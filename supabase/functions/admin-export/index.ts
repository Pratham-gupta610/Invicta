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
    const format = url.searchParams.get('format') || 'csv' // csv or xlsx

    // Build query to fetch all registrations (no pagination for export)
    let query = supabaseClient
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
      .order('created_at', { ascending: false })

    // Filter by sport if provided
    if (sportId) {
      query = query.eq('events.sport_id', sportId)
    }

    const { data: registrations, error } = await query

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

    if (!registrations || registrations.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No data to export' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404,
        }
      )
    }

    // Log export action
    await supabaseClient
      .from('audit_log')
      .insert({
        table_name: 'registrations',
        record_id: user.id,
        action: 'create',
        new_data: {
          action: 'export',
          sport_id: sportId,
          format: format,
          count: registrations.length,
        },
        user_id: user.id,
      })

    // Generate CSV (lightweight, fast for large datasets)
    if (format === 'csv') {
      const csvHeader = 'User ID,Username,Email,Phone,Sport,Event,Team,Registration Type,Status,Registration Date\n'
      
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
        ]
        // Escape commas and quotes
        return row.map(field => {
          const str = String(field)
          if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`
          }
          return str
        }).join(',')
      }).join('\n')

      const csv = csvHeader + csvRows

      const sportName = registrations[0]?.events?.sports?.name || 'All'
      const filename = `registrations_${sportName}_${new Date().toISOString().split('T')[0]}.csv`

      return new Response(csv, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${filename}"`,
        },
        status: 200,
      })
    }

    // Generate Excel-like format (TSV for simplicity, compatible with Excel)
    if (format === 'xlsx' || format === 'excel') {
      // For true XLSX, we'd need a library like exceljs
      // For now, use TSV which Excel can open
      const tsvHeader = 'User ID\tUsername\tEmail\tPhone\tSport\tEvent\tTeam\tRegistration Type\tStatus\tRegistration Date\n'
      
      const tsvRows = registrations.map((reg: any) => {
        return [
          reg.profiles.id,
          reg.profiles.username || '',
          reg.profiles.email || '',
          reg.profiles.phone || '',
          reg.events.sports.name,
          reg.events.title,
          reg.team_name || '',
          reg.registration_type,
          reg.status,
          new Date(reg.created_at).toLocaleString(),
        ].join('\t')
      }).join('\n')

      const tsv = tsvHeader + tsvRows

      const sportName = registrations[0]?.events?.sports?.name || 'All'
      const filename = `registrations_${sportName}_${new Date().toISOString().split('T')[0]}.xls`

      return new Response(tsv, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/vnd.ms-excel',
          'Content-Disposition': `attachment; filename="${filename}"`,
        },
        status: 200,
      })
    }

    // Default to JSON
    return new Response(
      JSON.stringify({
        success: true,
        data: registrations.map((reg: any) => ({
          user_id: reg.profiles.id,
          username: reg.profiles.username,
          email: reg.profiles.email,
          phone: reg.profiles.phone,
          sport: reg.events.sports.name,
          event: reg.events.title,
          team: reg.team_name,
          registration_type: reg.registration_type,
          status: reg.status,
          created_at: reg.created_at,
        })),
        count: registrations.length,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Export error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
