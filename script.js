import Program from "./src/program.mjs";

// DOM Elements

const runBtn = document.getElementById('runBtn');
const debugBtn = document.getElementById('debugBtn');
const nextLineBtn = document.getElementById('nextLineBtn');

CodeMirror.defineSimpleMode("your-custom-mode", {
  start: [
    // 1. COMMAND RULE: Handles optional leading space, the command, and the delimiter.
    // In the start array:
    {
      // This allows spaces before and after the command, matching everything up to the colon
      // It is simpler than dealing with three separate capture groups.
      regex: /^\s*(POP|PUSH|CPY|JMP_N|JMP_P|JMP_Z|JMP_U|ADD|SUB|LOAD|PRT)\s*:/,

      // Assigns the token directly to the whole match group, then transitions.
      token: "keyword",
      next: "arguments",
    },

    // 2. Comments (Handle lines that are just comments)
    { regex: /;.*/, token: "comment" },

    // 3. Fallback (Catches anything that isn't a command or comment)
    { regex: /.*/, token: null },
  ],

  arguments: [
    { regex: /\s+/, token: null },
    { regex: /,/, token: "operator" },
    { regex: /.*/, next: "start" },
  ],
});

var editor = CodeMirror(document.getElementById("editor-code-mirror"), {
  lineNumbers: true,
  mode: "your-custom-mode",
});


const noNegatives = `START
POP: r0, INPUT
JMP_U: 9, r0
JMP_N: 2, r0
PUSH: OUTPUT, r0
PRT: r0
JMP_P: 2, r0
JMP_Z: 2, r0
END`

const deb = `START
 POP: r0, INPUT
 POP: r1, INPUT
 POP: r2, INPUT
 CPY: mx0, r0
 CPY: mx1, r1
 CPY: mx2, r2
 PRT: r0
 END`;

const urlParams = new URLSearchParams(window.location.search);
const cParam = urlParams.get('code');

if (cParam) {
  editor.setValue(cParam)
}

const q = [1, -2, 3, -4, 5];
const p = new Program(q)


// Button actions
runBtn.addEventListener('click', function () {
  this.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i> Running...';
  const q = [1, -2, 3, -4, 5];
  const p = new Program(q)
  p.run(editor.getValue())

  updateUi(p);


  this.innerHTML = '<i class="fas fa-play"></i> Run';
});

debugBtn.addEventListener('click', function () {
  if (!p.debugging) {
    p.prepareEval(editor.getValue());
  } else {

    for (let i = 0; i < p.runner.operations.length; i++) {
      editor.removeLineClass(i, "background", "highlighted-line");
    }
    p.resetProgram()
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

  // TODO: FIX THE HIGHLIGHTING PROBLEM
  editor.addLineClass(p.line - 1, "background", "highlighted-line");
  editor.removeLineClass(p.line - 2, "background", "highlighted-line");

  document.getElementById('codeLine').innerHTML = p.line;
  document.getElementById('statusMetric').innerHTML = p.running ? "running" : "stopped";
  document.getElementById('cpuCycles').innerHTML = 0;
  document.getElementById('inputMetric').innerHTML = p.inQ;
  document.getElementById('outputMetric').innerHTML = p.outQ;

  document.getElementById("memoryTable").lastElementChild.children[0].innerHTML = p.memory.get("MX0") || ""
  document.getElementById("memoryTable").lastElementChild.children[1].innerHTML = p.memory.get("MX1") || ""
  document.getElementById("memoryTable").lastElementChild.children[2].innerHTML = p.memory.get("MX2") || ""

  document.getElementById("registersTable").lastElementChild.children[0].innerHTML = p.registers.get("R0X") || ""
  document.getElementById("registersTable").lastElementChild.children[1].innerHTML = p.registers.get("R1X") || ""
  document.getElementById("registersTable").lastElementChild.children[2].innerHTML = p.registers.get("R2X") || ""
}
