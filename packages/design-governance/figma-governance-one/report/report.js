;(() => {
  const root = document.querySelector("#report")
  const make = (tag, text, className) => {
    const node = document.createElement(tag)
    if (text !== undefined) node.textContent = String(text)
    if (className) node.className = className
    return node
  }
  const append = (node, ...children) => {
    node.append(...children.filter(Boolean))
    return node
  }
  try {
    const data = JSON.parse(document.querySelector("#report-data").textContent)
    if (data.schema !== "marwes.governance-html/v1" || data.provider.families.length !== 1)
      throw Error("Unsupported report or family scope")
    const family = data.provider.families[0]
    if (!family.run || family.run.id !== data.manifest.runId)
      throw Error("Report run identity does not match the manifest")
    const implementations = data.provider.implementations
    const proofNames = ["integrity", "structural", "visual", "behavior", "coverage"]
    const applicableProofs = (item) => [
      ...item.requiredProofs,
      ...(item.requiredProofs.length === 1 && item.requiredProofs[0] === "behavior"
        ? []
        : ["integrity", "coverage"]),
    ]
    const imageRoles = new Set(["reference", "actual", "capture", "diff"])
    let zoom = 1
    const exact = (comparison) =>
      comparison && comparison.runId === family.run.id && comparison.state === "recorded"
    const artifact = (comparison, role) =>
      exact(comparison)
        ? comparison.artifacts.find(
            (a) =>
              a.role === role &&
              imageRoles.has(a.role) &&
              /^image\/(png|webp|jpeg)$/.test(a.mimeType) &&
              typeof a.href === "string" &&
              a.href.startsWith(`data:${a.mimeType};base64,`) &&
              /^[A-Za-z0-9+/=]+$/.test(a.href.split(",")[1] || ""),
          )
        : null
    const needsDesign = (item) =>
      item.visualRequired && item.source?.availability === "needs-design"
    const needsMapping = (item) =>
      item.visualRequired &&
      !needsDesign(item) &&
      (item.source?.availability === "needs-mapping" ||
        (!item.source?.nodeId && item.source?.availability !== "rule-defined"))
    const failedNonvisualProofs = (item, c) =>
      exact(c)
        ? applicableProofs(item).filter(
            (proof) => proof !== "visual" && ["failed", "error"].includes(c.outcomes?.[proof]),
          )
        : []
    const attentionGroups = [
      {
        id: "visual-failures",
        label: "Recorded visual failures",
        matches: (item) =>
          item.visualRequired &&
          item.comparisons.some((c) => exact(c) && c.outcomes?.visual === "failed"),
      },
      {
        id: "other-proof-failures",
        label: "Other required proof failures",
        matches: (item) => item.comparisons.some((c) => failedNonvisualProofs(item, c).length > 0),
      },
      {
        id: "needs-design",
        label: "Skipped — design needed",
        matches: needsDesign,
      },
      {
        id: "needs-mapping",
        label: "Design mapping needed",
        matches: needsMapping,
      },
      {
        id: "rule-enrollment",
        label: "Approved rules to enroll",
        matches: (item) =>
          item.source?.availability === "rule-defined" &&
          (!item.caseId || item.gaps.length > 0 || item.comparisons.some((c) => !exact(c))),
      },
      {
        id: "missing-fixtures",
        label: "Missing fixtures",
        matches: (item) => !item.caseId,
      },
      {
        id: "capture-tools",
        label: "Capture or tool gaps",
        matches: (item) =>
          item.visualRequired &&
          !needsDesign(item) &&
          Boolean(item.caseId) &&
          item.comparisons.some(
            (c) =>
              !exact(c) ||
              ["unsupported", "error", "not-run"].includes(c.outcomes?.visual) ||
              !artifact(c, "actual") ||
              !artifact(c, "reference"),
          ),
      },
    ]
    const safeSource = (value) => {
      try {
        const url = new URL(value)
        return url.protocol === "https:" &&
          (url.hostname === "figma.com" || url.hostname === "www.figma.com")
          ? url.href
          : null
      } catch {
        return null
      }
    }
    const sourceLink = (value, text = "Figma source") => {
      const href = safeSource(value)
      if (!href) return null
      const a = make("a", text)
      a.href = href
      a.target = "_blank"
      a.rel = "noopener noreferrer"
      return a
    }
    const badge = (name, outcome) => make("span", `${name}: ${outcome}`, `badge ${outcome}`)
    const image = (a, label) => {
      if (!a) return make("p", "No verified image for this role", "muted")
      const img = make("img")
      img.src = a.href
      img.alt = label
      img.addEventListener("load", () => {
        img.style.width = `${img.naturalWidth * zoom}px`
        img.style.height = `${img.naturalHeight * zoom}px`
      })
      return append(make("div", undefined, "image-viewport"), img)
    }
    root.replaceChildren()
    document.title = `${family.id} · Governance evidence`
    append(
      root,
      make("p", "FIGMA GOVERNANCE · FROZEN EVIDENCE", "eyebrow"),
      make("h1", `${family.id} — design comparison`),
      make("p", data.provider.project.label, "muted"),
    )
    const statusStrip = make("aside", undefined, "status-strip")
    statusStrip.setAttribute("aria-label", "Frozen run status")
    append(
      statusStrip,
      make("strong", `Freshness at export: ${family.freshness.state}`),
      make(
        "span",
        `Automated result: ${family.outcome ?? "unknown"} · Recorded engine: Reflection ${
          family.run.environment?.reflection ?? "not recorded"
        }`,
      ),
      make("span", `Scope: ${family.scope.kind} · Owner review: ${family.review.state}`),
      make("code", `Exact run: ${family.run.id}`),
    )
    root.append(statusStrip)
    const actions = make("section", undefined, "panel action-overview")
    actions.id = "action-overview"
    append(
      actions,
      make("h2", "What needs attention"),
      make(
        "p",
        family.freshness.state !== "current"
          ? "Next step: run a fresh canonical validation. These frozen results describe an earlier input state; they cannot certify current code."
          : family.outcome === "passed" &&
              family.inventory.complete &&
              !attentionGroups.some((group) => family.items.some(group.matches))
            ? family.review.state !== "accepted"
              ? "Next step: owner review of this exact run. Automated proof does not grant design approval or reference promotion."
              : family.scope.kind === "staged"
                ? "Next step: obtain explicit approval for promotion of this exact stage, then verify active references."
                : "No pending comparison actions recorded. Continue the final project verification gates."
            : "Next step: resolve required proof failures and source mappings, then rerun the affected selections.",
      ),
      make(
        "p",
        `${
          family.inventory.requiredItems ?? family.items.length
        } required item/mode combinations remain in scope. Categories overlap; do not add their counts together.`,
        "muted",
      ),
    )
    const actionCards = make("div", undefined, "action-cards")
    for (const group of attentionGroups) {
      const rows = family.items.filter(group.matches)
      if (group.id === "other-proof-failures" && !rows.length) continue
      const cases = new Set(
        rows.filter((item) => item.caseId).map((item) => `${item.caseId}\0${item.dimensions.mode}`),
      )
      const adapterCases = new Set(
        rows.flatMap((item) =>
          item.comparisons
            .filter(
              (c) =>
                exact(c) &&
                (group.id !== "visual-failures" || c.outcomes?.visual === "failed") &&
                (group.id !== "other-proof-failures" || failedNonvisualProofs(item, c).length > 0),
            )
            .map((c) => `${item.caseId}\0${item.dimensions.mode}\0${c.implementationId}`),
        ),
      )
      const card = make("section", undefined, "action-card")
      const button = make("button", `${rows.length} · ${group.label}`)
      button.type = "button"
      button.addEventListener("click", () => {
        attention.value = group.id
        search.value = ""
        mode.value = "all"
        proof.value = "all"
        outcome.value = "all"
        adapter.value = "all"
        render()
        controls.scrollIntoView({ behavior: "smooth", block: "start" })
      })
      append(
        card,
        button,
        make(
          "small",
          `${rows.length} required rows · ${cases.size} unique mapped case/mode selections · ${adapterCases.size} recorded adapter results`,
        ),
      )
      const details = append(
        make("details"),
        make("summary", `View ${rows.length} affected required rows`),
      )
      if (rows.length && group.id === "needs-design")
        details.append(
          make(
            "p",
            "Only the visual check is skipped pending explicit design work. Required proof and recorded outcomes remain unchanged.",
            "muted",
          ),
        )
      if (rows.length && group.id === "needs-mapping")
        details.append(
          make(
            "p",
            "A source mapping is missing or unresolved. This does not establish that the design is absent.",
            "muted",
          ),
        )
      if (rows.length && group.id === "rule-enrollment")
        details.append(
          make(
            "p",
            "Design rules are documented. Enroll independent expectations, fixtures and proof; these rows are not waiting for a new design.",
            "muted",
          ),
        )
      if (!rows.length) details.append(make("p", "No required rows in this category."))
      for (const item of rows) {
        const statuses = item.comparisons
          .filter(
            (c) => group.id !== "other-proof-failures" || failedNonvisualProofs(item, c).length > 0,
          )
          .map(
            (c) =>
              `${c.implementationId}: ${
                group.id === "other-proof-failures"
                  ? failedNonvisualProofs(item, c)
                      .map((proof) => `${proof} ${c.outcomes[proof]}`)
                      .join(", ")
                  : exact(c)
                    ? c.outcomes?.visual || "not-run"
                    : c.state
              }`,
          )
          .join(" · ")
        details.append(make("p", `${item.label} · ${item.dimensions.mode} · ${statuses}`))
      }
      if (rows.length) card.append(details)
      actionCards.append(card)
    }
    append(
      actions,
      actionCards,
      make(
        "p",
        "Skipped is a report disposition, not a waiver or a pass. Structural and behavior checks remain required. Freshness and owner review are separate from automated results.",
        "muted",
      ),
    )
    root.append(actions)
    const banner = append(
      make("details", undefined, "banner"),
      make("summary", "Run identity, source scope and freshness details"),
    )
    append(
      banner,
      make("h2", `Run ${family.run.id}`),
      make(
        "p",
        `Freshness at export: ${family.freshness.state} · Scope: ${family.scope.kind} · Owner review: ${family.review.state}`,
      ),
      make(
        "p",
        `Exported ${data.exportedAt}. Freshness is frozen at export; this file does not check subsequent changes.`,
        "muted",
      ),
    )
    for (const reason of family.freshness.reasons || []) banner.append(make("p", reason))
    if (family.scope.stageId)
      banner.append(make("p", `Stage: ${family.scope.stageId} · ${family.scope.stageHash}`))
    if (family.error) banner.append(make("p", family.error, "error"))
    root.append(banner)
    const count = family.inventory.requiredItems ?? family.items.length
    const overview = append(
      make("details", undefined, "panel"),
      make("summary", "Required inventory and detailed proof tallies"),
    )
    const stats = make("div", undefined, "summary")
    for (const [label, value] of [
      ["Required item/mode combinations", count],
      ["Mapped items", family.items.filter((item) => item.caseId).length],
      ["Missing fixtures", family.items.filter((item) => !item.caseId).length],
      ["Required rows with gaps", family.items.filter((item) => item.gaps.length).length],
      ["Owner review", family.review.state],
    ])
      stats.append(
        append(make("div", undefined, "stat"), make("strong", value), make("span", label)),
      )
    append(
      overview,
      make("h2", "Required inventory"),
      stats,
      make(
        "p",
        "Counts remain unchanged when filtering. Mapped does not mean compliant; inventory gaps are listed independently of case outcomes.",
        "muted",
      ),
    )
    const tallies = make("div", undefined, "tallies")
    for (const implementation of implementations) {
      const unique = new Map()
      for (const item of family.items)
        for (const c of item.comparisons)
          if (c.implementationId === implementation.id && exact(c)) {
            const key = `${item.caseId}\0${item.dimensions.mode}`
            const entry = unique.get(key) ?? {
              comparison: c,
              requiredProofs: new Set(),
            }
            for (const proof of item.requiredProofs) entry.requiredProofs.add(proof)
            unique.set(key, entry)
          }
      const section = make("section")
      section.append(make("h2", implementation.label))
      for (const proof of ["structural", "visual", "behavior"]) {
        const totals = {}
        for (const { comparison: c, requiredProofs } of unique.values()) {
          if (!requiredProofs.has(proof)) continue
          const outcome = c.outcomes?.[proof] || "not-run"
          totals[outcome] = (totals[outcome] || 0) + 1
        }
        section.append(
          make(
            "p",
            `${proof}: ${
              Object.entries(totals)
                .map(([key, value]) => `${value} ${key}`)
                .join(" · ") || "no recorded cases"
            }`,
          ),
        )
      }
      section.append(
        make(
          "small",
          `${unique.size} unique case/mode results; aliases are counted once and each proof includes only applicable cases. These are case-wide tallies, not required-row coverage.`,
        ),
      )
      tallies.append(section)
    }
    overview.append(tallies)
    root.append(overview)
    if (data.artifactWarnings.length || family.inventory.gaps.length || family.inventory.error) {
      const warnings = append(
        make("details", undefined, "panel warning"),
        make("summary", "Coverage and artifact limitations"),
      )
      for (const warning of [
        ...data.artifactWarnings,
        ...family.inventory.gaps,
        ...(family.inventory.error ? [family.inventory.error] : []),
      ])
        warnings.append(make("p", warning))
      root.append(warnings)
    }
    const controls = make("section", undefined, "panel filters")
    const field = (label, node) => {
      node.setAttribute("aria-label", label)
      controls.append(append(make("label", label), node))
      return node
    }
    const search = field("Search required items", make("input"))
    search.type = "search"
    search.placeholder = "Variant, state, size, icon…"
    const select = (label, values) => {
      const node = make("select")
      for (const [value, text] of values) {
        const option = make("option", text)
        option.value = value
        node.append(option)
      }
      return field(label, node)
    }
    const attention = select("Attention", [
      ["all", "All required items"],
      ...attentionGroups.map((group) => [group.id, group.label]),
    ])
    const mode = select("Theme / mode", [
      ["all", "All modes"],
      ...[...new Set(family.items.map((i) => i.dimensions.mode))].sort().map((v) => [v, v]),
    ])
    const proof = select("Proof", [["all", "All proofs"], ...proofNames.map((v) => [v, v])])
    const outcome = select("Outcome", [
      ["all", "All outcomes"],
      ...["passed", "failed", "unsupported", "not-run", "error", "missing", "unmatched"].map(
        (v) => [v, v],
      ),
    ])
    const adapter = select("Implementation", [
      ["all", "All implementations"],
      ...implementations.map((v) => [v.id, v.label]),
    ])
    const range = field("Synchronized image zoom", make("input"))
    range.type = "range"
    range.min = "0.5"
    range.max = "4"
    range.step = "0.25"
    range.value = "1"
    const zoomText = make("output", "100%")
    controls.append(zoomText)
    root.append(controls)
    const visible = make("p")
    visible.id = "visible-count"
    visible.setAttribute("aria-live", "polite")
    root.append(visible)
    const wrap = make("div", undefined, "table-wrap")
    wrap.tabIndex = 0
    wrap.setAttribute("aria-label", "Required items comparison table")
    const table = make("table")
    const caption = make(
      "caption",
      "Required items compared against Figma in the exact selected run",
    )
    caption.className = "muted"
    table.append(caption)
    const head = make("thead")
    const hr = make("tr")
    head.append(hr)
    table.append(head)
    const body = make("tbody")
    table.append(body)
    wrap.append(table)
    root.append(wrap)
    const dialog = make("dialog")
    dialog.setAttribute("aria-labelledby", "inspect-title")
    const dialogHead = make("div", undefined, "dialog-head")
    const title = make("h2", "Image inspection")
    title.id = "inspect-title"
    const close = make("button", "Close inspection")
    close.type = "button"
    close.addEventListener("click", () => dialog.close())
    append(dialogHead, title, close)
    dialog.append(dialogHead)
    const inspectGrid = make("div", undefined, "inspect-grid")
    dialog.append(inspectGrid)
    root.append(dialog)
    const inspect = (item, c) => {
      title.textContent = `${item.label} · ${c.implementationId} · ${item.dimensions.mode}`
      inspectGrid.replaceChildren()
      for (const role of ["reference", "actual", "diff"])
        inspectGrid.append(
          append(
            make("section"),
            make("h2", role),
            image(artifact(c, role), `${role} for ${item.label}`),
          ),
        )
      dialog.showModal()
    }
    function renderComparison(item, c) {
      const td = make("td")
      if (!exact(c)) {
        append(
          td,
          badge("evidence", c?.state || "missing"),
          make("p", "No exact-run evidence for this required selection.", "muted"),
        )
        return td
      }
      if (needsDesign(item))
        td.append(
          make(
            "p",
            "Visual check skipped — design needed. Recorded outcomes below are unchanged; other proofs remain required.",
            "design-pending",
          ),
        )
      const proofs = make("div", undefined, "proofs")
      for (const name of proofNames)
        if (applicableProofs(item).includes(name))
          proofs.append(badge(name, c.outcomes?.[name] || "not-run"))
      if (item.visualRequired) {
        const actual = artifact(c, "actual")
        const capture = actual ? null : artifact(c, "capture")
        td.append(
          make(
            "small",
            actual
              ? "Native visual capture"
              : capture
                ? `Structural capture only · visual ${c.outcomes?.visual || "not-run"}`
                : "Native visual image unavailable",
            "capture-label",
          ),
        )
        td.append(
          image(
            actual || capture,
            `${c.implementationId} ${item.label} ${actual ? "visual" : "structural"} capture`,
          ),
        )
        td.append(proofs)
        const metrics = data.visualMetrics[c.id]
        if (metrics)
          td.append(
            make(
              "p",
              `${metrics.diffPixels} differing pixels · ${(metrics.diffRatio * 100).toFixed(
                4,
              )}%. Limits: ${metrics.threshold?.maxDiffPixels ?? "—"} pixels / ${
                metrics.threshold?.maxDiffPixelRatio === undefined
                  ? "—"
                  : `${metrics.threshold.maxDiffPixelRatio * 100}%`
              }. Recomputed from verified images; not new acceptance proof. ${
                metrics.classification
              }`,
              "metric",
            ),
          )
        if (artifact(c, "reference") || actual || artifact(c, "diff")) {
          const button = make("button", "Inspect reference / actual / diff")
          button.type = "button"
          button.addEventListener("click", () => inspect(item, c))
          td.append(button)
        }
      } else {
        td.append(
          make(
            "p",
            item.requiredProofs.length === 1 && item.requiredProofs[0] === "behavior"
              ? "No visual proof required · behavior-only selection"
              : "No visual proof required for this selection",
            "muted",
          ),
          proofs,
        )
      }
      const details = append(make("details"), make("summary", "Measurements and provenance"))
      append(
        details,
        make("p", `Exact run: ${c.runId}`),
        sourceLink(c.sourceUrl),
        make(
          "pre",
          JSON.stringify(
            {
              requiredProofs: item.requiredProofs,
              outcomes: c.outcomes,
              measurements: c.measurements,
              gaps: c.gaps,
              limitations: c.limitations,
              artifacts: c.artifacts.map(({ href, ...a }) => a),
            },
            null,
            2,
          ),
        ),
      )
      td.append(details)
      return td
    }
    function matches(item) {
      if (
        attention.value !== "all" &&
        !attentionGroups.find((group) => group.id === attention.value)?.matches(item)
      )
        return false
      if (mode.value !== "all" && item.dimensions.mode !== mode.value) return false
      if (
        search.value &&
        !JSON.stringify([item.label, item.id, item.caseId, item.dimensions])
          .toLowerCase()
          .includes(search.value.toLowerCase())
      )
        return false
      if (outcome.value === "all") return true
      return item.comparisons
        .filter((c) => adapter.value === "all" || c.implementationId === adapter.value)
        .some((c) => {
          if (!exact(c)) return outcome.value === (c.state || "missing")
          const applicable = applicableProofs(item)
          const names =
            proof.value === "all"
              ? applicable
              : applicable.includes(proof.value)
                ? [proof.value]
                : []
          return names.some((name) => c.outcomes?.[name] === outcome.value)
        })
    }
    function render() {
      const active = implementations.filter(
        (v) => adapter.value === "all" || adapter.value === v.id,
      )
      hr.replaceChildren(
        ...["Required selection", "Figma reference", ...active.map((v) => v.label)].map((text) => {
          const th = make("th", text)
          th.scope = "col"
          return th
        }),
      )
      body.replaceChildren()
      const rows = family.items.filter(matches)
      visible.textContent = `${rows.length} visible / ${count} required item/mode combinations`
      for (const item of rows) {
        const tr = make("tr")
        tr.dataset.itemId = item.id
        const name = make("th")
        name.scope = "row"
        append(
          name,
          make("strong", item.label, "selection"),
          make("code", item.id),
          make(
            "p",
            Object.entries(item.dimensions)
              .map(([k, v]) => `${k}: ${v}`)
              .join(" · "),
            "muted",
          ),
          sourceLink(item.source?.url),
        )
        if (needsDesign(item))
          name.append(make("p", "Skipped — design needed (visual check only)", "design-pending"))
        else if (needsMapping(item))
          name.append(
            make("p", "Design mapping needed; design availability is unconfirmed.", "muted"),
          )
        for (const gap of item.gaps || []) name.append(make("p", gap, "muted"))
        const rd = append(
          make("details"),
          make("summary", "Required item source"),
          make(
            "pre",
            JSON.stringify(
              {
                caseId: item.caseId,
                source: item.source,
                requiredProofs: item.requiredProofs,
              },
              null,
              2,
            ),
          ),
        )
        name.append(rd)
        tr.append(name)
        const figma = make("td")
        if (item.visualRequired) {
          if (needsDesign(item))
            figma.append(
              make(
                "p",
                "Skipped — design needed. Any retained images below are historical evidence, not an approved design.",
                "design-pending",
              ),
            )
          const bound = item.comparisons.filter((c) => artifact(c, "reference"))
          const distinct = new Set(bound.map((c) => artifact(c, "reference").sha256))
          if (distinct.size === 1) {
            append(
              figma,
              make(
                "small",
                `Declared reference · ${bound
                  .map((c) => c.implementationId)
                  .join(", ")} · identical hash`,
                "capture-label",
              ),
              image(artifact(bound[0], "reference"), `Figma reference for ${item.label}`),
            )
          } else if (bound.length) {
            figma.append(
              make("p", "Adapter references differ; inspect each declared source.", "muted"),
            )
            for (const c of bound)
              append(
                figma,
                make("small", `Declared reference · ${c.implementationId}`, "capture-label"),
                image(
                  artifact(c, "reference"),
                  `Figma reference for ${item.label} ${c.implementationId}`,
                ),
              )
          } else figma.append(make("p", "No exact-run Figma reference", "muted"))
        } else figma.append(make("p", "No visual reference required", "muted"))
        tr.append(figma)
        for (const impl of active)
          tr.append(
            renderComparison(
              item,
              item.comparisons.find((c) => c.implementationId === impl.id),
            ),
          )
        body.append(tr)
      }
      if (!rows.length) {
        const td = make(
          "td",
          "No required items match these filters. The full inventory remains required.",
          "empty",
        )
        td.colSpan = 2 + active.length
        body.append(append(make("tr"), td))
      }
    }
    for (const control of [search, mode, proof, outcome, adapter, attention])
      control.addEventListener("input", render)
    range.addEventListener("input", () => {
      zoom = Number(range.value)
      zoomText.textContent = `${Math.round(zoom * 100)}%`
      for (const img of root.querySelectorAll("img")) {
        img.style.width = `${img.naturalWidth * zoom}px`
        img.style.height = `${img.naturalHeight * zoom}px`
      }
    })
    const manifest = append(
      make("details", undefined, "panel"),
      make("summary", "Export identity and manifest"),
      make(
        "pre",
        JSON.stringify(
          {
            schema: data.schema,
            inventoryScope: data.inventoryScope,
            exportedAt: data.exportedAt,
            manifest: data.manifest,
            run: family.run,
            scope: family.scope,
          },
          null,
          2,
        ),
      ),
    )
    root.append(manifest)
    root.append(
      make(
        "footer",
        "Frozen evidence report. Automated passes, owner review and reference promotion are separate decisions. This file cannot rerun, approve or promote evidence.",
      ),
    )
    render()
  } catch (error) {
    root.replaceChildren(
      make("h1", "Evidence report unavailable"),
      make("p", String(error), "fatal"),
    )
  }
})()
