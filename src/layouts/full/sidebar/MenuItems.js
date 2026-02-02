import {
  IconArticle,
  IconReportAnalytics,
  IconMapPin,
  IconChartBubble,
} from '@tabler/icons-react';

// Native implementation to replace lodash uniqueId - reduces bundle size
let idCounter = 0;
const uniqueId = (prefix = 'id_') => `${prefix}${++idCounter}`;

const Menuitems = [
  {
    navlabel: true,
    subheader: 'Insights',
  },
  {
    id: uniqueId(),
    title: 'News Updates',
    icon: IconArticle,
    href: '/NewsRoom',
  },
  {
    id: uniqueId(),
    title: 'Intelligence Briefings',
    icon: IconReportAnalytics,
    href: '/intelligenceBriefings',
  },
  {
    navlabel: true,
    subheader: 'Timeline and Networks',
  },
  {
    id: uniqueId(),
    title: 'Event Timeline',
    icon: IconMapPin,
    href: '/map-and-timeline',
  },
  {
    id: uniqueId(),
    title: 'Link Analysis',
    icon: IconChartBubble,
    href: '/graph-demo',
  },
];

export default Menuitems;
