const doc = {
  name: 'labels',
  description: `<p>
        Labels are named references to specific lines in an Assemblo program. They let you mark a line with a name and then refer to that name in <a href="docs?item=instructions">instructions</a> like <code>JMP_N</code>, <code>JMP_P</code>, <code>JMP_Z</code>, and <code>JMP_U</code> instead of using a raw line number.
    </p>

    <hr>

    <h2>Label Syntax</h2>

    <p>
        A label is written as a dot (<code>.</code>) followed by a name:
    </p>

    <pre>LBL: .labelname</pre>

    <p>
        The name can be any alphanumeric identifier (eg. <code>.start</code>, <code>.end</code>, <code>.loop</code>, <code>.done</code>).
    </p>

    <hr>

    <h2>Predefined Labels</h2>

    <p>
        Assemblo has two predefined labels that every program must use:
    </p>

    <ul>
        <li>
            <strong><a href="docs?item=.start">.start</a>:</strong> Marks the beginning of the program. Execution always starts here.
        </li>
        <li>
            <strong><a href="docs?item=.end">.end</a>:</strong> Marks the end of the program. Execution stops when reached.
        </li>
    </ul>

    <hr>

    <h2>Labels as Jump Targets</h2>

    <p>
        Conditional jump instructions use labels instead of line numbers to specify the target. This makes programs easier to read and maintain — adding or removing lines does not break jump targets.
    </p>

    <pre>
LBL: .start
  POP: r0, INPUT
  JMP_N: .end, r0
  PRT: r0
LBL: .end
    </pre>

    <p>
        In this example, if <code>r0</code> is negative the program jumps directly to <code>.end</code>, skipping the <code>PRT</code> instruction.
    </p>

    <hr>

    <h2>Duplicate Labels</h2>

    <p>
        Each label name must be unique. Defining the same label twice causes an error.
    </p>

    <hr>

    <h2>Labels vs Line Numbers</h2>

    <p>
        Older versions of Assemblo used raw line numbers as jump targets. Modern Assemblo programs must use labels. Labels are resolved to the correct line number automatically during program loading.
    </p>`
}

export default doc
