import Program from "./src/program.mjs";
import challenges from "./challenges.mjs";
import editor from "./codemirror.mjs";

const runBtn = document.getElementById('runBtn');
const debugBtn = document.getElementById('debugBtn');
const nextLineBtn = document.getElementById('nextLineBtn');
const consoleElem = document.getElementById("consoleOutput");
const challengeElem = document.getElementById("challengeInfo");
const codeInfo = document.getElementById("codeInfo");
const registersTable = document.getElementById("registersTable")
const memoryTable = document.getElementById("memoryTable")

const urlParams = new URLSearchParams(window.location.search);
const paramChallenge = urlParams.get('challenge');

let p;
let inputStack;
let expected;

const noNegatives = `START
  POP: r0, INPUT
  JMP_U: 9, r0
  JMP_N: 2, r0
  PUSH: OUTPUT, r0
  PRT: r0
  JMP_P: 2, r0
  JMP_Z: 2, r0
  END`;

editor.setValue(noNegatives)

if (paramChallenge) {
  const challenge = challenges[paramChallenge]
  inputStack = challenge.input
  expected = challenge.expected

  p = new Program()

  const challengeEls = createChallengeInfo(challenge);
  for (const el of challengeEls) {
    challengeElem.appendChild(el)
  }
}


// Button actions
runBtn.addEventListener('click', function () {
  const code = editor.getValue();

  this.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i> Running...';
  p.reset(inputStack);
  p.run(code)
  // p.test(expected)

  updateUi(p);


  this.innerHTML = '<i class="fas fa-play"></i> Run';
});

debugBtn.addEventListener('click', function () {
  p.reset(inputStack)

  if (!p.debugging) {
    p.prepareEval(editor.getValue());
  }

  p.debugging = !p.debugging

  updateUi(p)
  nextLineBtn.hidden = !nextLineBtn.hidden
  runBtn.hidden = !runBtn.hidden
  editor.setOption("readOnly", !editor.options.readOnly)
});

nextLineBtn.addEventListener("click", () => {
  p.nextLine()
  updateUi(p)
});

function updateUi(p) {

  codeInfo.children[0].innerText = p.line;
  codeInfo.children[1].innerText = p.status;
  codeInfo.children[2].innerText = 0
  codeInfo.children[3].innerText = p.inQ;
  codeInfo.children[4].innerText = p.outQ;

  memoryTable.children[0].innerText = p.memory.get("MX0") || "_"
  memoryTable.children[1].innerText = p.memory.get("MX1") || "_"
  memoryTable.children[2].innerText = p.memory.get("MX2") || "_"

  registersTable.children[0].innerText = p.registers.get("R0X") || "_"
  registersTable.children[1].innerText = p.registers.get("R1X") || "_"
  registersTable.children[2].innerText = p.registers.get("R2X") || "_"

  consoleElem.replaceChildren();
  for (const log of p.logger) {
    consoleElem.appendChild(createConsoleOuput(log))
  }

  consoleElem.scrollTop = consoleElem.scrollHeight;
}

function createChallengeInfo(c) {
  const elemTitle = document.createElement("h3")
  elemTitle.innerText = c.title

  const elemDescription = document.createElement("h4")
  elemDescription.innerText = c.description

  const elemText = document.createElement("p")
  elemText.innerText = c.text
  return [elemTitle, elemDescription, elemText]
}

function createConsoleOuput(log) {
  const output = document.createElement("div")
  output.classList.add('alert')
  output.role = "alert"

  switch(log.type) {
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
