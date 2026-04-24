const docSideBar = document.getElementById('docSideBar') as HTMLDivElement
const docContent = document.getElementById('docContent') as HTMLDivElement

function createDocListTitle(title: string) {
  const aEl = document.createElement('a')
  aEl.id = `${title}ListTitle`
  aEl.href = `docs?item=${title}`
  aEl.className = 'list-group-item list-group-item-action'
  aEl.innerHTML = `<span class="fs-5 fw-semibold">${title}</span>`
  return aEl
}

function createDocListItem(doc: any) {
  const a = document.createElement('a')
  a.href = `docs?item=${doc.name}`

  a.className = 'mb-1 list-group-item'
  a.innerText = doc.name
  return a
}

function renderDocList(doc: any) {
  const docListTitle = createDocListTitle(doc.name)
  docSideBar.append(docListTitle)

  if (!doc.items) return
}

function renderDocListItem(elem: HTMLDivElement, doc: any) {
  const listItem = createDocListItem(doc)
  elem.appendChild(listItem)
}

function renderDocContent(item: any) {
  if (!item) return
  const divEl = document.createElement('div')

  divEl.innerHTML = `<div class="p-4">
          <h1>${item.name}</h1>
          <p>${item.description}</p>
        </div>`

  docContent.append(divEl)
}


export default {
  renderDocList,
  renderDocListItem,
  renderDocContent
}