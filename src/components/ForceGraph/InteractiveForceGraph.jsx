import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Chip,
  Paper,
  IconButton,
  Tooltip,
  ButtonGroup,
  Card,
  CardContent,
  Avatar,
  Grid
} from '@mui/material';
import {
  Close,
  ZoomIn,
  ZoomOut,
  CenterFocusStrong,
  PlayArrow,
  Pause,
  Refresh,
  Fullscreen,
  Info,
  Settings,
  Assessment,
  FilterAlt,
  Clear,
  Launch,
  Delete,
  VisibilityOutlined
} from '@mui/icons-material';
import PropTypes from 'prop-types';

// Clustering utility functions
const clusterNodes = (nodes, links, clusterThreshold = 100) => {
  if (nodes.length <= clusterThreshold) {
    return { nodes, links, clusters: [] };
  }

  // Group nodes by category/type for clustering
  const clusters = {};
  const clusterNodes = [];
  const clusterLinks = [];
  const originalNodes = [];
  
  // Group nodes by category
  nodes.forEach(node => {
    const clusterKey = node.category || node.type || 'default';
    if (!clusters[clusterKey]) {
      clusters[clusterKey] = {
        id: `cluster-${clusterKey}`,
        name: `${clusterKey.charAt(0).toUpperCase() + clusterKey.slice(1)} Cluster`,
        type: 'cluster',
        category: clusterKey,
        status: 'active',
        connections: 0,
        description: `Cluster containing ${clusterKey} nodes`,
        color: getClusterColor(clusterKey),
        size: 20,
        nodeCount: 0,
        childNodes: []
      };
    }
    clusters[clusterKey].childNodes.push(node);
    clusters[clusterKey].nodeCount++;
  });

  // Create cluster nodes and calculate their properties
  Object.values(clusters).forEach(cluster => {
    // Calculate cluster size based on number of child nodes
    cluster.size = Math.min(30, 15 + cluster.nodeCount * 0.5);
    
    // Calculate connections to other clusters
    const clusterConnections = new Set();
    
    cluster.childNodes.forEach(node => {
      links.forEach(link => {
        const sourceNode = nodes.find(n => n.id === link.source);
        const targetNode = nodes.find(n => n.id === link.target);
        
        if (sourceNode?.id === node.id || targetNode?.id === node.id) {
          const otherNode = sourceNode?.id === node.id ? targetNode : sourceNode;
          if (otherNode && otherNode.category !== cluster.category) {
            clusterConnections.add(`cluster-${otherNode.category || otherNode.type || 'default'}`);
          }
        }
      });
    });
    
    cluster.connections = clusterConnections.size;
    clusterNodes.push(cluster);
  });

  // Create links between clusters
  const clusterLinkMap = new Map();
  
  links.forEach(link => {
    const sourceNode = nodes.find(n => n.id === link.source);
    const targetNode = nodes.find(n => n.id === link.target);
    
    if (sourceNode && targetNode) {
      const sourceCluster = `cluster-${sourceNode.category || sourceNode.type || 'default'}`;
      const targetCluster = `cluster-${targetNode.category || targetNode.type || 'default'}`;
      
      if (sourceCluster !== targetCluster) {
        const linkKey = `${sourceCluster}-${targetCluster}`;
        const reverseLinkKey = `${targetCluster}-${sourceCluster}`;
        
        if (!clusterLinkMap.has(linkKey) && !clusterLinkMap.has(reverseLinkKey)) {
          clusterLinkMap.set(linkKey, {
            source: sourceCluster,
            target: targetCluster,
            strength: 0.7,
            type: 'cluster',
            color: '#4a90e2'
          });
        }
      }
    }
  });

  return {
    nodes: clusterNodes,
    links: Array.from(clusterLinkMap.values()),
    clusters: Object.values(clusters),
    originalData: { nodes, links }
  };
};

const getClusterColor = (category) => {
  const colors = {
    infrastructure: '#e74c3c',
    frontend: '#3498db', 
    data: '#2ecc71',
    middleware: '#9b59b6',
    performance: '#1abc9c',
    operations: '#34495e',
    security: '#c0392b',
    user: '#e67e22',
    admin: '#d32f2f',
    developer: '#1976d2',
    designer: '#7b1fa2',
    manager: '#388e3c',
    tester: '#f57c00',
    analyst: '#5d4037',
    organic: '#795548',
    inorganic: '#607d8b',
    default: '#757575'
  };
  return colors[category] || colors.default;
};

