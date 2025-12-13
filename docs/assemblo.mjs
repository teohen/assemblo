const doc = {
  name: 'assemblo',
  description: `
<p><strong>Assemblo</strong>, a pseudo-Assembly language that supports data manipulation and processing through <a href="docs?item=instructions">instructions</a> that operates on <a href="docs?item=registers">registers</a> and <a href="docs?item=memory">memory</a> slots. Programmers can use <strong>Assemblo</strong> to solve a series of coding challenges and improve their knowlegde. </p>
<h4>examples</h4>
<pre>
// prints all items from INPUT = [3, 2, 1]
  START
    POP: r0, INPUT
    PRT: r0
    POP: r0, INPUT
    PRT: r0
    POP: r0, INPUT
    PRT: r0
  END
</pre>
<code>//system console:<br>1<br>2<br>3</code>
    `
}

export default doc;