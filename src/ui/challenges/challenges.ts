const challenges: any = {
  "no-negatives": {
    title: "No Negatives",
    id: "no-negatives",
    description: "Don't send any negative numbers to the output!",
    text: `<p>Write a program that process an INPUT list of integers and outputs a list containing only the non-negative integers from the INPUT list. </p>
    <p><strong>Constraints</strong>: The INPUT list will contain integers ranging from -100 to 100.</p>
    <p><strong>Result</strong>: The output must be a list of positive integers only, presented in the same order from the INPUT list.</p>
<p>hint: try start using POP to take the first item from the INPUT list to a register</p>
    `,
    input: [0, 1, -2, 3, -4, 5],
    expected: [5, 3, 1]
  },
  "multiplication-miracle": {
    title: "The Multiplication Miracle",
    id: "multiplication-miracle",
    description: "Perform the multiplication instruction",
    text: `<p>Write a program to process an INPUT list of integers. For each two items in the INPUT list, multiply them and push the result to the output. </p>
    <p><strong>Constraints</strong>:<br> The INPUT list will contain an odd sequence of integers ranging from -100 to 100. <br></p>
    <p><strong>Result</strong>:<br> The output must be a list containing the result of the multiplication.</p>
    `,
    input: [-3, 2, -1, -4, 3, 0, 6, 5, 4, 3, 2, 1],
    expected: [2, 12, 30, 0, 4, -6]
  },
  "same-sign": {
    title: "Same sign",
    id: "same-sign",
    description: "Compare two values to check their sign.",
    text: `<p>Write a program to process an INPUT list of integers. For each two items in the INPUT list, push 0 to the OUTPUT if the items have the same sign (positive or negative) or push 1 if the signs are different. </p>
    <p><strong>Constraints</strong>:<br> The INPUT list will contain an odd sequence of integers ranging from -100 to 100. <br></p>
    <p><strong>Result</strong>:<br> The output must be a list containing 0s and 1s in the right sequence.</p>
    `,
    input: [4, -8, 5, -4, 2, -4, -2, -8, 2, 4],
    expected: [0, 0, 1, 1, 1]
  },
}

export default challenges;