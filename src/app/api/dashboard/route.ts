/**
 * Rectoverso OS - Dashboard API Route
 * Dashboard stats and overview data
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { withAuth } from '../_lib/auth-middleware'
import { apiResponse } from '../_lib/response'
import { handleApiError } from '../_lib/error-handler'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

function getSupabase() {
  return createClient(supabaseUrl, supabaseServiceKey)
}

// ============================================
// GET /api/dashboard
// ============================================

export async function GET(request: NextRequest) {
  try {
    const authResult = await withAuth()(request)
    if (!authResult.allowed) {
      return authResult.response!
    }

    const supabase = getSupabase()

    // Get today's date ranges
    const today = new Date().toISOString().split('T')[0]
    const weekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    // Parallel queries for dashboard data
    const [
      campaignsResult,
      tasksResult,
      issuesResult,
      schedulesResult,
      teamResult,
    ] = await Promise.all([
      // Active campaigns
      supabase
        .from('campaigns')
        .select('*')
        .in('status', ['running', 'setup', 'problem']),

      // Today's tasks
      supabase
        .from('tasks')
        .select(`
          *,
          campaign:campaigns(id, name),
          owner:users(id, full_name)
        `)
        .lte('due_date', today)
        .neq('status', 'done'),

      // Open issues
      supabase
        .from('campaign_issues')
        .select(`
          *,
          campaign:campaigns(id, name),
          assigned_user:users!assigned_to(full_name)
        `)
        .not('status', 'in', '(resolved,closed)'),

      // Today's schedules
      supabase
        .from('team_schedules')
        .select(`
          *,
          campaign:campaigns(id, name)
        `)
        .gte('start_datetime', today)
        .lte('start_datetime', `${today}T23:59:59`),

      // Team workload
      supabase
        .from('users')
        .select(`
          id,
          full_name,
          role,
          tasks:tasks(count)
        `)
        .eq('is_active', true),
    ])

    const campaigns = campaignsResult.data || []
    const tasks = tasksResult.data || []
    const issues = issuesResult.data || []
    const schedules = schedulesResult.data || []
    const users = teamResult.data || []

    // Calculate stats
    const activeCampaigns = campaigns.filter((c: { status: string }) => c.status === 'running')
    const problemCampaigns = campaigns.filter((c: { health_status: string; status: string }) =>
      c.health_status === 'red' || c.status === 'problem'
    )
    const urgentTasks = tasks.filter((t: { priority: string }) =>
      t.priority === 'urgent' || t.priority === 'high'
    )
    const criticalIssues = issues.filter((i: { severity: string }) => i.severity === 'critical')

    // Get invoices for finance summary
    const { data: invoices } = await supabase
      .from('invoices')
      .select('amount, status')
      .neq('status', 'paid')

    const outstandingAmount = invoices?.reduce((sum: number, inv: { amount: number; status: string }) => {
      if (inv.status !== 'paid' && inv.status !== 'disputed') {
        return sum + inv.amount
      }
      return sum
    }, 0) || 0

    // Calculate total budget
    const totalBudget = activeCampaigns.reduce((sum: number, c: { budget: number }) => sum + c.budget, 0)

    // Group tasks by user for workload
    const workloadByUser = users.map((user: { id: string; full_name: string; role: string }) => {
      const userTasks = tasks.filter((t: { owner_id: string }) => t.owner_id === user.id)
      const urgent = userTasks.filter((t: { priority: string }) =>
        t.priority === 'urgent' || t.priority === 'high'
      ).length

      return {
        id: user.id,
        name: user.full_name,
        role: user.role,
        totalTasks: userTasks.length,
        urgentTasks: urgent,
      }
    })

    const dashboardData = {
      stats: {
        activeCampaigns: activeCampaigns.length,
        runningCampaigns: activeCampaigns.filter((c: { status: string }) => c.status === 'running').length,
        problemCampaigns: problemCampaigns.length,
        todayTasks: tasks.length,
        urgentTasks: urgentTasks.length,
        openIssues: issues.length,
        criticalIssues: criticalIssues.length,
        todaySchedules: schedules.length,
        totalBudget,
        outstandingAmount,
      },
      campaigns: activeCampaigns.map((c: {
        id: string; name: string; status: string; health_status: string;
        kpi_type: string; kpi_target: number; kpi_current: number; budget: number;
        next_action: string; next_action_due: string;
      }) => ({
        id: c.id,
        name: c.name,
        status: c.status,
        health: c.health_status,
        kpi: {
          type: c.kpi_type,
          target: c.kpi_target,
          current: c.kpi_current,
          progress: c.kpi_target > 0 ? Math.round((c.kpi_current / c.kpi_target) * 100) : 0,
        },
        budget: c.budget,
        nextAction: c.next_action,
        nextActionDue: c.next_action_due,
      })),
      todayTasks: tasks.map((t: {
        id: string; title: string; status: string; priority: string;
        due_date: string; due_time: string; estimated_hours: number;
      }) => ({
        id: t.id,
        title: t.title,
        status: t.status,
        priority: t.priority,
        dueDate: t.due_date,
        dueTime: t.due_time,
        estimatedHours: t.estimated_hours,
        campaign: t.campaign,
        owner: t.owner,
      })),
      issues: issues.map((i: {
        id: string; title: string; severity: string; status: string;
        due_date: string; campaign: { name: string }; assigned_user: { full_name: string };
      }) => ({
        id: i.id,
        title: i.title,
        severity: i.severity,
        status: i.status,
        dueDate: i.due_date,
        campaign: i.campaign?.name,
        assignedTo: i.assigned_user?.full_name,
      })),
      schedules: schedules.map((s: {
        id: string; title: string; type: string; start_datetime: string;
        end_datetime: string; location_type: string; meeting_link: string; color: string;
      }) => ({
        id: s.id,
        title: s.title,
        type: s.type,
        startTime: s.start_datetime,
        endTime: s.end_datetime,
        locationType: s.location_type,
        meetingLink: s.meeting_link,
        color: s.color,
      })),
      workload: workloadByUser,
    }

    return apiResponse().success(dashboardData)
  } catch (error) {
    const { status, code, message, details } = handleApiError(error)
    return Response.json({ status: 'error', error: { code, message, details } }, { status })
  }
}
