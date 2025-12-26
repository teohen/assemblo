const doc = {
  name: 'lists',
  description: `<p>
        Lists are special data storage entities that hold multiple values and enforce a strict, queue-based dynamic for data management. They are used to handle sequential data input and output for the program.
    </p>
    <hr>

    <h2>Available Lists</h2>

    <p>
        Assemblo provides two specialized lists, each with a fixed, unidirectional data flow:
    </p>

    <ul>
        <li>
            <strong>INPUT:</strong> A list of items that only accepts removing the last item from it. (stack)
        </li>
        <li>
            <strong>OUTPUT:</strong> A list of items that only accepts adding items to the end of it. (stack)
        </li>
    </ul>
    
    <hr>

    <h2>Lists as Arguments</h2>

    <p>
        Lists are used as <a href="docs?item=arguments">arguments</a> in specific <a href="docs?item=instructions">instructions</a>  such as (<a href="docs?item=pop">POP</a>, <a href="docs?item=push">PUSH</a>) to move data from/to them.
    </p>

    <pre>POP: r1, INPUT</pre>
    <p><em>(The last item from <code>INPUT</code> list is loaded into register <code>r1</code> and removed from the list.)</em></p>

    <pre>PUSH: OUTPUT, r0</pre>
    <p><em>(The value from register <code>r0</code> is added to the end of the <code>OUTPUT</code> list.)</em></p>
    `
}

export default doc