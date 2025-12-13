const docs = {
  name: 'registers',
  description: `<p>
        Registers are the fundamental, high-speed storage locations directly within the pseudo-processor. They are essential for performing calculations and data manipulation quickly, as accessing them is much faster than accessing main memory.
    </p>
    
    <p>
        In Pseud ASM, registers are used to temporarily hold data, intermediate results of operations, and addresses for memory access.
    </p>

    <hr>

    <h2>Register Structure and Naming</h2>

    <p>
        All general-purpose registers in Pseud ASM follow a strict naming convention: a lowercase <code>r</code> followed immediately by an integer index.
    </p>

    <pre>r&lt;index&gt;</pre>

    <p>
        For example, <code>r0</code> is the first register, <code>r1</code> is the second, and so on.
    </p>

    <hr>

    <h2>Available General-Purpose Registers</h2>

    <p>
        The Pseud ASM processor provides a total of 10 general-purpose registers, available for any data storage or calculation task:
    </p>

    <ul>
        <li><strong>r0</strong> (Register Zero)</li>
        <li><strong>r1</strong> (Register One)</li>
        <li><strong>r2</strong> (Register Two)</li>
        <li><strong>r3</strong> (Register Three)</li>
        <li><strong>r4</strong> (Register Four)</li>
        <li><strong>r5</strong> (Register Five)</li>
        <li><strong>r6</strong> (Register Six)</li>
        <li><strong>r7</strong> (Register Seven)</li>
        <li><strong>r8</strong> (Register Eight)</li>
        <li><strong>r9</strong> (Register Nine)</li>
    </ul>

    <h3>Important Note on Register Usage</h3>
    <p>
        While all general-purpose registers (<code>r0</code> through <code>r9</code>) can be used interchangeably for most operations, certain conventions or specific instructions may imply special usage for registers like <code>r0</code> (often used as an accumulator) or the highest registers. Consult the **Instruction Set** documentation for any register-specific rules.
    </p>

    <hr>

    <h2>Registers as Arguments</h2>

    <p>
        Registers are typically used as the **Target Argument** to store a result, or as a **Source Argument** to provide data for an operation.
    </p>

    <pre>LOAD: r0, mx0</pre>
    <p><em>(The value from memory address <code>mx0</code> is loaded into register <code>r0</code>.)</em></p>

    <pre>ADD: r1, r0</pre>
    <p><em>(The value in <code>r0</code> is added to the value in <code>r1</code>, and the result is stored back in <code>r1</code>.)</em></p>`
}

export default { docs };