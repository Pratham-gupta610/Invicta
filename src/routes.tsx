import Home from './pages/Home';
import SportDetail from './pages/SportDetail';
import Registration from './pages/Registration';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import JoinTeam from './pages/JoinTeam';
import TeamDetails from './pages/TeamDetails';
import ClearAuth from './pages/ClearAuth';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Home',
    path: '/',
    element: <Home />,
  },
  {
    name: 'Sport Detail',
    path: '/sports/:slug',
    element: <SportDetail />,
  },
  {
    name: 'Registration',
    path: '/register/:eventId',
    element: <Registration />,
  },
  {
    name: 'My Events',
    path: '/dashboard',
    element: <UserDashboard />,
  },
  {
    name: 'Admin',
    path: '/admin',
    element: <AdminDashboard />,
  },
  {
    name: 'Login',
    path: '/login',
    element: <Login />,
  },
  {
    name: 'Join Team',
    path: '/join-team/:inviteCode',
    element: <JoinTeam />,
  },
  {
    name: 'Team Details',
    path: '/team/:registrationId',
    element: <TeamDetails />,
  },
  {
    name: 'About Us',
    path: '/about-us',
    element: <AboutUs />,
  },
  {
    name: 'Contact',
    path: '/contact',
    element: <Contact />,
  },
  {
    name: 'Clear Auth',
    path: '/clear-auth',
    element: <ClearAuth />,
  },
  {
    name: 'Not Found',
    path: '*',
    element: <NotFound />,
  },
];

export default routes;
