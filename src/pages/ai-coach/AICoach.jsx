import { useState, useEffect } from "react";
import { Loader2, Sparkles, TrendingUp, AlertCircle, CheckCircle, Zap, Target, Brain, Table, CalendarDays } from "lucide-react";
import api from "../../api/axios";

export default function AICoach() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [coachingResponse, setCoachingResponse] = useState(null);
  const [platformStats, setPlatformStats] = useState([]);
  const [userKey, setUserKey] = useState(null);

  // Fetch user info to create a unique storage key
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/api/user/me");
        const user = response.data;
        // Use email or authUserId to make the key unique
        const key = user.email || user.authUserId || "guest";
        setUserKey(key);
      } catch (err) {
        console.warn("Failed to fetch user info, falling back to default key:", err);
        setUserKey("default");
      }
    };
    fetchUser();
  }, []);

  // Once userKey is set, load cached data (if exists) and fetch fresh stats
  useEffect(() => {
    if (!userKey) return;

    const STORAGE_KEY = `algoNest_aiCoach_state_${userKey}`;

    const loadState = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) return null;
        const parsed = JSON.parse(saved);
        if (parsed?.coachingResponse) {
          setCoachingResponse(parsed.coachingResponse);
        }
        if (parsed?.platformStats) {
          setPlatformStats(parsed.platformStats);
        }
        return parsed;
      } catch (storageError) {
        console.warn("Unable to load AI coach state:", storageError);
        return null;
      }
    };

    const loadCached = loadState();
    // Always fetch fresh stats (they may have changed since last cache)
    fetchPlatformData();
  }, [userKey]);

  const saveState = (nextResponse, nextStats) => {
    if (!userKey) return;
    const STORAGE_KEY = `algoNest_aiCoach_state_${userKey}`;
    try {
      const payload = {
        coachingResponse: nextResponse,
        platformStats: nextStats,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (storageError) {
      console.warn("Unable to save AI coach state:", storageError);
    }
  };

  const fetchPlatformData = async () => {
    if (!userKey) return;
    try {
      const response = await api.get("/api/stats/latest");
      const snapshots = response.data;
      setPlatformStats(snapshots);
      return snapshots;
    } catch (err) {
      console.error("Failed to fetch platform data:", err);
      if (err.response?.status === 401) {
        setError("Your session has expired. Please log in again.");
      } else {
        setError(err.response?.data?.message || "Failed to load your coding data.");
      }
      return null;
    }
  };

  // ---- Parser ----
  const parseCoachingResponse = (text) => {
    if (!text) return { raw: "No response from AI.", sections: [] };

    const lines = text.split('\n');
    const sections = [];
    let currentSection = { title: 'General', items: [], type: 'content' };
    let tableRows = [];
    let inTable = false;
    let tableTitle = '';

    const addSection = (title, items, type = 'content') => {
      if (items.length === 0) return;
      sections.push({ title, items, type });
    };

    const isTableRow = (line) => {
      return line.includes('|') && line.split('|').filter(c => c.trim()).length >= 2;
    };

    const isBullet = (line) => {
      return /^[\s]*[-*•]\s/.test(line) || /^[\s]*\d+\.\s/.test(line);
    };

    const cleanBullet = (line) => {
      return line.replace(/^[\s]*[-*•]\s/, '').replace(/^[\s]*\d+\.\s/, '').trim();
    };

    const isSubBullet = (line) => {
      return /^[\s]{2,}[-*•]\s/.test(line) || /^[\s]{2,}\d+\.\s/.test(line);
    };

    const isHeader = (line) => {
      const trimmed = line.trim();
      return /^\d+\.\s/.test(trimmed) || /^\*\*[^*]+\*\*/.test(trimmed) || /^[A-Z][a-z]+.*:$/.test(trimmed) || /^[A-Z\s]+$/.test(trimmed);
    };

    const normalizeSectionTitle = (line) => {
      const trimmed = line.trim();
      let title = trimmed
        .replace(/^\d+\.\s*/, '')
        .replace(/\*\*/g, '')
        .replace(/:$/, '')
        .trim();

      const normalized = title.toLowerCase();
      if (normalized.includes('strength') || normalized.includes('advantage')) {
        return 'Advantages';
      }
      if (normalized.includes('weakness') || normalized.includes('improvement')) {
        return 'Weakness';
      }
      if (normalized.includes('recommended action') || normalized.includes('recommendation') || normalized.includes('action')) {
        return 'Recommended Actions';
      }
      if (normalized.includes('summary') || normalized.includes('impact')) {
        return 'Summary';
      }
      if (normalized.includes('general') || normalized.includes('detail') || normalized.includes('overview')) {
        return 'General';
      }

      return title || 'General';
    };

    let pendingSectionTitle = 'General';
    let currentBullets = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      if (!trimmed) {
        if (inTable && tableRows.length > 0) {
          sections.push({
            title: tableTitle || 'Details',
            items: tableRows,
            type: 'table'
          });
          inTable = false;
          tableRows = [];
          tableTitle = '';
        }
        if (currentBullets.length > 0) {
          let finalItems = [];
          for (let bullet of currentBullets) {
            if (bullet.subItems && bullet.subItems.length > 0) {
              finalItems.push({ text: bullet.text, subItems: bullet.subItems });
            } else {
              finalItems.push({ text: bullet.text });
            }
          }
          sections.push({
            title: pendingSectionTitle,
            items: finalItems,
            type: 'bullets'
          });
          currentBullets = [];
          pendingSectionTitle = 'General';
        }
        continue;
      }

      if (isTableRow(trimmed)) {
        if (currentBullets.length > 0) {
          let finalItems = [];
          for (let bullet of currentBullets) {
            if (bullet.subItems && bullet.subItems.length > 0) {
              finalItems.push({ text: bullet.text, subItems: bullet.subItems });
            } else {
              finalItems.push({ text: bullet.text });
            }
          }
          sections.push({
            title: pendingSectionTitle,
            items: finalItems,
            type: 'bullets'
          });
          currentBullets = [];
          pendingSectionTitle = 'General';
        }

        if (trimmed.includes('---')) continue;

        let title = pendingSectionTitle || 'General';
        if (!inTable) {
          inTable = true;
          tableTitle = title;
          tableRows = [];
        }
        const cells = trimmed.split('|').map(c => c.trim()).filter(c => c);
        if (cells.length > 0) {
          tableRows.push(cells);
        }
        continue;
      }

      if (inTable && !isTableRow(trimmed)) {
        if (tableRows.length > 0) {
          sections.push({
            title: tableTitle || 'Details',
            items: tableRows,
            type: 'table'
          });
        }
        inTable = false;
        tableRows = [];
        tableTitle = '';
      }

      if (isHeader(trimmed)) {
        if (currentBullets.length > 0) {
          let finalItems = [];
          for (let bullet of currentBullets) {
            if (bullet.subItems && bullet.subItems.length > 0) {
              finalItems.push({ text: bullet.text, subItems: bullet.subItems });
            } else {
              finalItems.push({ text: bullet.text });
            }
          }
          sections.push({
            title: pendingSectionTitle,
            items: finalItems,
            type: 'bullets'
          });
          currentBullets = [];
        }
        pendingSectionTitle = normalizeSectionTitle(trimmed);
        continue;
      }

      if (isBullet(trimmed) || isSubBullet(trimmed)) {
        const isSub = isSubBullet(trimmed);
        const clean = cleanBullet(trimmed);
        if (!clean) continue;

        if (isSub) {
          if (currentBullets.length > 0) {
            const last = currentBullets[currentBullets.length - 1];
            if (!last.subItems) last.subItems = [];
            last.subItems.push(clean);
          } else {
            currentBullets.push({ text: clean, subItems: [] });
          }
        } else {
          currentBullets.push({ text: clean, subItems: [] });
        }
        continue;
      }

      if (trimmed.length > 5 && !isHeader(trimmed) && !isBullet(trimmed) && !isTableRow(trimmed)) {
        if (currentBullets.length > 0) {
          currentBullets.push({ text: trimmed, type: 'paragraph' });
        } else {
          pendingSectionTitle = 'General';
          currentBullets.push({ text: trimmed, type: 'paragraph' });
        }
      }
    }

    if (inTable && tableRows.length > 0) {
      sections.push({
        title: tableTitle || 'Details',
        items: tableRows,
        type: 'table'
      });
    }

    if (currentBullets.length > 0) {
      let finalItems = [];
      for (let bullet of currentBullets) {
        if (bullet.subItems && bullet.subItems.length > 0) {
          finalItems.push({ text: bullet.text, subItems: bullet.subItems });
        } else {
          finalItems.push({ text: bullet.text });
        }
      }
      sections.push({
        title: pendingSectionTitle,
        items: finalItems,
        type: 'bullets'
      });
    }

    if (sections.length === 0) {
      return { raw: text, sections: [] };
    }

    return { sections };
  };

  // ---- Generate Coaching ----
  const generateCoaching = async () => {
    setLoading(true);
    setError(null);
    setCoachingResponse(null);

    try {
      // Always fetch fresh platform data before generating
      const stats = await fetchPlatformData();
      if (!stats || stats.length === 0) {
        setError("No platform data found. Please connect some platforms first.");
        setLoading(false);
        return;
      }

      const platformSummary = stats.map(s => {
        const fields = [
          `Platform: ${s.platform || "Unknown"}`,
          `Handle: ${s.handle || "N/A"}`,
          `Total Solved: ${s.totalSolved || 0}`,
          `Rating: ${s.rating || "N/A"}`,
          `Contests: ${s.contestGiven || 0}`,
          `Max Streak: ${s.maxStreakLifetime || 0}`,
          `Active Days: ${s.activeDays || 0}`,
        ];
        if (s.difficultyCounts) {
          const diff = Object.entries(s.difficultyCounts)
            .map(([k, v]) => `${k}: ${v}`)
            .join(", ");
          fields.push(`Difficulty Breakdown: ${diff}`);
        }
        return fields.join(" | ");
      }).join("\n");

      const prompt = `You are AlgoNest AI Coach, an expert coding performance analyst. Analyze the following data from a user's connected coding platforms and provide actionable advice.

USER DATA:
${platformSummary}

Format your reply in exactly 5 parts in this order:
1. **General** – Start with a short table using pipe-separated columns that summarizes the user's profile data.
2. **Advantages** – What they are doing well.
3. **Weakness** – What they should focus on.
4. **Recommended Actions** – Specific, actionable steps. Use bullet points.
5. **Summary** – A brief summary of the analysis and overall impact.

Keep the response concise, encouraging, and actionable.`;

      const response = await api.post("/api/ai/coach", { prompt });
      const data = response.data;

      let responseText = "";
      if (data.choices && data.choices.length > 0) {
        responseText = data.choices[0].message.content;
      } else if (data.candidates && data.candidates.length > 0) {
        responseText = data.candidates[0].content.parts[0].text;
      } else if (typeof data === 'string') {
        responseText = data;
      } else {
        responseText = "No response from AI.";
      }

      const parsed = parseCoachingResponse(responseText);
      setCoachingResponse(parsed);
      saveState(parsed, stats);
    } catch (err) {
      console.error("Coaching generation failed:", err);
      if (err.response?.status === 401) {
        setError("Your session has expired. Please log in again.");
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError(err.message || "Failed to generate coaching. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const hasData = platformStats.length > 0;

  const renderTextWithBold = (text) => {
    if (!text) return null;
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        return <strong key={i} className="text-slate-900">{part}</strong>;
      }
      return <span key={i} className="text-slate-700">{part}</span>;
    });
  };

  const renderBulletItem = (item, idx) => {
    if (item.type === 'paragraph') {
      return (
        <p key={idx} className="text-slate-700 mt-2">{renderTextWithBold(item.text)}</p>
      );
    }
    return (
      <li key={idx} className="flex flex-col gap-1">
        <div className="flex items-start gap-2 text-slate-700">
          <span className="mt-1 text-blue-600 font-bold">•</span>
          <span>{renderTextWithBold(item.text)}</span>
        </div>
        {item.subItems && item.subItems.length > 0 && (
          <ul className="ml-8 space-y-1 mt-1">
            {item.subItems.map((sub, subIdx) => (
              <li key={subIdx} className="flex items-start gap-2 text-sm text-slate-600">
                <span className="mt-1 text-blue-400">▸</span>
                <span>{renderTextWithBold(sub)}</span>
              </li>
            ))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-10">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-[#485E73]/80">AI Coach</p>
            <h1 className="mt-3 text-3xl font-bold text-slate-900 flex items-center gap-3">
              <Brain className="text-[#485E73]" size={32} />
              AlgoNest AI Coach
            </h1>
            <p className="mt-2 max-w-xl text-slate-600">
              Get personalized recommendations to level up your coding skills based on your actual performance data.
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {hasData ? `${platformStats.length} platform${platformStats.length > 1 ? 's' : ''} connected` : 'No platforms connected'}
            </p>
          </div>
          <button
            onClick={() => {
              setError(null);
              setCoachingResponse(null);
              generateCoaching();
            }}
            disabled={loading || !hasData}
            className="inline-flex items-center gap-2 rounded-2xl bg-[#485E73] px-6 py-3 font-semibold text-white transition hover:bg-[#3B4D5F] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
            {loading ? "Analyzing..." : "Get AI Insights"}
          </button>
        </div>

        {!hasData && !loading && (
          <div className="rounded-4xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <AlertCircle className="mx-auto mb-3 h-12 w-12 text-slate-400" />
            <h3 className="text-lg font-semibold text-slate-900">No Data Available</h3>
            <p className="mt-2 text-slate-500">
              Connect at least one coding platform in your <a href="/profiles" className="text-[#485E73] hover:underline">Profiles</a> page to get AI coaching.
            </p>
          </div>
        )}

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle size={20} />
            {error}
            <button onClick={generateCoaching} className="ml-auto rounded-lg bg-red-100 px-3 py-1 text-sm font-medium hover:bg-red-200">
              Retry
            </button>
          </div>
        )}

        {coachingResponse && (
          <div className="space-y-6 mt-6">
            {coachingResponse.sections && coachingResponse.sections.length > 0 ? (
              coachingResponse.sections.map((section, idx) => {
                if (section.type === 'table') {
                  return (
                    <div key={idx} className="rounded-4xl border border-purple-200 bg-purple-50 p-6 shadow-sm">
                      <h3 className="flex items-center gap-2 text-lg font-semibold text-purple-800 mb-4">
                        <Table size={22} /> {section.title || "Details"}
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b-2 border-purple-200">
                              {section.items.length > 0 && section.items[0].map((cell, cellIdx) => (
                                <th key={cellIdx} className="text-left py-2 px-3 font-semibold text-slate-800">
                                  {renderTextWithBold(cell)}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {section.items.slice(1).map((row, rowIdx) => (
                              <tr key={rowIdx} className="border-b border-purple-100 hover:bg-purple-100/50 transition">
                                {row.map((cell, cellIdx) => (
                                  <td key={cellIdx} className="py-2 px-3 text-slate-700">
                                    {renderTextWithBold(cell)}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                } else if (section.type === 'bullets') {
                  let borderColor = 'border-blue-200';
                  let bgColor = 'bg-blue-50';
                  let iconColor = 'text-blue-800';
                  let Icon = Zap;
                  let title = section.title || 'Recommendations';

                  if (title.toLowerCase().includes('strength')) {
                    borderColor = 'border-green-200';
                    bgColor = 'bg-green-50';
                    iconColor = 'text-green-800';
                    Icon = CheckCircle;
                  } else if (title.toLowerCase().includes('weakness') || title.toLowerCase().includes('area')) {
                    borderColor = 'border-orange-200';
                    bgColor = 'bg-orange-50';
                    iconColor = 'text-orange-800';
                    Icon = Target;
                  } else if (title.toLowerCase().includes('summary') || title.toLowerCase().includes('impact')) {
                    borderColor = 'border-purple-200';
                    bgColor = 'bg-purple-50';
                    iconColor = 'text-purple-800';
                    Icon = TrendingUp;
                  } else if (title.toLowerCase().includes('frequency') || title.toLowerCase().includes('timeline')) {
                    borderColor = 'border-indigo-200';
                    bgColor = 'bg-indigo-50';
                    iconColor = 'text-indigo-800';
                    Icon = CalendarDays;
                  }

                  return (
                    <div key={idx} className={`rounded-4xl border ${borderColor} ${bgColor} p-6 shadow-sm`}>
                      <h3 className={`flex items-center gap-2 text-lg font-semibold ${iconColor}`}>
                        <Icon size={22} /> {title}
                      </h3>
                      <ul className="mt-3 space-y-3">
                        {section.items.map((item, itemIdx) => renderBulletItem(item, itemIdx))}
                      </ul>
                    </div>
                  );
                } else {
                  return (
                    <div key={idx} className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
                      <h3 className="text-lg font-semibold text-slate-900">{section.title}</h3>
                      <div className="mt-2 text-slate-700">
                        {section.items.map((item, i) => (
                          <p key={i} className="mb-2">{renderTextWithBold(item.text || item)}</p>
                        ))}
                      </div>
                    </div>
                  );
                }
              })
            ) : (
              <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">AI Insights</h3>
                <div className="mt-3 whitespace-pre-wrap text-slate-700">
                  {coachingResponse.raw}
                </div>
              </div>
            )}
            <p className="text-center text-xs text-slate-400">
              Generated by AI • {new Date().toLocaleString()}
            </p>
          </div>
        )}

        {loading && (
          <div className="rounded-4xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <Loader2 className="mx-auto mb-4 h-10 w-10 animate-spin text-[#485E73]" />
            <h3 className="text-lg font-semibold text-slate-900">Analyzing Your Data</h3>
            <p className="mt-2 text-slate-500">Our AI is reviewing your coding patterns and generating personalized recommendations...</p>
          </div>
        )}

        {!coachingResponse && !loading && hasData && (
          <div className="rounded-4xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <Brain className="mx-auto mb-4 h-16 w-16 text-slate-300" />
            <h3 className="text-lg font-semibold text-slate-900">Ready for Insights</h3>
            <p className="mt-2 text-slate-500">
              Click the <span className="font-medium">"Get AI Insights"</span> button above to receive personalized coaching.
            </p>
            <p className="mt-1 text-sm text-slate-400">
              AI analyzes your total solved, difficulty distribution, streaks, and contest history.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}