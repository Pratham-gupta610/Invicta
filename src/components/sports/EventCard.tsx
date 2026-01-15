import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, User } from 'lucide-react';
import type { Event } from '@/types/types';

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const eventDate = new Date(event.event_date);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const isFullyBooked = event.available_slots === 0;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg">{event.title}</CardTitle>
          <Badge variant={isFullyBooked ? 'destructive' : 'default'}>
            {event.available_slots} / {event.total_slots} slots
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1">
        {event.description && (
          <p className="text-sm text-muted-foreground mb-4">{event.description}</p>
        )}
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{formattedDate} at {event.event_time}</span>
          </div>
          
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{event.location}</span>
          </div>
          
          <div className="flex items-center gap-2 text-muted-foreground">
            {event.registration_type === 'team' ? (
              <>
                <Users className="h-4 w-4" />
                <span>Team Registration {event.team_size ? `(${event.team_size} members)` : ''}</span>
              </>
            ) : (
              <>
                <User className="h-4 w-4" />
                <span>Individual Registration</span>
              </>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Link to={`/register/${event.id}`} className="w-full">
          <Button className="w-full" disabled={isFullyBooked}>
            {isFullyBooked ? 'Fully Booked' : 'Register Now'}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
