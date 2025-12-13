const challenges = {
  "no-negatives": {
    title: "No Negatives",
    id: "no-negatives",
    description: "Don't send any negative numbers to the output!",
    text: "Write a program that process an INPUT list of integers and outtputs a list containing only the non-negative integers from the INPUT list. Constraints: The INPUT list will contain integers ranging from -100 to 100. The output must be a list of positive integers only, presented in the same order from the INPUT list",
    input: [1, -2, 3, -4, 5],
    expected: [5, 3, 1]
  },
  "only-negatives": {
    title: "Only Negatives",
    id: "only-negatives",
    description: "Can't send number unless it's negative!",
    text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    input: [1, -2, 3, -4, 5],
    expected: [5, 3, 1]
  },
}

export default challenges;