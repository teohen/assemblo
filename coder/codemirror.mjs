CodeMirror.defineSimpleMode("your-custom-mode", {
  start: [
    {
      regex: /^\s*(POP|PUSH|CPY|JMP_N|JMP_P|JMP_Z|JMP_U|ADD|SUB|LOAD|PRT)\s*:/,
      token: "keyword",
      next: "arguments",
    },

    { regex: /;.*/, token: "comment" },

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
  theme: "default"
});

editor.setValue(`START
  ...code here
END`);

// editor.setValue(`START
//   POP: r0, INPUT
//   JMP_U:8, r0
//   JMP_N: 2, r0
//   PUSH: OUTPUT, r0
//   PRT: r0
//   JMP_P: 2, r0
//   END`);


export default editor;