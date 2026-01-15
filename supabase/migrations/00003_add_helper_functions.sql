-- Create function to decrement event slots
CREATE OR REPLACE FUNCTION decrement_event_slots(event_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE events
  SET available_slots = GREATEST(available_slots - 1, 0),
      updated_at = NOW()
  WHERE id = event_id;
END;
$$;
