import { useEffect, useState } from 'react';
import { supabase } from '@/db/supabase';
import type { Sport } from '@/types/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Download, Search, ArrowUpDown, Loader2, FileSpreadsheet } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface RegistrationData {
  id: string;
  user_id: string;
  username: string;
  email: string;
  phone: string;
  sport_name: string;
  sport_id: string;
  event_name: string;
  event_id: string;
  team_name: string | null;
  registration_type: string;
  status: string;
  created_at: string;
}

interface SportStats {
  [key: string]: {
    count: number;
    sport_id: string;
  };
}

export default function RegistrationManagement() {
  const { toast } = useToast();
  const [registrations, setRegistrations] = useState<RegistrationData[]>([]);
  const [sports, setSports] = useState<Sport[]>([]);
  const [sportStats, setSportStats] = useState<SportStats>({});
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  
  // Filters and sorting
  const [selectedSport, setSelectedSport] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'sport' | 'date'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    loadSports();
  }, []);

  useEffect(() => {
    loadRegistrations();
  }, [selectedSport, searchQuery, sortBy, sortOrder, page]);

  const loadSports = async () => {
    try {
      const { data, error } = await supabase
        .from('sports')
        .select('*')
        .order('name');

      if (error) throw error;
      setSports(data || []);
    } catch (error) {
      console.error('Failed to load sports:', error);
      toast({
        title: 'Error',
        description: 'Failed to load sports',
        variant: 'destructive',
      });
    }
  };

  const loadRegistrations = async () => {
    setLoading(true);
    try {
      // CRITICAL FIX: Sanitize inputs FIRST
      const sanitizedSearch = searchQuery?.trim() || '';
      const sanitizedSport = selectedSport?.trim() || '';

      console.log('Loading registrations with filters:', {
        sport: sanitizedSport,
        search: sanitizedSearch,
        sortBy,
        sortOrder,
        page
      });

      // Build query with proper joins
      let query = supabase
        .from('registrations')
        .select(`
          id,
          created_at,
          registration_type,
          team_name,
          status,
          user_id,
          event_id,
          profiles!inner(
            id,
            username,
            email,
            phone
          ),
          events!inner(
            id,
            title,
            sport_id,
            sports!inner(
              id,
              name
            )
          )
        `, { count: 'exact' })
        .eq('status', 'confirmed');

      // CRITICAL FIX: Apply .eq() filters FIRST (AND conditions)
      // Sport filter MUST be applied before OR conditions
      if (sanitizedSport) {
        console.log('Applying sport filter:', sanitizedSport);
        query = query.eq('events.sport_id', sanitizedSport);
      }

      // CRITICAL FIX: Apply .or() filters LAST (OR conditions)
      // Search filter applied AFTER all AND conditions
      if (sanitizedSearch) {
        console.log('Applying search filter:', sanitizedSearch);
        // Escape special characters for ILIKE
        const escapedSearch = sanitizedSearch.replace(/[%_]/g, '\\$&');
        query = query.or(`profiles.email.ilike.%${escapedSearch}%,profiles.username.ilike.%${escapedSearch}%,team_name.ilike.%${escapedSearch}%`);
      }

      // Sorting
      if (sortBy === 'name') {
        query = query.order('profiles.username', { ascending: sortOrder === 'asc' });
      } else if (sortBy === 'date') {
        query = query.order('created_at', { ascending: sortOrder === 'asc' });
      } else {
        query = query.order('created_at', { ascending: sortOrder === 'asc' });
      }

      // Pagination
      const offset = (page - 1) * 50;
      query = query.range(offset, offset + 49);

      const { data: registrations, error, count } = await query;

      if (error) {
        console.error('Query error:', {
          error,
          message: error.message,
          details: error.details,
          hint: error.hint,
          filters: { sport: sanitizedSport, search: sanitizedSearch }
        });
        
        // User-friendly error message
        toast({
          title: 'Unable to Apply Filters',
          description: 'Please reset filters and try again.',
          variant: 'destructive',
        });
        
        // Reset to safe state
        setRegistrations([]);
        setTotalPages(1);
        setTotalCount(0);
        setLoading(false);
        return;
      }

      console.log('Query successful:', {
        resultCount: registrations?.length || 0,
        totalCount: count
      });

      // Transform data for frontend
      const transformedData = registrations?.map((reg: any) => ({
        id: reg.id,
        user_id: reg.profiles.id,
        username: reg.profiles.username,
        email: reg.profiles.email,
        phone: reg.profiles.phone,
        sport_name: reg.events.sports.name,
        sport_id: reg.events.sport_id,
        event_name: reg.events.title,
        event_id: reg.events.id,
        team_name: reg.team_name,
        registration_type: reg.registration_type,
        status: reg.status,
        created_at: reg.created_at,
      })) || [];

      setRegistrations(transformedData);
      setTotalPages(Math.ceil((count || 0) / 50));
      setTotalCount(count || 0);

      // Get sport-wise counts
      const { data: allRegistrations } = await supabase
        .from('registrations')
        .select(`
          event_id,
          events!inner(
            sport_id,
            sports!inner(id, name)
          )
        `)
        .eq('status', 'confirmed');

      const sportStatsTemp: SportStats = {};
      allRegistrations?.forEach((reg: any) => {
        const sportName = reg.events.sports.name;
        const sportId = reg.events.sports.id;
        if (!sportStatsTemp[sportName]) {
          sportStatsTemp[sportName] = { count: 0, sport_id: sportId };
        }
        sportStatsTemp[sportName].count++;
      });

      setSportStats(sportStatsTemp);
    } catch (error: any) {
      console.error('Failed to load registrations:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to load registrations',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format: 'csv' | 'xlsx' = 'csv') => {
    setExporting(true);
    try {
      // Build query to fetch all registrations (no pagination for export)
      let query = supabase
        .from('registrations')
        .select(`
          id,
          created_at,
          registration_type,
          team_name,
          status,
          profiles!inner(
            id,
            username,
            email,
            phone
          ),
          events!inner(
            id,
            title,
            sport_id,
            sports!inner(
              id,
              name
            )
          )
        `)
        .eq('status', 'confirmed')
        .order('created_at', { ascending: false });

      // Filter by sport if provided
      if (selectedSport) {
        query = query.eq('events.sport_id', selectedSport);
      }

      const { data: registrations, error } = await query;

      if (error) {
        console.error('Query error:', error);
        throw error;
      }

      if (!registrations || registrations.length === 0) {
        throw new Error('No data to export');
      }

      // Generate CSV
      const csvHeader = 'User ID,Username,Email,Phone,Sport,Event,Team,Registration Type,Status,Registration Date\n';
      
      const csvRows = registrations.map((reg: any) => {
        const row = [
          reg.profiles.id,
          reg.profiles.username || '',
          reg.profiles.email || '',
          reg.profiles.phone || '',
          reg.events.sports.name,
          reg.events.title,
          reg.team_name || '',
          reg.registration_type,
          reg.status,
          new Date(reg.created_at).toISOString(),
        ];
        // Escape commas and quotes
        return row.map(field => {
          const str = String(field);
          if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`;
          }
          return str;
        }).join(',');
      }).join('\n');

      const csv = csvHeader + csvRows;

      const sportName = selectedSport ? getSportName(selectedSport) : 'All';
      const filename = `registrations_${sportName}_${new Date().toISOString().split('T')[0]}.csv`;

      // Download file
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: 'Success',
        description: `Exported ${registrations.length} registrations successfully`,
      });
    } catch (error: any) {
      console.error('Export failed:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to export data',
        variant: 'destructive',
      });
    } finally {
      setExporting(false);
    }
  };

  const toggleSort = (column: 'name' | 'sport' | 'date') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
    setPage(1); // Reset to first page
  };

  const getSportName = (sportId: string) => {
    return sports.find(s => s.id === sportId)?.name || 'All Sports';
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold dynamic-header">Registration Management</h2>
          <p className="text-muted-foreground">
            Filter, sort, and export registrations
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => handleExport('csv')}
            disabled={exporting || registrations.length === 0}
            variant="outline"
          >
            {exporting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            Export CSV
          </Button>
          <Button
            onClick={() => handleExport('xlsx')}
            disabled={exporting || registrations.length === 0}
          >
            {exporting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <FileSpreadsheet className="h-4 w-4 mr-2" />
            )}
            Export Excel
          </Button>
        </div>
      </div>

      {/* Sport Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(sportStats).map(([sportName, data]) => (
          <Card key={sportName}>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{data.count}</div>
              <p className="text-sm text-muted-foreground">{sportName}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Sport Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Sport</label>
              <Select
                value={selectedSport || 'all'}
                onValueChange={(value) => {
                  setSelectedSport(value === 'all' ? '' : value);
                  setPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Sports" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sports</SelectItem>
                  {sports.map((sport) => (
                    <SelectItem key={sport.id} value={sport.id}>
                      {sport.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by email, username, or team name..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(1);
                  }}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {registrations.length} of {totalCount} registrations
          {selectedSport && ` for ${getSportName(selectedSport)}`}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1 || loading}
          >
            Previous
          </Button>
          <span className="flex items-center px-3 text-sm">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages || loading}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Registration Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : registrations.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No registrations found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User ID</TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSort('name')}
                        className="hover:bg-transparent"
                      >
                        Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSort('sport')}
                        className="hover:bg-transparent"
                      >
                        Sport
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Team</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSort('date')}
                        className="hover:bg-transparent"
                      >
                        Date
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registrations.map((reg) => (
                    <TableRow key={reg.id}>
                      <TableCell className="font-mono text-xs">
                        {reg.user_id.slice(0, 8)}...
                      </TableCell>
                      <TableCell className="font-medium">{reg.username}</TableCell>
                      <TableCell>{reg.email}</TableCell>
                      <TableCell>{reg.phone || '-'}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{reg.sport_name}</Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {reg.event_name}
                      </TableCell>
                      <TableCell>{reg.team_name || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={reg.registration_type === 'team' ? 'default' : 'outline'}>
                          {reg.registration_type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(reg.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
