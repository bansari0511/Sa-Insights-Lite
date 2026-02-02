import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Drawer,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Autocomplete,
  Button,
  Slider,
  Switch,
  FormControlLabel,
  Chip,
  Card,
  CardContent,
  Divider,
  Tooltip,
  Alert,
  Popover,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Modal,
  Menu,
  ListItemIcon,
  ListItemText,
  LinearProgress,
  Backdrop,
  CircularProgress,
  Pagination
} from '@mui/material';
import {
  Settings as SettingsIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Download as DownloadIcon,
  Image as ImageIcon,
  TableChart as TableChartIcon,
  AccountTree as GraphIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Visibility as VisibilityIcon,
  Launch as LaunchIcon,
  Delete as DeleteIcon,
  Assessment as AssessmentIcon,
  FirstPage as FirstPageIcon,
  LastPage as LastPageIcon,
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon
} from '@mui/icons-material';
import InteractiveForceGraph from '../ForceGraph/InteractiveForceGraph';
import { 
  ENTITY_TYPES, 
  searchEntities, 
  fetchGraphData, 
  exportToCSV, 
  exportToPNG,
  appendExploreDataToGraph,
  fetchEntitiesByType,
  searchEntityByKeyword,
  fetchRelatedNodes,
  NODE_COLORS,
  EDGE_COLORS,
  getNodeColor,
  getEdgeColor
} from '../../services/graphApiService';

const GRAPH_LAYOUTS = [
  { value: 'force', label: 'Force Layout' },
  { value: 'circle', label: 'Circular Layout' },
  { value: 'grid', label: 'Grid Layout' },
  { value: 'tree', label: 'Tree Layout' },
  { value: 'radial', label: 'Radial Layout' },
  { value: 'hierarchical', label: 'Hierarchical Layout' },
  { value: 'spiral', label: 'Spiral Layout' },
  { value: 'concentric', label: 'Concentric Layout' },
  { value: 'dagre', label: 'Dagre Layout' },
  { value: 'arc', label: 'Arc Layout' },
  { value: 'cluster', label: 'Cluster Layout' },
  { value: 'linear', label: 'Linear Layout' },
  { value: 'cola', label: 'Cola Layout' },
  { value: 'random', label: 'Random Layout' }
];

const NODE_SHAPES = [
  { value: 'circle', label: 'Circle' },
  { value: 'square', label: 'Square' },
  { value: 'triangle', label: 'Triangle' },
  { value: 'diamond', label: 'Diamond' },
  { value: 'hexagon', label: 'Hexagon' },
  { value: 'star', label: 'Star' }
];

const DRAWER_WIDTH = 320;

// Helper function to determine text color based on background
const getContrastColor = (hexColor) => {
  // Convert hex to RGB
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return white for dark colors, black for light colors
  return luminance > 0.5 ? '#000000' : '#ffffff';
};

// Helper function to truncate long labels
const truncateLabel = (label, maxLength = 20) => {
  if (!label || label.length <= maxLength) return label;
  return `${label.substring(0, maxLength)}...`;
};

