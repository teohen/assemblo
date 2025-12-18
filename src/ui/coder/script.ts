import Program, { status } from "../../assemblo/program";
import challenges from "../challenges/challenges";
import editor from "./codemirror";
import ui from "./ui"

const runBtn = document.getElementById('runBtn');
const debugBtn = document.getElementById('debugBtn');
const nextLineBtn = document.getElementById('nextLineBtn');
const restoreBtn = document.getElementById('restoreBtn');
const submitBtn = document.getElementById('submitBtn');
const delay = document.getElementById('runDelay')
const runDelay = delay?.firstElementChild as HTMLInputElement;

const urlParams = new URLSearchParams(window.location.search);
const paramChallenge = urlParams.get('challenge');

let p = new Program();
let inputStack = [];
let expected = [];
let challenge;

if (paramChallenge) {
  const ch: any = challenges[paramChallenge]
  inputStack = ch.input
  expected = ch.expected
  challenge = ch
  if (submitBtn) submitBtn.hidden = false
}

ui.renderChallengeInfo(challenge);
p.reset(inputStack)
ui.updateUI(p, inputStack)

runBtn?.addEventListener('click', function() {
  if (p.status === status.RUNNING) return;

  const code = editor.getValue();
  p.reset(inputStack);
  let lastLine = p.line;
  p.run(code,
    () => {
      ui.updateUI(p, inputStack);
      ui.updateEditor(p)
      lastLine = p.line
    },
    () => {
      ui.updateUI(p, inputStack)
    },
    parseInt(runDelay?.value)
  );
});

debugBtn?.addEventListener('click', function() {
  if (p.status === status.READY) {
    p.prepareOperations(editor.getValue())
  } else {
    p.reset(inputStack)
  }

  ui.updateUI(p, inputStack);
  editor.setOption("readOnly", !editor.options.readOnly)
});

nextLineBtn?.addEventListener("click", () => {
  p.nextLine();
  ui.updateUI(p, inputStack);
  ui.updateEditor(p)
});

restoreBtn?.addEventListener("click", () => {
  p.reset(inputStack);
  ui.updateUI(p, inputStack)
  ui.updateEditor(p)
})

submitBtn?.addEventListener("click", () => {
  const code = editor.getValue();
  p.reset(inputStack);

  p.run(code, () => {
    ui.updateUI(p, inputStack)
  }, () => {
    p.test(expected);
    ui.updateUI(p, inputStack)
  }, 1);
})


let autoSaveTimeout: any;

editor.on('change', function() {
  if (autoSaveTimeout) clearTimeout(autoSaveTimeout);
  autoSaveTimeout = setTimeout(function() {
    localStorage.setItem('code', editor.getValue());
  }, 750);
});


