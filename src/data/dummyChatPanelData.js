/**
 * Dummy chat-panel data — temporary stand-in for the live /osintsearch/query
 * API while the backend is offline. Plain JS so it works under the project's
 * jsx esbuild loader without TypeScript-only syntax.
 */

const DUMMY_SEARCH_RESPONSES = {
  default: {
    query: {
      id: 'q-dummy-001',
      text: '',
      timestamp: new Date(),
    },
    aiResponse: {
      id: 'ai-dummy-001',
      content: '',
      isStreaming: false,
      sources: ['Intelligence Report DB', 'Satellite Imagery Archive', 'Open Source Feed'],
      timestamp: new Date(),
    },
    dataResults: [
      {
        id: 'dr-001',
        type: 'document',
        title: 'Strategic Assessment Report - Q1 2026',
        snippet: 'Comprehensive analysis of regional developments including infrastructure changes, troop movements, and diplomatic engagements observed during the first quarter.',
        source: 'Intelligence Report DB',
        relevanceScore: 0.95,
        timestamp: new Date('2026-03-15'),
      },
      {
        id: 'dr-002',
        type: 'location',
        title: 'Satellite Observation - Port Facility',
        snippet: 'Recent satellite imagery indicates increased activity at the port facility with new construction observed in the eastern sector.',
        source: 'Satellite Imagery Archive',
        relevanceScore: 0.88,
        location: { lat: 15.3647, lng: 73.8468, label: 'Port Facility' },
      },
      {
        id: 'dr-003',
        type: 'entity',
        title: 'Entity Profile - Organization Alpha',
        snippet: 'Organization Alpha has been active in the region with multiple reported engagements and partnerships with local entities.',
        source: 'Entity Database',
        relevanceScore: 0.82,
      },
      {
        id: 'dr-004',
        type: 'event',
        title: 'Maritime Exercise - Bay of Bengal',
        snippet: 'Joint naval exercise conducted with participation from multiple nations. Key assets deployed include destroyers and surveillance aircraft.',
        source: 'Open Source Feed',
        relevanceScore: 0.78,
        timestamp: new Date('2026-02-20'),
        location: { lat: 13.0827, lng: 85.3127, label: 'Bay of Bengal' },
      },
    ],
    suggestedQuestions: [
      'What are the latest satellite observations of the port facility?',
      'Show me recent naval exercises in the Indian Ocean region',
      'What entities are active in Southeast Asia?',
      'Summarize infrastructure developments in the last 90 days',
    ],
    result: `## Search Results Summary

Based on the analysis of multiple intelligence sources, here are the key findings:

### Key Observations

1. **Port Facility Activity**: Satellite imagery from March 2026 shows significant construction activity at Port Facility Alpha (15.36°N, 73.85°E). New infrastructure includes expanded berths and warehouse facilities.

2. **Naval Exercise**: A multi-national naval exercise was conducted in the Bay of Bengal during February 2026, involving destroyers, frigates, and maritime patrol aircraft.

3. **Entity Activity**: Organization Alpha continues to expand operations in the region with new partnerships and logistical arrangements.

### Incident Summary

| Date       | Region          | Type           | Severity | Confidence |
|------------|-----------------|----------------|----------|------------|
| 2026-03-12 | South Asia      | Construction   | High     | 0.92       |
| 2026-03-08 | Indian Ocean    | Naval Patrol   | Medium   | 0.86       |
| 2026-02-20 | Bay of Bengal   | Joint Exercise | Medium   | 0.81       |
| 2026-02-15 | Southeast Asia  | Logistics      | Low      | 0.74       |
| 2026-02-02 | East Asia       | SIGINT Spike   | High     | 0.88       |

### Top Tracked Entities

| Entity             | Type           | Activity Count | Last Seen   | Risk |
|--------------------|----------------|----------------|-------------|------|
| Organization Alpha | Organization   | 47             | 2026-03-15  | High |
| Naval Task Force   | Military       | 23             | 2026-03-10  | Med  |
| Supplier Corp      | Organization   | 18             | 2026-03-04  | Low  |
| Logistics Hub SG   | Infrastructure | 31             | 2026-03-12  | Med  |

### Data Sources Consulted
- Intelligence Report Database (3 documents)
- Satellite Imagery Archive (2 captures)
- Sensor Network (3 active sensors)
- Open Source Intelligence Feeds

### Risk Assessment
The overall regional security posture remains **elevated** due to increased military activity and infrastructure development.
`,
    source: 'multi-source-fusion',
  },
};

/**
 * Returns a dummy search result, customizing the query text and timestamps.
 * Simulates a small delay to mimic network latency.
 */
export async function getDummySearchResult(query) {
  await new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 500));

  const base = DUMMY_SEARCH_RESPONSES.default;
  const now = new Date();

  return {
    ...base,
    query: {
      ...base.query,
      id: `q-dummy-${Date.now()}`,
      text: query,
      timestamp: now,
    },
    aiResponse: {
      ...base.aiResponse,
      id: `ai-dummy-${Date.now()}`,
      timestamp: now,
    },
  };
}
