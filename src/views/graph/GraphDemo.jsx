import React from 'react';
import EnhancedGraphContainer from '../../components/EnhancedGraph/EnhancedGraphContainer';
import PageContainer from '../../components/container/PageContainer.js';
import { DUMMY_GRAPH_DATA } from '../../data/dummyGraphData';

const GraphDemo = () => {
  return (
    <PageContainer
      title="Link Analysis"
      description="Advanced network visualization with intelligent filtering, visual controls, and interactive features"
    >
      <EnhancedGraphContainer useDummyData={true} dummyData={DUMMY_GRAPH_DATA} />
    </PageContainer>
  );
};

export default GraphDemo;