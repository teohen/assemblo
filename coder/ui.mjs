import editor from "./codemirror.mjs";

const consoleElem = document.getElementById("consoleOutput");
const challengeElem = document.getElementById("challengeInfo");
const codeInfo = document.getElementById("codeInfo");
const registersTable = document.getElementById("registersTable")
const memoryTable = document.getElementById("memoryTable")

function renderCodeInfo(p, inputStack) {
  codeInfo.children[0].innerText = p.line || '_';
  codeInfo.children[1].innerText = p.status || '_';
  codeInfo.children[2].innerText = 0
  codeInfo.children[3].innerText = inputStack ?  '[' + inputStack + ']' : '[]';
  codeInfo.children[4].innerText = p.outQ ?  '[' + p.outQ + ']' : '[]';
}

function renderRegistersMemoryInfo(p) {
  memoryTable.children[0].innerText = p.memory.get("MX0") !== undefined ?  p.memory.get("MX0") : "_"
  memoryTable.children[1].innerText = p.memory.get("MX1") !== undefined ?  p.memory.get("MX1") : "_"
  memoryTable.children[2].innerText = p.memory.get("MX2") !== undefined ?  p.memory.get("MX2") : "_"

  registersTable.children[0].innerText = p.registers.get("R0X") !== undefined ?  p.registers.get("R0X") : "_"
  registersTable.children[1].innerText = p.registers.get("R1X") !== undefined ?  p.registers.get("R1X") : "_"
  registersTable.children[2].innerText = p.registers.get("R2X") !== undefined ?  p.registers.get("R2X") : "_"

}

function renderConsoleOutput(p) {
  consoleElem.replaceChildren();
  for (const log of p.logger) {
    consoleElem.appendChild(createConsoleOuput(log))
  }
  consoleElem.scrollTop = consoleElem.scrollHeight;
}

function renderChallengeInfo(challenge) {
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

function toggleButtonHidden(elem) {
  elem.hidden = !elem.hidden
}

function paintEditorLine(lineNumber, colorClass) {
  editor.addLineClass(lineNumber, "background", colorClass);
}

function removePaintEditorLine(lineNumber, colorClass) {
  if (lineNumber < 0) return
  editor.removeLineClass(lineNumber, "background", colorClass);
}

function enableDebugMode(runBtn, nextLineBtn, debugBtn, restoreBtn, submitBtn) {
runBtn.hidden = true
nextLineBtn.hidden = false
restoreBtn.hidden = true
updateIcon(debugBtn, 'Debugging ... (click to cancel)', 'spin')
}

function disabelDebugMode(runBtn, nextLineBtn, debugBtn, restoreBtn, submitBtn) {
  runBtn.hidden = false
  nextLineBtn.hidden = true
  restoreBtn.hidden = false
  updateIcon(debugBtn, 'Debug', 'bug')
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
  renderCodeInfo,
  renderConsoleOutput,
  renderRegistersMemoryInfo,
  updateIcon,
  toggleButtonHidden,
  paintEditorLine,
  removePaintEditorLine,
  enableDebugMode,
  disabelDebugMode
}