const EnhancedGraphContainer = ({ useDummyData = false, dummyData = null }) => {
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [controlPanelOpen, setControlPanelOpen] = useState(false);
  const [filterPanelOpen, setFilterPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [overviewPanelOpen, setOverviewPanelOpen] = useState(true);
  const [hoveredNodeForActions, setHoveredNodeForActions] = useState(null);
  const [clickedNodeForActions, setClickedNodeForActions] = useState(null);
  const [hoveredAction, setHoveredAction] = useState(null);
  const [clickedNodePosition, setClickedNodePosition] = useState({ x: 0, y: 0 });
  const [nodeWithVisibleBorder, setNodeWithVisibleBorder] = useState(null);
  const [colorPickerAnchor, setColorPickerAnchor] = useState(null);
  const [colorPickerType, setColorPickerType] = useState(null); // 'node' or 'edge'
  const [colorPickerLabel, setColorPickerLabel] = useState('');
  const [highlightedNodes, setHighlightedNodes] = useState(new Set());
  const [highlightedLinks, setHighlightedLinks] = useState(new Set());
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedNodePosition, setSelectedNodePosition] = useState({ x: 0, y: 0 });
  const [hoveredNodePosition, setHoveredNodePosition] = useState({ x: 0, y: 0 });
  const graphRef = useRef();

  // Pagination state for explore history
  const [exploreHistory, setExploreHistory] = useState([]); // Array of graph data snapshots
  const [currentPage, setCurrentPage] = useState(0); // Current page index (0-based)

  // Node batch pagination state - for fetching more nodes from backend
  const [displayedNodesCount, setDisplayedNodesCount] = useState(0); // Number of nodes currently displayed
  const [totalNodesCount, setTotalNodesCount] = useState(0); // Total count from backend
  const [lastExploredNode, setLastExploredNode] = useState(null); // Track last explored node for "fetch more"
  const [currentOffset, setCurrentOffset] = useState(0); // Current offset for pagination
  const [paginationMode, setPaginationMode] = useState('query'); // 'explore' for history, 'query' for node batch

  // Filter states
  const [entityType, setEntityType] = useState('Imo');
  const [entityValue, setEntityValue] = useState('1089663');
  const [entityOptions, setEntityOptions] = useState([]);
  const [entityOptionsLoading, setEntityOptionsLoading] = useState(false);
  const [entityInputValue, setEntityInputValue] = useState('');
  const[dataStatusMessage,setDataStatusMessage] = useState('Data of MilitaryGroup - top 25 records');

  // Filter tracking removed - no longer needed for node explore

  // Visual control states
  const [graphLayout, setGraphLayout] = useState('force');
  const [userOverrideLayout, setUserOverrideLayout] = useState(false); // Track if user manually changed layout
  const [nodeSize, setNodeSize] = useState(6);
  const [linkWidth, setLinkWidth] = useState(2);
  const [showLabels, setShowLabels] = useState(true);
  const [userOverrideLabels, setUserOverrideLabels] = useState(false); // Track if user manually changed labels
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [enableClustering, setEnableClustering] = useState(true);
  const [nodeSpacing, setNodeSpacing] = useState(200); // Control for node spacing - increased for better hover
  const [showEdgeLabels, setShowEdgeLabels] = useState(true); // Default off for edge labels
  const [nodeShape, setNodeShape] = useState('circle'); // Node shape control
  const [hoveredNodeInfo, setHoveredNodeInfo] = useState(null); // For hover card
  const [hoveredLinkInfo, setHoveredLinkInfo] = useState(null); // For hover card
  const [noDataModalOpen, setNoDataModalOpen] = useState(false); // For no data modal
  const [downloadMenuAnchor, setDownloadMenuAnchor] = useState(null); // For download menu

  // Load initial entity options when entity type changes
  useEffect(() => {
    const loadInitialOptions = async () => {
      if (!entityType) return;


      setEntityOptionsLoading(true);
      setEntityValue(''); // Reset selection when type changes
      setEntityInputValue(''); // Reset input when type changes
      try {
        const options = await searchEntityByKeyword(entityType, '');
        setEntityOptions(options);
      } catch (error) {
        console.error(`Error fetching ${entityType}:`, error);
        setEntityOptions([]);
      } finally {
        setEntityOptionsLoading(false);
      }
    };
    
    loadInitialOptions();
  }, [entityType]);

  // Debounced search when user types
  useEffect(() => {
    const searchTimer = setTimeout(async () => {
      if (!entityType) return;
      
      setEntityOptionsLoading(true);
      try {
        const options = await searchEntityByKeyword(entityType, entityInputValue);
        setEntityOptions(options);
      } catch (error) {
        console.error(`Error searching ${entityType}:`, error);
        setEntityOptions([]);
      } finally {
        setEntityOptionsLoading(false);
      }
    }, 500);

    return () => clearTimeout(searchTimer);
  }, [entityType, entityInputValue]);
  
  // Refresh entity options after search to maintain auto-suggest functionality
  const refreshEntityOptions = useCallback(async () => {
    if (!entityType) return;
    
    try {
      const options = await searchEntityByKeyword(entityType, entityInputValue);
      setEntityOptions(options);
    } catch (error) {
      console.error(`Error refreshing ${entityType} options:`, error);
    }
  }, [entityType, entityInputValue]);

  // Handle entity selection and input changes
  const handleEntityChange = useCallback((event, newValue) => {
    setEntityValue(newValue || '');
    // When a value is selected, update the input to match
    if (newValue) {
      setEntityInputValue(newValue);
    }
  }, []);

  const handleEntityInputChange = useCallback((event, newInputValue) => {
    setEntityInputValue(newInputValue);
    // If user clears the input, also clear the selected value
    if (!newInputValue) {
      setEntityValue('');
    }
  }, []);

  // Fetch graph data based on filters
  const handleFetchData = useCallback(async () => {
    if (!entityType) {
      setNoDataModalOpen(true);
      return;
    }
    
    // Use either selected value or typed input value
    // Allow empty string searches - don't require a value to be entered
    const searchValue = entityValue || entityInputValue || '';

    // Reset all panels and controls for completely fresh start
    setRightPanelOpen(false);
    setControlPanelOpen(false);
    setOverviewPanelOpen(true);
   // setFilterPanelOpen(false);
    setSelectedNode(null);
    setClickedNodeForActions(null);
    setNodeWithVisibleBorder(null);
    setHoveredNodeInfo(null);
    setHoveredLinkInfo(null);
    setHighlightedNodes(new Set());
    setHighlightedLinks(new Set());
    setColorPickerAnchor(null);
    setNoDataModalOpen(false);
    
    // Reset all control settings to defaults
    setGraphLayout('force');
    setUserOverrideLayout(false);
    setNodeSize(6);
    setLinkWidth(2);
    setShowLabels(true);
    setUserOverrideLabels(false);
    setBackgroundColor('#ffffff');
    setEnableClustering(true);
    setNodeSpacing(200);
    setShowEdgeLabels(true);
    setNodeShape('circle');

    setLoading(true);
    try {
      const data = await fetchGraphData(entityType, searchValue);
      if (!data || !data.nodes || data.nodes.length === 0) {
        setNoDataModalOpen(true);
        setGraphData(null);
        // Reset pagination on empty data
        setExploreHistory([]);
        setCurrentPage(0);
        // Reset batch pagination
        setDisplayedNodesCount(0);
        setTotalNodesCount(0);
        setLastExploredNode(null);
        setCurrentOffset(0);
      } else {
        setGraphData(data);
        // Initialize explore history with the first page (initial search result)
        setExploreHistory([{
          data: data,
          label: `Initial: ${entityType} - ${searchValue || 'All'}`,
          timestamp: new Date().toISOString()
        }]);
        setCurrentPage(0);

        // Initialize batch pagination - track displayed and total counts
        setDisplayedNodesCount(data.nodes.length);
        setTotalNodesCount(data.totalCount || data.nodes.length); // Use totalCount from backend if available
        setLastExploredNode(null);
        setCurrentOffset(data.nodes.length);

        const displayLabel = searchValue || 'All';
        setDataStatusMessage(`Displaying Data of ${entityType} - ${displayLabel} `);
      }
      
      // Refresh entity options to maintain auto-suggest functionality
      await refreshEntityOptions();
    } catch (error) {
      console.error('Error fetching graph data:', error);
      setNoDataModalOpen(true);
      setGraphData(null);
    } finally {
      setLoading(false);
    }
  }, [entityType, entityValue, entityInputValue, refreshEntityOptions]);


  // Node hover handler for highlighting connected nodes
  const handleNodeHover = useCallback((node) => {
    if (!node || !graphData) {
      setHighlightedNodes(new Set());
      setHighlightedLinks(new Set());
      setHoveredNodeInfo(null);
      setHoveredNodeForActions(null);
      return;
    }

    const connectedNodes = new Set([node.id]);
    const connectedLinks = new Set();

    graphData.links.forEach(link => {
      const sourceId = link.source.id || link.source;
      const targetId = link.target.id || link.target;
      
      if (sourceId === node.id || targetId === node.id) {
        connectedLinks.add(`${sourceId}-${targetId}`);
        connectedNodes.add(sourceId);
        connectedNodes.add(targetId);
      }
    });

    setHighlightedNodes(connectedNodes);
    setHighlightedLinks(connectedLinks);
    setHoveredNodeInfo(node);
    setHoveredLinkInfo(null); // Clear link info when hovering node
  }, [graphData]);

  // Link hover handler for showing link information
  const handleLinkHover = useCallback((link) => {
    if (!link) {
      setHoveredLinkInfo(null);
      return;
    }
if (import.meta.env.DEV) console.log("link info", link);
    setHoveredLinkInfo(link);

    setHoveredNodeInfo(null); // Clear node info when hovering link
  }, []);

  // Add click timeout ref for click/double-click distinction
  const clickTimeoutRef = useRef(null);

  // Function to get current screen position of a node
  const getNodeScreenPosition = useCallback((node) => {
    if (!graphRef.current || !node || node.x === undefined || node.y === undefined) {
      return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    }
    
    try {
      const graphInstance = graphRef.current.getGraphRef();
      if (graphInstance && graphInstance.graph2ScreenCoords) {
        const screenCoords = graphInstance.graph2ScreenCoords(node.x, node.y);
        const graphContainer = graphInstance.renderer().domElement.parentElement;
        const containerRect = graphContainer.getBoundingClientRect();
        
        return { 
          x: screenCoords.x + containerRect.left, 
          y: screenCoords.y + containerRect.top 
        };
      }
    } catch (error) {
      console.warn('Error calculating node position:', error);
    }
    
    return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  }, []);

  // Node click handler - show details panel and toggle border
  const handleNodeClick = useCallback((node, event) => {
    // Clear any existing timeout
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }

    // Set a timeout to handle single click after double-click detection window
    clickTimeoutRef.current = setTimeout(() => {
      // Always show node details panel on node click
      setSelectedNode(node);
      setRightPanelOpen(true);
      // Auto-close control panel to prevent layout shift
      setControlPanelOpen(false);

      // COMMENTED OUT: Header and icons addition on left click
      // The following code was toggling border visibility and adding icons on node click
      // Now commented out - node details card with Focus button is shown instead
      /*
      // Toggle border visibility for this node
      if (nodeWithVisibleBorder && nodeWithVisibleBorder.id === node.id) {
        // If this node already has border visible, hide it
        setNodeWithVisibleBorder(null);
        setClickedNodeForActions(null);
      } else {
        // Show border for this node and hide any existing border
        setNodeWithVisibleBorder(node);
        setClickedNodeForActions({ node });

        // Use mouse event coordinates for positioning icons
        const mousePosition = {
          x: event.x || event.clientX || 0,
          y: event.y || event.clientY || 0
        };
        setClickedNodePosition(mousePosition);
      }
      */
    }, 300); // 300ms delay to detect double-clicks
  }, [nodeWithVisibleBorder]);

  // Action handlers for floating icons
  const handleShowNodeDetails = useCallback((node) => {
    setSelectedNode(node);
    setRightPanelOpen(true);
    // Auto-close control panel to prevent layout shift
    setControlPanelOpen(false);
    // Keep border visible and don't clear actions
    // setClickedNodeForActions(null);
    // setNodeWithVisibleBorder(null);
  }, []);

  // Automatic layout switching and label visibility based on node count
  useEffect(() => {
    if (graphData && graphData.nodes) {
      const nodeCount = graphData.nodes.length;
      
      // Auto-hide labels after 25 nodes (unless user manually overrode)
      if (!userOverrideLabels) {
        if (nodeCount > 25 && showLabels) {
          if (import.meta.env.DEV) console.log(`Auto-hiding node labels for ${nodeCount} nodes`);
          setShowLabels(false);
          setShowEdgeLabels(false);
        } else if (nodeCount <= 25 && !showLabels) {
          if (import.meta.env.DEV) console.log(`Auto-showing node labels for ${nodeCount} nodes`);
          setShowLabels(true);
        }
      }
      
      // Auto layout switching (unless user manually overrode)
      if (!userOverrideLayout) {
        const currentLayout = graphLayout;
        
        if (nodeCount > 25 && currentLayout !== 'cluster') {
          if (import.meta.env.DEV) console.log(`Auto-switching to cluster layout for ${nodeCount} nodes (was ${currentLayout})`);
          setGraphLayout('force');
        } else if (nodeCount <= 25 && nodeCount > 0 && currentLayout === 'cluster') {
          if (import.meta.env.DEV) console.log(`Auto-switching back to force layout for ${nodeCount} nodes`);
          setGraphLayout('force');
        }
      }
    }
  }, [graphData?.nodes?.length, userOverrideLayout, userOverrideLabels, showLabels, graphLayout]); // Dependencies for auto-management

  const handleExploreNodeFromIcon = useCallback(async (node) => {
    // Keep border visible and don't clear actions during explore
    // setClickedNodeForActions(null);
    // setNodeWithVisibleBorder(null);
    if (!node || !graphData) return;

    setLoading(true);
    try {
      const newData = await fetchRelatedNodes(node.type, node.id, useDummyData);
      const mergedData = appendExploreDataToGraph(graphData, newData);
      setGraphData(mergedData);

      // Add to explore history as a new page
      const newHistoryEntry = {
        data: mergedData,
        label: `Explore: ${node.name || node.id}`,
        exploredNode: { id: node.id, name: node.name, type: node.type },
        timestamp: new Date().toISOString()
      };

      setExploreHistory(prevHistory => {
        const newHistory = [...prevHistory.slice(0, currentPage + 1), newHistoryEntry];
        return newHistory;
      });
      setCurrentPage(prevPage => prevPage + 1);

      if (import.meta.env.DEV) console.log('Exploring node from icon:', node.name, 'Type:', node.type, 'Merged nodes:', mergedData.nodes.length, 'Merged links:', mergedData.links.length);
    } catch (error) {
      console.error('Error exploring node:', error);
    } finally {
      setLoading(false);
    }
  }, [graphData, useDummyData, currentPage]);

  // Background click handler to clear clicked node actions and border
  const handleBackgroundClick = useCallback(() => {
    setClickedNodeForActions(null);
    setNodeWithVisibleBorder(null);
  }, []);

  // Color change handler
  const handleColorChange = useCallback((color) => {
    if (!colorPickerType || !colorPickerLabel || !graphData) return;
    
    if (colorPickerType === 'node') {
      // Update node colors directly on existing objects (same approach as edges)
      setGraphData(prevData => {
        const updatedNodes = prevData.nodes.map(node => {
          if (node.type === colorPickerLabel) {
            // Only update the color property, preserve all other properties and references
            node.color = color;
            return node;
          }
          return node;
        });
        
        // Return new object but preserve all existing structure and references
        return {
          ...prevData,
          nodes: updatedNodes
        };
      });
    } else if (colorPickerType === 'edge') {
      // Update edge colors while preserving all original link properties
      setGraphData(prevData => {
        const updatedLinks = prevData.links.map(link => {
          if (link.type === colorPickerLabel) {
            // Only update the color property, preserve all other properties and references
            link.color = color;
            return link;
          }
          return link;
        });
        
        // Return new object but preserve all existing structure and references
        return {
          ...prevData,
          links: updatedLinks
        };
      });
    }
    
    setColorPickerAnchor(null);
  }, [colorPickerType, colorPickerLabel]);

  // Size change handler
  const handleSizeChange = useCallback((size) => {
    if (!colorPickerType || !colorPickerLabel || !graphData) return;
    
    if (colorPickerType === 'node') {
      // Update node sizes directly on existing objects (same approach as edges)
      setGraphData(prevData => {
        const updatedNodes = prevData.nodes.map(node => {
          if (node.type === colorPickerLabel) {
            // Only update the size property, preserve all other properties and references
            node.size = size;
            return node;
          }
          return node;
        });
        
        // Return new object but preserve all existing structure and references
        return {
          ...prevData,
          nodes: updatedNodes
        };
      });
    } else if (colorPickerType === 'edge') {
      // Update edge widths while preserving all original link properties
      setGraphData(prevData => {
        const updatedLinks = prevData.links.map(link => {
          if (link.type === colorPickerLabel) {
            // Only update the width property, preserve all other properties and references
            link.width = size;
            return link;
          }
          return link;
        });
        
        // Return new object but preserve all existing structure and references
        return {
          ...prevData,
          links: updatedLinks
        };
      });
    }
  }, [colorPickerType, colorPickerLabel]);

  // Note: Removed position update effect - popup now uses static mouse click coordinates

  const handleRemoveNodeFromGraph = useCallback((node) => {
    // Clear border and actions when removing node since node will be gone
    setClickedNodeForActions(null);
    setNodeWithVisibleBorder(null);
    if (!node || !graphData) return;
    
    // Remove node and its links from graph
    const filteredNodes = graphData.nodes.filter(n => n.id !== node.id);
    const filteredLinks = graphData.links.filter(link => {
      const sourceId = link.source.id || link.source;
      const targetId = link.target.id || link.target;
      return sourceId !== node.id && targetId !== node.id;
    });
    
    setGraphData({
      nodes: filteredNodes,
      links: filteredLinks
    });
    
    // Clear selection if this node was selected
    if (selectedNode?.id === node.id) {
      setSelectedNode(null);
      setRightPanelOpen(false);
    }
  }, [graphData, selectedNode]);

  // Color picker handlers
  const handleOpenColorPicker = useCallback((event, type, label) => {
    setColorPickerAnchor(event.currentTarget);
    setColorPickerType(type);
    setColorPickerLabel(label);
  }, []);

  const handleCloseColorPicker = useCallback(() => {
    setColorPickerAnchor(null);
    setColorPickerType(null);
    setColorPickerLabel('');
  }, []);

  // Node double-click handler for exploration
  const handleNodeDoubleClick = useCallback(async (node) => {
    if (!node || !graphData) return;

    // Clear the single-click timeout to prevent context menu
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
    }

    if (import.meta.env.DEV) console.log('Double-click detected, exploring node:', node.id);

    setLoading(true);
    try {
      // Fetch new graph data for the double-clicked node
      const newData = await fetchRelatedNodes(node.type, node.id, useDummyData);

      // Append new data to existing graph instead of replacing
      const mergedData = appendExploreDataToGraph(graphData, newData);
      setGraphData(mergedData);

      // Add to explore history as a new page
      const newHistoryEntry = {
        data: mergedData,
        label: `Explore: ${node.name || node.id}`,
        exploredNode: { id: node.id, name: node.name, type: node.type },
        timestamp: new Date().toISOString()
      };

      setExploreHistory(prevHistory => {
        const newHistory = [...prevHistory.slice(0, currentPage + 1), newHistoryEntry];
        return newHistory;
      });
      setCurrentPage(prevPage => prevPage + 1);

      if (import.meta.env.DEV) console.log('Double-click exploring node:', node.name, 'Type:', node.type, 'Merged nodes:', mergedData.nodes.length, 'Merged links:', mergedData.links.length);
    } catch (error) {
      console.error('Error exploring node on double-click:', error);
    } finally {
      setLoading(false);
    }
  }, [graphData, useDummyData, currentPage]);

  // Node right-click handler for exploration
  const handleNodeRightClick = useCallback(async (node) => {
    if (!node || !graphData) return;

    // Clear the single-click timeout to prevent node card from opening
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
    }

    if (import.meta.env.DEV) console.log('Right-click detected, exploring node:', node.id);

    setLoading(true);
    try {
      // Fetch new graph data for the right-clicked node
      const newData = await fetchRelatedNodes(node.type, node.id, useDummyData);

      // Append new data to existing graph instead of replacing
      const mergedData = appendExploreDataToGraph(graphData, newData);
      setGraphData(mergedData);

      // Add to explore history as a new page
      const newHistoryEntry = {
        data: mergedData,
        label: `Explore: ${node.name || node.id}`,
        exploredNode: { id: node.id, name: node.name, type: node.type },
        timestamp: new Date().toISOString()
      };

      setExploreHistory(prevHistory => {
        const newHistory = [...prevHistory.slice(0, currentPage + 1), newHistoryEntry];
        return newHistory;
      });
      setCurrentPage(prevPage => prevPage + 1);

      if (import.meta.env.DEV) console.log('Right-click exploring node:', node.name, 'Type:', node.type, 'Merged nodes:', mergedData.nodes.length, 'Merged links:', mergedData.links.length);
    } catch (error) {
      console.error('Error exploring node on right-click:', error);
    } finally {
      setLoading(false);
    }
  }, [graphData, useDummyData, currentPage]);

  // Pagination handlers for explore history navigation
  const handlePageChange = useCallback((event, newPage) => {
    // newPage is 1-based from MUI Pagination, convert to 0-based index
    const pageIndex = newPage - 1;
    if (pageIndex >= 0 && pageIndex < exploreHistory.length) {
      setCurrentPage(pageIndex);
      setGraphData(exploreHistory[pageIndex].data);
      // Clear selection when navigating pages
      setSelectedNode(null);
      setRightPanelOpen(false);
      setNodeWithVisibleBorder(null);
      setClickedNodeForActions(null);
    }
  }, [exploreHistory]);

  const handleGoToFirstPage = useCallback(() => {
    if (exploreHistory.length > 0) {
      setCurrentPage(0);
      setGraphData(exploreHistory[0].data);
      setSelectedNode(null);
      setRightPanelOpen(false);
    }
  }, [exploreHistory]);

  const handleGoToLastPage = useCallback(() => {
    if (exploreHistory.length > 0) {
      const lastIndex = exploreHistory.length - 1;
      setCurrentPage(lastIndex);
      setGraphData(exploreHistory[lastIndex].data);
      setSelectedNode(null);
      setRightPanelOpen(false);
    }
  }, [exploreHistory]);

  const handleGoToPrevPage = useCallback(() => {
    if (currentPage > 0) {
      const newIndex = currentPage - 1;
      setCurrentPage(newIndex);
      setGraphData(exploreHistory[newIndex].data);
      setSelectedNode(null);
      setRightPanelOpen(false);
    }
  }, [currentPage, exploreHistory]);

  const handleGoToNextPage = useCallback(() => {
    if (currentPage < exploreHistory.length - 1) {
      const newIndex = currentPage + 1;
      setCurrentPage(newIndex);
      setGraphData(exploreHistory[newIndex].data);
      setSelectedNode(null);
      setRightPanelOpen(false);
    }
  }, [currentPage, exploreHistory]);

  // Focus on node functionality - highlights the node and its related nodes
  const handleFocusNode = useCallback(() => {
    if (selectedNode && graphRef.current && graphData) {
      // Center and zoom on the selected node
      graphRef.current.centerAt(selectedNode.x, selectedNode.y, 1000);
      graphRef.current.zoom(3, 1000);

      // Highlight the selected node and its connected nodes
      const connectedNodes = new Set([selectedNode.id]);
      const connectedLinks = new Set();

      // Find all nodes connected to the selected node
      graphData.links.forEach(link => {
        const sourceId = link.source.id || link.source;
        const targetId = link.target.id || link.target;

        if (sourceId === selectedNode.id || targetId === selectedNode.id) {
          connectedLinks.add(`${sourceId}-${targetId}`);
          connectedNodes.add(sourceId);
          connectedNodes.add(targetId);
        }
      });

      // Update highlighted nodes and links state
      setHighlightedNodes(connectedNodes);
      setHighlightedLinks(connectedLinks);

      if (import.meta.env.DEV) console.log('Focus button clicked - highlighting node:', selectedNode.id, 'and', connectedNodes.size - 1, 'related nodes');
    }
  }, [selectedNode, graphData]);

  // Simplified explore functionality - no filter tracking

  // Simplified explore node functionality - with pagination tracking
  const handleExploreNode = useCallback(async () => {
    if (!selectedNode || !graphData) return;

    setLoading(true);
    try {
      // Fetch new graph data for the selected node
      const newData = await fetchRelatedNodes(selectedNode.type, selectedNode.id, useDummyData);

      // Append new data to existing graph instead of replacing
      const mergedData = appendExploreDataToGraph(graphData, newData);
      setGraphData(mergedData);

      // Add to explore history as a new page
      const newHistoryEntry = {
        data: mergedData,
        label: `Explore: ${selectedNode.name || selectedNode.id}`,
        exploredNode: { id: selectedNode.id, name: selectedNode.name, type: selectedNode.type },
        timestamp: new Date().toISOString()
      };

      // If we're not at the last page, truncate history and add new entry
      setExploreHistory(prevHistory => {
        const newHistory = [...prevHistory.slice(0, currentPage + 1), newHistoryEntry];
        return newHistory;
      });
      setCurrentPage(prevPage => prevPage + 1);

      // Update batch pagination tracking
      setLastExploredNode({ id: selectedNode.id, name: selectedNode.name, type: selectedNode.type });
      setDisplayedNodesCount(mergedData.nodes.length);
      setTotalNodesCount(newData.totalCount || mergedData.nodes.length);
      setCurrentOffset(newData.nodes?.length || 50);

      if (import.meta.env.DEV) console.log('Exploring node:', selectedNode.name, 'Type:', selectedNode.type, 'Merged nodes:', mergedData.nodes.length, 'Merged links:', mergedData.links.length);
    } catch (error) {
      console.error('Error exploring node:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedNode, graphData, useDummyData, currentPage]);

  // Handler to fetch next batch of nodes from backend
  const handleFetchNextBatch = useCallback(async () => {
    if (!lastExploredNode || displayedNodesCount >= totalNodesCount) return;

    setLoading(true);
    try {
      // Fetch next batch with offset
      const newData = await fetchRelatedNodes(
        lastExploredNode.type,
        lastExploredNode.id,
        useDummyData,
        currentOffset // Pass offset to get next batch
      );

      if (newData && newData.nodes && newData.nodes.length > 0) {
        // Append new nodes to existing graph
        const mergedData = appendExploreDataToGraph(graphData, newData);
        setGraphData(mergedData);

        // Update the current history entry with merged data
        setExploreHistory(prevHistory => {
          const newHistory = [...prevHistory];
          if (newHistory.length > 0) {
            newHistory[currentPage] = {
              ...newHistory[currentPage],
              data: mergedData
            };
          }
          return newHistory;
        });

        // Update batch tracking
        setDisplayedNodesCount(mergedData.nodes.length);
        setCurrentOffset(prevOffset => prevOffset + (newData.nodes?.length || 50));

        if (import.meta.env.DEV) console.log('Fetched next batch. Total nodes now:', mergedData.nodes.length, 'of', totalNodesCount);
      }
    } catch (error) {
      console.error('Error fetching next batch:', error);
    } finally {
      setLoading(false);
    }
  }, [lastExploredNode, displayedNodesCount, totalNodesCount, currentOffset, graphData, useDummyData, currentPage]);

  // Get connection stats for a node
  const getNodeStats = useCallback((node) => {
    if (!node || !graphData) return {};
    const connections = graphData.links.filter(
      link => {
        const sourceId = link.source.id || link.source;
        const targetId = link.target.id || link.target;
        return sourceId === node.id || targetId === node.id;
      }
    );
    return {
      totalConnections: connections.length,
      inbound: connections.filter(link => {
        const targetId = link.target.id || link.target;
        return targetId === node.id;
      }).length,
      outbound: connections.filter(link => {
        const sourceId = link.source.id || link.source;
        return sourceId === node.id;
      }).length
    };
  }, [graphData]);

  // Get graph statistics
  const getGraphStats = useCallback(() => {
    if (!graphData) return { nodeLabels: [], relationshipTypes: [], nodeCount: 0, linkCount: 0 };
    
    // Get unique node types (labels)
    const nodeLabels = [...new Set(graphData.nodes.map(node => node.type))].filter(Boolean);
    
    // Get unique relationship types
    const relationshipTypes = [...new Set(graphData.links.map(link => link.type))].filter(Boolean);
    
    // Get counts per type
    const nodeTypeCounts = nodeLabels.reduce((acc, type) => {
      acc[type] = graphData.nodes.filter(node => node.type === type).length;
      return acc;
    }, {});
    
    const relationshipTypeCounts = relationshipTypes.reduce((acc, type) => {
      acc[type] = graphData.links.filter(link => link.type === type).length;
      return acc;
    }, {});
    
    return {
      nodeLabels,
      relationshipTypes,
      nodeTypeCounts,
      relationshipTypeCounts,
      nodeCount: graphData.nodes.length,
      linkCount: graphData.links.length
    };
  }, [graphData]);

  // Export functions
  const handleExportPNG = useCallback(() => {
    if (graphRef.current && graphRef.current.exportToPNG) {
      // Use the direct export method from the graph component
      const success = graphRef.current.exportToPNG();
      if (success) {
        if (import.meta.env.DEV) console.log('PNG export completed successfully');
      } else {
        console.error('PNG export failed');
        alert('Failed to export graph as PNG. Please try again.');
      }
    } else {
      // Fallback to the service method
      if (import.meta.env.DEV) console.log('Using fallback export method');
      exportToPNG(graphRef);
    }
  }, []);

  const handleExportCSV = useCallback(() => {
    if (graphData) {
      exportToCSV(graphData);
    }
    setDownloadMenuAnchor(null); // Close menu after export
  }, [graphData]);

  const handleDownloadMenuOpen = useCallback((event) => {
    setDownloadMenuAnchor(event.currentTarget);
  }, []);

  const handleDownloadMenuClose = useCallback(() => {
    setDownloadMenuAnchor(null);
  }, []);

  const handleExportPNGFromMenu = useCallback(() => {
    handleExportPNG();
    setDownloadMenuAnchor(null); // Close menu after export
  }, [handleExportPNG]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
    };
  }, []);

  // Load dummy data on mount if enabled, otherwise wait for user to search
   useEffect(() => {
       if (useDummyData && dummyData && !graphData) {
           if (import.meta.env.DEV) console.log('Loading dummy data:', dummyData);
           setGraphData(dummyData);
           // Initialize explore history for dummy data
           setExploreHistory([{
             data: dummyData,
             label: 'Initial: Dummy Data',
             timestamp: new Date().toISOString()
           }]);
           setCurrentPage(0);
           // Initialize batch pagination for dummy data
           setDisplayedNodesCount(dummyData.nodes.length);
           setTotalNodesCount(dummyData.totalCount || dummyData.nodes.length);
           setLastExploredNode(null);
           setCurrentOffset(dummyData.nodes.length);
           setDataStatusMessage(`Displaying Dummy Data - ${dummyData.nodes.length} nodes, ${dummyData.links.length} relationships`);
       } else if (!useDummyData && !graphData && entityType && !loading) {
           handleFetchData();
       }
   }, [useDummyData, dummyData]);
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      width: '100%',
      position: 'relative',
      overflow: 'auto',
      bgcolor: 'background.default',
      p: 2
    }}>
      {/* Loading Progress Bar - Fixed at top */}
      {loading && (
        <LinearProgress
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
            height: 4
          }}
        />
      )}

      {/* Loading Backdrop with Spinner */}
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 2000,
          backdropFilter: 'blur(4px)',
          background: 'rgba(0, 0, 0, 0.3)'
        }}
        open={loading}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <CircularProgress color="inherit" size={60} thickness={4} />
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
            Loading Graph Data...
          </Typography>
        </Box>
      </Backdrop>

      {/* Main Graph Content Area */}
      <Box sx={{
        flexGrow: 1,
        position: 'relative',
        minHeight: '900px',
        display: 'flex',
        flexDirection: 'column'
      }}>

        {/* Node Properties Panel - Neo4j Style */}
        {rightPanelOpen && selectedNode && (
          <Card 
            sx={{ 
              position: 'absolute',
              right: 8,
              top: 80,
              width: 350,
              maxWidth: 'calc(100vw - 50px)',
              zIndex: 1150,
              bgcolor: 'background.paper',
              boxShadow: 6,
              height: 'auto',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1
            }}
          >
            <CardContent sx={{ p: 0 }}>
              {/* Header */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                p: 1,
                borderBottom: '1px solid',
                borderColor: 'divider'
              }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '12px' }}>
                  Node properties
                </Typography>
                <IconButton 
                  size="small" 
                  onClick={() => setRightPanelOpen(false)}
                  sx={{ color: 'text.secondary' }}
                >
                  <ChevronRightIcon fontSize="small" />
                </IconButton>
              </Box>

              {/* Node Type Badge */}
              <Box sx={{ p: 1, pb: 0.25 }}>
                <Chip
                  label={selectedNode.type}
                  size="small"
                  sx={{ 
                    bgcolor: selectedNode.color || 'primary.main',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '10px'
                  }}
                />
              </Box>

              {/* Properties Table */}
              <TableContainer sx={{ px: 1, pb: 1 }}>
                <Table size="small" sx={{ '& .MuiTableCell-root': { py: 0.5 } }}>
                  <TableBody>
                    {/* Node ID */}
                    <TableRow>
                      <TableCell 
                        component="th" 
                        scope="row" 
                        sx={{ 
                          width: '30%',
                          fontSize: '10px', 
                          fontWeight: 'bold', 
                          color: 'text.secondary',
                          borderBottom: '1px solid',
                          borderColor: 'divider',
                          wordBreak: 'break-word'
                        }}
                      >
                        elementId
                      </TableCell>
                      <TableCell 
                        sx={{ 
                          fontSize: '10px', 
                          fontFamily: 'monospace',
                          color: 'text.primary',
                          borderBottom: '1px solid',
                          borderColor: 'divider',
                          wordBreak: 'break-all',
                          whiteSpace: 'normal'
                        }}
                      >
                        {selectedNode.id}
                      </TableCell>
                    </TableRow>

                    {/* Node Name */}
                    {selectedNode.name && (
                      <TableRow>
                        <TableCell 
                          component="th" 
                          scope="row" 
                          sx={{ 
                            fontSize: '10px', 
                            fontWeight: 'bold', 
                            color: 'text.secondary',
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            wordBreak: 'break-word'
                          }}
                        >
                          name
                        </TableCell>
                        <TableCell 
                          sx={{ 
                            fontSize: '10px', 
                            color: 'text.primary',
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            wordBreak: 'break-word',
                            whiteSpace: 'normal'
                          }}
                        >
                          {selectedNode.name}
                        </TableCell>
                      </TableRow>
                    )}

                    {/* Node Type */}
                    {selectedNode.type && (
                      <TableRow>
                        <TableCell 
                          component="th" 
                          scope="row" 
                          sx={{ 
                            fontSize: '10px', 
                            fontWeight: 'bold', 
                            color: 'text.secondary',
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            wordBreak: 'break-word'
                          }}
                        >
                          type
                        </TableCell>
                        <TableCell 
                          sx={{ 
                            fontSize: '10px', 
                            color: 'text.primary',
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            wordBreak: 'break-word',
                            whiteSpace: 'normal'
                          }}
                        >
                          {selectedNode.type}
                        </TableCell>
                      </TableRow>
                    )}

                    {/* Node Category */}
                    {selectedNode.category && (
                      <TableRow>
                        <TableCell 
                          component="th" 
                          scope="row" 
                          sx={{ 
                            fontSize: '10px', 
                            fontWeight: 'bold', 
                            color: 'text.secondary',
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            wordBreak: 'break-word'
                          }}
                        >
                          category
                        </TableCell>
                        <TableCell 
                          sx={{ 
                            fontSize: '10px', 
                            color: 'text.primary',
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            wordBreak: 'break-word',
                            whiteSpace: 'normal'
                          }}
                        >
                          {selectedNode.category}
                        </TableCell>
                      </TableRow>
                    )}

                    {/* Node Status */}
                    {selectedNode.status && (
                      <TableRow>
                        <TableCell 
                          component="th" 
                          scope="row" 
                          sx={{ 
                            fontSize: '10px', 
                            fontWeight: 'bold', 
                            color: 'text.secondary',
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            wordBreak: 'break-word'
                          }}
                        >
                          status
                        </TableCell>
                        <TableCell 
                          sx={{ 
                            fontSize: '10px', 
                            color: 'text.primary',
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            wordBreak: 'break-word',
                            whiteSpace: 'normal'
                          }}
                        >
                          {selectedNode.status}
                        </TableCell>
                      </TableRow>
                    )}

                    {/* Description */}
                    {selectedNode.description && (
                      <TableRow>
                        <TableCell 
                          component="th" 
                          scope="row" 
                          sx={{ 
                            fontSize: '10px', 
                            fontWeight: 'bold', 
                            color: 'text.secondary',
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            wordBreak: 'break-word',
                            verticalAlign: 'top'
                          }}
                        >
                          description
                        </TableCell>
                        <TableCell 
                          sx={{ 
                            fontSize: '10px', 
                            color: 'text.primary',
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            wordBreak: 'break-word',
                            whiteSpace: 'normal'
                          }}
                        >
                          {selectedNode.description}
                        </TableCell>
                      </TableRow>
                    )}

                    {/* Display all properties from selectedNode.properties except body field */}
                    {selectedNode.properties && Object.entries(selectedNode.properties).filter(([key]) => key !== 'body').map(([key, value]) => (
                      <TableRow key={key}>
                        <TableCell 
                          component="th" 
                          scope="row" 
                          sx={{ 
                            fontSize: '10px', 
                            fontWeight: 'bold', 
                            color: 'text.secondary',
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            wordBreak: 'break-word',
                            verticalAlign: 'top'
                          }}
                        >
                          {key}
                        </TableCell>
                        <TableCell 
                          sx={{ 
                            fontSize: '10px', 
                            color: 'text.primary',
                            fontFamily: key.includes('id') || key.includes('guid') ? 'monospace' : 'inherit',
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            wordBreak: key.includes('id') || key.includes('guid') ? 'break-all' : 'break-word',
                            whiteSpace: 'normal'
                          }}
                        >
                          {value?.toString() || 'N/A'}
                        </TableCell>
                      </TableRow>
                    ))}

                    {/* Connection Statistics */}
                    {(() => {
                      const stats = getNodeStats(selectedNode);
                      return (
                        <>
                          <TableRow>
                            <TableCell 
                              component="th" 
                              scope="row" 
                              sx={{ 
                                fontSize: '10px', 
                                fontWeight: 'bold', 
                                color: 'text.secondary',
                                borderBottom: '1px solid',
                                borderColor: 'divider',
                                borderTop: '2px solid',
                                borderTopColor: 'divider'
                              }}
                            >
                              Total Connections
                            </TableCell>
                            <TableCell 
                              sx={{ 
                                fontSize: '10px', 
                                color: 'text.primary',
                                borderBottom: '1px solid',
                                borderColor: 'divider',
                                borderTop: '2px solid',
                                borderTopColor: 'divider'
                              }}
                            >
                              {stats.totalConnections}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell 
                              component="th" 
                              scope="row" 
                              sx={{ 
                                fontSize: '10px', 
                                fontWeight: 'bold', 
                                color: 'text.secondary',
                                borderBottom: '1px solid',
                                borderColor: 'divider'
                              }}
                            >
                              Inbound
                            </TableCell>
                            <TableCell 
                              sx={{ 
                                fontSize: '10px', 
                                color: 'text.primary',
                                borderBottom: '1px solid',
                                borderColor: 'divider'
                              }}
                            >
                              {stats.inbound}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell 
                              component="th" 
                              scope="row" 
                              sx={{ 
                                fontSize: '10px', 
                                fontWeight: 'bold', 
                                color: 'text.secondary',
                                borderBottom: 'none'
                              }}
                            >
                              Outbound
                            </TableCell>
                            <TableCell 
                              sx={{ 
                                fontSize: '10px', 
                                color: 'text.primary',
                                borderBottom: 'none'
                              }}
                            >
                              {stats.outbound}
                            </TableCell>
                          </TableRow>
                        </>
                      );
                    })()}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Action Buttons */}
              <Box sx={{ 
                p: 1,
                borderTop: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                gap: 0.5,
                flexDirection: 'column'
              }}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleExploreNode}
                  fullWidth
                  disabled={loading}
                  sx={{ mb: 0.5, fontSize: '10px', py: 0.25 }}
                >
                  {loading ? 'Exploring...' : 'Explore Node'}
                </Button>
                
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleFocusNode}
                    sx={{ flex: 1, fontSize: '10px', py: 0.25 }} // Reduced button size
                  >
                    Focus
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      // Remove node from graph logic (to be implemented)
                      setSelectedNode(null);
                      setRightPanelOpen(false);
                    }}
                    color="error"
                    sx={{ flex: 1, fontSize: '10px', py: 0.25 }} // Reduced button size
                  >
                    Remove
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Control Panel Popup */}
        {controlPanelOpen && (
          <Paper
            sx={{
              position: 'absolute',
              top: rightPanelOpen ? 500 : 60, // Better positioning to avoid overlap
              right: rightPanelOpen ? 470 : 8, // Position to left of node card when open
              width: 'min(280px, calc(100vw - 100px))',
              maxWidth: 280,
              p: 0,
              zIndex: 1200, // Higher than node card
              bgcolor: 'background.paper',
              boxShadow: 8,
              maxHeight: 'calc(100vh - 150px)',
              overflow: 'hidden',
              border: '2px solid',
              borderColor: 'secondary.main',
              borderRadius: 2
            }}
          >
            {/* Header with collapse button */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              p: 1.5,
              borderBottom: '1px solid',
              borderColor: 'divider'
            }}>
              <Typography variant="h6" sx={{ color: 'black', fontSize: '14px', fontWeight: 'bold' }}>
                Settings
              </Typography>
              <IconButton 
                size="small" 
                onClick={() => setControlPanelOpen(false)}
                sx={{ color: 'text.secondary' }}
              >
                <ChevronRightIcon fontSize="small" />
              </IconButton>
            </Box>

            {/* Settings content */}
            <Box sx={{ p: 2, maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>

            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: 'black', fontSize: '12px' }}>
                  Graph Layout {!userOverrideLayout && graphData?.nodes?.length > 25 && (
                    <Chip 
                      label="Auto" 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                      sx={{ ml: 1, height: 16, fontSize: '10px' }}
                    />
                  )}
                </Typography>
                {userOverrideLayout && (
                  <Button
                    size="small"
                    onClick={() => {
                      setUserOverrideLayout(false);
                      if (import.meta.env.DEV) console.log('Reset to automatic layout behavior');
                    }}
                    sx={{ fontSize: '10px', minWidth: 'auto', p: 0.5 }}
                  >
                    Reset Auto
                  </Button>
                )}
              </Box>
              <FormControl fullWidth size="small">
                <Select
                  value={graphLayout}
                  onChange={(e) => {
                    setGraphLayout(e.target.value);
                    setUserOverrideLayout(true); // Mark as user override
                    if (import.meta.env.DEV) console.log(`User manually selected ${e.target.value} layout`);
                  }}
                  sx={{ fontSize: '12px' }}
                >
                  {GRAPH_LAYOUTS.map((layout) => (
                    <MenuItem key={layout.value} value={layout.value} sx={{ fontSize: '12px' }}>
                      {layout.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ color: 'black', fontSize: '12px', mb: 1 }}>
                Node Shape
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={nodeShape}
                  onChange={(e) => setNodeShape(e.target.value)}
                  sx={{ fontSize: '12px' }}
                >
                  {NODE_SHAPES.map((shape) => (
                    <MenuItem key={shape.value} value={shape.value} sx={{ fontSize: '12px' }}>
                      {shape.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ color: 'black', fontSize: '12px', mb: 1 }}>
                Link Width: {linkWidth}
              </Typography>
              <Slider
                value={linkWidth}
                onChange={(e, value) => setLinkWidth(value)}
                min={1}
                max={8}
                step={0.5}
                size="small"
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ color: 'black', fontSize: '12px', mb: 1 }}>
                Node Spacing: {nodeSpacing}px
              </Typography>
              <Slider
                value={nodeSpacing}
                onChange={(e, value) => setNodeSpacing(value)}
                min={50}
                max={300}
                step={10}
                size="small"
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={showLabels}
                    onChange={(e) => {
                      setShowLabels(e.target.checked);
                      setUserOverrideLabels(true); // Mark as user override
                      if (import.meta.env.DEV) console.log(`User manually set labels to ${e.target.checked}`);
                    }}
                    size="small"
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography sx={{ color: 'black', fontSize: '12px' }}>
                      Node Labels
                    </Typography>
                    {!userOverrideLabels && graphData?.nodes?.length > 25 && (
                      <Chip 
                        label="Auto" 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                        sx={{ ml: 1, height: 16, fontSize: '10px' }}
                      />
                    )}
                  </Box>
                }
              />
              {userOverrideLabels && (
                <Button
                  size="small"
                  onClick={() => {
                    setUserOverrideLabels(false);
                    if (import.meta.env.DEV) console.log('Reset to automatic label behavior');
                  }}
                  sx={{ fontSize: '10px', minWidth: 'auto', p: 0.5 }}
                >
                  Reset Auto
                </Button>
              )}
            </Box>


            <FormControlLabel
              control={
                <Switch
                  checked={showEdgeLabels}
                  onChange={(e) => setShowEdgeLabels(e.target.checked)}
                  size="small"
                />
              }
              label={<Typography sx={{ color: 'black', fontSize: '12px' }}>Edge Labels</Typography>}
              sx={{ mb: 2 }}
            />

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ color: 'black', fontSize: '12px', mb: 1 }}>
                Background Color
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                {[
                  { color: '#0a0a0a', label: 'Dark' },
                  { color: '#ffffff', label: 'White' },
                  { color: '#1a1a2e', label: 'Navy' },
                  { color: '#16213e', label: 'Blue' },
                  { color: '#0f3460', label: 'Ocean' },
                  { color: '#2d1b69', label: 'Purple' }
                ].map((option) => (
                  <Box
                    key={option.color}
                    onClick={() => setBackgroundColor(option.color)}
                    sx={{
                      width: 30,
                      height: 20,
                      backgroundColor: option.color,
                      border: backgroundColor === option.color ? '2px solid #1976d2' : '1px solid #ccc',
                      borderRadius: 1,
                      cursor: 'pointer',
                      '&:hover': {
                        border: '2px solid #1976d2'
                      }
                    }}
                    title={option.label}
                  />
                ))}
              </Box>
              <TextField
                fullWidth
                size="small"
                label="Custom Color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                placeholder="#ffffff"
                sx={{ 
                  '& .MuiInputBase-input': { 
                    fontSize: '11px' 
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '12px'
                  }
                }}
              />
            </Box>

            <IconButton
              size="small"
              onClick={handleDownloadMenuOpen}
              disabled={!graphData}
              sx={{ 
                alignSelf: 'flex-end',
                mb: 1,
                color: 'text.primary',
                '&:hover': { 
                  backgroundColor: 'action.hover' 
                }
              }}
            >
              <DownloadIcon fontSize="small" />
            </IconButton>
            </Box>
          </Paper>
        )}


        {/* Summary Panel Toggle Button - Left Side (shown when collapsed) */}
        {!overviewPanelOpen && graphData && (
          <IconButton
            onClick={() => setOverviewPanelOpen(true)}
            sx={{
              position: 'absolute',
              top: 380,
              left: 16,
              bgcolor: 'primary.main',
              color: 'white',
              width: 40,
              height: 40,
              zIndex: 1090,
              boxShadow: 3,
              '&:hover': {
                bgcolor: 'primary.dark',
                boxShadow: 6
              }
            }}
          >
            <AssessmentIcon />
          </IconButton>
        )}

        {/* Summary Panel Content - Vertical Design */}
        {overviewPanelOpen && graphData && (
          <Card
            sx={{
              position: 'absolute',
              top: 380,
              left: 16,
              width: 360,
              maxHeight: '60vh',
              overflow: 'hidden',
              bgcolor: 'background.paper',
              boxShadow: 3,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              zIndex: 1090
            }}
          >
            <CardContent sx={{ p: 2 }}>
              {/* Header */}
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AssessmentIcon sx={{ color: 'primary.main', fontSize: '20px' }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    Graph Summary
                  </Typography>
                </Box>
                <IconButton
                  size="small"
                  onClick={() => setOverviewPanelOpen(false)}
                  sx={{ color: 'text.secondary' }}
                >
                  <ChevronRightIcon fontSize="small" />
                </IconButton>
              </Box>

              <Box sx={{ maxHeight: 'calc(60vh - 80px)', overflow: 'auto' }}>
                {(() => {
                  const stats = getGraphStats();
                  return (
                    <>
                      {/* Node Labels Section */}
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1, color: 'text.secondary' }}>
                          Node Labels ({stats.nodeLabels.length})
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {stats.nodeLabels.map((label) => {
                            const sampleNode = graphData?.nodes?.find(node => node.type === label);
                            const nodeColor = sampleNode?.color || getNodeColor(label);
                            const fullLabel = `${label} (${stats.nodeTypeCounts[label]})`;
                            const truncatedLabel = `${truncateLabel(label, 12)} (${stats.nodeTypeCounts[label]})`;

                            return (
                              <Tooltip title={fullLabel} arrow key={label}>
                                <Chip
                                  label={truncatedLabel}
                                  size="small"
                                  clickable
                                  onClick={(event) => handleOpenColorPicker(event, 'node', label)}
                                  sx={{
                                    fontSize: '11px',
                                    cursor: 'pointer',
                                    background: `${nodeColor} !important`,
                                    bgcolor: nodeColor,
                                    color: getContrastColor(nodeColor),
                                    borderColor: nodeColor,
                                    border: `2px solid ${nodeColor}`,
                                    fontWeight: 600,
                                    px: 1,
                                    transition: 'all 0.2s ease',
                                    '& .MuiChip-label': {
                                      px: 1
                                    },
                                    '&:hover': {
                                      opacity: 0.8,
                                      transform: 'translateY(-2px)',
                                      boxShadow: `0 4px 12px ${nodeColor}60`
                                    }
                                  }}
                                />
                              </Tooltip>
                            );
                          })}
                        </Box>
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      {/* Relationship Types Section */}
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1, color: 'text.secondary' }}>
                          Relationship Types ({stats.relationshipTypes.length})
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {stats.relationshipTypes.map((type) => {
                            const sampleLink = graphData?.links?.find(link => link.type === type);
                            const linkColor = sampleLink?.color || getEdgeColor(type);
                            const fullLabel = `${type} (${stats.relationshipTypeCounts[type]})`;
                            const truncatedLabel = `${truncateLabel(type, 12)} (${stats.relationshipTypeCounts[type]})`;

                            return (
                              <Tooltip title={fullLabel} arrow key={type}>
                                <Chip
                                  label={truncatedLabel}
                                  size="small"
                                  clickable
                                  onClick={(event) => handleOpenColorPicker(event, 'edge', type)}
                                  sx={{
                                    fontSize: '10px',
                                    cursor: 'pointer',
                                    background: `${linkColor} !important`,
                                    bgcolor: linkColor,
                                    color: getContrastColor(linkColor),
                                    borderColor: linkColor,
                                    border: `2px solid ${linkColor}`,
                                    fontWeight: 600,
                                    px: 1,
                                    transition: 'all 0.2s ease',
                                    '& .MuiChip-label': {
                                      px: 1
                                    },
                                    '&:hover': {
                                      opacity: 0.8,
                                      transform: 'translateY(-2px)',
                                      boxShadow: `0 4px 12px ${linkColor}60`
                                    }
                                  }}
                                />
                              </Tooltip>
                            );
                          })}
                        </Box>
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      {/* Statistics Section */}
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1, color: 'text.secondary' }}>
                          Statistics
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                              {stats.nodeCount}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              Total Nodes
                            </Typography>
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
                              {stats.linkCount}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              Total Links
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </>
                  );
                })()}
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Compact Filter Panel - Top Left in Graph Space */}
        <Card 
          sx={{ 
            position: 'absolute',
            top: 8,
            left: 8,
            width: 'auto',
            maxWidth: 800, // Increased width to fit all items
            minWidth: 500,
            bgcolor: 'background.paper',
            boxShadow: 3,
            border: '1px solid',
            borderColor: 'primary.main',
            zIndex: 1000,
            borderRadius: 1
          }}
        >
          <CardContent sx={{ p: 1, '&:last-child': { pb: 1.5 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: filterPanelOpen ? 1 : 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <FilterIcon color="primary" fontSize="small" />
                <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 'bold', fontSize: '14px' }}>
                  Filters
                </Typography>
              </Box>
              <IconButton 
                size="small" 
                onClick={() => setFilterPanelOpen(!filterPanelOpen)}
                sx={{ color: 'text.secondary' }}
              >
                {filterPanelOpen ? <ChevronLeftIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />}
              </IconButton>
            </Box>
            
            {filterPanelOpen && (
                <Box>
              <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
                <FormControl size="small" sx={{ minWidth: 80 }}>
                  <InputLabel sx={{ fontSize: '14px' }}>Type</InputLabel>
                  <Select
                    value={entityType}
                    onChange={(e) => setEntityType(e.target.value)}
                    sx={{ fontSize: '11px' }}
                  >
                    {ENTITY_TYPES.map((type) => (
                      <MenuItem key={type.value} value={type.value} sx={{ fontSize: '11px' }}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Autocomplete
                  size="small"
                  options={entityOptions}
                  value={entityValue}
                  //defaultValue="1089663"
                  onChange={handleEntityChange}
                  onInputChange={handleEntityInputChange}
                  inputValue={entityInputValue}
                  loading={entityOptionsLoading}
                  sx={{ minWidth: 300 }}
                  filterOptions={(options) => options} // Disable client-side filtering since we filter server-side
                  freeSolo={true} // Allow typing custom text not in options
                  clearOnBlur={false} // Don't clear on blur
                  selectOnFocus={true} // Select text on focus
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Entity Label"
                      placeholder="Type to search..."
                      sx={{ 
                        '& .MuiInputLabel-root': { fontSize: '14px' },
                        '& .MuiInputBase-input': { fontSize: '11px' }
                      }}
                    />
                  )}
                />

                <Button
                  variant="contained"
                  onClick={handleFetchData}
                  disabled={loading || !entityType}
                  size="small"
                  sx={{ fontSize: '9px', px: 1.5 }}
                >
                  {loading ? 'Loading...' : 'Search'}
                </Button>
              </Box>
              {graphData && (
                  <Alert
                  severity="info"
                  sx= { {
                      p:0.5,
                      fontSize:'10px',
                      '&.MuiAlert-message': {
                          fontSize: '10px',
                          py:0.25
                          },
                      '&.MuiAlert-icon':{
                          fontSize:'14px'
                          }
                      }}
                  >
               <Typography variant="body2" sx={{ fontSize:'12px'}}>
                   Displaying Data of <strong> {entityType} </strong> - {entityValue || entityInputValue || ' '}
                   </Typography>
                  </Alert>
                  )}
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Pagination Panel - Positioned next to filter panel */}
        {graphData && (exploreHistory.length >= 1 || totalNodesCount > 0) && (
          <Card
            sx={{
              position: 'absolute',
              top: 8,
              left: filterPanelOpen ? 520 : 150, // Position next to filter panel
              bgcolor: 'background.paper',
              boxShadow: 3,
              border: '1px solid',
              borderColor: 'secondary.main',
              zIndex: 1000,
              borderRadius: 1
            }}
          >
            <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {/* Mode Toggle Switch */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, borderBottom: '1px solid', borderColor: 'divider', pb: 1 }}>
                  <Chip
                    label="Explore"
                    size="small"
                    color={paginationMode === 'explore' ? 'primary' : 'default'}
                    variant={paginationMode === 'explore' ? 'filled' : 'outlined'}
                    onClick={() => setPaginationMode('explore')}
                    sx={{
                      fontSize: '10px',
                      height: 22,
                      cursor: 'pointer',
                      '&:hover': { opacity: 0.8 }
                    }}
                  />
                  <Chip
                    label="Query"
                    size="small"
                    color={paginationMode === 'query' ? 'secondary' : 'default'}
                    variant={paginationMode === 'query' ? 'filled' : 'outlined'}
                    onClick={() => setPaginationMode('query')}
                    sx={{
                      fontSize: '10px',
                      height: 22,
                      cursor: 'pointer',
                      '&:hover': { opacity: 0.8 }
                    }}
                  />
                </Box>

                {/* Explore History Navigation - shown when mode is 'explore' */}
                {paginationMode === 'explore' && exploreHistory.length > 1 && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '11px', mr: 1 }}>
                      History:
                    </Typography>

                    {/* First Page Button */}
                    <Tooltip title="Go to first page (Initial Search)" placement="top">
                      <span>
                        <IconButton
                          size="small"
                          onClick={handleGoToFirstPage}
                          disabled={currentPage === 0}
                          sx={{
                            p: 0.5,
                            color: currentPage === 0 ? 'text.disabled' : 'primary.main'
                          }}
                        >
                          <FirstPageIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>

                    {/* Previous Page Button */}
                    <Tooltip title="Previous exploration" placement="top">
                      <span>
                        <IconButton
                          size="small"
                          onClick={handleGoToPrevPage}
                          disabled={currentPage === 0}
                          sx={{
                            p: 0.5,
                            color: currentPage === 0 ? 'text.disabled' : 'primary.main'
                          }}
                        >
                          <NavigateBeforeIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>

                    {/* Page Numbers */}
                    <Pagination
                      count={exploreHistory.length}
                      page={currentPage + 1} // MUI Pagination is 1-based
                      onChange={handlePageChange}
                      size="small"
                      siblingCount={1}
                      boundaryCount={1}
                      showFirstButton={false}
                      showLastButton={false}
                      hidePrevButton={true}
                      hideNextButton={true}
                      sx={{
                        '& .MuiPaginationItem-root': {
                          fontSize: '11px',
                          minWidth: 24,
                          height: 24,
                        },
                        '& .Mui-selected': {
                          bgcolor: 'primary.main',
                          color: 'white',
                          '&:hover': {
                            bgcolor: 'primary.dark',
                          }
                        }
                      }}
                    />

                    {/* Next Page Button */}
                    <Tooltip title="Next exploration" placement="top">
                      <span>
                        <IconButton
                          size="small"
                          onClick={handleGoToNextPage}
                          disabled={currentPage === exploreHistory.length - 1}
                          sx={{
                            p: 0.5,
                            color: currentPage === exploreHistory.length - 1 ? 'text.disabled' : 'primary.main'
                          }}
                        >
                          <NavigateNextIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>

                    {/* Last Page Button */}
                    <Tooltip title="Go to last exploration" placement="top">
                      <span>
                        <IconButton
                          size="small"
                          onClick={handleGoToLastPage}
                          disabled={currentPage === exploreHistory.length - 1}
                          sx={{
                            p: 0.5,
                            color: currentPage === exploreHistory.length - 1 ? 'text.disabled' : 'primary.main'
                          }}
                        >
                          <LastPageIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>

                    {/* Current Page Info */}
                    <Tooltip title={exploreHistory[currentPage]?.label || ''} placement="top">
                      <Chip
                        label={`${currentPage + 1} / ${exploreHistory.length}`}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{
                          fontSize: '10px',
                          height: 22,
                          ml: 1
                        }}
                      />
                    </Tooltip>
                  </Box>
                )}

                {/* No explore history message */}
                {paginationMode === 'explore' && exploreHistory.length <= 1 && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '11px', fontStyle: 'italic' }}>
                      No explore history yet. Double-click or explore a node to start.
                    </Typography>
                  </Box>
                )}

                {/* Node Batch Pagination - Fetch More from Backend - shown when mode is 'query' */}
                {paginationMode === 'query' && graphData && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '11px' }}>
                      Nodes:
                    </Typography>

                    {/* Node Count Display */}
                    <Chip
                      label={totalNodesCount > displayedNodesCount
                        ? `1-${displayedNodesCount} of ${totalNodesCount}`
                        : `${displayedNodesCount} nodes`}
                      size="small"
                      color={displayedNodesCount < totalNodesCount ? 'warning' : 'success'}
                      variant="outlined"
                      sx={{
                        fontSize: '10px',
                        height: 22,
                        fontWeight: 'bold'
                      }}
                    />

                    {/* Fetch Next Button */}
                    {displayedNodesCount < totalNodesCount && (
                      <Tooltip title={`Fetch next 50 nodes (${totalNodesCount - displayedNodesCount} remaining)`} placement="top">
                        <IconButton
                          size="small"
                          onClick={handleFetchNextBatch}
                          disabled={loading}
                          sx={{
                            p: 0.5,
                            color: 'secondary.main',
                            bgcolor: 'secondary.light',
                            '&:hover': { bgcolor: 'secondary.main', color: 'white' }
                          }}
                        >
                          <NavigateNextIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}

                    {/* All Loaded Indicator */}
                    {displayedNodesCount >= totalNodesCount && totalNodesCount > displayedNodesCount && (
                      <Chip
                        label="All Loaded"
                        size="small"
                        color="success"
                        sx={{
                          fontSize: '9px',
                          height: 20
                        }}
                      />
                    )}
                  </Box>
                )}

                {/* No query data message */}
                {paginationMode === 'query' && !graphData && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '11px', fontStyle: 'italic' }}>
                      No query results. Search or explore a node first.
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Single Hover Card - Positioned below filter panel */}
        {(hoveredNodeInfo || hoveredLinkInfo) && (
          <Card
            sx={{
              position: 'absolute',
              top: filterPanelOpen ? 260 : 120, // Dynamic positioning based on filter panel state - moved up 50px
              left: 8,
              width: 320, // Slightly wider for better content display
              bgcolor: 'background.paper',
              boxShadow: 6,
              border: '2px solid',
              borderColor: hoveredNodeInfo ? 'info.main' : 'warning.main',
              zIndex: 1001, // Higher than filter panel (1000)
              borderRadius: 2
            }}
          >
            <CardContent sx={{ p: 2 }}>
              {hoveredNodeInfo && (
                <>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '14px', mb: 1, color: 'text.primary' }}>
                    {hoveredNodeInfo.properties.display_name_label || hoveredNodeInfo.name}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '12px', color: 'text.secondary', mb: 1, lineHeight: 1.5 }}>
                    <strong>Type:</strong> {hoveredNodeInfo.type}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '12px', color: 'text.secondary', mb: 1, lineHeight: 1.5 }}>
                    <strong>Category:</strong> {hoveredNodeInfo.category || 'N/A'}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '12px', color: 'text.secondary', lineHeight: 1.5 }}>
                    <strong>Connections:</strong> {getNodeStats(hoveredNodeInfo).totalConnections}
                  </Typography>
                </>
              )}
              {hoveredLinkInfo && (
                <>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '14px', mb: 1, color: 'text.primary' }}>
                    Relationship: {hoveredLinkInfo.type || 'Related'}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '12px', color: 'text.secondary', mb: 1, lineHeight: 1.5 }}>
                    <strong>From:</strong> {hoveredLinkInfo.source?.name || hoveredLinkInfo.source}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '12px', color: 'text.secondary', lineHeight: 1.5 }}>
                    <strong>To:</strong> {hoveredLinkInfo.target?.name || hoveredLinkInfo.target}
                  </Typography>
                 <Typography variant="body2" sx={{ fontSize: '12px', color: 'text.secondary', lineHeight: 1.5 }}>
                  <strong>Date:</strong> {hoveredLinkInfo.properties?.last_modified_date ||
hoveredLinkInfo.properties.creation_date}
                </Typography>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Graph Container */}
        <Paper 
          sx={{ 
            position: 'relative', 
            height: '900px', // Fixed height for better consistency
            minHeight: '700px',
            overflow: 'hidden',
            borderRadius: 2,
            border: '2px solid',
            borderColor: 'divider',
            boxShadow: 4,
            flexGrow: 1,
            bgcolor: 'background.paper'
          }}
        >
          {graphData && (
            <InteractiveForceGraph
              ref={graphRef}
              data={graphData}
              width="100%"
              height="900px"
              nodeSize={nodeSize}
              linkWidth={linkWidth}
              showLabels={showLabels}
              showEdgeLabels={showEdgeLabels}
              backgroundColor={backgroundColor}
              layout={graphLayout}
              nodeShape={nodeShape}
              onNodeClick={handleNodeClick}
              onNodeDoubleClick={handleNodeDoubleClick}
              onNodeRightClick={handleNodeRightClick}
              onNodeHover={handleNodeHover}
              onLinkHover={handleLinkHover}
              onBackgroundClick={handleBackgroundClick}
              onSettingsToggle={() => setControlPanelOpen(!controlPanelOpen)}
              onSummaryToggle={() => setOverviewPanelOpen(!overviewPanelOpen)}
              controlPanelOpen={controlPanelOpen}
              overviewPanelOpen={overviewPanelOpen}
              highlightedNodes={highlightedNodes}
              highlightedLinks={highlightedLinks}
              enableClustering={enableClustering && graphData.nodes.length > 100}
              nodeSpacing={nodeSpacing}
              nodeWithVisibleBorder={nodeWithVisibleBorder}
              nodeActionHandlers={{
                onShowDetails: handleShowNodeDetails,
                onExplore: handleExploreNodeFromIcon,
                onRemove: handleRemoveNodeFromGraph
              }}
              isLoading={loading}
            />
          )}
          
          {!graphData && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                flexDirection: 'column',
                color: 'text.secondary',
                p: 4
              }}
            >
              <GraphIcon sx={{ fontSize: 80, mb: 3, color: 'primary.main' }} />
              <Typography variant="h4" sx={{ mb: 2, textAlign: 'center', fontWeight: 'bold' }}>
                Link Analysis
              </Typography>
              <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
                Select filters and click Search to load graph data
              </Typography>
              <Typography variant="body1" sx={{ textAlign: 'center', maxWidth: 500, color: 'text.secondary' }}>
                Choose an entity type and value from the filters panel above, then click the Search button to visualize network connections and explore entity relationships.
              </Typography>
            </Box>
          )}
        </Paper>



        {/* Color Picker Popover */}
        <Popover
          open={Boolean(colorPickerAnchor)}
          anchorEl={colorPickerAnchor}
          onClose={handleCloseColorPicker}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <Box sx={{ p: 2, width: 250 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>
              {colorPickerType === 'node' ? 'Node' : 'Edge'} Settings: {colorPickerLabel}
            </Typography>
            
            {/* Color Selection */}
            <Typography variant="body2" sx={{ mb: 1, fontSize: '12px' }}>
              Color:
            </Typography>
            <Grid container spacing={1} sx={{ mb: 2 }}>
              {[
                '#ff6b35', '#4a90e2', '#50c878', '#f39c12', 
                '#e74c3c', '#9b59b6', '#2ecc71', '#e67e22',
                '#34495e', '#16a085', '#f1c40f', '#e91e63'
              ].map((color) => (
                <Grid item xs={3} key={color}>
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      bgcolor: color,
                      borderRadius: 1,
                      cursor: 'pointer',
                      border: '2px solid transparent',
                      '&:hover': {
                        border: '2px solid #000'
                      }
                    }}
                    onClick={() => handleColorChange(color)}
                  />
                </Grid>
              ))}
            </Grid>

            {/* Size Control */}
            <Typography variant="body2" sx={{ mb: 1, fontSize: '12px' }}>
              Size:
            </Typography>
            <Slider
              defaultValue={colorPickerType === 'node' ? 6 : 2}
              min={colorPickerType === 'node' ? 4 : 1}
              max={colorPickerType === 'node' ? 20 : 8}
              step={1}
              size="small"
              onChange={(e, value) => handleSizeChange(value)}
            />
          </Box>
        </Popover>

        {/* No Data Modal */}
        <Modal
          open={noDataModalOpen}
          onClose={() => setNoDataModalOpen(false)}
          aria-labelledby="no-data-modal-title"
          aria-describedby="no-data-modal-description"
        >
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid',
            borderColor: 'divider',
            boxShadow: 24,
            p: 4,
            borderRadius: 2
          }}>
            <Typography id="no-data-modal-title" variant="h6" component="h2" sx={{ mb: 2, fontWeight: 'bold', textAlign: 'center' }}>
              {!entityType ? 'Entity Type Required' : (!entityValue && !entityInputValue) ? 'Entity Selection Required' : 'No Data Available'}
            </Typography>
            <Typography id="no-data-modal-description" sx={{ mb: 3, textAlign: 'center', color: 'text.secondary' }}>
              {!entityType 
                ? 'Please select an Entity Type from the dropdown before searching.' 
                : (!entityValue && !entityInputValue)
                ? `Please select or type a ${ENTITY_TYPES.find(type => type.value === entityType)?.label || 'entity'} in the autocomplete field before searching.`
                : 'No graph data was found for the selected entity. Please try a different entity or check your selection.'
              }
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button 
                variant="contained" 
                onClick={() => setNoDataModalOpen(false)}
                sx={{ minWidth: 120 }}
              >
                OK
              </Button>
            </Box>
          </Box>
        </Modal>
        
        {/* Download Menu */}
        <Menu
          anchorEl={downloadMenuAnchor}
          open={Boolean(downloadMenuAnchor)}
          onClose={handleDownloadMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem onClick={handleExportPNGFromMenu} disabled={!graphData}>
            <ListItemIcon>
              <ImageIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText 
              primary="Export PNG" 
              primaryTypographyProps={{ fontSize: '14px' }}
            />
          </MenuItem>
          <MenuItem onClick={handleExportCSV} disabled={!graphData}>
            <ListItemIcon>
              <TableChartIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText 
              primary="Export CSV" 
              primaryTypographyProps={{ fontSize: '14px' }}
            />
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default EnhancedGraphContainer;