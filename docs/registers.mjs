const doc = {
  name: 'registers',
  description: `<p>
        Registers are storage locations directly within the program processor which are used to temporarily hold and process data.
    </p>
    
    <hr>

    <h2>Available Registers</h2>

    <p>
        The programs processor provides a total of 3 registers:
    </p>

    <ul>
        <li><strong>r0</strong> (Register Zero)</li>
        <li><strong>r1</strong> (Register One)</li>
        <li><strong>r2</strong> (Register Two)</li>
    </ul>
    <hr>

    <h2>Registers as Arguments</h2>

    <p>
        Registers are used as <a href="/docs?item=arguments">arguments</a> in <a href="/docs?item=instructions">instructions</a> to provide data for an operation as a source or destination.
    </p>

    <pre>LOAD: r0, mx0</pre>
    <p><em>(The value from memory address <code>mx0</code> is loaded into register <code>r0</code>.)</em></p>

    <pre>ADD: r1, r0</pre>
    <p><em>(The value in <code>r0</code> is added to the value in <code>r1</code>, and the result is stored back in <code>r1</code>.)</em></p>`
}

export default doc;