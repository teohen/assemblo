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


export default editor;