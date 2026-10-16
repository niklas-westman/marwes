const $ = (id) => document.getElementById(id)
let catalog
let capability
let family
let selection
let activeJob
let requestVersion = 0
let matrixVersion = 0
const reports = new Map()
let reportLoads = 0
const reportQueue = []
async function readRun(runId) {
  if (!reports.has(runId)) {
    reports.set(
      runId,
      (async () => {
        if (reportLoads >= 4) await new Promise((resolve) => reportQueue.push(resolve))
        ++reportLoads
        try {
          const report = await api(`/api/runs/${encodeURIComponent(runId)}`)
          if (
            report.runId !== runId ||
            !Array.isArray(report.cases) ||
            !report.freshness ||
            !report.review
          )
            throw new Error("Malformed or mismatched canonical report.")
          return report
        } finally {
          --reportLoads
          reportQueue.shift()?.()
        }
      })(),
    )
  }
  return reports.get(runId)
}
function behaviorOnly(item) {
  return (
    item?.proofScope === "behavior-only" ||
    (item?.requiredProofs?.length === 1 && item.requiredProofs[0] === "behavior")
  )
}
function evidenceMatches(item) {
  return !item?.evidenceMatch || item.evidenceMatch === "matched"
}
function projectItemCase(entry, item) {
  return evidenceMatches(item)
    ? entry
    : { ...entry, runId: null, outcomes: null, outcome: "blocked", freshness: "unmatched" }
}
function itemOutcome(entry, item) {
  if (!evidenceMatches(item)) return "blocked"
  return behaviorOnly(item) || (!item?.requiredProofs?.length && behaviorOnly(entry))
    ? entry.outcomes?.behavior || "not-run"
    : entry.outcome
}
function itemProofs(entry, item) {
  return Object.entries(entry.outcomes || {}).filter(
    ([proof]) =>
      !(behaviorOnly(item) || (!item?.requiredProofs?.length && behaviorOnly(entry))) ||
      proof === "behavior",
  )
}
function proofRequired(proof, item, entry) {
  if (behaviorOnly(item) || (!item.requiredProofs?.length && behaviorOnly(entry)))
    return proof === "behavior"
  // Integrity and coverage guard every normal visual/structural execution,
  // while inventory declarations enumerate only the component proof axes.
  if (proof === "integrity" || proof === "coverage") return true
  if (item.requiredProofs?.length) return item.requiredProofs.includes(proof)
  if (entry?.requiredProofs?.length) return entry.requiredProofs.includes(proof)
  return true
}
function matchesResult(item, cases, shownAdapters) {
  const result = $("result").value
  // Filters narrow the work queue, never the inventory or family denominator.
  if (result === "all") return true
  const proof = $("proof").value
  if (proof !== "all" && !proofRequired(proof, item, cases[0])) return false
  const missing =
    !evidenceMatches(item) ||
    !item.caseId ||
    shownAdapters.some((adapter) => !cases.some((c) => c.adapter === adapter))
  if (result === "blocked" && (item.gaps.length || missing)) return true
  return cases.some((entry) => {
    if (["stale", "never-run"].includes(result)) return entry.freshness === result
    if (proof === "all")
      return (
        itemOutcome(entry, item) === result ||
        (["unsupported", "not-run", "error"].includes(result) &&
          Object.entries(entry.outcomes || {}).some(
            ([key, outcome]) => proofRequired(key, item, entry) && outcome === result,
          ))
      )
    const outcome = entry.outcomes?.[proof] || "not-run"
    return (
      outcome === result ||
      (result === "blocked" &&
        (["blocked", "unsupported", "not-run", "error"].includes(outcome) ||
          entry.freshness !== "current"))
    )
  })
}
const behaviorReferenceLabel = "Behavior obligation — no visual reference required"
function requiredItems() {
  if (Array.isArray(family?.coverage?.items)) return family.coverage.items
  return [
    ...new Map(
      (family?.cases || []).map((c) => [
        JSON.stringify([c.caseId, c.mode]),
        {
          itemId: JSON.stringify([c.caseId, c.mode]),
          label: c.caseId,
          caseId: c.caseId,
          mode: c.mode,
          gaps: [],
        },
      ]),
    ).values(),
  ]
}
const adapters = ["react", "vue", "svelte"]
const escapeHtml = (value) =>
  String(value ?? "—").replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  )
