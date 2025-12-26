
const doc = {
  name: 'instructions',
  description: `<p>
        A instruction in Assemblo is a command that take <a href="docs?item=arguments">argument</a> and tells the program to execute a operation to store, process or move data between the programs entities (<a href="docs?item=registers">registers</a>, <a href="docs?item=memory">memory</a>, <a href="docs?item=list">list</a>) based on the arguments.
    </p>
    <hr>
    <h3>Structure</h3>
    <p>
        A Assemblo instruction generally follows a clear, predictable structure:
    </p>
    <pre>NAME: TARGET_ARG, SOURCE_ARG</pre>
    <ul>
        <li>
            <strong>NAME:</strong> The operation to be performed. The NAME is immediately followed by a colon (<code>:</code>).
        </li>
        <li>
            <strong>TARGET_ARG:</strong> The first <a href="docs?item=argument">argument</a> is the entity where the result of the operation will happen.
        </li>
        <li>
            <strong>SOURCE_ARG:</strong> The second <a href="docs?item=argument">argument</a> is the source of the data for the operation.
        </li>
    </ul>
    <p>
        <b>PS:</b> Some instructions only require one operand to perform their function. For these operations, the <code>TARGET_ARG</code> is used, and the <code>SOURCE_ARG</code> is omitted, along with the comma separator.
    </p>
    <hr>
    <h3>Instruction examples</h3>
    <pre>ADD: r0, r1</pre>
    <pre>PRT: r0</pre>`
}

export default doc