const challenges = {
  "no-negatives": {
    title: "No Negatives",
    id: "no-negatives",
    description: "Don't send any negative numbers to the output!",
    text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
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