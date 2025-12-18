import { status } from "../src/program.mjs";
import editor from "./codemirror.mjs";

const consoleElem = document.getElementById("consoleOutput");
const challengeElem = document.getElementById("challengeInfo");
const codeInfo = document.getElementById("codeInfo");
const registersTable = document.getElementById("registersTable")
const memoryTable = document.getElementById("memoryTable")
const runBtn = document.getElementById('runBtn');
const debugBtn = document.getElementById('debugBtn');
const nextLineBtn = document.getElementById('nextLineBtn');
const restoreBtn = document.getElementById('restoreBtn');
const submitBtn = document.getElementById('submitBtn');
const runDelay = document.getElementById('runDelay');
const testModal = document.getElementById('testModal');
const myModal = new bootstrap.Modal(testModal);

function renderCodeInfo(p, inputStack) {
  codeInfo.children[0].innerText = p.line || '_';
  codeInfo.children[1].innerText = p.status || '_';
  codeInfo.children[2].innerText = p.instCounter || 0
  codeInfo.children[3].innerText = inputStack ? '[' + inputStack + ']' : '[]';
  codeInfo.children[4].innerText = p.outQ ? '[' + p.outQ + ']' : '[]';
}

function renderRegistersMemoryInfo(p) {
  memoryTable.children[0].innerText = p.memory.get("MX0") !== undefined ? p.memory.get("MX0") : "_"
  memoryTable.children[1].innerText = p.memory.get("MX1") !== undefined ? p.memory.get("MX1") : "_"
  memoryTable.children[2].innerText = p.memory.get("MX2") !== undefined ? p.memory.get("MX2") : "_"

  registersTable.children[0].innerText = p.registers.get("R0X") !== undefined ? p.registers.get("R0X") : "_"
  registersTable.children[1].innerText = p.registers.get("R1X") !== undefined ? p.registers.get("R1X") : "_"
  registersTable.children[2].innerText = p.registers.get("R2X") !== undefined ? p.registers.get("R2X") : "_"

}

function renderConsoleOutput(p) {
  consoleElem.replaceChildren();
  for (const log of p.logger) {
    consoleElem.appendChild(createConsoleOuput(log))
  }

  consoleElem.scrollTop = consoleElem.scrollHeight;
}

function renderChallengeInfo(challenge) {
  if (!challenge) return;

  const challengeEls = createChallengeInfo(challenge);
  for (const el of challengeEls) {
    challengeElem.appendChild(el)
  }
}

function createChallengeInfo(c) {
  const elemTitle = document.createElement("h3")
  elemTitle.innerText = c.title

  const elemText = document.createElement("p")
  elemText.innerHTML = c.text
  return [elemTitle, elemText]
}

function createConsoleOuput(log) {
  const output = document.createElement("div")
  output.classList.add('alert')
  output.role = "alert"

  switch (log.type) {
    case "error":
      output.classList.add('alert-danger')
      break;
    case "message":
      output.classList.add('alert-secondary')
      break;

    default:
      output.classList.add('alert-success')
  }

  output.innerText = log.value

  return output
}

function updateIcon(elem, text, type) {
  const runningIcon = `<i class="fas fa-sync-alt fa-spin"></i> ${text}`;
  const playIcon = `<i class="fas fa-play"></i> ${text}`;
  const bugIcon = `<i class="fas fa-bug"></i> ${text}`;

  if (type == 'spin') elem.innerHTML = runningIcon
  else if (type == 'play') elem.innerHTML = playIcon
  else elem.innerHTML = bugIcon

}

function debugging() {
  if (debugBtn.innerText.includes('Debugging...')) return;
  updateIcon(debugBtn, 'Debugging... (click to cancel)', 'spin')
}

function running() {
  if (runBtn.innerText.includes('Running...')) return;
  updateIcon(runBtn, 'Running...', 'spin')
}

function resetIcons() {
  updateIcon(runBtn, 'Run', 'play')
  updateIcon(debugBtn, 'Debug', 'bug')
}

