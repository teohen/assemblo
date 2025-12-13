const docSideBar = document.getElementById('docSideBar');
const docContent = document.getElementById('docContent')

function createDocListTitle(title) {
  const aEl = document.createElement('a');
  aEl.id = `${title}ListTitle`
  aEl.href = `/docs?item=${title}`;
  aEl.className = "list-group-item list-group-item-action"
  aEl.innerHTML = `<span class="fs-5 fw-semibold">${title}</span>`;
  return aEl;
}

function createDocListItem(doc) {
  const a = document.createElement('a')
  a.href=`/docs?item=${doc.name}`

  a.className = "mb-1 list-group-item"
  a.innerText = doc.name
  return a;
}

function renderDocList(doc) {
  const docListTitle = createDocListTitle(doc.name);
  docSideBar.append(docListTitle);

  if (!doc.items) return;
}

function renderDocListItem(elem, doc) {
  const listItem = createDocListItem(doc)
  elem.appendChild(listItem)
}

function renderDocContent(item) {
  if (!item) return;
  const divEl = document.createElement('div');

  divEl.innerHTML = `<div class="p-4">
          <h1>${item.name}</h1>
          <p>${item.description}</p>
        </div>`

  docContent.append(divEl);
}


export default {
  renderDocList,
  renderDocListItem,
  renderDocContent
}