const InteractiveForceGraph = React.forwardRef(({
  data,
  width = '100%',
  height = 600,
  nodeSize = 8,
  linkWidth = 3,
  showLabels = true,
  showEdgeLabels = false,
  backgroundColor = '#0a0a0a',
  nodeColor = '#ff6b35',
  linkColor = '#2c5aa0',
  layout = 'force',
  nodeShape = 'circle',
  onNodeClick,
  onNodeDoubleClick,
  onNodeRightClick,
  onNodeHover,
  onLinkClick,
  onLinkHover,
  onBackgroundClick,
  onSettingsToggle,
  onSummaryToggle,
  controlPanelOpen = false,
  overviewPanelOpen = false,
  highlightedNodes = new Set(),
  highlightedLinks = new Set(),
  enableClustering = false,
  nodeSpacing = 100,
  nodeWithVisibleBorder = null,
  nodeActionHandlers = {},
  isLoading = false
}, ref) => {
  const fgRef = useRef();
  const [selectedNode, setSelectedNode] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [isAnimating, setIsAnimating] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isClustered, setIsClustered] = useState(false);
  const [clusterData, setClusterData] = useState(null);
  const [filteredNodeIds, setFilteredNodeIds] = useState([]);
  const [originalGraphData, setOriginalGraphData] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 }); // Track mouse position
  const [iconPositions, setIconPositions] = useState([]); // Track icon positions for DOM overlay
  const [containerDimensions, setContainerDimensions] = useState({ width: 900, height: 900 }); // Track container size

  // Process data with clustering logic
  const processedGraphData = useMemo(() => {
    const inputData = data || {
    nodes: [
      {
        id: 'central',
        name: 'Central Hub',
        type: 'server',
        category: 'infrastructure',
        status: 'active',
        connections: 8,
        description: 'Main server handling core operations',
        color: '#e74c3c',
        size: 15
      },
      {
        id: 'web1',
        name: 'Web Server 1',
        type: 'web',
        category: 'frontend',
        status: 'active',
        connections: 3,
        description: 'Primary web server for user interface',
        color: '#3498db',
        size: 12
      },
      {
        id: 'web2',
        name: 'Web Server 2',
        type: 'web',
        category: 'frontend',
        status: 'maintenance',
        connections: 2,
        description: 'Secondary web server for load balancing',
        color: '#f39c12',
        size: 10
      },
      {
        id: 'db1',
        name: 'Database Primary',
        type: 'database',
        category: 'data',
        status: 'active',
        connections: 5,
        description: 'Primary database with real-time replication',
        color: '#2ecc71',
        size: 14
      },
      {
        id: 'db2',
        name: 'Database Replica',
        type: 'database',
        category: 'data',
        status: 'active',
        connections: 3,
        description: 'Backup database for redundancy',
        color: '#27ae60',
        size: 11
      },
      {
        id: 'api1',
        name: 'API Gateway',
        type: 'api',
        category: 'middleware',
        status: 'active',
        connections: 6,
        description: 'Main API gateway routing requests',
        color: '#9b59b6',
        size: 13
      },
      {
        id: 'cache1',
        name: 'Redis Cache',
        type: 'cache',
        category: 'performance',
        status: 'active',
        connections: 4,
        description: 'High-speed cache for improved performance',
        color: '#1abc9c',
        size: 9
      },
      {
        id: 'monitor1',
        name: 'Monitoring',
        type: 'monitoring',
        category: 'operations',
        status: 'active',
        connections: 7,
        description: 'System monitoring and alerting service',
        color: '#34495e',
        size: 8
      },
      {
        id: 'lb1',
        name: 'Load Balancer',
        type: 'loadbalancer',
        category: 'infrastructure',
        status: 'active',
        connections: 4,
        description: 'Distributes traffic across servers',
        color: '#e67e22',
        size: 12
      },
      {
        id: 'auth1',
        name: 'Auth Service',
        type: 'auth',
        category: 'security',
        status: 'active',
        connections: 5,
        description: 'Authentication and authorization service',
        color: '#c0392b',
        size: 10
      }
    ],
    links: [
      { source: 'central', target: 'web1', strength: 0.8, type: 'primary' },
      { source: 'central', target: 'web2', strength: 0.6, type: 'secondary' },
      { source: 'central', target: 'db1', strength: 0.9, type: 'critical' },
      { source: 'central', target: 'api1', strength: 0.8, type: 'primary' },
      { source: 'web1', target: 'lb1', strength: 0.7, type: 'primary' },
      { source: 'web2', target: 'lb1', strength: 0.6, type: 'secondary' },
      { source: 'db1', target: 'db2', strength: 0.9, type: 'replication' },
      { source: 'api1', target: 'auth1', strength: 0.8, type: 'security' },
      { source: 'api1', target: 'cache1', strength: 0.7, type: 'performance' },
      { source: 'cache1', target: 'db1', strength: 0.8, type: 'data' },
      { source: 'monitor1', target: 'central', strength: 0.5, type: 'monitoring' },
      { source: 'monitor1', target: 'web1', strength: 0.4, type: 'monitoring' },
      { source: 'monitor1', target: 'web2', strength: 0.4, type: 'monitoring' },
      { source: 'monitor1', target: 'db1', strength: 0.6, type: 'monitoring' },
      { source: 'monitor1', target: 'api1', strength: 0.5, type: 'monitoring' },
      { source: 'auth1', target: 'db1', strength: 0.7, type: 'data' }
    ]
    };

    // Apply clustering if node count > 100
    const clusteredData = clusterNodes(inputData.nodes, inputData.links, 100);
    const shouldCluster = inputData.nodes.length > 100;

    return {
      original: inputData,
      clustered: clusteredData,
      shouldCluster,
      current: shouldCluster ? clusteredData : inputData
    };
  }, [data]);

  // Multi-node filtering function - shows selected nodes and their direct connections
  const filterGraphToNodes = useCallback((nodeIds, sourceGraphData) => {
    if (!nodeIds || nodeIds.length === 0) return sourceGraphData;

    // Get all connected node IDs for all filtered nodes
    const connectedNodeIds = new Set(nodeIds);
    
    // For each filtered node, add its direct connections
    nodeIds.forEach(nodeId => {
      sourceGraphData.links.forEach(link => {
        if (link.source === nodeId || link.source.id === nodeId) {
          connectedNodeIds.add(typeof link.target === 'string' ? link.target : link.target.id);
        }
        if (link.target === nodeId || link.target.id === nodeId) {
          connectedNodeIds.add(typeof link.source === 'string' ? link.source : link.source.id);
        }
      });
    });

    // Filter nodes to only include connected ones
    const filteredNodes = sourceGraphData.nodes.filter(node => connectedNodeIds.has(node.id));
    
    // Filter links to only include connections between filtered nodes
    const filteredLinks = sourceGraphData.links.filter(link => {
      const sourceId = typeof link.source === 'string' ? link.source : link.source.id;
      const targetId = typeof link.target === 'string' ? link.target : link.target.id;
      return connectedNodeIds.has(sourceId) && connectedNodeIds.has(targetId);
    });

    // Get names of filtered nodes
    const filteredNodeNames = nodeIds.map(id => {
      const node = sourceGraphData.nodes.find(n => n.id === id);
      return node ? (node.name || node.id) : id;
    });

    return {
      nodes: filteredNodes,
      links: filteredLinks,
      isFiltered: true,
      filteredNodeIds: nodeIds,
      filteredNodeNames,
      filterCount: nodeIds.length
    };
  }, []);

  // Filter management functions
  const addNodeFilter = useCallback((nodeId) => {
    if (!filteredNodeIds.includes(nodeId)) {
      setFilteredNodeIds(prev => [...prev, nodeId]);
    }
  }, [filteredNodeIds]);

  const removeNodeFilter = useCallback((nodeId) => {
    setFilteredNodeIds(prev => prev.filter(id => id !== nodeId));
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilteredNodeIds([]);
    // Auto zoom-to-fit removed to keep constant node size
  }, []);

  // Current graph data to display (with filtering applied if active)
  const graphData = useMemo(() => {
    const baseData = isClustered ? processedGraphData.clustered : processedGraphData.original;
    
    if (filteredNodeIds.length > 0) {
      return filterGraphToNodes(filteredNodeIds, baseData);
    }
    
    return baseData;
  }, [isClustered, processedGraphData, filteredNodeIds, filterGraphToNodes]);

  const handleNodeClick = useCallback((node, event) => {
    if (import.meta.env.DEV) console.log('Node clicked:', node);

    // Since we're using DOM overlay icons, we don't need complex canvas click detection
    // Just handle regular node click behavior
    onNodeClick?.(node, event);

    // No automatic centering or zooming - let user control view manually

    // COMMENTED OUT: Header and icon addition on left click
    // The following code was adding header with icons on node click - now commented out
    // as per requirement to show node details card with focus button instead
    /*
    // Add header with icons for the clicked node
    // setNodeWithVisibleBorder(node);
    // setClickedNodeForActions({ node });
    */
  }, [onNodeClick]);

  const handleNodeDoubleClick = useCallback((node, event) => {
    if (import.meta.env.DEV) console.log('Node double-clicked for exploration:', node);
    onNodeDoubleClick?.(node, event);
  }, [onNodeDoubleClick]);

  const handleNodeRightClick = useCallback((node, event) => {
    if (import.meta.env.DEV) console.log('Node right-clicked for exploration:', node);
    // Prevent default context menu
    if (event && event.preventDefault) {
      event.preventDefault();
    }
    onNodeRightClick?.(node, event);
  }, [onNodeRightClick]);

  const handleNodeHover = useCallback((node) => {
    // Only notify parent component, don't set local hover state to avoid duplicate hover cards
    onNodeHover?.(node);
    
    // Change cursor
    document.body.style.cursor = node ? 'pointer' : 'default';
  }, [onNodeHover]);

  const handleLinkClick = useCallback((link, event) => {
    if (import.meta.env.DEV) console.log('Link clicked:', link);
    onLinkClick?.(link, event);
  }, [onLinkClick]);

  const handleLinkHover = useCallback((link) => {
    // Only notify parent component through onLinkHover prop
    onLinkHover?.(link);
    
    // Change cursor
    document.body.style.cursor = link ? 'pointer' : 'default';
  }, [onLinkHover]);

  const handleBackgroundClick = useCallback((event) => {
    onBackgroundClick?.(event);
  }, [onBackgroundClick]);

  // Helper function to determine if background is light
  const isLightBackground = useCallback((bgColor) => {
    const hex = bgColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128;
  }, []);

  const nodeCanvasObject = useCallback((node, ctx, globalScale) => {
    const label = node.properties.display_name_label || node.name;
    // Font size scales with zoom level
    const fontSize = 10 / globalScale;
    const hasVisibleBorder = nodeWithVisibleBorder && nodeWithVisibleBorder.id === node.id;
    const isHighlighted = highlightedNodes && highlightedNodes.has(node.id);

    // Fixed node size - stays constant regardless of zoom
    const nodeRadius = 8;

    // Draw highlight glow effect for highlighted nodes (Focus button functionality)
    if (isHighlighted) {
      ctx.save();
      // Draw outer glow
      ctx.shadowColor = '#FFD700'; // Gold color for highlight
      ctx.shadowBlur = 20 / globalScale;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // Draw highlight ring
      ctx.beginPath();
      ctx.arc(node.x, node.y, nodeRadius + 5 / globalScale, 0, 2 * Math.PI, false);
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 3 / globalScale;
      ctx.stroke();
      ctx.restore();
    }

    // Draw node based on selected shape
    ctx.fillStyle = node.color || nodeColor;
    ctx.beginPath();
    
    switch (nodeShape) {
      case 'circle':
        ctx.arc(node.x, node.y, nodeRadius, 0, 2 * Math.PI, false);
        break;
        
      case 'square':
        ctx.rect(node.x - nodeRadius, node.y - nodeRadius, nodeRadius * 2, nodeRadius * 2);
        break;
        
      case 'triangle':
        ctx.moveTo(node.x, node.y - nodeRadius);
        ctx.lineTo(node.x - nodeRadius * 0.866, node.y + nodeRadius * 0.5);
        ctx.lineTo(node.x + nodeRadius * 0.866, node.y + nodeRadius * 0.5);
        ctx.closePath();
        break;
        
      case 'diamond':
        ctx.moveTo(node.x, node.y - nodeRadius);
        ctx.lineTo(node.x + nodeRadius, node.y);
        ctx.lineTo(node.x, node.y + nodeRadius);
        ctx.lineTo(node.x - nodeRadius, node.y);
        ctx.closePath();
        break;
        
      case 'hexagon':
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3;
          const x = node.x + nodeRadius * Math.cos(angle);
          const y = node.y + nodeRadius * Math.sin(angle);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        break;
        
      case 'star':
        const spikes = 5;
        const outerRadius = nodeRadius;
        const innerRadius = nodeRadius * 0.5;
        for (let i = 0; i < spikes * 2; i++) {
          const radius = i % 2 === 0 ? outerRadius : innerRadius;
          const angle = (i * Math.PI) / spikes;
          const x = node.x + radius * Math.cos(angle - Math.PI / 2);
          const y = node.y + radius * Math.sin(angle - Math.PI / 2);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        break;
        
      default:
        ctx.arc(node.x, node.y, nodeRadius, 0, 2 * Math.PI, false);
    }
    
    ctx.fill();

    // Draw transparent thick border for selected node (DOM icons will overlay)
    if (hasVisibleBorder) {
      const borderRadius = nodeRadius + 25 / globalScale;

      // Save current state
      ctx.save();

      // Draw light gray ring/border background (not covering the node) - no dotted circle
      ctx.fillStyle = 'lightgray';
      ctx.beginPath();
      // Create a ring by drawing outer circle and cutting out inner circle
      ctx.arc(node.x, node.y, borderRadius, 0, 2 * Math.PI, false);
      ctx.arc(node.x, node.y, nodeRadius + 8 / globalScale, 0, 2 * Math.PI, true); // Inner hole
      ctx.fill('evenodd');

      // Restore state
      ctx.restore();
    }

    // Always draw label in middle of node with larger text (requirement #2 and #6)
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Support multiple lines by splitting long text
    const maxCharsPerLine = 10;
    const words = label.split(' ');
    const lines = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      if (testLine.length > maxCharsPerLine && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }

    // Draw each line
    const lineHeight = fontSize * 1.2;
    const totalHeight = lines.length * lineHeight;
    const startY = node.y - totalHeight / 2 + lineHeight / 2;

    lines.forEach((line, index) => {
      ctx.fillText(line, node.x, startY + index * lineHeight);
    });

    ctx.globalAlpha = 1; // Reset alpha
  }, [nodeColor, nodeShape, graphData, nodeWithVisibleBorder, highlightedNodes]);

  const linkCanvasObject = useCallback((link, ctx, globalScale) => {
    const start = link.source;
    const end = link.target;

    // Use the linkWidth prop from parent component with proper priority: individual link width > global linkWidth > calculated from strength
    const baseLinkWidth = link.width !== undefined ? link.width : (linkWidth !== undefined ? linkWidth : (link.strength || 1) * 2);

    if (!start.x || !start.y || !end.x || !end.y) return;

    // Check if this link should be highlighted (Focus button functionality)
    const sourceId = start.id || start;
    const targetId = end.id || end;
    const linkKey = `${sourceId}-${targetId}`;
    const reverseLinkKey = `${targetId}-${sourceId}`;
    const isHighlighted = highlightedLinks && (highlightedLinks.has(linkKey) || highlightedLinks.has(reverseLinkKey));

    // Set full opacity (no highlighting/dimming - requirement #5)
    ctx.globalAlpha = 1;

    // Check if this is a self-loop edge
    const isSelfLoop = start.id === end.id || link.isSelfLoop;

    // Increase line width for highlighted links
    ctx.lineWidth = isHighlighted ? (baseLinkWidth * 2) / globalScale : baseLinkWidth / globalScale;

    if (isSelfLoop) {
      // Draw self-loop as a circular arc - fixed node size
      const nodeRadius = 8; // Fixed node size
      const radius = Math.max(nodeRadius + 8 / globalScale, 20 / globalScale); // Ensure loop is outside the node
      const centerX = start.x;
      const centerY = start.y - radius; // Position loop above the node

      // Set stroke style for self-loop - use gold color if highlighted, otherwise use link color from graphData
      ctx.strokeStyle = isHighlighted ? '#FFD700' : (link.color || '#9E9E9E');

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Draw arrow for self-loop
      const headlen = 8 / globalScale; // Arrow size
      const arrowX = centerX + radius * Math.cos(-Math.PI / 4);
      const arrowY = centerY + radius * Math.sin(-Math.PI / 4);
      const angle = -Math.PI / 4 + Math.PI / 2; // Perpendicular to the circle

      ctx.save();
      ctx.globalAlpha = 1; // Ensure arrow is fully opaque
      ctx.fillStyle = isHighlighted ? '#FFD700' : (link.color || '#9E9E9E'); // Gold color for highlighted edges

      ctx.beginPath();
      ctx.moveTo(arrowX, arrowY);
      ctx.lineTo(
        arrowX - headlen * Math.cos(angle - Math.PI / 6),
        arrowY - headlen * Math.sin(angle - Math.PI / 6)
      );
      ctx.lineTo(
        arrowX - headlen * Math.cos(angle + Math.PI / 6),
        arrowY - headlen * Math.sin(angle + Math.PI / 6)
      );
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    } else {
      // Calculate curvature for multiple edges between same nodes
      // Count how many edges exist between this pair of nodes
      const parallelLinks = graphData.links.filter(l => {
        const lSourceId = l.source.id || l.source;
        const lTargetId = l.target.id || l.target;
        return (lSourceId === start.id && lTargetId === end.id) ||
               (lSourceId === end.id && lTargetId === start.id);
      });

      // If there are multiple edges, apply curvature
      let curvature = 0;
      if (parallelLinks.length > 1) {
        // Find the index of this link among parallel links
        const linkIndex = parallelLinks.findIndex(l => l === link);
        // Calculate curvature offset based on index
        // Spread edges evenly: -0.3, -0.15, 0, 0.15, 0.3 for 5 edges
        const maxCurvature = 0.3;
        const step = (2 * maxCurvature) / Math.max(parallelLinks.length - 1, 1);
        curvature = -maxCurvature + (linkIndex * step);
      }

      // Set stroke style - gold color for highlighted edges, otherwise use link color from graphData
      ctx.strokeStyle = isHighlighted ? '#FFD700' : (link.color || '#9E9E9E');

      // Calculate control point and curvature info
      let controlX, controlY, isCurved = false;
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Draw full edge line first
      if (curvature !== 0) {
        // Curved edge
        const controlPointDistance = distance * curvature;
        const midX = (start.x + end.x) / 2;
        const midY = (start.y + end.y) / 2;
        const perpX = -dy / distance;
        const perpY = dx / distance;
        controlX = midX + perpX * controlPointDistance;
        controlY = midY + perpY * controlPointDistance;
        isCurved = true;

        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.quadraticCurveTo(controlX, controlY, end.x, end.y);
        ctx.stroke();
      } else {
        // Straight edge
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
      }
    }

    // Draw arrow if it's a directed link - positioned near the end of the edge (only for regular edges, not self-loops)
    if (!isSelfLoop) {
      const headlen = 15 / globalScale; // Arrow size - increased for better visibility

      let midX, midY, angle;

      // Recalculate curvature info for arrow positioning
      const parallelLinks = graphData.links.filter(l => {
        const lSourceId = l.source.id || l.source;
        const lTargetId = l.target.id || l.target;
        return (lSourceId === start.id && lTargetId === end.id) ||
               (lSourceId === end.id && lTargetId === start.id);
      });

      let curvature = 0;
      if (parallelLinks.length > 1) {
        const linkIndex = parallelLinks.findIndex(l => l === link);
        const maxCurvature = 0.3;
        const step = (2 * maxCurvature) / Math.max(parallelLinks.length - 1, 1);
        curvature = -maxCurvature + (linkIndex * step);
      }

      if (curvature !== 0) {
        // For curved edges: calculate position and tangent at t=0.85 (near the end) on the curve
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const controlPointDistance = distance * curvature;
        const straightMidX = (start.x + end.x) / 2;
        const straightMidY = (start.y + end.y) / 2;

        const perpX = -dy / distance;
        const perpY = dx / distance;

        const controlX = straightMidX + perpX * controlPointDistance;
        const controlY = straightMidY + perpY * controlPointDistance;

        // Quadratic Bezier curve point at t=0.85 (near the end)
        // B(t) = (1-t)² * P0 + 2(1-t)t * P1 + t² * P2
        const t = 0.85;
        const oneMinusT = 1 - t;
        midX = oneMinusT * oneMinusT * start.x + 2 * oneMinusT * t * controlX + t * t * end.x;
        midY = oneMinusT * oneMinusT * start.y + 2 * oneMinusT * t * controlY + t * t * end.y;

        // Tangent at t=0.85 for quadratic Bezier: B'(t) = 2(1-t)(P1-P0) + 2t(P2-P1)
        const tangentX = 2 * oneMinusT * (controlX - start.x) + 2 * t * (end.x - controlX);
        const tangentY = 2 * oneMinusT * (controlY - start.y) + 2 * t * (end.y - controlY);
        angle = Math.atan2(tangentY, tangentX);
      } else {
        // For straight edges: position at 85% along the edge (near the end), same as curved edges
        const t = 0.85;
        midX = start.x + t * (end.x - start.x);
        midY = start.y + t * (end.y - start.y);
        angle = Math.atan2(end.y - start.y, end.x - start.x);
      }

      // Draw arrow as a filled triangle with stroke for better visibility
      ctx.save();
      ctx.globalAlpha = 1; // Ensure arrow is fully opaque

      // Fill the arrow - use gold for highlighted, white otherwise
      ctx.fillStyle = isHighlighted ? '#FFD700' : '#ffffff';
      ctx.beginPath();
      ctx.moveTo(midX, midY);
      ctx.lineTo(
        midX - headlen * Math.cos(angle - Math.PI / 6),
        midY - headlen * Math.sin(angle - Math.PI / 6)
      );
      ctx.lineTo(
        midX - headlen * Math.cos(angle + Math.PI / 6),
        midY - headlen * Math.sin(angle + Math.PI / 6)
      );
      ctx.closePath();
      ctx.fill();

      // Add stroke/outline for even better visibility - use link color from graphData
      ctx.strokeStyle = isHighlighted ? '#FFD700' : (link.color || '#9E9E9E');
      ctx.lineWidth = 2 / globalScale;
      ctx.stroke();

      ctx.restore();
    }
    
    // Always draw edge labels (requirement #6)
    if (link.type || link.label) {
      let midX, midY;

      if (isSelfLoop) {
        // Position label next to the self-loop - fixed node size
        const nodeRadius = 8; // Fixed node size
        const radius = Math.max(nodeRadius + 8 / globalScale, 20 / globalScale);
        midX = start.x + radius + 10 / globalScale;
        midY = start.y - radius;
      } else {
        // Check if this edge is curved
        const parallelLinks = graphData.links.filter(l => {
          const lSourceId = l.source.id || l.source;
          const lTargetId = l.target.id || l.target;
          return (lSourceId === start.id && lTargetId === end.id) ||
                 (lSourceId === end.id && lTargetId === start.id);
        });

        let curvature = 0;
        if (parallelLinks.length > 1) {
          const linkIndex = parallelLinks.findIndex(l => l === link);
          const maxCurvature = 0.3;
          const step = (2 * maxCurvature) / Math.max(parallelLinks.length - 1, 1);
          curvature = -maxCurvature + (linkIndex * step);
        }

        if (curvature !== 0) {
          // For curved edges: calculate label position at curve midpoint
          const dx = end.x - start.x;
          const dy = end.y - start.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          const controlPointDistance = distance * curvature;
          const straightMidX = (start.x + end.x) / 2;
          const straightMidY = (start.y + end.y) / 2;

          const perpX = -dy / distance;
          const perpY = dx / distance;

          const controlX = straightMidX + perpX * controlPointDistance;
          const controlY = straightMidY + perpY * controlPointDistance;

          // Position label at curve midpoint (t=0.5)
          midX = 0.25 * start.x + 0.5 * controlX + 0.25 * end.x;
          midY = 0.25 * start.y + 0.5 * controlY + 0.25 * end.y;
        } else {
          // For straight edges: use simple midpoint
          midX = (start.x + end.x) / 2;
          midY = (start.y + end.y) / 2;
        }
      }

      // Edge label with text rotated in edge direction
      const edgeLabelFontSize = 12 / globalScale;

      // Format label text
      const rawLabel = link.type || link.label || 'related';
      const formattedLabel = rawLabel
        .replace(/_/g, ' ')  // Replace underscores with spaces
        .toLowerCase();      // Convert to lowercase

      // Calculate edge angle for text rotation
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      let angle = Math.atan2(dy, dx);

      // Keep text readable (not upside down)
      if (angle > Math.PI / 2 || angle < -Math.PI / 2) {
        angle = angle + Math.PI;
      }

      // Save context and rotate for text
      ctx.save();
      ctx.translate(midX, midY);
      ctx.rotate(angle);

      // Set text style
      ctx.font = `${edgeLabelFontSize}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Measure text for background
      const textMetrics = ctx.measureText(formattedLabel);
      const textWidth = textMetrics.width;
      const padding = 4 / globalScale;

      // Draw white background to create cut effect
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(
        -textWidth / 2 - padding,
        -edgeLabelFontSize / 2 - padding,
        textWidth + padding * 2,
        edgeLabelFontSize + padding * 2
      );

      // Draw text
      ctx.fillStyle = '#000000';
      ctx.fillText(formattedLabel, 0, 0);

      // Restore context
      ctx.restore();
    }
    
    ctx.globalAlpha = 1;
  }, [linkColor, graphData, linkWidth, highlightedLinks]);

  // Control functions
  const handleZoomIn = () => {
    if (fgRef.current) {
      const currentZoom = fgRef.current.zoom();
      const newZoom = Math.min(currentZoom * 1.5, 8); // Max zoom of 8x
      fgRef.current.zoom(newZoom, 500);
    }
  };

  const handleZoomOut = () => {
    if (fgRef.current) {
      const currentZoom = fgRef.current.zoom();
      const newZoom = Math.max(currentZoom / 1.5, 1); // Min zoom of 1x
      fgRef.current.zoom(newZoom, 500);
    }
  };

  const handleZoomReset = () => {
    if (fgRef.current) {
      // Fit all nodes within the container with appropriate padding
      const { width: containerWidth, height: containerHeight } = containerDimensions;
      const padding = Math.min(containerWidth, containerHeight) * 0.1; // 10% padding
      fgRef.current.zoomToFit(1000, padding);
    }
  };

  const handleFullscreen = () => {
    if (fgRef.current) {
      try {
        // Try to get the graph container element
        let element = null;
        
        // Method 1: Try graphDiv
        if (fgRef.current.graphDiv) {
          element = fgRef.current.graphDiv().current;
        }
        
        // Method 2: Try direct DOM search if graphDiv fails
        if (!element) {
          const graphContainer = document.querySelector('[data-testid="graph-container"]') || 
                               document.querySelector('.react-force-graph') ||
                               fgRef.current;
          element = graphContainer;
        }
        
        // Method 3: Use the parent container
        if (!element && fgRef.current) {
          element = fgRef.current.parentElement || fgRef.current;
        }
        
        if (element && element.requestFullscreen) {
          element.requestFullscreen().catch(err => {
            console.warn('Fullscreen request failed:', err);
            // Fallback to document.body fullscreen
            if (document.body.requestFullscreen) {
              document.body.requestFullscreen();
            }
          });
        } else if (element && element.webkitRequestFullscreen) {
          element.webkitRequestFullscreen();
        } else if (element && element.msRequestFullscreen) {
          element.msRequestFullscreen();
        } else {
          console.warn('Fullscreen API not supported');
          alert('Fullscreen mode is not supported by your browser');
        }
      } catch (error) {
        console.error('Fullscreen error:', error);
        // Fallback to document.body fullscreen
        try {
          if (document.body.requestFullscreen) {
            document.body.requestFullscreen();
          }
        } catch (fallbackError) {
          console.error('Fullscreen fallback failed:', fallbackError);
          alert('Unable to enter fullscreen mode');
        }
      }
    }
  };

  const toggleAnimation = () => {
    setIsAnimating(!isAnimating);
    if (fgRef.current) {
      if (isAnimating) {
        fgRef.current.pauseAnimation();
      } else {
        fgRef.current.resumeAnimation();
      }
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedNode(null);
  };

  // Apply layout and auto-fit to container size
  useEffect(() => {
    if (fgRef.current && graphData.nodes.length > 0) {
      const applyLayout = () => {
        const nodes = graphData.nodes;
        const centerX = 0;
        const centerY = 0;
        
        // Use actual container dimensions for layout calculations
        const { width: containerWidth, height: containerHeight } = containerDimensions;
        const maxX = containerWidth / 4; // Use 1/4 of container width from center for more space
        const maxY = containerHeight / 4; // Use 1/4 of container height from center for more space

        if (import.meta.env.DEV) console.log('Applying layout:', layout, 'Container:', containerWidth, 'x', containerHeight);

        nodes.forEach((node, index) => {
          let x, y;
          
          switch (layout) {
            case 'circle':
              const angle = (index * 2 * Math.PI) / nodes.length;
              const radius = Math.min(nodes.length * 1.5, maxX * 0.7); // Larger radius for more space
              x = centerX + radius * Math.cos(angle);
              y = centerY + radius * Math.sin(angle);
              break;
              
            case 'grid':
              const cols = Math.ceil(Math.sqrt(nodes.length));
              const rows = Math.ceil(nodes.length / cols);
              const spacingX = Math.min(nodeSpacing * 0.8, (maxX * 1.9) / Math.max(cols, 1)); // Increased spacing responsiveness
              const spacingY = Math.min(nodeSpacing * 0.8, (maxY * 1.9) / Math.max(rows, 1));
              const row = Math.floor(index / cols);
              const col = index % cols;
              x = centerX + (col - (cols - 1) / 2) * spacingX;
              y = centerY + (row - (rows - 1) / 2) * spacingY;
              break;
              
            case 'radial':
              const rings = Math.min(Math.ceil(Math.sqrt(nodes.length / Math.PI)), 6); // More rings
              const ringIndex = Math.floor(Math.sqrt(index / Math.PI));
              const angleInRing = (index % (ringIndex * 6 + 1)) * 2 * Math.PI / Math.max(1, ringIndex * 6);
              const ringRadius = Math.min((ringIndex + 1) * 25, maxX * 0.8); // Larger ring radius
              x = centerX + ringRadius * Math.cos(angleInRing);
              y = centerY + ringRadius * Math.sin(angleInRing);
              break;
              
            case 'tree':
              const levels = Math.min(Math.ceil(Math.log2(nodes.length + 1)), 5); // More levels
              const level = Math.floor(Math.log2(index + 1));
              const positionInLevel = index - (Math.pow(2, level) - 1);
              const levelWidth = Math.pow(2, level);
              const spacingTree = Math.min(50, (maxX * 1.9) / Math.max(levelWidth, 1)); // Larger tree spacing
              x = centerX + (positionInLevel - (levelWidth - 1) / 2) * spacingTree;
              y = centerY + (level - (levels - 1) / 2) * Math.min(40, (maxY * 1.9) / Math.max(levels, 1));
              break;
              
            case 'hierarchical':
              const hierarchyLevels = Math.ceil(nodes.length / 6); // 6 nodes per level
              const hierarchyLevel = Math.floor(index / 6);
              const hierarchyPosition = index % 6;
              const hierarchySpacing = Math.min(60, (maxX * 1.8) / 6);
              const hierarchyLevelSpacing = Math.min(80, (maxY * 1.8) / Math.max(hierarchyLevels, 1));
              x = centerX + (hierarchyPosition - 2.5) * hierarchySpacing;
              y = centerY + (hierarchyLevel - (hierarchyLevels - 1) / 2) * hierarchyLevelSpacing;
              break;
              
            case 'spiral':
              const spiralAngle = index * 0.5; // Spiral growth rate
              const spiralRadius = Math.min(index * 8, maxX * 0.8);
              x = centerX + spiralRadius * Math.cos(spiralAngle);
              y = centerY + spiralRadius * Math.sin(spiralAngle);
              break;
              
            case 'concentric':
              const concentricRings = Math.ceil(Math.sqrt(nodes.length / 4));
              const concentricRing = Math.floor(Math.sqrt(index / 4));
              const concentricNodesInRing = Math.max(1, concentricRing * 8 || 1);
              const concentricAngleStep = (2 * Math.PI) / concentricNodesInRing;
              const concentricPosInRing = index - (concentricRing * concentricRing * 4);
              const concentricAngle = concentricPosInRing * concentricAngleStep;
              const concentricRadius = Math.min((concentricRing + 1) * 40, maxX * 0.8);
              x = centerX + concentricRadius * Math.cos(concentricAngle);
              y = centerY + concentricRadius * Math.sin(concentricAngle);
              break;
              
            case 'dagre':
              // Directed Acyclic Graph layout - simplified version
              const dagreColumns = Math.ceil(Math.sqrt(nodes.length));
              const dagreRows = Math.ceil(nodes.length / dagreColumns);
              const dagreCol = index % dagreColumns;
              const dagreRow = Math.floor(index / dagreColumns);
              const dagreSpacingX = Math.min(80, (maxX * 1.8) / Math.max(dagreColumns, 1));
              const dagreSpacingY = Math.min(60, (maxY * 1.8) / Math.max(dagreRows, 1));
              x = centerX + (dagreCol - (dagreColumns - 1) / 2) * dagreSpacingX;
              y = centerY + (dagreRow - (dagreRows - 1) / 2) * dagreSpacingY;
              break;
              
            case 'arc':
              const arcAngle = (index * Math.PI) / Math.max(nodes.length - 1, 1); // Arc from 0 to PI
              const arcRadius = Math.min(nodes.length * 3, maxX * 0.7);
              x = centerX + arcRadius * Math.cos(arcAngle);
              y = centerY + arcRadius * Math.sin(arcAngle);
              break;
              
            case 'cluster':
              const clusterSize = Math.ceil(Math.sqrt(nodes.length / 3)); // 3 main clusters
              const cluster = Math.floor(index / clusterSize);
              const posInCluster = index % clusterSize;
              const clusterCenters = [
                { x: centerX - maxX * 0.5, y: centerY - maxY * 0.3 },
                { x: centerX + maxX * 0.5, y: centerY - maxY * 0.3 },
                { x: centerX, y: centerY + maxY * 0.5 }
              ];
              const currentCluster = clusterCenters[cluster % 3];
              const clusterAngle = (posInCluster * 2 * Math.PI) / clusterSize;
              const clusterRadius = Math.min(clusterSize * 5, maxX * 0.2);
              x = currentCluster.x + clusterRadius * Math.cos(clusterAngle);
              y = currentCluster.y + clusterRadius * Math.sin(clusterAngle);
              break;
              
            case 'linear':
              const linearSpacing = Math.min(50, (maxX * 1.8) / Math.max(nodes.length, 1));
              x = centerX + (index - (nodes.length - 1) / 2) * linearSpacing;
              y = centerY;
              break;
              
            case 'cola':
              // Cola layout - constraint-based layout with better edge crossing reduction
              const colaColumns = Math.ceil(Math.sqrt(nodes.length * 1.2)); // Slightly more columns for better spread
              const colaRows = Math.ceil(nodes.length / colaColumns);
              const colaCol = index % colaColumns;
              const colaRow = Math.floor(index / colaColumns);
              
              // Add some randomness to avoid perfect grid while maintaining structure
              const colaSpacingX = Math.min(70, (maxX * 1.6) / Math.max(colaColumns, 1));
              const colaSpacingY = Math.min(60, (maxY * 1.6) / Math.max(colaRows, 1));
              const colaRandomX = (Math.random() - 0.5) * colaSpacingX * 0.3; // 30% randomness
              const colaRandomY = (Math.random() - 0.5) * colaSpacingY * 0.3;
              
              x = centerX + (colaCol - (colaColumns - 1) / 2) * colaSpacingX + colaRandomX;
              y = centerY + (colaRow - (colaRows - 1) / 2) * colaSpacingY + colaRandomY;
              break;
              
            case 'random':
              x = centerX + (Math.random() - 0.5) * maxX * 1.8;
              y = centerY + (Math.random() - 0.5) * maxY * 1.8;
              break;
              
            default: // force layout
              delete node.fx;
              delete node.fy;
              return; // Don't set fixed positions for force layout
          }
          
          // Ensure positions are strictly within container bounds
          if (layout !== 'force') {
            node.fx = Math.max(-maxX, Math.min(maxX, x));
            node.fy = Math.max(-maxY, Math.min(maxY, y));
          }
        });

        // Always restart simulation to apply new positions
        if (fgRef.current.d3ReheatSimulation) {
          fgRef.current.d3ReheatSimulation();
        }
        
        // Force refresh the graph
        if (fgRef.current.refresh) {
          fgRef.current.refresh();
        }
        
        // For non-force layouts, ensure edges are immediately visible by triggering a render
        if (layout !== 'force') {
          setTimeout(() => {
            if (fgRef.current && fgRef.current.d3Force) {
              // Force a single tick to update link positions
              fgRef.current.d3Force('link').links(graphData.links);
              if (fgRef.current.refresh) {
                fgRef.current.refresh();
              }
            }
          }, 100);
        }

        // Auto zoom-to-fit removed to keep constant node size
      };

      applyLayout();
    }
  }, [layout, graphData, nodeSpacing, containerDimensions]);

  // Set initial zoom and position graph to the right
  useEffect(() => {
    if (fgRef.current && graphData.nodes.length > 0) {
      // Auto zoom-to-fit removed to keep constant node size
      // Nodes will maintain their visual size regardless of node count

      // Keep animation running for responsive dragging
      if (fgRef.current) {
        fgRef.current.resumeAnimation();
        setIsAnimating(true);
      }
    }
  }, [graphData, containerDimensions]);

  // Track container dimensions for dynamic fitting
  useEffect(() => {
    const updateContainerDimensions = () => {
      if (fgRef.current) {
        try {
          const graphDiv = fgRef.current.graphDiv().current;
          if (graphDiv) {
            const rect = graphDiv.getBoundingClientRect();
            setContainerDimensions({ 
              width: rect.width || 900, 
              height: rect.height || 900 
            });
          }
        } catch (error) {
          console.warn('Could not get container dimensions:', error);
        }
      }
    };

    // Update dimensions initially and on window resize
    updateContainerDimensions();
    window.addEventListener('resize', updateContainerDimensions);
    
    return () => {
      window.removeEventListener('resize', updateContainerDimensions);
    };
  }, []);

  // Simple mouse position tracking for fallback
  useEffect(() => {
    const handleMouseMove = (event) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Update icon positions for DOM overlay
  useEffect(() => {
    if (!nodeWithVisibleBorder || !fgRef.current) {
      setIconPositions([]);
      return;
    }

    const updateIconPositions = () => {
      try {
        const graphInstance = fgRef.current.getGraphRef ? fgRef.current.getGraphRef() : fgRef.current;
        if (graphInstance && graphInstance.graph2ScreenCoords) {
          const node = nodeWithVisibleBorder;
          const screenCoords = graphInstance.graph2ScreenCoords(node.x, node.y);
          
          // Calculate icon positions
          const scale = graphInstance.zoom();
          const connectionBasedSize = Math.min(12.5, Math.max(4, 4 + 
            graphData.links.filter(link => {
              const sourceId = link.source.id || link.source;
              const targetId = link.target.id || link.target;
              return sourceId === node.id || targetId === node.id;
            }).length * 0.75
          ));
          const nodeRadius = connectionBasedSize * scale;
          const borderRadius = nodeRadius + 25;
          const iconDistance = borderRadius - 8;
          
          const icons = [
            { angle: -Math.PI/2, action: 'details', tooltip: 'View Details', color: 'lightgray' }, // Top - Light gray background
            { angle: Math.PI/6, action: 'explore', tooltip: 'Explore Node', color: 'lightgray' }, // Top Right - Light gray background
            { angle: 5*Math.PI/6, action: 'remove', tooltip: 'Remove Node', color: 'lightgray' } // Top Left - Light gray background
          ];
          
          const newIconPositions = icons.map(({ angle, action, tooltip, color }) => {
            const iconX = screenCoords.x + iconDistance * Math.cos(angle);
            const iconY = screenCoords.y + iconDistance * Math.sin(angle);
            
            return {
              action,
              tooltip,
              color,
              x: iconX,
              y: iconY,
              nodeId: node.id
            };
          });
          
          setIconPositions(newIconPositions);
        }
      } catch (error) {
        console.warn('Error updating icon positions:', error);
        setIconPositions([]);
      }
    };

    // Update positions immediately
    updateIconPositions();
    
    // Update positions on graph changes (zoom, pan, etc.)
    const interval = setInterval(updateIconPositions, 100); // Update every 100ms
    
    return () => {
      clearInterval(interval);
    };
  }, [nodeWithVisibleBorder, graphData, zoomLevel]);

  // Get connection stats for a node
  const getNodeStats = (node) => {
    if (!node) return {};
    const connections = graphData.links.filter(
      link => link.source.id === node.id || link.target.id === node.id
    );
    return {
      totalConnections: connections.length,
      inbound: connections.filter(link => link.target.id === node.id).length,
      outbound: connections.filter(link => link.source.id === node.id).length
    };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'maintenance': return 'warning';
      case 'error': return 'error';
      default: return 'default';
    }
  };

  // Expose the ref to parent components
  React.useImperativeHandle(ref, () => ({
    zoomToFit: () => fgRef.current?.zoomToFit(1000, 50),
    centerAt: (x, y) => fgRef.current?.centerAt(x, y, 1000),
    zoom: (level) => fgRef.current?.zoom(level, 1000),
    getGraphRef: () => fgRef.current,
    exportToPNG: () => {
      if (import.meta.env.DEV) console.log('Starting PNG export...');

      if (!fgRef.current) {
        console.error('Graph reference not available for export');
        alert('Graph reference not available. Please wait for the graph to load.');
        return false;
      }

      if (import.meta.env.DEV) console.log('Graph reference found:', fgRef.current);

      try {
        // Method 1: Try graphDiv approach
        if (import.meta.env.DEV) console.log('Trying graphDiv method...');
        if (fgRef.current.graphDiv) {
          const graphDiv = fgRef.current.graphDiv().current;
          if (import.meta.env.DEV) console.log('GraphDiv found:', graphDiv);

          if (graphDiv) {
            const canvas = graphDiv.querySelector('canvas');
            if (import.meta.env.DEV) console.log('Canvas found via graphDiv:', canvas);

            if (canvas) {
              if (import.meta.env.DEV) console.log('Canvas dimensions:', canvas.width, 'x', canvas.height);

              // Create a new canvas with proper background
              const exportCanvas = document.createElement('canvas');
              exportCanvas.width = canvas.width;
              exportCanvas.height = canvas.height;
              const exportCtx = exportCanvas.getContext('2d');

              // Fill background with the actual graph background color
              exportCtx.fillStyle = backgroundColor || '#ffffff';
              exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

              // Draw the original canvas on top
              exportCtx.drawImage(canvas, 0, 0);

              const dataURL = exportCanvas.toDataURL('image/png');
              if (import.meta.env.DEV) console.log('DataURL created with background, length:', dataURL.length);

              const link = document.createElement('a');
              link.download = `graph-export-${Date.now()}.png`;
              link.href = dataURL;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              if (import.meta.env.DEV) console.log('Graph exported successfully via graphDiv method');
              return true;
            }
          }
        }

        // Method 2: Try direct DOM search
        if (import.meta.env.DEV) console.log('Trying direct DOM search...');
        const allCanvases = document.querySelectorAll('canvas');
        if (import.meta.env.DEV) console.log('All canvases found:', allCanvases.length);

        if (allCanvases.length > 0) {
          // Use the largest canvas (likely the graph canvas)
          let targetCanvas = allCanvases[0];
          for (let canvas of allCanvases) {
            if (canvas.width * canvas.height > targetCanvas.width * targetCanvas.height) {
              targetCanvas = canvas;
            }
          }

          if (import.meta.env.DEV) console.log('Using largest canvas:', targetCanvas.width, 'x', targetCanvas.height);

          // Create a new canvas with proper background
          const exportCanvas = document.createElement('canvas');
          exportCanvas.width = targetCanvas.width;
          exportCanvas.height = targetCanvas.height;
          const exportCtx = exportCanvas.getContext('2d');

          // Fill background with the actual graph background color
          exportCtx.fillStyle = backgroundColor || '#ffffff';
          exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

          // Draw the original canvas on top
          exportCtx.drawImage(targetCanvas, 0, 0);

          const dataURL = exportCanvas.toDataURL('image/png');

          const link = document.createElement('a');
          link.download = `graph-export-${Date.now()}.png`;
          link.href = dataURL;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          if (import.meta.env.DEV) console.log('Graph exported successfully via DOM search method');
          return true;
        }

        console.error('No canvas found for export');
        alert('No canvas element found. Please ensure the graph is fully loaded.');
        return false;

      } catch (error) {
        console.error('Export error:', error);
        alert('Export failed: ' + error.message);
        return false;
      }
    }
  }));

  return (
    <Box sx={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      {/* Control Panel */}
      <Paper
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 1000,
          p: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <ButtonGroup orientation="vertical" size="small">
          <Tooltip title="Zoom In" placement="left">
            <IconButton onClick={handleZoomIn} sx={{ color: 'white' }}>
              <ZoomIn />
            </IconButton>
          </Tooltip>
          <Tooltip title="Zoom Out" placement="left">
            <IconButton onClick={handleZoomOut} sx={{ color: 'white' }}>
              <ZoomOut />
            </IconButton>
          </Tooltip>
          <Tooltip title="Reset View" placement="left">
            <IconButton onClick={handleZoomReset} sx={{ color: 'white' }}>
              <CenterFocusStrong />
            </IconButton>
          </Tooltip>
          
          {/* Settings Icon */}
          {onSettingsToggle && (
            <Tooltip title="Settings" placement="left">
              <IconButton 
                onClick={onSettingsToggle} 
                sx={{ 
                  color: controlPanelOpen ? '#1976d2' : 'white',
                  backgroundColor: controlPanelOpen ? 'rgba(25, 118, 210, 0.2)' : 'transparent'
                }}
              >
                <Settings />
              </IconButton>
            </Tooltip>
          )}
        </ButtonGroup>
      </Paper>


      {/* Multi-Node Filter Indicator */}
      {filteredNodeIds.length > 0 && graphData.isFiltered && (
        <Paper
          sx={{
            position: 'absolute',
            top: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1001,
            p: 2,
            backgroundColor: 'rgba(255, 108, 53, 0.95)',
            color: 'white',
            backdropFilter: 'blur(10px)',
            borderRadius: 2,
            minWidth: 300,
            maxWidth: '80%'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FilterAlt />
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                Exploring {graphData.filterCount} Node{graphData.filterCount > 1 ? 's' : ''}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                ({graphData.nodes.length} nodes, {graphData.links.length} links)
              </Typography>
            </Box>
            <Tooltip title="Clear All Filters">
              <IconButton
                onClick={clearAllFilters}
                sx={{ color: 'white' }}
                size="small"
              >
                <Clear />
              </IconButton>
            </Tooltip>
          </Box>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {graphData.filteredNodeNames.map((nodeName, index) => {
              const nodeId = graphData.filteredNodeIds[index];
              return (
                <Chip
                  key={nodeId}
                  label={nodeName}
                  size="small"
                  variant="outlined"
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    fontSize: '0.75rem'
                  }}
                  onDelete={() => removeNodeFilter(nodeId)}
                  deleteIcon={
                    <Close 
                      sx={{ 
                        color: 'white !important', 
                        '&:hover': { color: '#ff9999 !important' } 
                      }} 
                    />
                  }
                />
              );
            })}
          </Box>
        </Paper>
      )}

      {/* Force Graph */}
      <ForceGraph2D
        ref={fgRef}
        graphData={graphData}
        width={typeof width === 'string' ? undefined : width}
        height={typeof height === 'string' ? undefined : height}
        backgroundColor={backgroundColor}
        nodeCanvasObject={nodeCanvasObject}
        linkCanvasObject={linkCanvasObject}
        onNodeClick={handleNodeClick}
        onNodeDoubleClick={handleNodeDoubleClick} // Double left-click for node exploration
        onNodeRightClick={handleNodeRightClick} // Right-click for node exploration
        onNodeHover={handleNodeHover}
        onLinkClick={handleLinkClick}
        onLinkHover={handleLinkHover}
        onBackgroundClick={handleBackgroundClick}
        // Optimized configuration for smooth performance
        cooldownTicks={graphData.nodes.length > 100 ? 200 : graphData.nodes.length > 50 ? 150 : 100} // More ticks for complex graphs
        d3AlphaDecay={0.025} // Slightly slower decay for smoother movement
        d3VelocityDecay={0.85} // Improved stability
        d3AlphaMin={0.008} // Lower threshold for better convergence
        // Dynamic forces based on graph size - but keep them strong enough for movement
        d3ForceCharge={graphData.nodes.length > 100 ? -nodeSpacing * 1.0 : graphData.nodes.length > 50 ? -nodeSpacing * 1.1 : -nodeSpacing * 1.2}
        d3ForceLink={layout === 'spiral' ? 0.1 : (graphData.nodes.length > 50 ? 0.25 : 0.3)} // Weaker link forces for spiral to prevent position override
        d3ForceLinkDistance={layout === 'spiral' ? nodeSpacing * 2 : nodeSpacing * 1.2} // Larger distance for spiral layout  
        d3ForceLinkStrength={layout === 'spiral' ? 0.1 : (graphData.nodes.length > 50 ? 0.25 : 0.3)} // Weaker link strength for spiral layout
        d3ForceCenter={layout === 'spiral' ? 0 : (graphData.nodes.length > 50 ? 0.05 : 0.08)} // Disable center force for spiral layout
        d3ForceCollide={graphData.nodes.length > 50 ? 12 : 15} // Increased collision radius to prevent overlap
        // Custom force for boundary constraints only
        d3Force={(alpha) => {
          const { width: containerWidth, height: containerHeight } = containerDimensions;
          const maxX = containerWidth / 3; // Container boundary from center
          const maxY = containerHeight / 3;
          
          return (nodes) => {
            nodes.forEach(node => {
              // Only apply boundary constraints - no positioning force
              if (node.x > maxX) {
                node.x = maxX;
                node.vx = node.vx > 0 ? -node.vx * 0.7 : node.vx; // Bounce back with damping
              } else if (node.x < -maxX) {
                node.x = -maxX;
                node.vx = node.vx < 0 ? -node.vx * 0.7 : node.vx; // Bounce back with damping
              }
              
              if (node.y > maxY) {
                node.y = maxY;
                node.vy = node.vy > 0 ? -node.vy * 0.7 : node.vy; // Bounce back with damping
              } else if (node.y < -maxY) {
                node.y = -maxY;
                node.vy = node.vy < 0 ? -node.vy * 0.7 : node.vy; // Bounce back with damping
              }
            });
          };
        }}
        enableNodeDrag={true}
        enableZoomPanInteraction={true}
        // Hard boundaries - prevent any movement beyond container edges
        minZoom={0.1}
        maxZoom={10}
        onZoom={(transform) => {
          setZoomLevel(transform.k);
          
          // Use actual container dimensions for pan boundary calculation
          const { width: containerWidth, height: containerHeight } = containerDimensions;
          
          // Allow reasonable panning within container bounds
          const maxPanX = containerWidth / 4; // Allow panning up to 1/4 of container width
          const maxPanY = containerHeight / 4; // Allow panning up to 1/4 of container height
          
          // Bounce back if pan goes too far outside container
          let constrainedX = transform.x;
          let constrainedY = transform.y;
          
          if (Math.abs(transform.x) > maxPanX) {
            constrainedX = transform.x > 0 ? maxPanX : -maxPanX;
          }
          if (Math.abs(transform.y) > maxPanY) {
            constrainedY = transform.y > 0 ? maxPanY : -maxPanY;
          }

          // Re-centering on drag removed (requirement #4)
        }}
        // Enhanced link interaction - arrows are drawn in custom linkCanvasObject, disable library's default arrows
        linkDirectionalArrowLength={0} // Disabled - we draw custom arrows in linkCanvasObject for better control
        linkDirectionalArrowRelPos={0.85} // Position reference (not used since arrows are custom drawn)
        linkDirectionalParticles={0} // Disabled edge flow animation
        linkDirectionalParticleSpeed={0.01}
        linkDirectionalParticleWidth={2}
        linkLabel={(link) => `${link.type || 'related'}: ${link.source.name || link.source.id} → ${link.target.name || link.target.id}`}
        nodeLabel = {(node) => `<div style="text-align:left;"><b>${node.properties.display_name_label || node.name}</b><br/></div>`}
        // Use the enhanced linkCanvasObject for better edge detection
        linkWidth={6}
        linkCurvature={(link) => {
          // Calculate and return curvature for proper hover detection on curved edges
          const start = link.source;
          const end = link.target;

          // Check for parallel links between the same nodes
          const parallelLinks = graphData.links.filter(l => {
            const lSourceId = l.source.id || l.source;
            const lTargetId = l.target.id || l.target;
            const startId = start.id || start;
            const endId = end.id || end;
            return (lSourceId === startId && lTargetId === endId) ||
                   (lSourceId === endId && lTargetId === startId);
          });

          // If there are multiple edges, apply curvature
          if (parallelLinks.length > 1) {
            const linkIndex = parallelLinks.findIndex(l => l === link);
            const maxCurvature = 0.3;
            const step = (2 * maxCurvature) / Math.max(parallelLinks.length - 1, 1);
            return -maxCurvature + (linkIndex * step);
          }

          return 0; // No curvature for single edges
        }}
        nodeRelSize={graphData.nodes.length > 100 ? 3 : graphData.nodes.length > 50 ? 4 : 6} // Dynamic but sufficient for force calculation
        nodeVal={(node) => {
          // Calculate actual connections from graph data
          const connections = graphData.links.filter(link => {
            const sourceId = link.source.id || link.source;
            const targetId = link.target.id || link.target;
            return sourceId === node.id || targetId === node.id;
          }).length;
          
          // Dynamic node sizing based on total node count for better visualization
          const totalNodes = graphData.nodes.length;
          let baseSize, maxSize, connectionMultiplier;
          
          if (totalNodes > 100) {
            // Very large graphs: small but visible nodes
            baseSize = 2.5;
            maxSize = 4;
            connectionMultiplier = 0.15;
          } else if (totalNodes > 50) {
            // Large graphs: small nodes  
            baseSize = 3;
            maxSize = 5;
            connectionMultiplier = 0.25;
          } else if (totalNodes > 25) {
            // Medium graphs: 2px nodes as requested
            baseSize = 2;
            maxSize = 6;
            connectionMultiplier = 0.3;
          } else {
            // Small graphs: normal size
            baseSize = 4;
            maxSize = 12.5;
            connectionMultiplier = 0.75;
          }
          
          return Math.min(maxSize, Math.max(baseSize, baseSize + connections * connectionMultiplier));
        }}
      />

      {/* DOM Overlay Icons */}
      {iconPositions.map((icon, index) => (
        <Tooltip key={`${icon.nodeId}-${icon.action}`} title={icon.tooltip} placement="top">
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              if (import.meta.env.DEV) console.log(`DOM Icon clicked: ${icon.action}`);
              
              // Find the node from nodeWithVisibleBorder
              const node = nodeWithVisibleBorder;
              if (node) {
                if (icon.action === 'details' && nodeActionHandlers.onShowDetails) {
                  nodeActionHandlers.onShowDetails(node);
                } else if (icon.action === 'explore' && nodeActionHandlers.onExplore) {
                  nodeActionHandlers.onExplore(node);
                } else if (icon.action === 'remove' && nodeActionHandlers.onRemove) {
                  nodeActionHandlers.onRemove(node);
                }
              }
            }}
            sx={{
              position: 'absolute',
              left: icon.x - 16, // Center the 32px button
              top: icon.y - 16,  // Center the 32px button
              width: 32,
              height: 32,
              zIndex: 1500,
              backgroundColor: icon.color,
              color: 'whitesmoke',
              boxShadow: '0 3px 10px rgba(0,0,0,0.4)',
              border: '3px solid gray',
              '&:hover': {
                backgroundColor: icon.color,
                transform: 'scale(1.2)',
                boxShadow: '0 5px 15px rgba(0,0,0,0.5)',
              },
              transition: 'all 0.2s ease-in-out'
            }}
          >
            {icon.action === 'details' && <VisibilityOutlined sx={{ fontSize: 18 }} />}
            {icon.action === 'explore' && <Launch sx={{ fontSize: 18 }} />}
            {icon.action === 'remove' && <Delete sx={{ fontSize: 18 }} />}
          </IconButton>
        </Tooltip>
      ))}

    </Box>
  );
});

InteractiveForceGraph.propTypes = {
  data: PropTypes.shape({
    nodes: PropTypes.array.isRequired,
    links: PropTypes.array.isRequired
  }),
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  nodeSize: PropTypes.number,
  linkWidth: PropTypes.number,
  showLabels: PropTypes.bool,
  backgroundColor: PropTypes.string,
  nodeColor: PropTypes.string,
  linkColor: PropTypes.string,
  nodeShape: PropTypes.string,
  onNodeClick: PropTypes.func,
  onNodeDoubleClick: PropTypes.func,
  onNodeRightClick: PropTypes.func,
  onNodeHover: PropTypes.func,
  onLinkClick: PropTypes.func,
  onBackgroundClick: PropTypes.func,
  nodeWithVisibleBorder: PropTypes.object,
  nodeActionHandlers: PropTypes.shape({
    onShowDetails: PropTypes.func,
    onExplore: PropTypes.func,
    onRemove: PropTypes.func
  }),
  isLoading: PropTypes.bool
};

export default InteractiveForceGraph;