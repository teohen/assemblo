const docs = {
  name: 'memory',
  description: `<p>
        Memory in Assemblo are storage locations separate from the <a href="/docs?item=registers">registers</a>. It is used for longer-term data storage and retrieval within the program.
        A memory slot can't be directly used in processing <a href="/docs?item=instructions">instructions</a> such as ADD or SUB. 
    </p>

    <hr>

    <h2>Available Memory Slots</h2>

    <p>
        The program's available memory is segmented into 3 addressable slots:
    </p>

    <ul>
        <li><strong>mx0</strong> (Memory Slot Zero)</li>
        <li><strong>mx1</strong> (Memory Slot One)</li>
        <li><strong>mx2</strong> (Memory Slot Two)</li>
    </ul>

    <p>
        These slots are accessed using their unique memory addresses as arguments in <a href="/docs?item=instructions">instructions</a>.
    </p>

    <hr>

    <h2>Memory as Arguments</h2>

    <p>
        Memory addresses are used as <a href="/docs?item=arguments">arguments</a> to transfer data between memory and other entities, such as <a href="/docs?item=registers">registers</a>.
    </p>

    <pre>CPY: mx0, r1</pre>
    <p><em>(The value from register <code>r1</code> is CPY into memory address <code>mx0</code>.)</em></p>

    <pre>LOAD: r2, mx1</pre>
    <p><em>(The value from memory address <code>mx1</code> is loaded into register <code>r2</code>.)</em></p>`
}

export default { docs };