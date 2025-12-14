import Program, { status } from "../src/program.mjs";
import challenges from "../challenges/challenges.mjs";
import editor from "./codemirror.mjs";
import ui from "./ui.mjs"

const runBtn = document.getElementById('runBtn');
const debugBtn = document.getElementById('debugBtn');
const nextLineBtn = document.getElementById('nextLineBtn');
const restoreBtn = document.getElementById('restoreBtn');
const submitBtn = document.getElementById('submitBtn');
const runDelay = document.getElementById('runDelay');

const urlParams = new URLSearchParams(window.location.search);
const paramChallenge = urlParams.get('challenge');

let p = new Program();
let inputStack = [];
let expected = [];

if (paramChallenge) {
  const challenge = challenges[paramChallenge]
  inputStack = challenge.input
  expected = challenge.expected
  ui.renderChallengeInfo(challenge)
  submitBtn.hidden = false
}

p.reset(inputStack)
ui.renderCodeInfo(p, inputStack)

runBtn.addEventListener('click', function () {
  const code = editor.getValue();
  ui.updateIcon(this, 'Running...', 'spin');
  p.reset(inputStack);
  let lastLine = p.line;
  p.run(code,
    () => {
      ui.renderCodeInfo(p, inputStack);
      ui.renderRegistersMemoryInfo(p);
      ui.renderConsoleOutput(p);
      ui.paintEditorLine(p.line - 1, 'yellow-line')
      ui.removePaintEditorLine(lastLine - 1, 'yellow-line')
      lastLine = p.line
    },
    () => { ui.updateIcon(runBtn, 'Run', 'play') },
    parseInt(runDelay.value)
    );
});

debugBtn.addEventListener('click', function () {
  if (p.status === status.READY) {
    p.prepareOperations(editor.getValue())
    ui.enableDebugMode(runBtn, nextLineBtn, debugBtn, restoreBtn, submitBtn)
  } else {
    p.reset(inputStack)
    ui.disabelDebugMode(runBtn, nextLineBtn, debugBtn, restoreBtn, submitBtn)
  }

  ui.renderConsoleOutput(p)
  editor.setOption("readOnly", !editor.options.readOnly)

});

nextLineBtn.addEventListener("click", () => {
  let lastLine = p.line
  p.nextLine();
  ui.renderCodeInfo(p, inputStack);
  ui.renderRegistersMemoryInfo(p);
  ui.renderConsoleOutput(p);

  ui.paintEditorLine(p.line - 1, 'yellow-line')
  ui.removePaintEditorLine(lastLine - 1, 'yellow-line')
});

restoreBtn.addEventListener("click", () => {
  p.reset(inputStack);

  ui.renderCodeInfo(p, inputStack);
  ui.renderRegistersMemoryInfo(p);
  ui.renderConsoleOutput(p);
  ui.updateIcon(debugBtn, 'Debug', 'bug')
})

submitBtn.addEventListener("click", () => {
  const code = editor.getValue();
  p.reset(inputStack);
  p.run(code, () => {
    ui.renderCodeInfo(p, inputStack);
    ui.renderRegistersMemoryInfo(p);
    ui.renderConsoleOutput(p);
  }, () => {
    p.test(expected);
    ui.renderConsoleOutput(p);
  }, parseInt(runDelay.value));
})