function updateButtons(p) {
  if (p.status === status.FINISHED) {
    runBtn.hidden = true
    debugBtn.hidden = true
    submitBtn.hidden = true
    runDelay.hidden = true
    restoreBtn.hidden = false
  } else if (p.status === status.READY) {
    resetIcons()
    runBtn.hidden = false
    debugBtn.hidden = false
    submitBtn.hidden = false
    runDelay.hidden = false
    restoreBtn.hidden = false
    nextLineBtn.hidden = true
  } else if (p.status === status.RUNNING) {
    if (editor.options.readOnly) {
      debugging()
      runBtn.hidden = true
      debugBtn.hidden = false
    } else {
      running()
      runBtn.hidden = false
      debugBtn.hidden = true
    }

    submitBtn.hidden = true
    runDelay.hidden = true
    restoreBtn.hidden = true
  } else if (p.status === status.PARSED) {
    runBtn.hidden = true
    debugBtn.hidden = false
    submitBtn.hidden = true
    runDelay.hidden = true
    restoreBtn.hidden = true
    nextLineBtn.hidden = false
  }
}

function clearEditor() {
  for (let i = 0; i < editor.lineCount(); i++) {
    editor.removeLineClass(i, "background", 'red-line')
    editor.removeLineClass(i, "background", 'yellow-line')
  }
}

function updateUI(p, inputStack) {
  renderCodeInfo(p, inputStack);
  renderRegistersMemoryInfo(p);
  renderConsoleOutput(p);
  updateButtons(p);
}

function updateEditor(p) {
  if (p.status === status.READY) {
    editor.setOption('readOnly', false);
  }

  const errors = p.logger.find((i) => i.type === 'error');
  clearEditor()
  editor.addLineClass(p.line - 1, "background", "yellow-line");
  if (errors) editor.addLineClass(errors.ln - 1, "background", "red-line");
}

function showModal(p, success) {
  const modalHeader = testModal.firstElementChild.firstElementChild.firstElementChild;
  const modalTitle = modalHeader.firstElementChild;

  if (success == true) {
    modalHeader.classList.remove('bg-danger')
    modalHeader.classList.add('bg-success')
    modalTitle.innerHTML = "Correct!"
  } else {
    modalHeader.classList.remove('bg-success')
    modalHeader.classList.add('bg-danger')
    modalTitle.innerHTML = "Failed"
  }

  const testsResults = document.getElementById('testsResults');
  testsResults.replaceChildren()


  const fragment = document.createDocumentFragment();

  const items = [
    { data: 'output', value: '[' + p.outQ + ']' },
    { data: 'Inst. Count', value: p.instCounter },
    { data: 'Reg 0', value: p.registers.get("R0X") !== undefined ? p.registers.get("R0X") : " " },
    { data: 'Reg 1', value: p.registers.get("R1X") !== undefined ? p.registers.get("R1X") : " " },
    { data: 'Reg 2', value: p.registers.get("R2X") !== undefined ? p.registers.get("R2X") : " " },
    { data: 'Mem 0', value: p.memory.get("MX0") !== undefined ? p.memory.get("MX0") : " " },
    { data: 'Mem 1', value: p.memory.get("MX1") !== undefined ? p.memory.get("MX1") : " " },
    { data: 'Mem 2', value: p.memory.get("MX2") !== undefined ? p.memory.get("MX2") : " " },
  ];

  items.forEach(i => {
    const td1 = document.createElement('td');
    const td2 = document.createElement('td');
    td1.textContent = i.data;
    td1.classList.add('bold')
    td2.textContent = i.value;

    const tr = document.createElement('tr');
    tr.appendChild(td1)
    tr.appendChild(td2)
    fragment.appendChild(tr);
  });

  testsResults.appendChild(fragment);
  myModal.show();
}

document.addEventListener('DOMContentLoaded', function () {
  const themeToggle = document.getElementById('themeToggle');
  const htmlElement = document.documentElement;

  const savedTheme = localStorage.getItem('theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  if (savedTheme === 'dark') {
    editor.setOption("theme", "monokai")
    htmlElement.setAttribute('data-bs-theme', 'dark');
  }


  themeToggle.addEventListener('click', function () {
    if (htmlElement.getAttribute('data-bs-theme') === 'dark') {
      htmlElement.setAttribute('data-bs-theme', 'light');
      editor.setOption("theme", "default")
      localStorage.setItem('theme', 'light');
    } else {
      editor.setOption("theme", "monokai")
      htmlElement.setAttribute('data-bs-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
  });
});

export default {
  renderChallengeInfo,
  updateUI,
  updateEditor,
  showModal
}