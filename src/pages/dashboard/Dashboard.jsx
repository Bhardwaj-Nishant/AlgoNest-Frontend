import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from '../../api/axios';
import { 
  Bell, Sparkles, TrendingUp, Activity, CalendarDays, ShieldCheck, 
  Loader2, AlertCircle, ChevronLeft, ChevronRight, 
  Trophy, GitFork, Users, Clock, ExternalLink 
} from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [aggregatedStats, setAggregatedStats] = useState({
    totalSolved: 0,
    rating: null,
    maxStreak: 0,
    totalContests: 0,
    totalRepos: 0,
    totalContributions: 0,
    activeDays: 0,
    platforms: [],
    lastSynced: null,
  });
  const [heatmapData, setHeatmapData] = useState({});
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1. Fetch user info
        let userData = null;
        try {
          const userRes = await api.get('/api/user/me');
          userData = userRes.data;
          setUser(userData);
        } catch (userErr) {
          console.warn('Failed to fetch user info:', userErr.message);
        }

        // 2. Fetch latest stats
        const statsRes = await api.get('/api/stats/latest');
        const snapshots = statsRes.data;

        // Aggregate stats and collect heatmap data
        let totalSolved = 0;
        let maxRating = null;
        let maxStreak = 0;
        let totalContests = 0;
        let totalRepos = 0;
        let totalContributions = 0;
        let totalActiveDays = 0;
        const platforms = [];
        const heatmapAgg = {};
        let latestSync = null;

        for (const snapshot of snapshots) {
          totalSolved += snapshot.totalSolved || 0;
          const rating = snapshot.rating;
          if (rating != null && (maxRating === null || rating > maxRating)) {
            maxRating = rating;
          }
          maxStreak = Math.max(maxStreak, snapshot.maxStreakLifetime || 0);
          totalContests += snapshot.contestGiven || 0;
          totalRepos += snapshot.totalRepos || 0;
          totalContributions += snapshot.totalContributions || 0;
          totalActiveDays += snapshot.activeDays || 0;

          // Track latest sync time
          if (snapshot.syncedAt && (!latestSync || new Date(snapshot.syncedAt) > new Date(latestSync))) {
            latestSync = snapshot.syncedAt;
          }

          platforms.push({
            platform: snapshot.platform,
            handle: snapshot.handle,
            solved: snapshot.totalSolved || 0,
            rating: snapshot.rating,
            streak: snapshot.maxStreakLifetime || 0,
            lastSynced: snapshot.syncedAt || snapshot.created_at || null,
          });

          // Collect heatmap data (aggregate counts per day across all platforms)
          if (snapshot.heatmapData && snapshot.heatmapData.length > 0) {
            for (const day of snapshot.heatmapData) {
              const date = day.date;
              if (!heatmapAgg[date]) heatmapAgg[date] = 0;
              heatmapAgg[date] += day.count;
            }
          }
        }

        setAggregatedStats({
          totalSolved,
          rating: maxRating,
          maxStreak,
          totalContests,
          totalRepos,
          totalContributions,
          activeDays: totalActiveDays,
          platforms,
          lastSynced: latestSync,
        });
        setHeatmapData(heatmapAgg);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        let message = 'Failed to load dashboard data.';
        if (err.response) {
          if (err.response.status === 401) {
            message = 'Your session has expired. Please log in again.';
          } else if (err.response.status === 404) {
            message = 'Required endpoint not found. Please ensure the backend is running.';
          } else {
            message = err.response.data?.message || message;
          }
        } else if (err.request) {
          message = 'Network error. Please check your connection.';
        }
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // ---- Calendar Widget Helpers ----
  const formatNumber = (num) => {
    if (num == null) return '—';
    return num.toLocaleString();
  };

  const getColor = (count) => {
    if (count === 0) return "bg-gray-50 hover:bg-gray-100";
    if (count <= 1) return "bg-yellow-100 hover:bg-yellow-200";
    if (count <= 2) return "bg-orange-200 hover:bg-orange-300";
    if (count <= 3) return "bg-red-200 hover:bg-red-300";
    return "bg-red-500 hover:bg-red-600 text-white";
  };

  const buildCalendarGrid = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startOffset = (firstDayOfMonth.getDay() + 6) % 7;

    const days = [];
    for (let i = 0; i < startOffset; i++) {
      days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const count = heatmapData[dateStr] || 0;
      days.push({ day, date: dateStr, count });
    }
    return days;
  };

  const daysInGrid = buildCalendarGrid();

  const goToday = () => setCurrentMonth(new Date());
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const formatTimestamp = (iso) => {
    if (!iso) return 'Never';
    const diff = Date.now() - new Date(iso).getTime();
    if (diff < 60_000) return 'Just now';
    if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
    if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
    const days = Math.floor(diff / 86_400_000);
    if (days <= 30) return `${days} day${days === 1 ? '' : 's'} ago`;
    return new Date(iso).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 p-6 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#485E73]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-100 p-6 flex items-center justify-center">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 max-w-md">
          <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-3" />
          <h2 className="text-xl font-semibold text-slate-900 text-center">Something went wrong</h2>
          <p className="text-slate-600 text-center mt-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 w-full rounded-2xl bg-[#485E73] px-4 py-2 text-white hover:bg-[#3b4d60] transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Guest';
  const hasHandles = aggregatedStats.platforms.length > 0;

  return (
    <section className="min-h-screen bg-slate-100 p-6 lg:p-10">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-[#485E73]/80">
            Dashboard
          </p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">
            Welcome, {displayName}
          </h1>
          <p className="mt-2 max-w-xl text-slate-600">
            Track Your Coding Progress, Review Performance Metrics, Active Streaks, and Upcoming Contests in one Place.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate('/profiles')}
            className="inline-flex items-center gap-2 rounded-2xl bg-[#485E73] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#3b4d60]"
          >
            <Bell size={18} />
            Connect Platforms
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-5 xl:grid-cols-3">
        <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Current Rating</p>
              <h2 className="mt-3 text-4xl font-bold text-slate-900">
                {hasHandles ? formatNumber(aggregatedStats.rating) : '—'}
              </h2>
            </div>
            <div className="rounded-3xl bg-[#E8F2F4] p-3 text-[#485E73]">
              <TrendingUp size={28} />
            </div>
          </div>
          <p className="mt-5 text-sm text-slate-500">
            {hasHandles
              ? `Highest rating across ${aggregatedStats.platforms.length} platform${aggregatedStats.platforms.length > 1 ? 's' : ''}.`
              : 'Connect a platform to see your rating.'}
          </p>
        </div>

        <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Solved Problems</p>
              <h2 className="mt-3 text-4xl font-bold text-slate-900">
                {formatNumber(aggregatedStats.totalSolved)}
              </h2>
            </div>
            <div className="rounded-3xl bg-[#FFF3E8] p-3 text-[#F97316]">
              <Activity size={28} />
            </div>
          </div>
          <p className="mt-5 text-sm text-slate-500">
            {hasHandles
              ? `Total problems solved across all connected platforms.`
              : 'Connect a platform to track your solved problems.'}
          </p>
        </div>

        <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Current Streak</p>
              <h2 className="mt-3 text-4xl font-bold text-slate-900">
                {hasHandles ? `${aggregatedStats.maxStreak} days` : '—'}
              </h2>
            </div>
            <div className="rounded-3xl bg-[#FEE2E2] p-3 text-[#EF4444]">
              <Sparkles size={28} />
            </div>
          </div>
          <p className="mt-5 text-sm text-slate-500">
            {hasHandles
              ? `Best streak across all your connected accounts.`
              : 'Connect a platform to track your streak.'}
          </p>
        </div>
      </div>

      {/* Additional Stats & Calendar Widget */}
      {hasHandles && (
        <div className="mt-8 grid gap-6 xl:grid-cols-2">
          <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Platforms</h2>
                <p className="mt-2 text-sm text-slate-500">You have {aggregatedStats.platforms.length} platform{aggregatedStats.platforms.length > 1 ? 's' : ''} connected.</p>
              </div>
              <ShieldCheck size={24} className="text-[#485E73]" />
            </div>

            <div className="mt-6 space-y-3">
              {aggregatedStats.platforms.map((p, idx) => (
                <div key={idx} className="rounded-2xl bg-[#F8FAFC] p-4 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-slate-900 capitalize">{p.platform}</p>
                    <p className="text-sm text-slate-500">@{p.handle}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-700">
                      {p.solved} {p.platform === "github" ? "repos" : "solved"}
                    </p>
                    {p.rating && (
                      <p className="text-xs text-slate-500">
                        Rating: {formatNumber(p.rating)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Calendar Widget */}
          <div 
            className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate('/calender')}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Activity Calendar</h2>
                <p className="mt-2 text-sm text-slate-500">Click to view full calendar</p>
              </div>
              <CalendarDays size={24} className="text-[#485E73]" />
            </div>

            {/* Calendar header with navigation */}
            <div className="flex items-center justify-between mt-4">
              <button 
                className="p-1 hover:bg-slate-100 rounded-lg transition" 
                onClick={(e) => { e.stopPropagation(); prevMonth(); }}
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-sm font-medium text-slate-700">
                {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </span>
              <button 
                className="p-1 hover:bg-slate-100 rounded-lg transition" 
                onClick={(e) => { e.stopPropagation(); nextMonth(); }}
              >
                <ChevronRight size={18} />
              </button>
              <button 
                className="p-1 text-xs text-[#485E73] hover:underline"
                onClick={(e) => { e.stopPropagation(); goToday(); }}
              >
                Today
              </button>
            </div>

            {/* Calendar grid */}
            <div className="mt-3">
              <div className="grid grid-cols-7 gap-1 text-center text-xs text-slate-500">
                {DAYS_OF_WEEK.map((d) => (
                  <div key={d} className="py-1">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1 mt-1">
                {daysInGrid.map((day, idx) => {
                  if (day === null) {
                    return <div key={`empty-${idx}`} className="aspect-square" />;
                  }
                  const isToday = day.date === new Date().toISOString().split('T')[0];
                  const colorClass = getColor(day.count);
                  return (
                    <div
                      key={day.date}
                      className={`relative aspect-square rounded-sm ${colorClass} transition-colors ${isToday ? "ring-1 ring-[#485E73] ring-offset-1" : ""}`}
                    >
                      <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-slate-700">
                        {day.day}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---- NEW BOTTOM SECTION ---- */}
      {hasHandles && (
        <div className="mt-8 space-y-6">
          {/* Quick Stats Row */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-4xl border border-slate-200 bg-white p-5 shadow-sm flex items-center gap-4">
              <div className="rounded-full bg-[#E8F2F4] p-3 text-[#485E73]">
                <Trophy size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Contests</p>
                <h3 className="text-2xl font-bold text-slate-900">{formatNumber(aggregatedStats.totalContests)}</h3>
              </div>
            </div>
            <div className="rounded-4xl border border-slate-200 bg-white p-5 shadow-sm flex items-center gap-4">
              <div className="rounded-full bg-[#FFF3E8] p-3 text-[#F97316]">
                <GitFork size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Repos</p>
                <h3 className="text-2xl font-bold text-slate-900">{formatNumber(aggregatedStats.totalRepos)}</h3>
              </div>
            </div>
            <div className="rounded-4xl border border-slate-200 bg-white p-5 shadow-sm flex items-center gap-4">
              <div className="rounded-full bg-[#FEE2E2] p-3 text-[#EF4444]">
                <Users size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Contributions</p>
                <h3 className="text-2xl font-bold text-slate-900">{formatNumber(aggregatedStats.totalContributions)}</h3>
              </div>
            </div>
            <div className="rounded-4xl border border-slate-200 bg-white p-5 shadow-sm flex items-center gap-4">
              <div className="rounded-full bg-[#E8F2F4] p-3 text-[#485E73]">
                <Clock size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Active Days</p>
                <h3 className="text-2xl font-bold text-slate-900">{formatNumber(aggregatedStats.activeDays)}</h3>
              </div>
            </div>
          </div>

          {/* Recent Activity & Last Sync */}
          <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                <Clock size={22} className="text-[#485E73]" />
                Recent Activity
              </h2>
              <span className="text-xs text-slate-400">
                Last updated: {formatTimestamp(aggregatedStats.lastSynced)}
              </span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {aggregatedStats.platforms.slice(0, 6).map((p, idx) => (
                <div key={idx} className="flex items-center justify-between border-b border-slate-100 pb-2 last:border-0">
                  <div>
                    <p className="font-medium text-slate-800 capitalize">{p.platform}</p>
                    <p className="text-xs text-slate-500">@{p.handle}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-700">{p.solved} solved</p>
                    <p className="text-xs text-slate-400">{formatTimestamp(p.lastSynced)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <button
                onClick={() => navigate('/analytics')}
                className="text-sm text-[#485E73] hover:underline inline-flex items-center gap-1"
              >
                View full analytics <ExternalLink size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer / Call to action if no platforms */}
      {!hasHandles && (
        <div className="mt-8 rounded-4xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">Get started</h2>
          <p className="mt-2 text-slate-600">Connect your first coding platform to see your stats.</p>
          <button
            onClick={() => navigate('/profiles')}
            className="mt-4 rounded-2xl bg-[#485E73] px-6 py-2 text-white hover:bg-[#3b4d60] transition"
          >
            Connect Platform
          </button>
        </div>
      )}

      {/* Subtle footer */}
      <div className="mt-10 text-center text-xs text-slate-400 border-t border-slate-200 pt-6">
        <p>AlgoNest Dashboard &bull; All stats are updated in real-time &bull; <span className="hover:underline cursor-pointer" onClick={() => navigate('/settings')}>Settings</span></p>
      </div>
    </section>
  );
}

export default Dashboard;