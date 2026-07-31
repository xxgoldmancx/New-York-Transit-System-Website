import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';

import { AppLayout } from '@/components/layout/AppLayout';
import { AuthGuard, AdminGuard } from '@/components/auth/AuthGuard';

// Pages
import { Login } from '@/pages/Login';
import { Dashboard } from '@/pages/Dashboard';
import { Members } from '@/pages/Members';
import { Warnings } from '@/pages/Warnings';
import { Bans } from '@/pages/Bans';
import { Roles } from '@/pages/Roles';
import { Channels } from '@/pages/Channels';
import { Announcements } from '@/pages/Announcements';
import { BotSettings } from '@/pages/Settings';
import { Profile } from '@/pages/Profile';
import { Leaderboard } from '@/pages/Leaderboard';
import { Tickets } from '@/pages/Tickets';
import { TicketDetail } from '@/pages/TicketDetail';
import { AdminUsers } from '@/pages/AdminUsers';

const queryClient = new QueryClient();

function ProtectedRoutes() {
  return (
    <AuthGuard>
      <AppLayout>
        <Switch>
          {/* Admin Routes */}
          <Route path="/">
            <AdminGuard><Dashboard /></AdminGuard>
          </Route>
          <Route path="/members">
            <AdminGuard><Members /></AdminGuard>
          </Route>
          <Route path="/warnings">
            <AdminGuard><Warnings /></AdminGuard>
          </Route>
          <Route path="/bans">
            <AdminGuard><Bans /></AdminGuard>
          </Route>
          <Route path="/roles">
            <AdminGuard><Roles /></AdminGuard>
          </Route>
          <Route path="/channels">
            <AdminGuard><Channels /></AdminGuard>
          </Route>
          <Route path="/announcements">
            <AdminGuard><Announcements /></AdminGuard>
          </Route>
          <Route path="/settings">
            <AdminGuard><BotSettings /></AdminGuard>
          </Route>
          <Route path="/admin/users">
            <AdminGuard><AdminUsers /></AdminGuard>
          </Route>

          {/* Shared Routes */}
          <Route path="/profile" component={Profile} />
          <Route path="/leaderboard" component={Leaderboard} />
          <Route path="/tickets" component={Tickets} />
          <Route path="/tickets/:id" component={TicketDetail} />
          
          <Route component={NotFound} />
        </Switch>
      </AppLayout>
    </AuthGuard>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Switch>
            <Route path="/login" component={Login} />
            <Route component={ProtectedRoutes} />
          </Switch>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
