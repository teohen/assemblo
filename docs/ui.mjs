const docSideBar = document.getElementById('docSideBar');
const docContent = document.getElementById('docContent')

function createDocListItem(item) {
  const aEl = document.createElement('a');
  aEl.innerHTML = `<a href="/docs?item=${item.name}" class="list-group-item list-group-item-action py-3 lh-tight" aria-current="true">
          <div class="d-flex w-100 align-items-center justify-content-between">
            <strong class="mb-1">${item.name}</strong>
          </div>
        </a>`;

  return aEl;
}

function createDocListItems(items) {
  const divEl = document.createElement("div");
  divEl.innerHTML = `<div class="list-group list-group-flush border-bottom scrollarea"></div>`;

  for (const i of items) {
    divEl.append(createDocListItem(i))
  }

  return divEl
}

function createDocListTitle(title) {
  const aEl = document.createElement('a');

  aEl.innerHTML = `<a href="/docs?item=${title}" class="d-flex align-items-center flex-shrink-0 p-3 link-dark text-decoration-none border-bottom">
          <span class="fs-5 fw-semibold">${title}</span>
        </a>`;
  return aEl;
}

function renderDocList(doc) {
  const docListTitle = createDocListTitle(doc.title);
  const docListItems = createDocListItems(doc.items);
  docSideBar.append(docListTitle);
  docSideBar.append(docListItems);
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
  renderDocContent
}