export const generateResponse = async (problem) => {
  try {
    const response = await fetch("http://localhost:3000/invoke", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input: problem }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error("Error fetching from backend:", error);
    // Return a dummy error object so the UI doesn't break
    return {
      problem: problem,
      solution_1: "Error generating response.",
      solution_2: "Error generating response.",
      judge: {
        solution_1_score: 0,
        solution_2_score: 0,
        solution_1_reasoning: "Failed to connect to backend engine.",
        solution_2_reasoning: "Failed to connect to backend engine."
      }
    };
  }
};
