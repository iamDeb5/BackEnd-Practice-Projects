export const generateMockResponse = (problem) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        problem: problem,
        solution_1: `### Approach 1\nHere is a simple brute force approach.\n\n\`\`\`python\ndef solve(nums, target):\n    for i in range(len(nums)):\n        for j in range(i + 1, len(nums)):\n            if nums[i] + nums[j] == target:\n                return [i, j]\n\`\`\`\n\nThis approach has a time complexity of O(n^2) and space complexity of O(1).`,
        solution_2: `### Approach 2\nHere is an optimized approach using a hash map.\n\n\`\`\`python\ndef solve(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        diff = target - num\n        if diff in seen:\n            return [seen[diff], i]\n        seen[num] = i\n\`\`\`\n\nThis approach is extremely efficient. The time complexity is O(n) and the space complexity is O(n).`,
        judge: {
          solution_1_score: 65,
          solution_2_score: 95,
          solution_1_reasoning: "The brute force approach works but scales poorly with large inputs. It correctly implements the logic but lacks performance considerations for production systems.",
          solution_2_reasoning: "Excellent application of a hash map to reduce time complexity to linear time. Ideal for most practical scenarios and demonstrates strong algorithmic thinking."
        }
      });
    }, 1500);
  });
};
