import { useState, useEffect } from "react";
import {
  SiLeetcode,
  SiCodeforces,
  SiCodechef,
  SiGeeksforgeeks,
  SiGithub,
} from "react-icons/si";
import {
  CheckCircle2,
  Circle,
  RefreshCw,
  Loader2,
} from "lucide-react";
import api from "../../api/axios";

const PLATFORMS = [
  {
    key: "leetcode",
    name: "LeetCode",
    icon: SiLeetcode,
    color: "#FFA116",
    placeholder: "Enter LeetCode username",
    sampleStats: {
      "Contest Rating": "_",
      Solved: "_",
      "Max Streak": "_",
      "Active Days": "_",
    },
  },
  {
    key: "codeforces",
    name: "Codeforces",
    icon: SiCodeforces,
    color: "#1F8ACB",
    placeholder: "Enter Codeforces username",
    sampleStats: {
      Rating: "_",
      Solved: "_",
      Contests: "_",
      "Max Streak": "_",
    },
  },
  {
    key: "codechef",
    name: "CodeChef",
    icon: SiCodechef,
    color: "#6D4C41",
    placeholder: "Enter CodeChef username",
    sampleStats: {
      Rating: "_",
      Solved: "_",
      Contests: "_",
    },
  },
  {
    key: "gfg",
    name: "GeeksforGeeks",
    icon: SiGeeksforgeeks,
    color: "#2F8D46",
    placeholder: "Enter GFG username",
    sampleStats: {
      Rating: "_",
      Solved: "_",
      "Max Streak": "_",
      "Active Days": "_",
    },
  },
  {
    key: "github",
    name: "GitHub",
    icon: SiGithub,
    color: "#181717",
    placeholder: "Enter GitHub username",
    sampleStats: {
      Repositories: "_",
      Followers: "_",
      Contributions: "_",
    },
  },
];

const initialProfiles = PLATFORMS.reduce((acc, platform) => {
  acc[platform.key] = {
    username: "",
    connected: false,
    verified: false,
    stats: {},
    loading: false,
    error: null,
    id: null,
    lastSynced: null,
  };
  return acc;
}, {});

/* ---------------- PLATFORM STATS ---------------- */

const buildPlatformStats = (platform, data) => {
  switch (platform) {
    case "leetcode":
      return {
        "Contest Rating": data.rating ?? "—",
        Solved: data.totalSolved ?? "—",
        "Max Streak": data.maxStreakLifetime ?? "—",
        "Active Days": data.activeDays ?? "—",
      };

    case "codeforces":
      return {
        Rating: data.rating ?? "—",
        Solved: data.totalSolved ?? "—",
        Contests: data.contestGiven ?? "—",
        "Max Streak": data.maxStreakLifetime ?? "—",
      };

    case "codechef":
      return {
        Rating: data.rating ?? "—",
        Solved: data.totalSolved ?? "—",
        Contests: data.contestGiven ?? "—",
      };

    case "gfg":
      return {
        Rating: data.rating ?? "—",
        Solved: data.totalSolved ?? "—",
        "Max Streak": data.maxStreakLifetime ?? "—",
        "Active Days": data.activeDays ?? "—",
      };

    case "github":
      return {
        Repositories: data.totalRepos ?? "—",
        Followers: data.rating ?? data.totalFollowers ?? "—",
        Contributions: data.totalContributions ?? "—",
      };

    default:
      return {};
  }
};

const formatLastSynced = (iso) => {
  if (!iso) return 'Never';
  const t = new Date(iso).getTime();
  const diff = Date.now() - t;
  if (diff < 60_000) return 'Just now';
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  const days = Math.floor(diff / 86_400_000);
  if (days <= 30) return `${days} day${days === 1 ? '' : 's'} ago`;
  return new Date(iso).toLocaleString();
};

