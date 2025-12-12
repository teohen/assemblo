import challenges from "./challenges.mjs";

const listElem = document.getElementById("challengeList");

function renderChallenges() {
  for (const ch of Object.values(challenges)) {
    listElem.appendChild(createListItem((ch)))
  }
}

function createListItem(ch) {
  const elP = document.createElement("p")
  elP.className = "mb-1 description"
  elP.innerText = ch.description

  const elH5 = document.createElement("h5")
  elH5.className = "mb-1"
  elH5.innerText = ch.title

  const elDiv = document.createElement("div")
  elDiv.className = "d-flex w-100 justify-content-between"
  elDiv.appendChild(elH5)

  const elA = document.createElement("a");
  elA.href = `coder?challenge=${ch.id}`;
  elA.className = "list-group-item list-group-item-action"
  elA.appendChild(elDiv)
  elA.appendChild(elP)

  return elA
}

renderChallenges()


document.addEventListener('DOMContentLoaded', function () {
  const themeToggle = document.getElementById('themeToggle');
  const htmlElement = document.documentElement;

  const savedTheme = localStorage.getItem('theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  if (savedTheme === 'dark') {
    htmlElement.setAttribute('data-bs-theme', 'dark');
  }


  themeToggle.addEventListener('click', function () {
    if (htmlElement.getAttribute('data-bs-theme') === 'dark') {
      htmlElement.setAttribute('data-bs-theme', 'light');
      localStorage.setItem('theme', 'light');
    } else {
      htmlElement.setAttribute('data-bs-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
  });
});
