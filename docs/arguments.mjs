const docs = {
  name: 'arguments',
  description: `<p>
        Arguments define the data that an instruction operates on. They specify the location of the data or the data itself.
    </p>
    <hr>

    <h4>Possible Argument Types</h4>

    <ul>
        <li>
            <strong>Register Address:</strong> Represents one of the programs available registers (<code>r0, r1, r2</code>).
        </li>
        <li>
            <strong>Memory Address:</strong> Represents one memory address in the programs memory (<code>mx0, mx1, mx2</code>).
        </li>
        <li>
            <strong>Integer (number):</strong> A integer number ranging from <code>-1000 to 1000</code>
        </li>
        <li>
            <strong>List:</strong> A special entity that's used to take data from and to in a specific order. (<code>INPUT, OUTPUT</code>)
        </li>
    </ul>
    <hr>

    <h4>Argument examples</h4>
    <pre>LOAD: r0, mx0</pre>
    <pre>JPM_N: 2, r0</pre>`
}

export default { docs };