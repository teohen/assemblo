const list = [
  {
    name: 'START',
    description: `<p>
    Starts the program setting <a href="docs?item=registers">registers</a>, <a href="docs?item=memory">memory</a>, line counter, etc and represents the starting point of the program.
</p>

<hr>

<h3>Structure and Arguments</h3>
<pre>START</pre>

<hr>

<h3>Example</h3>

<pre>START<br>...<br>...</pre>


<code>//program:<br>// line = line of the START<br>// status = RUNNING</code>
`

  },
  {
    name: 'END',
    description: `<p>
    Ends the program setting the program status to ENDED and the line counter to -1.
</p>

<hr>

<h3>Structure and Arguments</h3>
<pre>END</pre>

<hr>

<h3>Example</h3>

<pre>...<br>...<br>END</pre>


<code>//program:<br>// line = -1<br>// status = ENDED</code>
`
  },
  {
    name: 'POP',
    description: `<p>
    Removes the last item from the program's INPUT <a href="docs?item=lists">list</a> and store the value into a specified <a href="docs?item=registers">register</a>.
</p>

<hr>

<h3>Structure and Arguments</h3>
<pre>POP: TARGET_REGISTER, INPUT</pre>
<ul>
    <li>
        <strong>TARGET_REGISTER:</strong> any available <a href="docs?item=registers">register</a>.
    </li>
    <li>
        <strong>INPUT:</strong> The INPUT <a href="docs?item=lists">list</a>.
    </li>
</ul>

<hr>

<h3>Example</h3>

<code>// INPUT = [3, 2, 1]</code>
<br>
<br>

<pre>POP: r1, INPUT</pre>

<code>// r1 = 1<br>// INPUT = [3, 2]</code>
<p>
    <em>(The item at the back of the INPUT list is removed and its value is stored in register <code>r1</code>.)</em>
</p>`
  },
  {
    name: 'PUSH',
    description: `<p>
    Copies a value from a specified <a href="docs?item=registers">register</a> and add it to the end of the program's OUTPUT <a href="docs?item=lists">list</a>.
</p>

<hr>

<h3>Structure and Arguments</h3>
<pre>PUSH: OUTPUT, SOURCE</pre>
<ul>
    <li>
        <strong>OUTPUT:</strong> The OUTPUT <a href="docs?item=lists">list</a>.
    </li>
    <li>
        <strong>SOURCE:</strong> <a href="docs?item=registers">register</a> ou a interger number. 
    </li>
</ul>

<hr>

<h3>Example</h3>

<code>// r0 = 10<br>// OUTPUT = [4, 5]</code>
<br>
<br>

<pre>PUSH: OUTPUT, r0<br>PUSH: OUTPUT, 2</pre>

<code>// OUTPUT = [4, 5, 10, 2]</code>
`
  },
  {
    name: 'CPY',
    description: `<p>
    Copies the value stored in a specified <a href="docs?item=registers">register</a> and place that value into a designated <a href="docs?item=memory">memory</a> slot.
</p>

<hr>

<h3>Structure and Arguments</h3>
<pre>CPY: TARGET_MEMORY_ADDRESS, SOURCE</pre>
<ul>
    <li>
        <strong>TARGET_MEMORY_ADDRESS:</strong> One of the available <a href="docs?item=memory">memory addresses</a>.
    </li>
    <li>
        <strong>SOURCE:</strong> a <a href="docs?item=registers">register</a> or a interger number.
    </li>
</ul>

<hr>

<h3>Example</h3>

<code>// r0 = 55<br>// mx1 = 99 </code>
<br>
<br>

<pre>CPY: mx1, r0</pre>

<code>// r0 = 55 <br>// mx1 = 55</code>
`
  },
  {
    name: 'LOAD',
    description: `<p>
    Loads a value from a specified <a href="docs?item=memory">memory</a> slot and copy that value into a designated <a href="docs?item=registers">register</a>.
</p>

<hr>

<h3>Structure and Arguments</h3>
<pre>LOAD: TARGET_REGISTER, SOURCE_MEMORY_ADDRESS</pre>
<ul>
    <li>
        <strong>TARGET_REGISTER:</strong> One of the available <a href="docs?item=registers">registers</a>.
    </li>
    <li>
        <strong>SOURCE_MEMORY_ADDRESS:</strong> One of the available <a href="docs?item=memory">memory addresses</a>.
    </li>
</ul>

<hr>

<h3>Example</h3>

<code>// r1 = 10 (Initial value in register)<br>// mx0 = 77</code>
<br>
<br>

<pre>LOAD: r1, mx0</pre>

<code>// r1 = 77 (Value from mx0 is now in register r1)<br>// mx0 = 77 (Value in memory remains unchanged)</code>
<p>
    <em>(The value stored in memory slot <code>mx0</code> is copied to register <code>r1</code>, overwriting the previous content of <code>r1</code>.)</em>
</p>`
  },
  {
    name: 'JMP_N',
    description: `<p>
    Jumps to the line if the value of the provided <a href="docs?item=registers">register</a> is <b>NEGATIVE</b>.
</p>

<hr>

<h3>Structure and Arguments</h3>
<pre>JMP_N: TARGET_LINE_NUMBER, SOURCE</pre>
<ul>
    <li>
        <strong>TARGET_LINE_NUMBER :</strong> a integer number (from <code>0</code> up to the program's last line).
    </li>
    <li>
        <strong>SOURCE :</strong> a <a href="docs?item=registers">register</a> OR a integer number.
    </li>
</ul>

<hr>

<h3>Example</h3>

<code>// r0 = -5 (Initial value in register)<br>// r1 = 10 (Initial value in register)</code>
<br>
<br>

<pre>
1] JMP_N: 3, r0
2] PRT: r1
3] PRT: r0
</pre>


<code>//system console:<br>-5</code>

<p>
    <em>(The program's console will only print the value of <code>r0</code>: -5)</em>
</p>`
  },
  {
    name: 'JMP_P',
    description: `<p>
    Jumps to the line if the value of the provided <a href="docs?item=registers">register</a> is <b>POSITIVE</b>.
</p>

<hr>

<h3>Structure and Arguments</h3>
<pre>JMP_P: TARGET_LINE_NUMBER, SOURCE</pre>
<ul>
    <li>
        <strong>TARGET_LINE_NUMBER :</strong> a integer number (from <code>0</code> up to the program's last line).
    </li>
    <li>
        <strong>SOURCE :</strong> a <a href="docs?item=registers">register</a> OR a integer number.
    </li>
</ul>

<hr>

<h3>Example</h3>

<code>// r0 = 5 (Initial value in register)<br>// r1 = 10 (Initial value in register)</code>
<br>
<br>

<pre>
1] JMP_P: 3, r0
2] PRT: r1
3] PRT: r0
</pre>

<code>//system console:<br>5</code>

<p>
    <em>(The program's console will only print the value of <code>r0</code>: 5)</em>
</p>`
  },
  {
    name: 'JMP_Z',
    description: `<p>
    Jumps to the line if the value of the provided <a href="docs?item=registers">register</a> is <b>ZERO</b>.
</p>

<hr>

<h3>Structure and Arguments</h3>
<pre>JMP_Z: TARGET_LINE_NUMBER, SOURCE</pre>
<ul>
    <li>
        <strong>TARGET_LINE_NUMBER :</strong> a integer number (from <code>0</code> up to the program's last line).
    </li>
    <li>
        <strong>SOURCE :</strong> a available <a href="docs?item=registers">registers</a> OR integer number.
    </li>
</ul>

<hr>

<h3>Example</h3>

<code>// r0 = 0 (Initial value in register)<br>// r1 = 10 (Initial value in register)</code>
<br>
<br>

<pre>
1] JMP_Z: 3, r0
2] PRT: r1
3] PRT: r0
</pre>

<code>//system console:<br>0</code>

<p>
    <em>(The program1s console will only print the value of <code>r0</code>: 0)</em>
</p>`
  },
  {
    name: 'JMP_U',
    description: `<p>
    Jumps to the line if the value of the provided <a href="docs?item=registers">register</a> is <b>UNDEFINED</b>.
</p>

<hr>

<h3>Structure and Arguments</h3>
<pre>JMP_U: TARGET_LINE_NUMBER, SOURCE</pre>
<ul>
    <li>
        <strong>TARGET_LINE_NUMBER :</strong> a integer number (from <code>0</code> up to the program's last line).
    </li>
    <li>
        <strong>SOURCE :</strong> a <a href="docs?item=registers">register</a> or a integer number.
    </li>
</ul>

<hr>

<h3>Example</h3>

<code>// r1 = 10 (r0 never gets set)</code>
<br>
<br>

<pre>
1] JMP_U: 3, r0
2] PRT: r1
3] PRT: r0
</pre>

<code>//system console:<br>undefined</code>

<p>
    <em>(The program1s console will only print the value of <code>r0</code>: 0)</em>
</p>`
  },
  {
    name: 'ADD',
    description: `<p>
    Adds the value from the <i>SOURCE</i> to the value of <i>TARGET_REGISTER</i>.<br>Will result in a <a href="docs?item=errors">ERROR</a> if the value of <i>SOURCE</i> is <b>UNDEFINED</b>.
</p>

<hr>

<h3>Structure and Arguments</h3>
<pre>ADD: <i>TARGET_REGISTER</i>, <i>SOURCE</i></pre>
<ul>
    <li>
        <strong><i>TARGET_REGISTER</i> :</strong> One of the available <a href="docs?item=registers">registers</a>. 
    </li>
    <li>
        <strong><i>SOURCE</i> :</strong> a <a href="docs?item=registers">registers</a> or a integer number.
    </li>
</ul>

<hr>

<h3>Example</h3>

<code>// r0 = 15<br>// r1 = 7</code>
<br>
<br>

<pre>ADD: r0, r1<br>ADD: r0, 5</pre>

<code>// r0 = 27<br>// r1 = 7 (Source value is unchanged)</code>
<br>
=======================================
<br>
<code>// r0 = 15 (r1 is never set)</code>
<br>
<br>

<pre>ADD: r0, r1</pre>

<code>//system console:<br>At line x. Argument should be a valid integer.</code>
<p>
    <em>(results in error)</em>
</p>
`
  },
  {
    name: 'SUB',
    description: `<p>
    Subtracts the value from the <i>SOURCE</i> to the value of <i>TARGET_REGISTER</i>.<br>Will result in a <a href="docs?item=errors">ERROR</a> if the value of <i>SOURCE</i> is <b>UNDEFINED</b>.
</p>

<hr>

<h3>Structure and Arguments</h3>
<pre>SUB: <i>TARGET_REGISTER</i>, <i>SOURCE</i></pre>
<ul>
    <li>
        <strong><i>TARGET_REGISTER</i> :</strong> One of the available <a href="docs?item=registers">registers</a>. 
    </li>
    <li>
        <strong><i>SOURCE</i> :</strong> a available <a href="docs?item=registers">register</a> OR a integer number.
    </li>
</ul>

<hr>

<h3>Example</h3>

<code>// r0 = 15<br>// r1 = 7</code>
<br>
<br>

<pre>SUB: r0, r1<br>SUB: r0, 5</pre>

<code>// r0 = 3<br>// r1 = 7 (Source value is unchanged)</code>
<br>
=======================================
<br>
<code>// r0 = 15 (r1 is never set)</code>
<br>
<br>

<pre>SUB: r0, r1</pre>

<code>//system console:<br>At line x. Argument should be a valid integer.</code>
<p>
    <em>(results in error)</em>
</p>`
  },
  {
    name: 'PRT',
    description: `<p>
    Prints the value of the <a href="docs?item=registers">register</a> in the console.
</p>

<hr>

<h3>Structure and Arguments</h3>
<pre>PRT: TARGET_REGISTER</pre>
<ul>
    <li>
        <strong>TARGET_REGISTER :</strong> One of the available <a href="docs?item=registers">registers</a>. 
    </li>
</ul>

<hr>

<h3>Example</h3>

<code>// r0 = 15</code>
<br>
<br>

<pre>PRT: r0</pre>

<code>//system console:<br>15</code>

<p>
    <em>(The program's console will only print the value of <code>r0</code>: 15)</em>
</p>
`
  },
]

export default list