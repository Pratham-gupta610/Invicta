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

    // Parse query parameters
    const url = new URL(req.url)
    const sportId = url.searchParams.get('sport_id')
    const sortBy = url.searchParams.get('sort_by') || 'created_at'
    const sortOrder = url.searchParams.get('sort_order') || 'desc'
    const search = url.searchParams.get('search') || ''
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '50')
    const offset = (page - 1) * limit

    // Build query
    let query = supabaseClient
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

    // Filter by sport
    if (sportId) {
      query = query.eq('events.sport_id', sportId)
    }

    // Search by email or username
    if (search) {
      query = query.or(`profiles.email.ilike.%${search}%,profiles.username.ilike.%${search}%`)
    }

    // Sorting
    const sortColumn = sortBy === 'name' ? 'profiles.username' : 
                       sortBy === 'sport' ? 'events.sports.name' :
                       sortBy === 'date' ? 'created_at' :
                       'created_at'

    query = query.order(sortColumn, { ascending: sortOrder === 'asc' })

    // Pagination
    query = query.range(offset, offset + limit - 1)

    const { data: registrations, error, count } = await query

    if (error) {
      console.error('Query error:', error)
      return new Response(
        JSON.stringify({ error: error.message }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      )
    }

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
    })) || []

    // Get sport-wise counts
    const { data: sportCounts } = await supabaseClient
      .from('registrations')
      .select(`
        event_id,
        events!inner(
          sport_id,
          sports!inner(id, name)
        )
      `)
      .eq('status', 'confirmed')

    const sportStats: Record<string, { count: number; sport_id: string }> = {}
    sportCounts?.forEach((reg: any) => {
      const sportName = reg.events.sports.name
      const sportId = reg.events.sports.id
      if (!sportStats[sportName]) {
        sportStats[sportName] = { count: 0, sport_id: sportId }
      }
      sportStats[sportName].count++
    })

    return new Response(
      JSON.stringify({
        success: true,
        data: transformedData,
        pagination: {
          page,
          limit,
          total: count || 0,
          total_pages: Math.ceil((count || 0) / limit),
        },
        sport_stats: sportStats,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
