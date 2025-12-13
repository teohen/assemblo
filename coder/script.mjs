import Program, { status } from "../src/program.mjs";
import challenges from "../challenges/challenges.mjs";
import editor from "./codemirror.mjs";
import ui from "./ui.mjs"

const runBtn = document.getElementById('runBtn');
const debugBtn = document.getElementById('debugBtn');
const nextLineBtn = document.getElementById('nextLineBtn');
const restoreBtn = document.getElementById('restoreBtn');

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
  
}

p.reset(inputStack)
ui.renderCodeInfo(p, inputStack)

runBtn.addEventListener('click', function () {
  const code = editor.getValue();
  ui.updateIcon(this, 'Running...', 'spin');
  p.reset(inputStack);
  p.run(code)

  ui.updateIcon(this, 'Run', 'play');

  ui.renderCodeInfo(p, inputStack);
  ui.renderRegistersMemoryInfo(p);
  ui.renderConsoleOutput(p);
});

debugBtn.addEventListener('click', function () {
  if (p.status === status.READY) {
    p.prepareOperations(editor.getValue())
    ui.enableDebugMode(runBtn, nextLineBtn, debugBtn, restoreBtn)
  } else {
    p.reset(inputStack)
    ui.disabelDebugMode(runBtn, nextLineBtn, debugBtn, restoreBtn)
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
