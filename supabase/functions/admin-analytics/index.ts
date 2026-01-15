import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser()

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        }
      )
    }

    // Check if user is admin
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 403,
        }
      )
    }

    // Get registration statistics
    const { data: stats, error: statsError } = await supabaseClient
      .rpc('get_registration_stats')

    if (statsError) {
      throw statsError
    }

    // Get registrations by sport
    const { data: sportStats, error: sportStatsError } = await supabaseClient
      .from('registrations')
      .select(`
        event_id,
        events!inner(
          sport_id,
          sports!inner(name)
        )
      `)
      .eq('status', 'confirmed')

    if (sportStatsError) {
      throw sportStatsError
    }

    // Aggregate by sport
    const sportCounts: Record<string, number> = {}
    sportStats?.forEach((reg: any) => {
      const sportName = reg.events.sports.name
      sportCounts[sportName] = (sportCounts[sportName] || 0) + 1
    })

    // Get recent registrations
    const { data: recentRegistrations, error: recentError } = await supabaseClient
      .from('registrations')
      .select(`
        id,
        created_at,
        registration_type,
        team_name,
        profiles!inner(username),
        events!inner(title)
      `)
      .order('created_at', { ascending: false })
      .limit(10)

    if (recentError) {
      throw recentError
    }

    // Get upcoming events with registration counts
    const { data: upcomingEvents, error: eventsError } = await supabaseClient
      .from('events')
      .select(`
        id,
        title,
        event_date,
        total_slots,
        available_slots,
        sports!inner(name)
      `)
      .eq('status', 'upcoming')
      .order('event_date', { ascending: true })
      .limit(5)

    if (eventsError) {
      throw eventsError
    }

    // Calculate registration trends (last 7 days)
    const { data: trendData, error: trendError } = await supabaseClient
      .from('registrations')
      .select('created_at')
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .eq('status', 'confirmed')

    if (trendError) {
      throw trendError
    }

    // Group by date
    const dailyCounts: Record<string, number> = {}
    trendData?.forEach((reg: any) => {
      const date = new Date(reg.created_at).toISOString().split('T')[0]
      dailyCounts[date] = (dailyCounts[date] || 0) + 1
    })

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          overview: stats[0],
          sport_distribution: sportCounts,
          recent_registrations: recentRegistrations,
          upcoming_events: upcomingEvents,
          registration_trend: dailyCounts,
        },
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Analytics error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
