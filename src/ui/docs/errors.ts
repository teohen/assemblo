const doc = {
  name: 'errors',
  description: `<p>
        Any error that occurs during the execution of the program will be printed into the programs console with a message describing what happened.
    </p>
    <hr>

    <h4>Error message structure</h4>

    <ul>
        <li>
            <strong>Line: </strong> The program's line where the error occured.
        </li>
        <li>
            <strong>Message: </strong> A description of the error.
        </li>
    </ul>
    <hr>

    <h4>Argument examples</h4>
    <pre>MOVE: r0, r1</pre>

    <code>//system console:<br>At line x. Instruction (MOVE) not found.</code>
    <p>
        <em>(results in error)</em>
    </p>`
}

export default doc