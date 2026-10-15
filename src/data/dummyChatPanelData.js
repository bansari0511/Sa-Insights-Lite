export async function getDummySearchResult(query) {
  // Simulate a brief async delay
  await new Promise(r => setTimeout(r, 300 + Math.random() * 700));

  return {
    result: `Simulated OSINT search result for: "${query}". This is a placeholder response while the search API endpoint is being configured.`,
    dataResults: [],
    sources: 0,
  };
}