const value = (input) =>
  input === null || input === undefined
    ? "—"
    : typeof input === "object"
      ? JSON.stringify(input)
      : String(input)
const badge = (state) => `<span class="badge ${escapeHtml(state)}">${escapeHtml(state)}</span>`
function notice(message, error = false) {
  $("notice").textContent = message
  $("notice").className = error ? "error" : ""
}
async function api(url, options) {
  const response = await fetch(url, options)
  const data = await response.json()
  if (!response.ok) throw new Error(data.error || "Governance request failed.")
  return data
}
async function load() {
  try {
    const data = await api("/api/catalog")
    reports.clear()
    catalog = data.catalog
    capability = data.capability
    if (!catalog || !Array.isArray(catalog.families))
      throw new Error("Malformed catalog. Run governance:status to inspect the source report.")
    drawFamilies()
    chooseFamily(
      catalog.families.find((f) => f.family === family?.family) ||
        catalog.families.find((f) => f.family === "button") ||
        catalog.families[0],
    )
  } catch (error) {
    notice(`Could not load evidence: ${error.message}`, true)
    $("run").disabled = true
    $("case-detail").hidden = true
  }
}
function drawFamilies() {
  const query = $("search").value.toLowerCase()
  const visible = catalog.families.filter((f) => f.family.toLowerCase().includes(query))
  $("families").innerHTML =
    visible
      .map(
        (f) =>
          `<button data-family="${escapeHtml(f.family)}" aria-current="${
            f.family === family?.family
          }"><span>${escapeHtml(f.family)}</span><span class="family-count">${escapeHtml(
            f.freshness?.state || "never-run",
          )}</span></button>`,
      )
      .join("") || '<p class="empty">No families match this search.</p>'
  for (const button of $("families").querySelectorAll("button")) {
    button.addEventListener("click", () =>
      chooseFamily(catalog.families.find((f) => f.family === button.dataset.family)),
    )
  }
}
function chooseFamily(next) {
  family = next
  const reportLink = $("export-report")
  reportLink.hidden = !family?.runId || Boolean(family?.error)
  const openReport = $("open-report")
  openReport.hidden = reportLink.hidden
  if (reportLink.hidden) {
    reportLink.removeAttribute("href")
    openReport.removeAttribute("href")
  } else {
    const exactRun = `family=${encodeURIComponent(family.family)}&run=${encodeURIComponent(family.runId)}`
    reportLink.href = `/api/export?${exactRun}`
    openReport.href = `/api/report?${exactRun}`
  }
  selection = null
  ++requestVersion
  $("case-detail").hidden = true
  if (!family) {
    notice("No registered component families. Add a family contract to begin.")
    return
  }
  drawFamilies()
  $("family-name").textContent = family.family.charAt(0).toUpperCase() + family.family.slice(1)
  const cases = family.cases || []
  const count = new Set(cases.map((c) => JSON.stringify([c.caseId, c.mode]))).size
  const inputLabel =
    family.inputScope === "staged"
      ? `Staged reference · awaiting promotion approval · stage ${family.stageId || "unavailable"} · `
      : ""
  $("family-summary").textContent = `${inputLabel}${count} registered validation cases · ${
    family.freshness?.state || "never-run"
  } evidence · automated ${family.outcome || "blocked"} · review ${
    family.review?.state || "unreviewed"
  }`
  $("mode").innerHTML = `<option value="all">All modes</option>${[
    ...new Set(requiredItems().map((item) => item.mode)),
  ]
    .filter(Boolean)
    .map((mode) => `<option>${escapeHtml(mode)}</option>`)
    .join("")}`
  $("run").disabled = Boolean(activeJob) || cases.length === 0
  notice(
    family.error ||
      (family.freshness?.state === "invalid"
        ? `Invalid evidence: ${
            (family.freshness.reasons || []).join("; ") || "Input integrity was not established"
          }. Run validation after resolving the cause.`
        : family.freshness?.state === "stale"
          ? "Historical evidence: inputs have changed. Run validation to establish current proof."
          : family.freshness?.state === "never-run"
            ? "No canonical evidence yet. Validation will capture the real component."
            : "Inspect the selected run. Automated outcomes and human review remain separate."),
    Boolean(family.error) || family.freshness?.state === "invalid",
  )
  const coverage = family.coverage
  const variants = coverage?.uncoveredVariants || []
  const items = requiredItems()
  const mapped = items.filter(
    (item) => item.caseId && cases.some((c) => c.caseId === item.caseId && c.mode === item.mode),
  ).length
  $("family-coverage-count").textContent = Array.isArray(coverage?.items)
    ? `${items.length} required items · ${mapped} fixture mapped · ${items.length - mapped} missing fixtures · ${items.filter((item) => item.gaps.length).length} with coverage gaps`
    : coverage
      ? `${coverage.structuralEnrolledCases} structurally enrolled / ${coverage.registeredCases} registered cases`
      : "Inventory unavailable"
  $("family-coverage").innerHTML = coverage
    ? `<div class="coverage-lines"><div><strong>${
        Array.isArray(coverage.items)
          ? `${items.filter((item) => item.gaps.length).length} required items have unresolved coverage gaps.`
          : `${variants.length} uncovered source / public variants.`
      }</strong> Registered cases do not establish complete family parity.</div>${
        coverage.error
          ? `<div class="warning">Inventory error: ${escapeHtml(coverage.error)}</div>`
          : ""
      }${
        coverage.uncovered?.length
          ? `<details><summary>Coverage diagnostics (${
              coverage.uncovered.length
            })</summary><ul class="uncovered-variants">${coverage.uncovered
              .map((reason) => `<li class="warning">${escapeHtml(reason)}</li>`)
              .join("")}</ul></details>`
          : ""
      }<details><summary>Inspect uncovered variants (${
        variants.length
      })</summary><ul class="uncovered-variants">${variants
        .map(
          (variant) =>
            `<li><strong>${escapeHtml(
              variant.name,
            )}</strong> <span class="tag">${escapeHtml(variant.source)} · ${escapeHtml(
              variant.id,
            )}</span><div class="muted">${escapeHtml(variant.reason)}</div></li>`,
        )
        .join("")}</ul></details></div>`
    : '<p class="muted">Source / public variant inventory has not been supplied. Complete family coverage is not established.</p>'
  drawMatrix()
}
function drawMatrix() {
  const version = ++matrixVersion
  const shownAdapters = $("adapter").value === "all" ? adapters : [$("adapter").value]
  const entries = requiredItems()
    .map((item) => ({
      item,
      cases: (family?.cases || [])
        .filter(
          (c) =>
            c.caseId === item.caseId && c.mode === item.mode && shownAdapters.includes(c.adapter),
        )
        .map((c) => projectItemCase(c, item)),
    }))
    .filter(
      ({ item, cases }) =>
        ($("mode").value === "all" || item.mode === $("mode").value) &&
        (Array.isArray(family?.coverage?.items) || cases.length) &&
        matchesResult(item, cases, shownAdapters),
    )
  $("matrix-columns").innerHTML =
    `<th scope="col">Required item</th><th scope="col">Figma design</th>${shownAdapters.map((adapter) => `<th scope="col">${escapeHtml(adapter)}</th>`).join("")}`
  $("case-count").textContent =
    `${entries.length} visible / ${requiredItems().length} required item/mode combinations`
  $("matrix").innerHTML =
    entries
      .map(
        ({ item, cases }, index) => `<tr data-item="${escapeHtml(item.itemId)}">
    <th scope="row">${escapeHtml(item.label)}<div class="muted">${escapeHtml(item.mode)} · ${escapeHtml(Object.values(item.dimensions || {}).join(" / "))}</div>
    ${!item.caseId ? '<div class="warning">Missing fixture mapping</div>' : ""}
    ${item.gaps.map((gap) => `<div class="warning">${escapeHtml(gap)}</div>`).join("")}</th>
    <td data-design="${index}"><span class="muted">${behaviorOnly(item) ? behaviorReferenceLabel : cases.some((c) => c.runId) ? "Loading exact design reference…" : "Missing design reference evidence"}</span>${item.sourceUrl ? `<div>${sourceLink(item.sourceUrl, "Open design")}</div>` : ""}</td>
    ${shownAdapters
      .map((adapter) => {
        const c = cases.find((c) => c.adapter === adapter)
        return `<td>${
          c
            ? `<button class="case-button" data-item-index="${index}" data-case="${escapeHtml(c.caseId)}" data-mode="${escapeHtml(c.mode)}" data-adapter="${adapter}" aria-pressed="${selection?.caseId === c.caseId && selection?.mode === c.mode && selection?.adapter === adapter && (!selection.coverageItem || selection.coverageItem.itemId === item.itemId)}">${escapeHtml(c.freshness === "current" ? `automated ${itemOutcome(c, item)}` : c.freshness)}<span class="muted"> · ${adapter}</span>${
                c.outcomes
                  ? `<span class="cell-proofs">${itemProofs(c, item)
                      .map(([proof, outcome]) => `${escapeHtml(proof)}: ${escapeHtml(outcome)}`)
                      .join(" · ")}</span>`
                  : ""
              }</button><div data-runtime="${index}-${adapter}" class="comparison-evidence">${c.runId ? "Loading exact run capture…" : "Missing runtime evidence"}</div>`
            : '<span class="warning">Missing fixture / adapter evidence</span>'
        }</td>`
      })
      .join("")}</tr>`,
      )
      .join("") ||
    `<tr><td colspan="${2 + shownAdapters.length}" class="empty">No represented cases for this selection. Required gaps remain visible in the coverage inventory.</td></tr>`
  for (const button of $("matrix").querySelectorAll("button")) {
    button.addEventListener("click", () =>
      selectCase({
        ...entries[Number(button.dataset.itemIndex)].cases.find(
          (c) =>
            c.caseId === button.dataset.case &&
            c.mode === button.dataset.mode &&
            c.adapter === button.dataset.adapter,
        ),
        coverageItem: entries[Number(button.dataset.itemIndex)].item,
      }),
    )
  }
  for (const [index, entry] of entries.entries()) hydrateComparison(entry, index, version)
  const cases = entries.flatMap((entry) =>
    entry.cases.map((c) => ({ ...c, coverageItem: entry.item })),
  )
  if (!selection && cases.length) selectCase(cases.find((c) => c.runId) || cases[0])
}
function imageForRole(selected, role) {
  return selected?.artifacts.find(
    (artifact) => artifact.mimeType.startsWith("image/") && artifact.role === role,
  )
}
function runtimeImage(selected) {
  return imageForRole(selected, "actual") || imageForRole(selected, "capture")
}
function captureScope(artifact, selected) {
  return artifact?.role === "capture"
    ? `<div class="warning">Structural capture — visual proof ${escapeHtml(selected.outcomes.visual)}. This image is not a visual comparison result.</div>`
    : ""
}
function comparisonImage(report, artifact, alt) {
  return `<div class="comparison-stage"><img loading="lazy" src="${escapeHtml(artifactUrl(report, artifact))}" alt="${escapeHtml(alt)}"></div>`
}
async function hydrateComparison({ item, cases }, index, version) {
  const resolved = await Promise.all(
    cases.map(async (entry) => {
      if (!evidenceMatches(item) || !entry.runId) return { entry }
      try {
        const report = await readRun(entry.runId)
        const selected = report.cases.find(
          (c) => c.caseId === item.caseId && c.mode === item.mode && c.adapter === entry.adapter,
        )
        if (!selected) throw new Error("Selected case missing from exact run")
        return { entry, report, selected }
      } catch {
        return { entry, error: true }
      }
    }),
  )
  if (version !== matrixVersion) return
  const pureBehavior =
    behaviorOnly(item) ||
    (!item.requiredProofs?.length &&
      resolved.length > 0 &&
      resolved.every(({ entry, selected }) => behaviorOnly(selected || entry)))
  const design =
    !pureBehavior && resolved.find(({ selected }) => imageForRole(selected, "reference"))
  const designCell = $("matrix").querySelector(`[data-design="${index}"]`)
  if (pureBehavior) {
    designCell.textContent = behaviorReferenceLabel
  } else if (design) {
    const artifact = imageForRole(design.selected, "reference")
    designCell.innerHTML = `${comparisonImage(design.report, artifact, `Figma reference ${item.caseId} ${item.mode}`)}<div class="muted">Exact ${escapeHtml(design.entry.adapter)} run ${escapeHtml(design.report.runId)} · ${escapeHtml(design.report.freshness.state)} · review ${escapeHtml(design.report.review.state)}</div>`
  } else {
    designCell.innerHTML = '<span class="warning">Missing design reference evidence</span>'
  }
  if (item.sourceUrl)
    designCell.innerHTML += `<div>${sourceLink(item.sourceUrl, "Open design")}</div>`
  for (const { entry, report, selected, error } of resolved) {
    const cell = $("matrix").querySelector(`[data-runtime="${index}-${entry.adapter}"]`)
    const rowBehavior =
      pureBehavior || (!item.requiredProofs?.length && behaviorOnly(selected || entry))
    const actual = !rowBehavior && runtimeImage(selected)
    cell.innerHTML = rowBehavior
      ? selected
        ? `<span>Behavior: ${escapeHtml(selected.outcomes.behavior)} · inspect assertions and artifacts</span>`
        : '<span class="warning">Behavior assertion evidence unavailable; no substitute</span>'
      : actual
        ? captureScope(actual, selected) +
          comparisonImage(
            report,
            actual,
            `${actual.role === "capture" ? "Structural capture" : "Runtime comparison"} ${entry.adapter} ${item.caseId} ${item.mode}`,
          )
        : `<span class="warning">${error ? "Exact run evidence unavailable; no substitute" : "Missing runtime capture"}</span>`
    if (report)
      cell.innerHTML += `<div class="muted">${escapeHtml(report.runId)} · ${escapeHtml(report.freshness.state)} · review ${escapeHtml(report.review.state)}</div>`
  }
  for (const img of $("matrix").querySelectorAll("img")) {
    img.addEventListener(
      "error",
      () => {
        img.parentElement.textContent = "Artifact unavailable or corrupted"
      },
      { once: true },
    )
  }
}
function artifactUrl(report, artifact) {
  return `/api/artifact?run=${encodeURIComponent(
    report.runId,
  )}&path=${encodeURIComponent(artifact.path)}`
}
function sourceLink(url, text) {
  try {
    const parsed = new URL(url)
    if (parsed.protocol !== "https:" || !["figma.com", "www.figma.com"].includes(parsed.hostname))
      return escapeHtml(text)
    return `<a href="${escapeHtml(url)}" target="_blank" rel="noreferrer">${escapeHtml(text)} ↗</a>`
  } catch {
    return escapeHtml(text)
  }
}
async function selectCase(requestedCase) {
  const next = projectItemCase(requestedCase, requestedCase.coverageItem)
  selection = next
  const version = ++requestVersion
  drawMatrix()
  $("case-detail").hidden = false
  $("case-name").textContent =
    `${next.coverageItem?.label && next.coverageItem.label !== next.caseId ? `${next.coverageItem.label} / ` : ""}${next.caseId} / ${next.mode} / ${next.adapter}`
  $("run-id").textContent = next.runId || "No run recorded"
  $("proofs").innerHTML = ""
  $("source").innerHTML = ""
  $("measurements").innerHTML = ""
  $("coverage").innerHTML = ""
  $("capture").innerHTML = '<p class="empty">Loading exact run evidence…</p>'
  if (!next.runId) {
    if (!evidenceMatches(next.coverageItem)) {
      $("capture").textContent =
        "No matching evidence for the current required definition. Rerun validation; earlier results and artifacts cannot substitute."
      $("source").textContent =
        "Current requirement differs from or is absent in the selected run inputs."
      $("coverage").textContent =
        "Required item remains visible and blocked until matching evidence exists."
      return
    }
    $("capture").innerHTML =
      '<p class="empty">Never run. No captured component or current design proof is available.</p>'
    $("source").innerHTML =
      '<p class="empty">Source facts appear after a canonical validation run.</p>'
    $("coverage").textContent = "Coverage not established. Human review: unreviewed."
    if (behaviorOnly(next.coverageItem) || behaviorOnly(next)) {
      $("source").textContent = behaviorReferenceLabel
      $("capture").textContent = "Behavior has not run. No assertion evidence is available."
    }
    return
  }
  try {
    const report = await readRun(next.runId)
    if (version !== requestVersion) return
    if (!Array.isArray(report.cases) || !report.freshness || !report.review)
      throw new Error("Malformed canonical report.")
    const c = report.cases.find(
      (c) => c.caseId === next.caseId && c.adapter === next.adapter && c.mode === next.mode,
    )
    if (!c && report.freshness.state === "invalid") {
      const reasons =
        report.freshness.reasons.join("; ") || "Validation setup did not establish case evidence."
      notice(
        `Validation could not capture the selected case: ${reasons}. Resolve the cause and run validation again.`,
        true,
      )
      $("proofs").innerHTML = `<div class="proof">Run freshness ${badge("invalid")}</div>`
      $("source").innerHTML =
        '<p class="empty">No selected-case source facts were captured in this run.</p>'
      $("capture").innerHTML =
        `<p class="empty">No selected-case runtime evidence was captured. ${escapeHtml(reasons)}</p>`
      $("measurements").innerHTML =
        '<tr><td colspan="6" class="empty">No selected-case measurements were captured. No other run was substituted.</td></tr>'
      $("coverage").innerHTML = `<div class="coverage-lines"><div>Run outcome: ${badge(
        report.outcome,
      )}. Human review: ${badge(report.review.state)}.</div><div class="warning">${escapeHtml(
        reasons,
      )}</div><div>Resolve the setup error and run validation again. Selected-case proof is unavailable.</div></div>`
      return
    }
    if (!c)
      throw new Error("Selected case is absent from this exact run. No other run was substituted.")
    const pureBehavior =
      behaviorOnly(next.coverageItem) ||
      (!next.coverageItem?.requiredProofs?.length && behaviorOnly(c))
    $("proofs").innerHTML = `${itemProofs(
      c,
      pureBehavior ? { proofScope: "behavior-only" } : next.coverageItem,
    )
      .map(([key, outcome]) => `<div class="proof">${escapeHtml(key)} ${badge(outcome)}</div>`)
      .join("")}<div class="proof">Freshness ${badge(report.freshness.state)}</div>`
    const source = c.measurements[0]?.source
    const staged = report.environment?.evidenceScope === "staged"
    $("source").innerHTML =
      `${staged ? `<p class="warning">Staged reference · awaiting promotion approval</p><p class="mono">Stage ${escapeHtml(report.environment.stageId)} · hash ${escapeHtml(report.environment.stageHash)}</p>` : ""}<dl><dt>Design node</dt><dd>${sourceLink(
        c.sourceUrl,
        source?.nodeId || "Open Figma source",
      )}</dd><dt>File identity</dt><dd class="mono">${escapeHtml(
        source?.fileKey || "No resolved facts",
      )}</dd><dt>Case mode</dt><dd>${escapeHtml(
        c.mode,
      )}</dd><dt>Input fingerprint</dt><dd class="mono">${escapeHtml(
        report.fingerprint,
      )}</dd></dl><p class="muted">Captured JSON source facts. Offline evidence does not establish live Figma freshness.</p>`
    const resolvedModes = [
      ...new Set(
        c.measurements
          .map((row) =>
            row.source.collectionId && row.source.modeId
              ? `${row.source.collectionId} / ${row.source.modeId}`
              : null,
          )
          .filter(Boolean),
      ),
    ]
    $("source").innerHTML += `<p class="muted">Resolved collection / mode IDs: ${escapeHtml(
      resolvedModes.join("; ") || "Not supplied in source facts",
    )}</p>`
    if (pureBehavior)
      $("source").innerHTML =
        `<p>${behaviorReferenceLabel}</p><p class="mono">Input fingerprint ${escapeHtml(report.fingerprint)}</p>`
    const reference = !pureBehavior && imageForRole(c, "reference")
    if (reference)
      $("source").innerHTML +=
        `<p class="muted">Figma reference retained by the selected validation run.</p><div class="capture-stage"><img class="capture-image" src="${artifactUrl(
          report,
          reference,
        )}" alt="Figma reference for ${escapeHtml(c.caseId)} ${escapeHtml(c.mode)}"></div>`
    const actual = !pureBehavior && runtimeImage(c)
    $("capture").innerHTML = pureBehavior
      ? `<p>Behavior: ${escapeHtml(c.outcomes.behavior)}. Inspect the recorded assertions and artifacts below.</p>`
      : actual
        ? `${captureScope(actual, c)}<div class="capture-stage"><img class="capture-image" src="${artifactUrl(
            report,
            actual,
          )}" alt="${escapeHtml(c.caseId)} ${escapeHtml(
            c.adapter,
          )} captured during run ${escapeHtml(report.runId)}"></div>`
        : '<p class="empty">No actual screenshot is listed for this case. Structural evidence is shown below; visual capture is unavailable.</p>'
    $("capture").innerHTML += `<p class="muted">${escapeHtml(
      report.finishedAt,
    )} · ${escapeHtml(c.adapter)} · ${escapeHtml(
      value(report.environment),
    )}</p><div class="artifact-links">${c.artifacts
      .filter(
        (artifact) =>
          !pureBehavior || !artifact.mimeType.startsWith("image/") || artifact.role === "behavior",
      )
      .map(
        (a) =>
          `<a href="${artifactUrl(
            report,
            a,
          )}" target="_blank" rel="noreferrer">${pureBehavior && a.role === "behavior" ? "Behavior assertions: " : ""}${escapeHtml(a.path)}</a>`,
      )
      .join("")}</div>`
    $("capture")
      .querySelector("img")
      ?.addEventListener("error", () => {
        $("capture").querySelector(".capture-stage").textContent =
          "Capture unavailable or corrupted. Inspect the run manifest and rerun validation."
      })
    $("measurements").innerHTML = pureBehavior
      ? '<tr><td colspan="6" class="empty">Behavior assertions are recorded in the linked exact-run behavior artifacts. Structural measurements do not establish this obligation.</td></tr>'
      : c.measurements
          .map(
            (row) =>
              `<tr><td><strong>${escapeHtml(row.part)} / ${escapeHtml(
                row.property,
              )}</strong><details class="measurement-detail"><summary>Source provenance</summary><div>Node ${escapeHtml(
                row.source.nodeId,
              )} · ${escapeHtml(row.source.propertyPath)}<br>Selector ${escapeHtml(
                row.selector,
              )}<br>Collection ${escapeHtml(row.source.collectionId)} / mode ${escapeHtml(
                row.source.modeId,
              )}<br>Aliases ${escapeHtml(
                (row.source.aliasChain || []).join(" → ") || "none",
              )}<br>${escapeHtml(row.diagnostic || "")}</div></details></td><td class="value">${escapeHtml(
                value(row.expected),
              )}</td><td class="value">${escapeHtml(value(row.actual))}</td><td class="value">${escapeHtml(
                value(row.delta),
              )}</td><td class="value">${escapeHtml(
                value(row.tolerance),
              )}</td><td>${badge(row.outcome)}</td></tr>`,
          )
          .join("") ||
        '<tr><td colspan="6" class="empty">No supported structural measurements recorded.</td></tr>'
    $("coverage").innerHTML = `<div class="coverage-lines"><div>${
      pureBehavior
        ? `Behavior obligation: ${escapeHtml(c.outcomes.behavior)}. Visual reference is not required for this obligation.`
        : `Verified structural properties: ${
            c.measurements.filter((m) => m.outcome === "passed").length
          }/${c.measurements.length}. Visual: ${escapeHtml(c.outcomes.visual)}. Behavior: ${escapeHtml(
            c.outcomes.behavior,
          )}.`
    }</div><div>Human review: ${badge(report.review.state)} · automated combined outcome: ${badge(
      report.outcome,
    )}</div><div>Input freshness: ${badge(report.freshness.state)} ${escapeHtml(
      report.freshness.reasons.join("; "),
    )}</div><div class="warning">${
      c.unsupported.length
        ? `Unsupported / unmapped: ${escapeHtml(c.unsupported.join("; "))}`
        : "No unsupported properties listed in this case. Coverage is limited to declared contract properties."
    }</div>${(c.limitations || [])
      .map((reason) => `<div class="muted">Proof limitation: ${escapeHtml(reason)}</div>`)
      .join("")}${
      report.review.reviewer
        ? `<div>Owner reviewer: ${escapeHtml(report.review.reviewer)}</div>`
        : ""
    }${(report.review.reasons || []).map((reason) => `<div>${escapeHtml(reason)}</div>`).join("")}${
      report.review.exceptions?.length
        ? `<div class="warning">Scoped review exceptions: ${escapeHtml(
            value(report.review.exceptions),
          )}</div>`
        : ""
    }</div>`
  } catch (error) {
    if (version !== requestVersion) return
    $("capture").innerHTML =
      '<p class="empty">Evidence unavailable. No substitute result is shown.</p>'
    notice(`Could not load selected evidence: ${error.message}`, true)
  }
}
async function runValidation() {
  try {
    $("run").disabled = true
    if (family.inputScope === "staged" && !family.stageId)
      throw new Error(
        "Staged evidence has no stage ID. Validation cannot substitute active references.",
      )
    const job = await api("/api/jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Governance-Capability": capability,
      },
      body: JSON.stringify({
        family: family.family,
        adapter: $("adapter").value,
        ...(family.inputScope === "staged" ? { stageId: family.stageId } : {}),
      }),
    })
    activeJob = job.id
    const poll = async () => {
      try {
        const current = await api(`/api/jobs/${activeJob}`)
        notice(current.message, current.state === "failed")
        if (["completed", "failed"].includes(current.state)) {
          activeJob = null
          await load()
          notice(current.message, current.state === "failed")
          return
        }
        setTimeout(poll, 1000)
      } catch (error) {
        activeJob = null
        $("run").disabled = false
        notice(`Could not read job progress: ${error.message}`, true)
      }
    }
    await poll()
  } catch (error) {
    $("run").disabled = false
    notice(`Could not start validation: ${error.message}`, true)
  }
}
$("search").addEventListener("input", drawFamilies)
for (const id of ["adapter", "proof", "result", "mode"])
  $(id).addEventListener("change", () => {
    selection = null
    ++requestVersion
    $("case-detail").hidden = true
    drawMatrix()
  })
$("run").addEventListener("click", runValidation)
load()
