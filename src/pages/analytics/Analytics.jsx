import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Award, 
  Target, 
  Calendar, 
  Loader2,
  AlertCircle,
  CheckCircle,
  Activity,
  Layers,
  Zap,
  BookOpen,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import {
  PieChart as RePieChart,
  Pie,
  Cell,
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import api from "../../api/axios";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function Analytics() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [platformData, setPlatformData] = useState([]);
  const [topicData, setTopicData] = useState([]);
  const [expandedPlatform, setExpandedPlatform] = useState(null);
  const [expandedTopic, setExpandedTopic] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get("/api/stats/latest");
        const snapshots = response.data;

        if (!snapshots || snapshots.length === 0) {
          setError("No platform data found. Connect some platforms first.");
          setLoading(false);
          return;
        }

        setStats(snapshots);

        // Aggregate per-platform data
        const platforms = snapshots.map(s => {
          // Compute active days from heatmap if available
          let activeDays = s.activeDays || 0;
          if (s.heatmapData && s.heatmapData.length > 0) {
            activeDays = s.heatmapData.filter(day => day.count > 0).length;
          }
          return {
            platform: s.platform,
            handle: s.handle,
            solved: s.totalSolved || 0,
            rating: s.rating || "—",
            contests: s.contestGiven || 0,
            streak: s.maxStreakLifetime || 0,
            activeDays: activeDays,
            difficulty: s.difficultyCounts || {},
            accuracy: s.acceptanceRate,
            beats: s.beatsPercentage || [],
            totalQuestionBeats: s.totalQuestionBeatsPercentage,
            solvedQuestionsByCategory: s.solvedQuestionsByCategory || {},
            totalRepos: s.totalRepos || 0,
            totalContributions: s.totalContributions || 0,
            stars: typeof s.rating === 'string' && s.rating.includes('★') ? s.rating : null,
          };
        });
        setPlatformData(platforms);

        // Extract topic efficiency from LeetCode skill breakdown
        const leetcodeData = snapshots.find(s => s.platform === "leetcode");
        if (leetcodeData && leetcodeData.skillBreakdown) {
          const topics = [];
          const breakdown = leetcodeData.skillBreakdown;
          for (const [level, items] of Object.entries(breakdown)) {
            for (const item of items) {
              topics.push({
                topic: item.tag_name,
                solved: item.problems_solved,
                level: level,
              });
            }
          }
          topics.sort((a, b) => b.solved - a.solved);
          setTopicData(topics);
        } else {
          setTopicData([]);
        }

      } catch (err) {
        console.error("Failed to fetch analytics:", err);
        setError(err.response?.data?.message || "Failed to load analytics data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getAggregatedStats = () => {
    if (!platformData || platformData.length === 0) return null;
    const totalSolved = platformData.reduce((sum, p) => sum + p.solved, 0);
    const totalContests = platformData.reduce((sum, p) => sum + (p.contests || 0), 0);
    const maxStreak = Math.max(...platformData.map(p => p.streak || 0));
    const totalActiveDays = platformData.reduce((sum, p) => sum + p.activeDays, 0);
    const highestRating = Math.max(...platformData.map(p => {
      const val = typeof p.rating === 'number' ? p.rating : 0;
      return val;
    }));

    const difficultyAgg = {};
    for (const p of platformData) {
      if (p.difficulty && typeof p.difficulty === 'object') {
        for (const [key, val] of Object.entries(p.difficulty)) {
          difficultyAgg[key] = (difficultyAgg[key] || 0) + val;
        }
      }
    }

    return {
      totalSolved,
      totalContests,
      maxStreak,
      totalActiveDays,
      highestRating,
      difficultyAgg,
      platformCount: platformData.length,
    };
  };

  const aggregated = getAggregatedStats();

  const difficultyChartData = aggregated?.difficultyAgg
    ? Object.entries(aggregated.difficultyAgg).map(([name, value]) => ({ name, value }))
    : [];

  const platformChartData = platformData.map(p => ({
    name: p.platform,
    solved: p.solved,
    rating: typeof p.rating === 'number' ? p.rating : 0,
  }));

  const topicChartData = topicData.slice(0, 15).map(t => ({
    name: t.topic,
    solved: t.solved,
  }));

  const togglePlatform = (idx) => {
    setExpandedPlatform(expandedPlatform === idx ? null : idx);
  };

  const toggleTopic = (idx) => {
    setExpandedTopic(expandedTopic === idx ? null : idx);
  };

  const getSortedCategories = (platform, questionsByCategory) => {
    const entries = Object.entries(questionsByCategory || {});
    if (!platform || platform.toLowerCase() !== 'gfg') return entries;

    const orderMap = { basic: 0, easy: 1, medium: 2, hard: 3 };
    return entries.sort(([categoryA], [categoryB]) => {
      const rankA = orderMap[categoryA?.toLowerCase()] ?? 99;
      const rankB = orderMap[categoryB?.toLowerCase()] ?? 99;
      return rankA - rankB || categoryA.localeCompare(categoryB);
    });
  };

  // Combine categories for "Solved Questions by Topic (All Platforms)"
  const getCombinedCategories = () => {
    const combined = {};
    for (const p of platformData) {
      const categories = p.solvedQuestionsByCategory || {};
      for (const [category, questions] of Object.entries(categories)) {
        if (!combined[category]) {
          combined[category] = [];
        }
        for (const q of questions) {
          if (!combined[category].includes(q)) {
            combined[category].push(q);
          }
        }
      }
    }
    const order = { basic: 0, easy: 1, medium: 2, hard: 3 };
    const sorted = Object.entries(combined).sort((a, b) => {
      const rankA = order[a[0].toLowerCase()] ?? 99;
      const rankB = order[b[0].toLowerCase()] ?? 99;
      return rankA - rankB;
    });
    return sorted;
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
            onClick={() => window.location.reload()}
            className="mt-4 w-full rounded-2xl bg-[#485E73] px-4 py-2 text-white hover:bg-[#3b4d60] transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!aggregated) {
    return (
      <div className="flex justify-center py-12">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 max-w-md text-center">
          <AlertCircle className="h-10 w-10 text-slate-400 mx-auto mb-3" />
          <p className="text-slate-600">No data to display.</p>
          <button
            onClick={() => navigate('/profiles')}
            className="mt-4 rounded-2xl bg-[#485E73] px-4 py-2 text-white hover:bg-[#3b4d60] transition"
          >
            Connect Platforms
          </button>
        </div>
      </div>
    );
  }

  const getPlatformMetrics = (p) => {
    const metrics = {
      platform: p.platform,
      handle: p.handle,
      solved: p.solved,
      rating: p.rating,
      contests: p.contests,
    };
    if (p.platform === 'codechef') {
      metrics.stars = p.stars;
    }
    if (p.platform === 'github') {
      metrics.repos = p.totalRepos || 0;
      metrics.contributions = p.totalContributions || 0;
    }
    return metrics;
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-[#485E73]/80">
              Analytics
            </p>
            <h1 className="mt-3 text-3xl font-bold text-slate-900">Performance Insights</h1>
            <p className="mt-2 max-w-xl text-slate-600">
              Detailed breakdown of your coding journey across all platforms.
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Solved</p>
                <h2 className="mt-2 text-3xl font-bold text-slate-900">{aggregated.totalSolved}</h2>
              </div>
              <Activity size={28} className="text-[#485E73]" />
            </div>
            <p className="mt-3 text-sm text-slate-500">across {aggregated.platformCount} platforms</p>
          </div>

          <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Highest Rating</p>
                <h2 className="mt-2 text-3xl font-bold text-slate-900">{aggregated.highestRating > 0 ? aggregated.highestRating : "—"}</h2>
              </div>
              <TrendingUp size={28} className="text-[#485E73]" />
            </div>
            <p className="mt-3 text-sm text-slate-500">peak across all platforms</p>
          </div>

          <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Max Streak</p>
                <h2 className="mt-2 text-3xl font-bold text-slate-900">{aggregated.maxStreak} days</h2>
              </div>
              <Zap size={28} className="text-[#485E73]" />
            </div>
            <p className="mt-3 text-sm text-slate-500">longest consecutive active days</p>
          </div>

          <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Active Days</p>
                <h2 className="mt-2 text-3xl font-bold text-slate-900">{aggregated.totalActiveDays}</h2>
              </div>
              <Calendar size={28} className="text-[#485E73]" />
            </div>
            <p className="mt-3 text-sm text-slate-500">total days with activity</p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <PieChart size={22} className="text-[#485E73]" />
              Difficulty Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <RePieChart>
                <Pie
                  data={difficultyChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {difficultyChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RePieChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <BarChart3 size={22} className="text-[#485E73]" />
              Solved per Platform
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <ReBarChart data={platformChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="solved" fill="#8884d8" />
              </ReBarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Topics Bar Chart (LeetCode) */}
        {topicChartData.length > 0 && (
          <div className="mt-8 rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen size={24} className="text-[#485E73]" />
              <h2 className="text-xl font-semibold text-slate-900">Top Topics (LeetCode)</h2>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <ReBarChart
                data={topicChartData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={120} />
                <Tooltip />
                <Legend />
                <Bar dataKey="solved" fill="#82ca9d" />
              </ReBarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Platform Metrics Table */}
        <div className="mt-8 rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Layers size={24} className="text-[#485E73]" />
            <h2 className="text-xl font-semibold text-slate-900">Platform Metrics</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Platform</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700">Handle</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700">Total Solved</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700">Rating</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700">Contests</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700">Stars</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700">Repos</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700">Contributions</th>
                </tr>
              </thead>
              <tbody>
                {platformData.map((p, idx) => {
                  const metrics = getPlatformMetrics(p);
                  const showGitHub = p.platform === 'github';
                  const showCodeChef = p.platform === 'codechef';
                  return (
                    <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4 font-medium text-slate-800 capitalize">{p.platform}</td>
                      <td className="text-center py-3 px-4 text-slate-700">{p.handle}</td>
                      <td className="text-center py-3 px-4 font-medium text-slate-900">{p.solved}</td>
                      <td className="text-center py-3 px-4 text-slate-700">{p.rating}</td>
                      <td className="text-center py-3 px-4 text-slate-700">{p.contests}</td>
                      <td className="text-center py-3 px-4 text-slate-700">
                        {showCodeChef ? (metrics.stars || "—") : "—"}
                      </td>
                      <td className="text-center py-3 px-4 text-slate-700">
                        {showGitHub ? metrics.repos : "—"}
                      </td>
                      <td className="text-center py-3 px-4 text-slate-700">
                        {showGitHub ? metrics.contributions : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Platform Breakdown (Stats Cards) */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Layers size={22} className="text-[#485E73]" />
            Platform Breakdown
          </h2>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {platformData.map((p, idx) => {
              const isGitHub = p.platform === 'github';
              return (
                <div key={idx} className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900 capitalize">{p.platform}</h3>
                    <span className="text-sm text-slate-500">@{p.handle}</span>
                  </div>
                  <div className="mt-4 space-y-3">
                    {/* Solved / Repos */}
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">{isGitHub ? 'Repos' : 'Solved'}</span>
                      <span className="font-medium text-slate-900">{p.solved}</span>
                    </div>
                    {/* Rating – only show for non-GitHub platforms */}
                    {!isGitHub && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Rating</span>
                        <span className="font-medium text-slate-900">{p.rating}</span>
                      </div>
                    )}
                    {/* Contests – only show for non-GitHub platforms */}
                    {!isGitHub && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Contests</span>
                        <span className="font-medium text-slate-900">{p.contests}</span>
                      </div>
                    )}
                    {/* GitHub specific: Contributions */}
                    {isGitHub && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Contributions</span>
                        <span className="font-medium text-slate-900">{p.totalContributions || 0}</span>
                      </div>
                    )}
                    {/* Streak */}
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Streak</span>
                      <span className="font-medium text-slate-900">{p.streak} days</span>
                    </div>
                    {/* Active Days (computed from heatmap) */}
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Active Days</span>
                      <span className="font-medium text-slate-900">{p.activeDays}</span>
                    </div>
                    {/* Accuracy / Beats (optional, keep if present) */}
                    {p.accuracy && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Acceptance Rate</span>
                        <span className="font-medium text-slate-900">{p.accuracy}%</span>
                      </div>
                    )}
                    {p.totalQuestionBeats && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Overall Beats</span>
                        <span className="font-medium text-slate-900">{p.totalQuestionBeats}%</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Solved Questions by Platform (Expandable List) */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <BookOpen size={22} className="text-[#485E73]" />
            Solved Questions by Platform
          </h2>
          <div className="space-y-4">
            {platformData.map((p, idx) => {
              const hasQuestions = p.solvedQuestionsByCategory && Object.keys(p.solvedQuestionsByCategory).length > 0;
              const isExpanded = expandedPlatform === idx;
              return (
                <div key={idx} className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => togglePlatform(idx)}
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 capitalize">{p.platform}</h3>
                      <p className="text-sm text-slate-500">@{p.handle} · {p.solved} {p.platform === 'github' ? 'repo' : 'solved'}</p>
                    </div>
                    <button className="text-slate-400 hover:text-slate-600">
                      {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </button>
                  </div>
                  {isExpanded && (
                    <div className="mt-4 max-h-80 overflow-y-auto space-y-4 border-t border-slate-200 pt-4">
                      {hasQuestions ? (
                        getSortedCategories(p.platform, p.solvedQuestionsByCategory).map(([category, questions]) => {
                          if (!questions || questions.length === 0) return null;
                          return (
                            <div key={category}>
                              <p className="text-sm font-semibold uppercase text-slate-500 mb-2">{category}</p>
                              <div className="flex flex-wrap gap-2">
                                {questions.map((q, qi) => (
                                  <span key={qi} className="inline-block rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                                    {q}
                                  </span>
                                ))}
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-sm text-slate-500">No solved questions data available.</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}