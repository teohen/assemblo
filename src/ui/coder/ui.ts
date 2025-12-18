import { status } from "../../assemblo/program";
import editor from "./codemirror";

const consoleElem = document.getElementById("consoleOutput");
const challengeElem = document.getElementById("challengeInfo");
const codeInfo: HTMLElement | null = document.getElementById("codeInfo");
const registersTable = document.getElementById("registersTable")
const memoryTable = document.getElementById("memoryTable")
const runBtn = document.getElementById('runBtn');
const debugBtn = document.getElementById('debugBtn');
const nextLineBtn = document.getElementById('nextLineBtn');
const restoreBtn = document.getElementById('restoreBtn');
const submitBtn = document.getElementById('submitBtn');
const runDelay = document.getElementById('runDelay');

function renderCodeInfo(p: any, inputStack: any) {
  if (codeInfo) codeInfo.children[0].innerHTML = p.line || '_';
  if (codeInfo) codeInfo.children[1].innerHTML = p.status || '_';
  if (codeInfo) codeInfo.children[2].innerHTML = '0'
  if (codeInfo) codeInfo.children[3].innerHTML = inputStack ? '[' + inputStack + ']' : '[]';
  if (codeInfo) codeInfo.children[4].innerHTML = p.outQ ? '[' + p.outQ + ']' : '[]';
}

function renderRegistersMemoryInfo(p: any) {
  if (memoryTable) memoryTable.children[0].innerHTML = p.memory.get("MX0") !== undefined ? p.memory.get("MX0") : "_"
  if (memoryTable) memoryTable.children[1].innerHTML = p.memory.get("MX1") !== undefined ? p.memory.get("MX1") : "_"
  if (memoryTable) memoryTable.children[2].innerHTML = p.memory.get("MX2") !== undefined ? p.memory.get("MX2") : "_"

  if (registersTable) registersTable.children[0].innerHTML = p.registers.get("R0X") !== undefined ? p.registers.get("R0X") : "_"
  if (registersTable) registersTable.children[1].innerHTML = p.registers.get("R1X") !== undefined ? p.registers.get("R1X") : "_"
  if (registersTable) registersTable.children[2].innerHTML = p.registers.get("R2X") !== undefined ? p.registers.get("R2X") : "_"

}

function renderConsoleOutput(p: any) {
  consoleElem?.replaceChildren();
  for (const log of p.logger) {
    consoleElem?.appendChild(createConsoleOuput(log))
  }
  if (consoleElem) consoleElem.scrollTop = consoleElem.scrollHeight;
}

function renderChallengeInfo(challenge: any) {
  if (!challenge) return;

  const challengeEls = createChallengeInfo(challenge);
  for (const el of challengeEls) {
    challengeElem?.appendChild(el)
  }
}

function createChallengeInfo(c: any) {
  const elemTitle = document.createElement("h3")
  elemTitle.innerText = c.title

  const elemText = document.createElement("p")
  elemText.innerHTML = c.text
  return [elemTitle, elemText]
}

function createConsoleOuput(log: any) {
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

function updateIcon(elem: any, text: any, type: any) {
  const runningIcon = `<i class="fas fa-sync-alt fa-spin"></i> ${text}`;
  const playIcon = `<i class="fas fa-play"></i> ${text}`;
  const bugIcon = `<i class="fas fa-bug"></i> ${text}`;

  if (type == 'spin') elem.innerHTML = runningIcon
  else if (type == 'play') elem.innerHTML = playIcon
  else elem.innerHTML = bugIcon

}

function debugging() {
  if (debugBtn?.innerText.includes('Debugging...')) return;
  updateIcon(debugBtn, 'Debugging... (click to cancel)', 'spin')
}

function running() {
  if (runBtn?.innerText.includes('Running...')) return;
  updateIcon(runBtn, 'Running...', 'spin')
}

function resetIcons() {
  updateIcon(runBtn, 'Run', 'play')
  updateIcon(debugBtn, 'Debug', 'bug')
}

function updateButtons(p: any) {
  if (p.status === status.FINISHED) {
    if (runBtn) runBtn.hidden = true
    if (debugBtn) debugBtn.hidden = true
    if (submitBtn) submitBtn.hidden = true
    if (runDelay) runDelay.hidden = true
    if (restoreBtn) restoreBtn.hidden = false
  } else if (p.status === status.READY) {
    resetIcons()
    if (runBtn) runBtn.hidden = false
    if (debugBtn) debugBtn.hidden = false
    if (submitBtn) submitBtn.hidden = false
    if (runDelay) runDelay.hidden = false
    if (restoreBtn) restoreBtn.hidden = false
    if (nextLineBtn) nextLineBtn.hidden = true
  } else if (p.status === status.RUNNING) {
    if (editor.options.readOnly) {
      debugging()
      if (runBtn) runBtn.hidden = true
      if (debugBtn) debugBtn.hidden = false
    } else {
      running()
      if (runBtn) runBtn.hidden = false
      if (debugBtn) debugBtn.hidden = true
    }

    if (submitBtn) submitBtn.hidden = true
    if (runDelay) runDelay.hidden = true
    if (restoreBtn) restoreBtn.hidden = true
  } else if (p.status === status.PARSED) {
    if (runBtn) runBtn.hidden = true
    if (debugBtn) debugBtn.hidden = false
    if (submitBtn) submitBtn.hidden = true
    if (runDelay) runDelay.hidden = true
    if (restoreBtn) restoreBtn.hidden = true
    if (nextLineBtn) nextLineBtn.hidden = false
  }
}

function clearEditor() {
  for (let i = 0; i < editor.lineCount(); i++) {
    editor.removeLineClass(i, "background", 'red-line')
    editor.removeLineClass(i, "background", 'yellow-line')
  }
}

function updateUI(p: any, inputStack: any) {
  renderCodeInfo(p, inputStack);
  renderRegistersMemoryInfo(p);
  renderConsoleOutput(p);
  updateButtons(p);
}

function updateEditor(p: any) {
  if (p.status === status.READY) {
    editor.setOption('readOnly', false);
  }

  const errors = p.logger.find((i: any) => i.type === 'error');
  clearEditor()




  editor.addLineClass(p.line - 1, "background", "yellow-line");
  if (errors) editor.addLineClass(errors.ln - 1, "background", "red-line");
}

document.addEventListener('DOMContentLoaded', function() {
  const themeToggle = document.getElementById('themeToggle');
  const htmlElement = document.documentElement;

  const savedTheme = localStorage.getItem('theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  if (savedTheme === 'dark') {
    editor.setOption("theme", "monokai")
    htmlElement.setAttribute('data-bs-theme', 'dark');
  }


  themeToggle?.addEventListener('click', function() {
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
  updateEditor
}
