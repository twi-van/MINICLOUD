// Progressive enhancement only: every article and link is already in the HTML.
const tools = document.querySelector<HTMLElement>('[data-blog-tools]')
const grid = document.querySelector<HTMLElement>('[data-blog-grid]')

if (tools && grid) {
  const cards = Array.from(grid.querySelectorAll<HTMLElement>('.blog-card'))
  const input = tools.querySelector<HTMLInputElement>('input')!
  const filters = tools.querySelectorAll<HTMLButtonElement>('[data-filter]')
  const normalize = (value: string) =>
    value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .toLowerCase()
      .trim()
  let category = 'Tất cả'

  function filter() {
    const query = normalize(input.value)
    const matches = cards.filter(
      (card) =>
        (category === 'Tất cả' || card.dataset.category === category) &&
        normalize(card.textContent || '').includes(query),
    )
    grid!.replaceChildren(...matches)
    document.querySelector<HTMLElement>('[data-blog-empty]')!.hidden = matches.length > 0
    document.querySelector<HTMLElement>('[data-blog-count]')!.textContent =
      `${matches.length} bài viết`
  }

  input.addEventListener('input', filter)
  filters.forEach((button) =>
    button.addEventListener('click', () => {
      category = button.dataset.filter!
      filters.forEach((item) => item.setAttribute('aria-pressed', String(item === button)))
      filter()
    }),
  )
  tools.hidden = false
}
