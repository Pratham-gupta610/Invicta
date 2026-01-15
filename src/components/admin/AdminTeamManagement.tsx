import { useEffect, useState } from 'react';
import { getSports, getEventsBySport, getTeamsByEvent, exportEventData } from '@/db/api';
import type { Sport, Event } from '@/types/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Download, FileSpreadsheet, Loader2, Users, Eye, Trophy } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import TeamDetailsModal from './TeamDetailsModal';

interface TeamData {
  id: string;
  team_name: string;
  registration_type: string;
  team_size: number;
  leader_username: string;
  leader_id: string;
  leader_mobile_number: string;
  sport_name: string;
  event_name: string;
  created_at: string;
}

export default function AdminTeamManagement() {
  const { toast } = useToast();
  
  // State for SPORT → EVENT → TEAM → MEMBERS flow
  const [sports, setSports] = useState<Sport[]>([]);
  const [selectedSport, setSelectedSport] = useState<string>('');
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string>('');
  const [teams, setTeams] = useState<TeamData[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [teamModalOpen, setTeamModalOpen] = useState(false);
  
  // Loading states
  const [loadingSports, setLoadingSports] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Load sports on mount
  useEffect(() => {
    loadSports();
  }, []);

  // Load events when sport changes
  useEffect(() => {
    if (selectedSport) {
      loadEvents();
    } else {
      // Reset when sport is cleared
      setEvents([]);
      setSelectedEvent('');
      setTeams([]);
    }
  }, [selectedSport]);

  // Load teams when event changes
  useEffect(() => {
    if (selectedEvent) {
      loadTeams();
    } else {
      // Reset when event is cleared
      setTeams([]);
    }
  }, [selectedEvent]);

  const loadSports = async () => {
    setLoadingSports(true);
    try {
      const data = await getSports();
      setSports(data);
    } catch (error) {
      console.error('Failed to load sports:', error);
      toast({
        title: 'Error',
        description: 'Failed to load sports',
        variant: 'destructive',
      });
    } finally {
      setLoadingSports(false);
    }
  };

  const loadEvents = async () => {
    if (!selectedSport) return;

    setLoadingEvents(true);
    try {
      console.log('Loading events for sport:', selectedSport);
      const data = await getEventsBySport(selectedSport);
      setEvents(data);
      console.log('Loaded events:', data.length);
    } catch (error) {
      console.error('Failed to load events:', error);
      toast({
        title: 'Error',
        description: 'Failed to load events',
        variant: 'destructive',
      });
    } finally {
      setLoadingEvents(false);
    }
  };

  const loadTeams = async () => {
    if (!selectedEvent) return;

    setLoadingTeams(true);
    try {
      console.log('Loading teams for event:', selectedEvent);
      const data = await getTeamsByEvent(selectedEvent);
      setTeams(data);
      console.log('Loaded teams:', data.length);
    } catch (error) {
      console.error('Failed to load teams:', error);
      toast({
        title: 'Error',
        description: 'Failed to load teams',
        variant: 'destructive',
      });
    } finally {
      setLoadingTeams(false);
    }
  };

  const handleSportChange = (sportId: string) => {
    console.log('Sport changed:', sportId);
    setSelectedSport(sportId);
    // Reset downstream selections
    setSelectedEvent('');
    setTeams([]);
  };

  const handleEventChange = (eventId: string) => {
    console.log('Event changed:', eventId);
    setSelectedEvent(eventId);
    // Reset downstream selections
    setTeams([]);
  };

  const handleViewTeam = (teamId: string) => {
    console.log('Viewing team:', teamId);
    setSelectedTeamId(teamId);
    setTeamModalOpen(true);
  };

  const handleExport = async (format: 'csv' | 'excel') => {
    if (!selectedEvent) {
      toast({
        title: 'No Event Selected',
        description: 'Please select an event to export data',
        variant: 'destructive',
      });
      return;
    }

    setExporting(true);
    try {
      console.log('Exporting event data:', { eventId: selectedEvent, format });
      const { data, eventName, sportName } = await exportEventData(selectedEvent, format);

      if (data.length === 0) {
        toast({
          title: 'No Data',
          description: 'No registrations found for this event',
          variant: 'destructive',
        });
        return;
      }

      // Convert to CSV or Excel
      if (format === 'csv') {
        exportToCSV(data, `${sportName}_${eventName}_registrations.csv`);
      } else {
        exportToExcel(data, `${sportName}_${eventName}_registrations.xlsx`);
      }

      toast({
        title: 'Success',
        description: `Exported ${data.length} records successfully`,
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: 'Export Failed',
        description: 'Failed to export data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setExporting(false);
    }
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;

    // Get headers
    const headers = Object.keys(data[0]);
    
    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header] || '';
          // Escape commas and quotes
          return `"${String(value).replace(/"/g, '""')}"`;
        }).join(',')
      )
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  const exportToExcel = (data: any[], filename: string) => {
    // For now, export as CSV with .xlsx extension
    // In production, use a library like xlsx or exceljs
    exportToCSV(data, filename);
    
    toast({
      title: 'Note',
      description: 'Excel export is currently in CSV format. Install xlsx library for true Excel format.',
    });
  };

  // Check if export buttons should be visible
  const showExportButtons = selectedSport && selectedEvent;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Management
          </CardTitle>
          <CardDescription>
            Follow the hierarchy: SPORT → EVENT → TEAM → MEMBERS
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* STEP 1: Sport Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Step 1: Select Sport
            </label>
            <Select
              value={selectedSport}
              onValueChange={handleSportChange}
              disabled={loadingSports}
            >
              <SelectTrigger>
                <SelectValue placeholder={loadingSports ? 'Loading sports...' : 'Select a sport'} />
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

          {/* STEP 2: Event Selection */}
          {selectedSport && (
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Step 2: Select Event
              </label>
              <Select
                value={selectedEvent}
                onValueChange={handleEventChange}
                disabled={loadingEvents || events.length === 0}
              >
                <SelectTrigger>
                  <SelectValue 
                    placeholder={
                      loadingEvents 
                        ? 'Loading events...' 
                        : events.length === 0 
                        ? 'No events available for this sport'
                        : 'Select an event'
                    } 
                  />
                </SelectTrigger>
                <SelectContent>
                  {events.map((event) => (
                    <SelectItem key={event.id} value={event.id}>
                      {event.title} - {new Date(event.event_date).toLocaleDateString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Export Buttons - ONLY visible when sport AND event selected */}
          {showExportButtons && (
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('csv')}
                disabled={exporting || loadingTeams}
              >
                {exporting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                Export CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('excel')}
                disabled={exporting || loadingTeams}
              >
                {exporting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                )}
                Export Excel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* STEP 3: Teams Table */}
      {selectedEvent && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Registered Teams
            </CardTitle>
            <CardDescription>
              Click on any team to view members
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingTeams ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : teams.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No teams registered for this event</p>
                <p className="text-sm">Teams will appear here once users register</p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Team Name</TableHead>
                      <TableHead>Leader Name</TableHead>
                      <TableHead>Leader Contact</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Registered</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teams.map((team) => (
                      <TableRow
                        key={team.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleViewTeam(team.id)}
                      >
                        <TableCell className="font-medium">
                          {team.team_name}
                        </TableCell>
                        <TableCell>{team.leader_username}</TableCell>
                        <TableCell className="font-mono text-sm">
                          {team.leader_mobile_number}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {team.registration_type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {team.team_size} {team.team_size === 1 ? 'member' : 'members'}
                        </TableCell>
                        <TableCell>
                          {new Date(team.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewTeam(team.id);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Team
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Empty State - No Event Selected */}
      {selectedSport && !selectedEvent && !loadingEvents && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">Select an event to view teams</p>
            <p className="text-sm">Choose an event from the dropdown above</p>
          </CardContent>
        </Card>
      )}

      {/* STEP 4: Team Details Modal */}
      <TeamDetailsModal
        teamId={selectedTeamId}
        open={teamModalOpen}
        onOpenChange={setTeamModalOpen}
      />
    </div>
  );
}
