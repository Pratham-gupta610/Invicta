import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  getAllEvents, 
  getAllRegistrations, 
  getSports, 
  createEvent, 
  deleteEvent,
  getAllProfiles,
  updateUserRole,
  deleteUser,
  deleteRegistration,
  getRegistrationStats
} from '@/db/api';
import type { Event, Registration, Sport, EventFormData, Profile } from '@/types/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Users, Calendar as CalendarIcon, UserCog, Database, TrendingUp, Search } from 'lucide-react';
import { getUserDisplayName } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminTeamManagement from '@/components/admin/AdminTeamManagement';
import DeleteUserModal from '@/components/admin/DeleteUserModal';

export default function AdminDashboard() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [sports, setSports] = useState<Sport[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [stats, setStats] = useState({
    totalRegistrations: 0,
    totalEvents: 0,
    totalUsers: 0,
    upcomingEvents: 0,
    teamRegistrations: 0,
    individualRegistrations: 0,
  });
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [deleteUserModalOpen, setDeleteUserModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<Profile | null>(null);

  const [formData, setFormData] = useState<EventFormData>({
    sport_id: '',
    title: '',
    description: '',
    registration_type: 'individual',
    team_size: undefined,
  });

  useEffect(() => {
    if (profile?.role !== 'admin') {
      window.location.href = '/';
      return;
    }

    loadData();
  }, [profile]);

  const loadData = async () => {
    try {
      const [eventsData, registrationsData, sportsData, usersData, statsData] = await Promise.all([
        getAllEvents(),
        getAllRegistrations(),
        getSports(),
        getAllProfiles(),
        getRegistrationStats(),
      ]);
      setEvents(eventsData);
      setRegistrations(registrationsData);
      setSports(sportsData);
      setUsers(usersData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.sport_id || !formData.title) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    // Validate team size for team events
    if (formData.registration_type === 'team' && !formData.team_size) {
      toast({
        title: 'Missing Team Size',
        description: 'Please specify the maximum team size for team events',
        variant: 'destructive',
      });
      return;
    }

    try {
      console.log('Creating event with data:', formData);
      await createEvent(formData);
      toast({
        title: 'Success',
        description: 'Event created successfully',
      });
      setDialogOpen(false);
      setFormData({
        sport_id: '',
        title: '',
        description: '',
        registration_type: 'individual',
        team_size: undefined,
      });
      loadData();
    } catch (error: any) {
      console.error('Failed to create event:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create event. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      await deleteEvent(eventId);
      toast({
        title: 'Success',
        description: 'Event deleted successfully',
      });
      loadData();
    } catch (error) {
      console.error('Failed to delete event:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete event',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: 'user' | 'admin') => {
    try {
      await updateUserRole(userId, newRole);
      toast({
        title: 'Success',
        description: 'User role updated successfully',
      });
      loadData();
    } catch (error) {
      console.error('Failed to update user role:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user role',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteUserClick = (user: Profile) => {
    // Prevent deleting yourself
    if (user.id === profile?.id) {
      toast({
        title: 'Cannot Delete',
        description: 'You cannot delete your own account',
        variant: 'destructive',
      });
      return;
    }

    // Warn when deleting admin users
    if (user.role === 'admin') {
      const adminCount = users.filter(u => u.role === 'admin').length;
      if (adminCount <= 1) {
        toast({
          title: 'Cannot Delete',
          description: 'Cannot delete the last admin user',
          variant: 'destructive',
        });
        return;
      }
    }

    setUserToDelete(user);
    setDeleteUserModalOpen(true);
  };

  const handleDeleteUserConfirm = async () => {
    if (!userToDelete) return;

    try {
      const result = await deleteUser(userToDelete.id);
      
      // Remove user from local state with animation
      setUsers(prevUsers => prevUsers.filter(u => u.id !== userToDelete.id));
      
      toast({
        title: 'User Deleted',
        description: `Successfully deleted ${result.deleted_name || result.deleted_email}. Removed ${result.registrations_deleted} registration(s) and ${result.team_memberships_deleted} team membership(s).`,
      });
      
      // Reload stats to update counts
      loadData();
    } catch (error: any) {
      console.error('Failed to delete user:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete user. Please try again.',
        variant: 'destructive',
      });
      throw error; // Re-throw to keep modal open on error
    }
  };

  const handleDeleteRegistration = async (registrationId: string) => {
    if (!confirm('Are you sure you want to delete this registration?')) return;

    try {
      await deleteRegistration(registrationId);
      toast({
        title: 'Success',
        description: 'Registration deleted successfully',
      });
      loadData();
    } catch (error) {
      console.error('Failed to delete registration:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete registration',
        variant: 'destructive',
      });
    }
  };

  const eventRegistrations = selectedEvent
    ? registrations.filter(r => r.event_id === selectedEvent)
    : [];

  // Filter users based on search query
  const filteredUsers = useMemo(() => {
    if (!userSearchQuery.trim()) {
      return users;
    }

    const query = userSearchQuery.toLowerCase();
    return users.filter(user => {
      const displayName = getUserDisplayName(user.full_name, user.email, user.id).toLowerCase();
      const email = (user.email || '').toLowerCase();
      const fullName = (user.full_name || '').toLowerCase();
      
      return displayName.includes(query) || 
             email.includes(query) || 
             fullName.includes(query);
    });
  }, [users, userSearchQuery]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 xl:pt-24 xl:pb-12">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl xl:text-4xl font-bold mb-2 dynamic-header">Admin Dashboard</h1>
            <p className="text-foreground">Manage events and registrations</p>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
                <DialogDescription>Add a new sports event to the platform</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateEvent} className="space-y-4">
                <div className="space-y-2">
                  <Label>Sport *</Label>
                  <Select
                    value={formData.sport_id}
                    onValueChange={(value) => setFormData({ ...formData, sport_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a sport" />
                    </SelectTrigger>
                    <SelectContent>
                      {sports.map((sport) => (
                        <SelectItem key={sport.id} value={sport.id}>
                          {sport.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Event Title *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter event title"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter event description"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Registration Type *</Label>
                  <Select
                    value={formData.registration_type}
                    onValueChange={(value: 'individual' | 'team') =>
                      setFormData({ ...formData, registration_type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">Individual</SelectItem>
                      <SelectItem value="team">Team</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.registration_type === 'team' && (
                  <div className="space-y-2">
                    <Label>Team Size (Max Members) *</Label>
                    <Input
                      type="number"
                      min="1"
                      value={formData.team_size || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          team_size: e.target.value ? parseInt(e.target.value) : undefined,
                        })
                      }
                      placeholder="e.g., 11 for cricket"
                    />
                    <p className="text-xs text-muted-foreground">
                      Maximum number of members allowed per team (including captain)
                    </p>
                  </div>
                )}

                <div className="flex gap-4">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Event</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEvents}</div>
              <p className="text-xs text-muted-foreground">
                {stats.upcomingEvents} upcoming
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRegistrations}</div>
              <p className="text-xs text-muted-foreground">
                {stats.teamRegistrations} team, {stats.individualRegistrations} individual
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                Registered users
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Database</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-muted-foreground">
                Active profiles
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="events" className="space-y-4">
          <TabsList>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="registrations">Registrations</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Filters</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Events</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Sport</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell className="font-medium">{event.title}</TableCell>
                        <TableCell>{event.sport?.name}</TableCell>
                        <TableCell>{new Date(event.event_date).toLocaleDateString()}</TableCell>
                        <TableCell>{event.location}</TableCell>
                        <TableCell>
                          {event.registration_type === 'team' 
                            ? `Team${event.team_size ? ` (${event.team_size} max)` : ''}`
                            : 'Individual'
                          }
                        </TableCell>
                        <TableCell>
                          <Badge>{event.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedEvent(event.id)}
                            >
                              View
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteEvent(event.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="registrations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Registrations</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event</TableHead>
                      <TableHead>Sport</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Team Name</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {registrations.map((registration) => (
                      <TableRow key={registration.id}>
                        <TableCell className="font-medium">
                          {registration.event?.title}
                        </TableCell>
                        <TableCell>{registration.event?.sport?.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{registration.registration_type}</Badge>
                        </TableCell>
                        <TableCell>{registration.team_name || '-'}</TableCell>
                        <TableCell>
                          {new Date(registration.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge>{registration.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteRegistration(registration.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <AdminTeamManagement />
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                  <CardTitle>User Management</CardTitle>
                  <div className="relative w-full xl:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search by name or email..."
                      value={userSearchQuery}
                      onChange={(e) => setUserSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                {userSearchQuery && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Found {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''}
                  </p>
                )}
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          {userSearchQuery ? 'No users found matching your search' : 'No users found'}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow 
                          key={user.id}
                          className="transition-opacity duration-300"
                        >
                          <TableCell className="font-medium">
                            {getUserDisplayName(user.full_name, user.email, user.id)}
                          </TableCell>
                          <TableCell>{user.email || '—'}</TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {user.user_category || '—'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge variant={user.role === 'admin' ? 'default' : 'outline'}>
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(user.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Select
                                value={user.role}
                                onValueChange={(value: 'user' | 'admin') =>
                                  handleUpdateUserRole(user.id, value)
                                }
                                disabled={user.id === profile?.id}
                              >
                                <SelectTrigger className="w-[120px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="user">User</SelectItem>
                                  <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteUserClick(user)}
                                disabled={user.id === profile?.id}
                                className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                title={user.id === profile?.id ? "Cannot delete yourself" : `Delete ${getUserDisplayName(user.full_name, user.email, user.id)}`}
                              >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {selectedEvent && (
          <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Event Registrations</DialogTitle>
                <DialogDescription>
                  View all registrations for this event
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {eventRegistrations.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No registrations yet
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Team Name</TableHead>
                        <TableHead>Members</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {eventRegistrations.map((reg) => (
                        <TableRow key={reg.id}>
                          <TableCell>
                            <Badge variant="outline">{reg.registration_type}</Badge>
                          </TableCell>
                          <TableCell>{reg.team_name || '-'}</TableCell>
                          <TableCell>{reg.team_members?.length || 0}</TableCell>
                          <TableCell>
                            {new Date(reg.created_at).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}

        <DeleteUserModal
          user={userToDelete}
          open={deleteUserModalOpen}
          onOpenChange={setDeleteUserModalOpen}
          onConfirm={handleDeleteUserConfirm}
        />
      </div>
    </div>
  );
}
