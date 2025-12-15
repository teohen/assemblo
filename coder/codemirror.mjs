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

const savedCode = localStorage.getItem('code') || `START
  ...code here
END`;

editor.setValue(savedCode);

export default editor;