import "./docs.css"

const searchInput = document.querySelector<HTMLInputElement>("[data-component-search]")
const cards = [...document.querySelectorAll<HTMLElement>("[data-component-card]")]
const count = document.querySelector<HTMLElement>("[data-component-count]")
const empty = document.querySelector<HTMLElement>("[data-component-empty]")

function filterCatalog(query: string) {
  const normalizedQuery = query.trim().toLowerCase()
  let visibleCount = 0

  for (const card of cards) {
    const visible = !normalizedQuery || card.dataset.search?.includes(normalizedQuery)
    card.hidden = !visible
    if (visible) visibleCount += 1
  }

  if (count)
    count.textContent = `${visibleCount} component ${visibleCount === 1 ? "family" : "families"}`
  if (empty) empty.hidden = visibleCount !== 0
}

searchInput?.addEventListener("input", () => filterCatalog(searchInput.value))
