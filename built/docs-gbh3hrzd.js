// src/ui/docs/ui.ts
var docSideBar = document.getElementById("docSideBar");
var docContent = document.getElementById("docContent");
function createDocListTitle(title) {
  const aEl = document.createElement("a");
  aEl.id = `${title}ListTitle`;
  aEl.href = `docs?item=${title}`;
  aEl.className = "list-group-item list-group-item-action";
  aEl.innerHTML = `<span class="fs-5 fw-semibold">${title}</span>`;
  return aEl;
}
function createDocListItem(doc) {
  const a = document.createElement("a");
  a.href = `docs?item=${doc.name}`;
  a.className = "mb-1 list-group-item";
  a.innerText = doc.name;
  return a;
}
function renderDocList(doc) {
  const docListTitle = createDocListTitle(doc.name);
  docSideBar.append(docListTitle);
  if (!doc.items)
    return;
}
function renderDocListItem(elem, doc) {
  const listItem = createDocListItem(doc);
  elem.appendChild(listItem);
}
function renderDocContent(item) {
  if (!item)
    return;
  const divEl = document.createElement("div");
  divEl.innerHTML = `<div class="p-4">
          <h1>${item.name}</h1>
          <p>${item.description}</p>
        </div>`;
  docContent.append(divEl);
}
var ui_default = {
  renderDocList,
  renderDocListItem,
  renderDocContent
};

// src/ui/docs/instructions.ts
var doc = {
  name: "instructions",
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
};
var instructions_default = doc;

// src/ui/docs/arguments.ts
var doc2 = {
  name: "arguments",
  description: `<p>
        Arguments define the data that an <a href="docs?item=instructions">instruction</a> operates on. They specify the location of the data or the data itself.
    </p>
    <hr>

    <h4>Possible Argument Types</h4>

    <ul>
        <li>
            <strong><a href="docs?item=registers">Register</a> Address:</strong> Represents one of the programs available registers (<code>r0, r1, r2</code>).
        </li>
        <li>
            <strong><a href="docs?item=memory">Memory</a> Address:</strong> Represents one memory address in the programs memory (<code>mx0, mx1, mx2</code>).
        </li>
        <li>
            <strong>Integer (number):</strong> A integer number ranging from <code>-1000 to 1000</code>
        </li>
        <li>
            <strong><a href="docs?item=list">List</a>:</strong> A special entity that's used to take data from and to in a specific order. (<code>INPUT, OUTPUT</code>)
        </li>
    </ul>
    <hr>

    <h4>Argument examples</h4>
    <pre>LOAD: r0, mx0</pre>
    <pre>JPM_N: 2, r0</pre>`
};
var arguments_default = doc2;

// src/ui/docs/registers.ts
var doc3 = {
  name: "registers",
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
        Registers are used as <a href="docs?item=arguments">arguments</a> in <a href="docs?item=instructions">instructions</a> to provide data for an operation as a source or destination.
    </p>

    <pre>LOAD: r0, mx0</pre>
    <p><em>(The value from memory address <code>mx0</code> is loaded into register <code>r0</code>.)</em></p>

    <pre>ADD: r1, r0</pre>
    <p><em>(The value in <code>r0</code> is added to the value in <code>r1</code>, and the result is stored back in <code>r1</code>.)</em></p>`
};
var registers_default = doc3;

// src/ui/docs/memory.ts
var doc4 = {
  name: "memory",
  description: `<p>
        Memory in Assemblo are storage locations separate from the <a href="docs?item=registers">registers</a>. It is used for longer-term data storage and retrieval within the program.
        A memory slot can't be directly used in processing <a href="docs?item=instructions">instructions</a> such as ADD or SUB. 
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
        These slots are accessed using their unique memory addresses as arguments in <a href="docs?item=instructions">instructions</a>.
    </p>

    <hr>

    <h2>Memory as Arguments</h2>

    <p>
        Memory addresses are used as <a href="docs?item=arguments">arguments</a> to transfer data between memory and other entities, such as <a href="docs?item=registers">registers</a>.
    </p>

    <pre>CPY: mx0, r1</pre>
    <p><em>(The value from register <code>r1</code> is CPY into memory address <code>mx0</code>.)</em></p>

    <pre>LOAD: r2, mx1</pre>
    <p><em>(The value from memory address <code>mx1</code> is loaded into register <code>r2</code>.)</em></p>`
};
var memory_default = doc4;

// src/ui/docs/lists.ts
var doc5 = {
  name: "lists",
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
};
var lists_default = doc5;

// src/ui/docs/errors.ts
var doc6 = {
  name: "errors",
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
};
var errors_default = doc6;

// src/ui/docs/assemblo.ts
var doc7 = {
  name: "assemblo",
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
};
var assemblo_default = doc7;

// src/ui/docs/instructions-set.ts
var list = [
  {
    name: "START",
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
    name: "END",
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
    name: "POP",
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
    name: "PUSH",
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
    name: "CPY",
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
    name: "LOAD",
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
    name: "JMP_N",
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
    name: "JMP_P",
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
    name: "JMP_Z",
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
    name: "JMP_U",
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
    name: "ADD",
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
    name: "SUB",
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
    name: "PRT",
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
  }
];
var instructions_set_default = list;

// src/ui/docs/script.ts
var docs = {};
docs[instructions_default.name] = instructions_default;
docs[arguments_default.name] = arguments_default;
docs[registers_default.name] = registers_default;
docs[memory_default.name] = memory_default;
docs[lists_default.name] = lists_default;
docs[errors_default.name] = errors_default;
docs[assemblo_default.name] = assemblo_default;
for (const i of instructions_set_default) {
  docs[i.name] = i;
}
var urlParams = new URLSearchParams(window.location.search);
var paramItem = urlParams.get("item") || "";
ui_default.renderDocList(docs["assemblo"]);
ui_default.renderDocList(docs["registers"]);
ui_default.renderDocList(docs["memory"]);
ui_default.renderDocList(docs["arguments"]);
ui_default.renderDocList(docs["lists"]);
ui_default.renderDocList(docs["errors"]);
ui_default.renderDocList(docs["instructions"]);
var instructionEle = document.getElementById("instructionsListTitle");
for (const i of instructions_set_default) {
  ui_default.renderDocListItem(instructionEle, i);
}
ui_default.renderDocContent(docs[paramItem]);
document.addEventListener("DOMContentLoaded", function() {
  const themeToggle = document.getElementById("themeToggle");
  const htmlElement = document.documentElement;
  const savedTheme = localStorage.getItem("theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  if (savedTheme === "dark") {
    htmlElement.setAttribute("data-bs-theme", "dark");
  }
  themeToggle?.addEventListener("click", function() {
    if (htmlElement.getAttribute("data-bs-theme") === "dark") {
      htmlElement.setAttribute("data-bs-theme", "light");
      localStorage.setItem("theme", "light");
    } else {
      htmlElement.setAttribute("data-bs-theme", "dark");
      localStorage.setItem("theme", "dark");
    }
  });
});