export default function Profiles() {
  const [profiles, setProfiles] = useState(initialProfiles);
  const [initialLoading, setInitialLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tick, setTick] = useState(0);
  // ✅ Track handles to be removed
  const [removedHandles, setRemovedHandles] = useState([]);

  useEffect(() => {
    fetchHandlesAndStats();
  }, []);

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  const fetchHandlesAndStats = async () => {
    setInitialLoading(true);
    try {
      const response = await api.get("/api/handles");
      const handles = response.data;
      const updatedProfiles = Object.fromEntries(
        Object.entries(initialProfiles).map(([k, v]) => [k, { ...v }])
      );

      for (const item of handles) {
        const platformKey = item.platform;
        if (!updatedProfiles[platformKey]) continue;
        updatedProfiles[platformKey].username = item.handle;
        updatedProfiles[platformKey].connected = true;
        updatedProfiles[platformKey].verified = true;
        updatedProfiles[platformKey].id = item.id;
        updatedProfiles[platformKey].lastSynced = item.created_at || item.createdAt || null;

        try {
          const statsRes = await api.get(`/api/stats/latest?platform=${platformKey}`);
          const statsData = statsRes.data;
          if (statsData && statsData.length > 0) {
            const snapshot = statsData[0];
            if (snapshot.error || (snapshot.totalSolved === null && snapshot.heatmapData === null)) {
              updatedProfiles[platformKey].verified = false;
              updatedProfiles[platformKey].stats = PLATFORMS.find(p => p.key === platformKey)?.sampleStats || {};
              updatedProfiles[platformKey].error = snapshot.error || "No data synced yet.";
            } else {
              updatedProfiles[platformKey].stats = buildPlatformStats(platformKey, snapshot);
              updatedProfiles[platformKey].verified = true;
              updatedProfiles[platformKey].error = null;
              updatedProfiles[platformKey].lastSynced = snapshot.syncedAt || snapshot.timestamp || snapshot.created_at || null;
            }
          } else {
            updatedProfiles[platformKey].stats = PLATFORMS.find(p => p.key === platformKey)?.sampleStats || {};
            updatedProfiles[platformKey].verified = false;
            updatedProfiles[platformKey].error = "No data available. Please sync.";
          }
        } catch (fetchErr) {
          console.warn("Failed to fetch stats for", platformKey, fetchErr);
          updatedProfiles[platformKey].stats = PLATFORMS.find(p => p.key === platformKey)?.sampleStats || {};
          updatedProfiles[platformKey].verified = false;
          updatedProfiles[platformKey].error = "Failed to load stats.";
        }
      }

      setProfiles(updatedProfiles);
    } catch (err) {
      console.error(err);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleChange = (platform, value) => {
    setProfiles(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        username: value,
        error: null,
        connected: prev[platform].connected, // keep connected state
        verified: prev[platform].verified,
        stats: prev[platform].stats,
        loading: false,
        id: prev[platform].id,
        lastSynced: prev[platform].lastSynced,
      },
    }));
  };

  const verifyPlatform = async (platformKey) => {
    const config = PLATFORMS.find((p) => p.key === platformKey);
    const username = profiles[platformKey].username.trim();
    if (!username) return;

    setProfiles((prev) => ({
      ...prev,
      [platformKey]: { ...prev[platformKey], loading: true, error: null },
    }));

    try {
      const response = await api.post("/api/handles", {
        platform: platformKey,
        handle: username,
      });
      const newHandle = response.data;

      setProfiles((prev) => ({
        ...prev,
        [platformKey]: {
          ...prev[platformKey],
          id: newHandle.id,
          connected: true,
          verified: true,
          lastSynced: newHandle.created_at || newHandle.createdAt || null,
        },
      }));

      const syncResponse = await api.post(`/api/sync/handle/${newHandle.id}`);
      const snapshot = syncResponse.data;
      const isValid = snapshot && snapshot.totalSolved !== undefined && snapshot.totalSolved !== null && !snapshot.error;

      if (isValid) {
        const displayStats = buildPlatformStats(platformKey, snapshot);
        setProfiles((prev) => ({
          ...prev,
          [platformKey]: {
            ...prev[platformKey],
            stats: displayStats,
            verified: true,
            loading: false,
            error: null,
            lastSynced: snapshot?.syncedAt || snapshot?.timestamp || new Date().toISOString(),
          },
        }));
      } else {
        const errorMsg = snapshot?.error || "Invalid username or no data found.";
        try {
          await api.delete(`/api/handles/${newHandle.id}`);
        } catch (deleteErr) {}
        setProfiles((prev) => ({
          ...prev,
          [platformKey]: {
            username: "",
            connected: false,
            verified: false,
            stats: {},
            loading: false,
            error: errorMsg,
            id: null,
            lastSynced: null,
          },
        }));
      }
    } catch (err) {
      let errorMsg = "Verification failed.";
      if (err.response) {
        const status = err.response.status;
        if (status === 409) errorMsg = "Username already added for this platform.";
        else if (status === 400) errorMsg = err.response.data?.message || "Invalid username or platform.";
        else if (status === 401) errorMsg = "Session expired. Please log in again.";
        else if (status === 403) errorMsg = "You are not authorized to add this handle.";
        else errorMsg = err.response.data?.message || "Server error. Please try again.";
      } else if (err.request) {
        errorMsg = "Network error. Please check your connection.";
      } else {
        errorMsg = err.message || "An unexpected error occurred.";
      }
      setProfiles((prev) => ({
        ...prev,
        [platformKey]: {
          ...prev[platformKey],
          loading: false,
          error: errorMsg,
          verified: false,
          connected: false,
          stats: {},
          id: null,
          lastSynced: null,
        },
      }));
    }
  };

  // ✅ Sync only this platform (scrapes fresh data)
  const syncPlatform = async (platformKey) => {
    const handleId = profiles[platformKey].id;
    if (!handleId) {
      setProfiles((prev) => ({
        ...prev,
        [platformKey]: { ...prev[platformKey], error: "No handle ID found. Re-verify the username." },
      }));
      return;
    }

    setProfiles((prev) => ({
      ...prev,
      [platformKey]: { ...prev[platformKey], loading: true, error: null },
    }));

    try {
      const syncResponse = await api.post(`/api/sync/handle/${handleId}`);
      const snapshot = syncResponse.data;
      const isValid = snapshot && snapshot.totalSolved !== undefined && snapshot.totalSolved !== null && !snapshot.error;

      if (isValid) {
        const displayStats = buildPlatformStats(platformKey, snapshot);
        setProfiles((prev) => ({
          ...prev,
          [platformKey]: {
            ...prev[platformKey],
            stats: displayStats,
            loading: false,
            lastSynced: snapshot?.syncedAt || snapshot?.timestamp || new Date().toISOString(),
            error: null,
          },
        }));
      } else {
        const errorMsg = snapshot?.error || "No data found.";
        setProfiles((prev) => ({
          ...prev,
          [platformKey]: {
            ...prev[platformKey],
            loading: false,
            error: errorMsg,
            verified: false,
            connected: false,
            stats: {},
          },
        }));
      }
    } catch (err) {
      setProfiles((prev) => ({
        ...prev,
        [platformKey]: {
          ...prev[platformKey],
          loading: false,
          error: "Failed to sync stats. Please try again.",
        },
      }));
    }
  };

  // ✅ Disconnect only marks for removal (no backend call yet)
  const disconnectPlatform = (platformKey) => {
    const handleId = profiles[platformKey].id;
    if (handleId) {
      setRemovedHandles(prev => [...new Set([...prev, handleId])]);
    }
    // Clear the card locally
    setProfiles((prev) => ({
      ...prev,
      [platformKey]: {
        username: "",
        connected: false,
        verified: false,
        stats: {},
        loading: false,
        error: null,
        id: null,
        lastSynced: null,
      },
    }));
  };

  // ✅ Save Changes: delete removed, update edited usernames, no sync
  const saveAllChanges = async () => {
  setSaving(true);
  try {
    console.log("removedHandles:", removedHandles);
    console.log("profiles:", profiles);

    // 1. Delete removed handles
    for (const id of removedHandles) {
      console.log(`Deleting handle with id: ${id}`);
      await api.delete(`/api/handles/${id}`);
    }
    setRemovedHandles([]);

    // 2. Update any existing handles that might have edited usernames
    for (const [platformKey, profile] of Object.entries(profiles)) {
      if (profile.id && profile.username.trim()) {
        console.log(`Updating handle ${profile.id} with platform ${platformKey} and handle ${profile.username.trim()}`);
        await api.put(`/api/handles/${profile.id}`, {
          platform: platformKey,
          handle: profile.username.trim(),
        });
      }
    }

    alert("Changes saved successfully!");
  } catch (err) {
    console.error("Save changes error:", err);
    // Try to read error response
    if (err.response) {
      console.error("Response data:", err.response.data);
      console.error("Response status:", err.response.status);
      alert(`Failed to save changes: ${err.response.data?.message || err.response.status}`);
    } else if (err.request) {
      alert("No response from server. Please check your connection.");
    } else {
      alert(`Failed to save changes: ${err.message}`);
    }
  } finally {
    setSaving(false);
  }
};

  const resetProfiles = () => {
    setProfiles(initialProfiles);
    setRemovedHandles([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-slate-900">Coding Profiles</h1>
          <p className="mt-3 max-w-2xl text-slate-500">
            Connect your coding accounts to automatically sync ratings, contest history, activity, GitHub contributions and AI insights.
          </p>
        </div>

        {initialLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#485E73]" />
          </div>
        ) : (
          <div className="space-y-6">
            {PLATFORMS.map((platform) => {
              const Icon = platform.icon;
              const profile = profiles[platform.key];

              return (
                <div key={platform.key} className="rounded-3xl border border-slate-100 bg-white p-7 shadow-sm">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: `${platform.color}15` }}>
                        <Icon size={30} color={platform.color} />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-slate-900">{platform.name}</h2>
                        <p className="text-sm text-slate-500">Connect your account</p>
                      </div>
                    </div>

                    {profile.connected && profile.verified ? (
                      <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
                        <CheckCircle2 size={17} /> Connected
                      </div>
                    ) : profile.connected && !profile.verified ? (
                      <div className="flex items-center gap-2 rounded-full bg-yellow-50 px-4 py-2 text-sm font-medium text-yellow-700">
                        <Circle size={14} /> Syncing...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600">
                        <Circle size={14} /> Not Connected
                      </div>
                    )}
                  </div>

                  {/* Username */}
                  <div className="mt-7 flex flex-wrap gap-4">
                    <input
                      value={profile.username}
                      onChange={(e) => handleChange(platform.key, e.target.value)}
                      placeholder={platform.placeholder}
                      disabled={profile.loading}
                      className="flex-1 rounded-2xl border border-slate-200 bg-white px-5 py-3 outline-none transition focus:border-[#485E73] focus:ring-4 focus:ring-[#485E73]/10 disabled:opacity-60"
                    />
                    <button
                      onClick={() => verifyPlatform(platform.key)}
                      disabled={!profile.username.trim() || profile.loading}
                      className="inline-flex items-center gap-2 rounded-2xl bg-[#485E73] px-6 py-3 font-medium text-white transition hover:bg-[#3B4D5F] disabled:opacity-50"
                    >
                      {profile.loading ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
                      {profile.loading ? "Verifying..." : "Verify"}
                    </button>
                  </div>

                  {profile.error && (
                    <div className="mt-4 rounded-2xl bg-red-50 p-3 text-sm text-red-700">
                      {profile.error}
                    </div>
                  )}

                  {profile.verified && (
                    <>
                      <div className="mt-5 flex items-center justify-between rounded-2xl bg-emerald-50 px-5 py-4">
                        <div>
                          <p className="font-medium text-emerald-700">Username Verified</p>
                          <p className="mt-1 text-sm text-emerald-600">@{profile.username}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs uppercase tracking-wider text-slate-500">Last Synced</p>
                          <p className="font-medium text-slate-800">{formatLastSynced(profile.lastSynced)}</p>
                        </div>
                      </div>

                      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
                        {Object.entries(profile.stats).map(([title, value]) => (
                          <div key={title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                            <p className="text-sm text-slate-500">{title}</p>
                            <h3 className="mt-2 text-2xl font-bold text-slate-900">{value}</h3>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 flex justify-end gap-3">
                        <button
                          onClick={() => syncPlatform(platform.key)}
                          disabled={profile.loading}
                          className="rounded-2xl border border-slate-200 bg-white px-5 py-3 font-medium text-slate-600 transition hover:bg-slate-100 disabled:opacity-50"
                        >
                          {profile.loading ? <Loader2 size={18} className="animate-spin" /> : "Sync Now"}
                        </button>
                        <button
                          onClick={() => disconnectPlatform(platform.key)}
                          className="rounded-2xl bg-red-50 px-5 py-3 font-medium text-red-600 transition hover:bg-red-100"
                        >
                          Disconnect
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-end gap-3">
        <button
          onClick={resetProfiles}
          className="rounded-2xl border border-slate-300 bg-white px-8 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          Reset
        </button>
        <button
          onClick={saveAllChanges}
          disabled={saving}
          className="rounded-2xl bg-[#485E73] px-8 py-3 font-semibold text-white transition hover:bg-[#3B4D5F] disabled:opacity-50"
        >
          {saving && <Loader2 className="mr-2 inline h-5 w-5 animate-spin" />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}