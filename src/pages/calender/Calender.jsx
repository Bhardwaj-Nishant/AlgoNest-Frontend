import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import api from "../../api/axios";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Color scale: 0 → light gray, 1 → yellow, 2 → orange, 3 → red, 4+ → dark red
const getColor = (count) => {
  if (count === 0) return "bg-gray-50 hover:bg-gray-100";
  if (count === 1) return "bg-yellow-100 hover:bg-yellow-200";
  if (count === 2) return "bg-orange-200 hover:bg-orange-300";
  if (count === 3) return "bg-red-200 hover:bg-red-300";
  return "bg-red-500 hover:bg-red-600 text-white";
};

export default function Calendar() {
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState(null);
  const [heatmapData, setHeatmapData] = useState({});
  const [platforms, setPlatforms] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [hoveredCell, setHoveredCell] = useState(null);

  const fetchHeatmap = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/api/stats/latest");
      const snapshots = response.data;

      console.log("📊 Raw snapshots:", snapshots); // DEBUG

      // If snapshots is not an array or empty, set platforms to empty and continue
      if (!Array.isArray(snapshots) || snapshots.length === 0) {
        setPlatforms([]);
        setHeatmapData({});
        setLoading(false);
        return;
      }

      // Extract platform names (filter out null/undefined)
      const platformNames = snapshots
        .map(s => s.platform)
        .filter(p => p != null && p !== "");
      setPlatforms(platformNames);

      // Aggregate heatmap data
      const aggregated = {};
      for (const snapshot of snapshots) {
        const platform = snapshot.platform;
        if (!platform) continue;
        const heatmap = snapshot.heatmapData || [];
        for (const day of heatmap) {
          const date = day.date;
          if (!aggregated[date]) {
            aggregated[date] = { platforms: [], count: 0 };
          }
          if (day.count > 0 && !aggregated[date].platforms.includes(platform)) {
            aggregated[date].platforms.push(platform);
            aggregated[date].count += 1;
          }
        }
      }
      console.log("📊 Aggregated heatmap:", aggregated); // DEBUG
      setHeatmapData(aggregated);
    } catch (err) {
      console.error("Failed to fetch heatmap:", err);
      setError(err.response?.data?.message || "Failed to load calendar data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeatmap();
  }, []);

  // Manual sync
  const handleSync = async () => {
    setSyncing(true);
    try {
      await api.post("/api/sync/all");
      // Wait a moment then refetch
      setTimeout(fetchHeatmap, 3000);
    } catch (err) {
      console.error("Sync failed:", err);
      setError("Sync failed. Please try again.");
      setSyncing(false);
    }
  };

  // Navigation
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  const goToday = () => setCurrentDate(new Date());

  // Build calendar grid
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDayOffset = (firstDayOfMonth.getDay() + 6) % 7;

  const days = [];
  for (let i = 0; i < startDayOffset; i++) days.push(null);
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const entry = heatmapData[dateStr];
    const count = entry ? entry.count : 0;
    const platformList = entry ? entry.platforms : [];
    days.push({ day, date: dateStr, count, platforms: platformList });
  }

  const handleMouseEnter = (e, date, platformList) => {
    if (!platformList || platformList.length === 0) {
      setHoveredCell(null);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    setHoveredCell({
      date,
      platforms: platformList,
      x: rect.left + rect.width / 2,
      y: rect.bottom + 8,
    });
  };

  const handleMouseLeave = () => {
    setHoveredCell(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#485E73]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center py-12">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 max-w-md">
          <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-3" />
          <p className="text-slate-600 text-center">{error}</p>
          <button
            onClick={fetchHeatmap}
            className="mt-4 w-full rounded-2xl bg-[#485E73] px-4 py-2 text-white hover:bg-[#3b4d60] transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const totalPlatforms = platforms.length;
  const hasHeatmapData = Object.keys(heatmapData).length > 0;
  const currentMonthDaysWithSubmissions = Object.entries(heatmapData).filter(
    ([date, entry]) => {
      const [y, m] = date.split("-").map(Number);

      return (
        y === year &&
        m === month + 1 &&
        entry.count > 0
      );
    }
  ).length;

  // CASE: No platforms connected
  if (totalPlatforms === 0) {
    return (
      <div className="bg-white rounded-4xl border border-slate-200 p-6 shadow-sm mt-10 ml-10 mr-10">
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">No Platforms Connected</h2>
          <p className="text-slate-500">Connect your coding platforms to see your activity calendar.</p>
          <button
            onClick={() => window.location.href = '/profiles'}
            className="mt-4 rounded-2xl bg-[#485E73] px-6 py-2 text-white hover:bg-[#3b4d60] transition"
          >
            Go to Profiles
          </button>
        </div>
      </div>
    );
  }

  // CASE: Platforms connected but NO heatmap data yet (sync needed)
  if (!hasHeatmapData) {
    return (
      <div className="bg-white rounded-4xl border border-slate-200 p-6 shadow-sm">
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">No Activity Data Yet</h2>
          <p className="text-slate-500">
            We haven't synced your activity yet. Click the button below to fetch your data.
          </p>
          <button
            onClick={handleSync}
            disabled={syncing}
            className="mt-4 rounded-2xl bg-[#485E73] px-6 py-2 text-white hover:bg-[#3b4d60] transition disabled:opacity-50"
          >
            {syncing ? <Loader2 className="inline h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="inline h-4 w-4 mr-2" />}
            {syncing ? 'Syncing...' : 'Sync Now'}
          </button>
        </div>
      </div>
    );
  }

  // Normal calendar view
  return (
    <div className="bg-white rounded-4xl border border-slate-200 p-6 shadow-sm relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-slate-900">Activity Calendar</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={prevMonth}
            className="rounded-lg p-2 hover:bg-slate-100 transition"
            aria-label="Previous month"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-sm font-medium text-slate-700 min-w-[120px] text-center">
            {MONTHS[month]} {year}
          </span>
          <button
            onClick={nextMonth}
            className="rounded-lg p-2 hover:bg-slate-100 transition"
            aria-label="Next month"
          >
            <ChevronRight size={20} />
          </button>
          <button
            onClick={goToday}
            className="rounded-lg bg-[#485E73] px-3 py-1 text-sm text-white hover:bg-[#3b4d60] transition"
          >
            Today
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-4 text-xs text-slate-500 flex-wrap">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-4 h-4 rounded bg-gray-50 border border-slate-200" />
          <div className="w-4 h-4 rounded bg-yellow-100 border border-slate-200" />
          <div className="w-4 h-4 rounded bg-orange-200 border border-slate-200" />
          <div className="w-4 h-4 rounded bg-red-200 border border-slate-200" />
          <div className="w-4 h-4 rounded bg-red-500 border border-slate-200" />
        </div>
        <span>More</span>
        <span className="ml-4 text-slate-400">(platforms with submissions)</span>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-2 text-center text-xs font-medium text-slate-500">
        {DAYS_OF_WEEK.map((d) => (
          <div key={d} className="py-1">{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 overflow-visible">
        {days.map((day, idx) => {
          if (day === null) {
            return <div key={`empty-${idx}`} className="aspect-square" />;
          }
          const { day: dayNum, date, count, platforms: platformList } = day;
          const isToday = date === todayStr;
          const colorClass = getColor(count);
          const hasSubmissions = count > 0;

          return (
            <div
              key={date}
              className={`relative aspect-square rounded-md ${colorClass} transition-colors duration-200 ${isToday ? "ring-2 ring-[#485E73] ring-offset-2" : ""} ${hasSubmissions ? "cursor-pointer" : ""}`}
              onMouseEnter={(e) => handleMouseEnter(e, date, platformList)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-slate-700">
                {dayNum}
              </div>
            </div>
          );
        })}
      </div>

      {/* Tooltip */}
      {hoveredCell && (
        <div
          className="fixed z-50 bg-slate-800 text-white text-xs rounded-lg px-3 py-2 min-w-[160px] text-center shadow-lg pointer-events-none"
          style={{
            left: hoveredCell.x,
            top: hoveredCell.y,
            transform: 'translateX(-50%)',
          }}
        >
          <div className="font-semibold">{hoveredCell.date}</div>
          <div className="mt-1 text-slate-300 text-[10px]">
            {hoveredCell.platforms.length} platform{hoveredCell.platforms.length !== 1 ? "s" : ""}:
          </div>
          <div className="mt-1 flex flex-wrap justify-center gap-1">
            {hoveredCell.platforms.map((p) => (
              <span key={p} className="bg-slate-700 px-1.5 py-0.5 rounded text-[10px] capitalize">
                {p}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Summary footer */}
      <div className="mt-6 text-xs text-slate-500 border-t border-slate-100 pt-4 flex justify-between">
        <span>
          <span
            className={`font-semibold ${
              currentMonthDaysWithSubmissions === 0
                ? "text-red-600"
                : "text-green-800"
            }`}
          >
            {currentMonthDaysWithSubmissions}
          </span>{" "}
          days with submissions
        </span>

        <span>
          <span
            className={`font-semibold ${
              totalPlatforms === 0
                ? "text-red-600"
                : "text-green-800"
            }`}
          >
            {totalPlatforms}
          </span>{" "}
          platform{totalPlatforms !== 1 ? "s" : ""} connected
        </span>
      </div>
    </div>
  );
}