import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Loadable from '../layouts/full/shared/loadable/Loadable';

/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));

/* ****Pages***** */
const Error = Loadable(lazy(() => import('../views/authentication/Error')));
const Register = Loadable(lazy(() => import('../views/authentication/Register')));
const Login = Loadable(lazy(() => import('../views/authentication/Login')));

// Landing Page
const LandingPage = Loadable(lazy(() => import("../views/landing/LandingPage")))

// NewsRoom / Insights
const NewsHomePage = Loadable(lazy(() => import("../views/newsRoom/NewsHomePage")))
const IntelligenceBriefings = Loadable(lazy(() => import("../views/newsRoom/IntelligenceBriefings")))

// Timeline and Networks - Event Timeline with Map
const EventTimeline = Loadable(lazy(() => import('../views/icons/mapandevent')))
const GraphDemo = Loadable(lazy(() => import('../views/graph/GraphDemo')))

const Router = [
  // Landing page - public, no auth required
  {
    path: '/',
    element: <BlankLayout />,
    children: [
      { index: true, element: <LandingPage /> },
    ],
  },
  // Auth routes - public
  {
    path: '/auth',
    element: <BlankLayout />,
    children: [
      { path: '404', element: <Error /> },
      { path: 'register', element: <Register /> },
      { path: 'login', element: <Login /> },
    ],
  },
  // Protected routes - require authentication
  {
    element: <FullLayout />,
    children: [
      // Insights Section
      { path: '/NewsRoom', element: <NewsHomePage /> },
      { path: '/intelligenceBriefings', element: <IntelligenceBriefings /> },

      // Timeline and Networks Section
      { path: '/map-and-timeline', element: <EventTimeline /> },
      { path: '/graph-demo', element: <GraphDemo /> },
    ],
  },
  // Catch-all for 404
  {
    path: '*',
    element: <Navigate to="/auth/404" />,
  },
];

export default Router;
