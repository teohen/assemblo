import ui from "./ui.mjs";
import instructions from "./instructions.mjs";
import arg from "./arguments.mjs";
import register from "./registers.mjs";
import memory from "./memory.mjs";
import list from "./lists.mjs";
import err from "./errors.mjs";
import assemblo from "./assemblo.mjs";
import allinstructions from "./instructions-set.mjs"

const docs = {}
docs[instructions.name] = instructions;
docs[arg.name] = arg;
docs[register.name] = register;
docs[memory.name] = memory;
docs[list.name] = list;
docs[err.name] = err;
docs[assemblo.name] = assemblo;

for (const i of allinstructions) {
  docs[i.name] = i
}


const urlParams = new URLSearchParams(window.location.search);
const paramItem = urlParams.get('item');


ui.renderDocList(docs['assemblo']);
ui.renderDocList(docs['registers']);
ui.renderDocList(docs['memory']);
ui.renderDocList(docs['arguments']);
ui.renderDocList(docs['lists']);
ui.renderDocList(docs['errors']);
ui.renderDocList(docs['instructions']);

const instructionEle = document.getElementById('instructionsListTitle')
for (const i of allinstructions) {
  ui.renderDocListItem(instructionEle, i)
}

ui.renderDocContent(docs[paramItem])


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