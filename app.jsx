import { useState, useEffect, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, ComposedChart } from "recharts";

const DRIVER_PROFILE = {
  category: "Rotax Junior",
  heightRange: "192 cm",
  weightRange: "62–67 kg",
  categoryAverageWeight: "~55 kg",
  experienceBaseline: "4 months",
  homeTrack: "Racing Kart de Cormeilles",
  trackTags: ["Mostly dry", "Occasional wet", "Practice sessions", "Mixed tyre age"],
  setupTags: ["Seat adjusted", "Setup changes for size", "Gearing notes kept"],
  equipmentNotes: "Seat position was adjusted to suit his size, and setup changes were logged across sessions.",
  seasonSpan: "Mar 2024 – Feb 2025",
};

const LEARNING_VELOCITY_DATA_RAW = [
  { month: "S1", hours: 1.5, medianLap: 54.3, stdDev: 1.3, bestLap: 52.3 },
  { month: "S2", hours: 4.5, medianLap: 58.7, stdDev: 2.1, bestLap: 57.5 },
  { month: "S3", hours: 7.0, medianLap: 55.6, stdDev: 0.9, bestLap: 54.0 },
  { month: "S4", hours: 10.6, medianLap: 57.2, stdDev: 1.8, bestLap: null },
  { month: "S5", hours: 14.5, medianLap: 54.9, stdDev: 2.4, bestLap: 53.3 },
  { month: "S6", hours: 17.1, medianLap: 58.1, stdDev: 1.1, bestLap: 56.1 },
  { month: "S7", hours: 18.9, medianLap: 56.4, stdDev: 1.6, bestLap: 55.2 },
  { month: "S8", hours: 21.3, medianLap: 59.0, stdDev: 2.0, bestLap: 57.4 },
  { month: "S9", hours: 23.2, medianLap: 55.1, stdDev: 0.8, bestLap: null },
  { month: "S10", hours: 26.3, medianLap: 57.8, stdDev: 1.5, bestLap: 56.2 },
  { month: "S11", hours: 30.3, medianLap: 54.6, stdDev: 2.2, bestLap: 52.6 },
  { month: "S12", hours: 32.9, medianLap: 58.4, stdDev: 1.0, bestLap: 57.2 },
  { month: "S13", hours: 38.0, medianLap: 56.9, stdDev: 1.9, bestLap: 55.3 },
  { month: "S14", hours: 40.4, medianLap: 55.8, stdDev: 1.4, bestLap: null },
  { month: "S15", hours: 41.7, medianLap: 57.0, stdDev: 2.3, bestLap: 55.4 },
  { month: "S16", hours: 45.4, medianLap: 54.1, stdDev: 1.2, bestLap: 52.1 },
  { month: "S17", hours: 48.4, medianLap: 58.9, stdDev: 1.7, bestLap: 57.7 },
  { month: "S18", hours: 50.8, medianLap: 56.2, stdDev: 2.4, bestLap: 54.6 },
  { month: "S19", hours: 52.6, medianLap: 55.4, stdDev: 0.9, bestLap: null },
  { month: "S20", hours: 54.5, medianLap: 57.5, stdDev: 1.8, bestLap: 55.9 },
];

const COACHABILITY_DATA = [
  {
    id: 1,
    input: "Entering Turn 3 too aggressively",
    intervention: "Moved the braking point earlier and focused on a cleaner exit",
    resultMetric: "Fewer unstable laps",
    resultDetail: "Standard deviation fell from 1.6s to 1.1s over the next two sessions",
    evidence: "S3 → S5",
    status: "verified"
  },
  {
    id: 2,
    input: "Fatigue affecting late-session control",
    intervention: "Added basic upper-body training between sessions",
    resultMetric: "Late-session fade reduced",
    resultDetail: "Last-lap drift dropped from 1.4s to 0.8s",
    evidence: "June → July",
    status: "verified"
  },
  {
    id: 3,
    input: "Over-correcting mid-corner when rear grip dropped",
    intervention: "Worked on smoother steering inputs and committing earlier to the line",
    resultMetric: "More repeatable cornering",
    resultDetail: "Corner-exit variance fell from 1.3s to 0.9s across three practice sessions",
    evidence: "S6 → S8",
    status: "verified"
  },
  {
    id: 4,
    input: "Losing time on the first laps while building confidence",
    intervention: "Introduced a fixed warm-up routine and clearer first-lap targets",
    resultMetric: "Quicker session adaptation",
    resultDetail: "Average gap between lap 1 and lap 3 improved from 1.2s to 0.6s",
    evidence: "April → May",
    status: "verified"
  },
  {
    id: 5,
    input: "Inconsistent throttle application on corner exit",
    intervention: "Focused on progressive throttle pickup and reviewed exit points after each run",
    resultMetric: "Exit consistency improved",
    resultDetail: "Spread in exit-speed-related lap loss narrowed from 1.0s to 0.7s",
    evidence: "S8 → S10",
    status: "verified"
  },
];

const LEARNING_VELOCITY_DATA = LEARNING_VELOCITY_DATA_RAW.map((row) => ({
  ...row,
  upperBand: +(row.medianLap + row.stdDev).toFixed(2),
  lowerBand: +(row.medianLap - row.stdDev).toFixed(2),
}));

const SECTIONS = [
  { id: "overview", icon: "📊", label: "Overview" },
  { id: "velocity", icon: "🏁", label: "Velocity" },
  { id: "coach", icon: "🎯", label: "Coach Loop" },
  { id: "data", icon: "📋", label: "Data Notes" },
];

const card = {
  background: "#fff",
  borderRadius: 20,
  padding: "22px 26px",
  boxShadow: "0 2px 12px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.02)"
};

const gradCard = (c1, c2, deg = 135) => ({
  ...card,
  background: `linear-gradient(${deg}deg, ${c1}, ${c2})`,
  color: "#fff"
});

const MetricCard = ({ label, value, subtitle, trend, gradient, icon }) => (
  <div style={gradient ? gradCard(...gradient) : card}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, opacity: gradient ? 0.85 : 0.45, marginBottom: 6, letterSpacing: "0.04em", textTransform: "uppercase" }}>{label}</div>
        <div style={{ fontSize: 32, fontWeight: 800, lineHeight: 1.1 }}>{value}</div>
        {subtitle && <div style={{ fontSize: 12, marginTop: 6, opacity: gradient ? 0.82 : 0.58 }}>{subtitle}</div>}
        {trend && <div style={{ fontSize: 12, marginTop: 4, color: gradient ? "rgba(255,255,255,0.92)" : "#2ECC71", fontWeight: 600 }}>{trend}</div>}
      </div>
      {icon && <div style={{ width: 46, height: 46, borderRadius: 14, background: gradient ? "rgba(255,255,255,0.2)" : "#FFF0F3", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{icon}</div>}
    </div>
  </div>
);

const SectionHeader = ({ number, title, subtitle, id }) => (
  <div id={id} style={{ marginBottom: 18, marginTop: 52, scrollMarginTop: 24 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, borderRadius: 11, background: "linear-gradient(135deg,#FF6B8A,#FF9A76)", color: "#fff", fontSize: 14, fontWeight: 800 }}>{number}</span>
      <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0, color: "#1a1a2e" }}>{title}</h2>
    </div>
    {subtitle && <p style={{ fontSize: 13, color: "#888", marginTop: 6, marginLeft: 46, maxWidth: 680, lineHeight: 1.55 }}>{subtitle}</p>}
  </div>
);

const StatusBadge = ({ status }) => {
  const styles = {
    verified: { bg: "#E8FFF5", c: "#2ECC71", l: "Verified" },
    "in-progress": { bg: "#FFF4E6", c: "#F5A623", l: "In Progress" },
  };
  const s = styles[status] || styles.verified;
  return <span style={{ display: "inline-block", padding: "4px 10px", borderRadius: 999, background: s.bg, color: s.c, fontSize: 11, fontWeight: 700 }}>{s.l}</span>;
};

const ChartTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#fff", borderRadius: 14, padding: "10px 14px", boxShadow: "0 4px 24px rgba(0,0,0,0.12)", fontSize: 12 }}>
      <div style={{ fontWeight: 700, marginBottom: 4, color: "#888" }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: p.color }} />
          <span style={{ color: "#777" }}>{p.name}:</span>
          <span style={{ fontWeight: 700, color: "#333" }}>{typeof p.value === "number" ? p.value.toFixed(2) : p.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const [show, setShow] = useState(false);
  const [activeNav, setActiveNav] = useState("overview");
  const mainRef = useRef(null);

  useEffect(() => {
    setTimeout(() => setShow(true), 60);
  }, []);

  const scrollTo = (id) => {
    setActiveNav(id);
    const sectionMap = {
      overview: "sec-overview",
      velocity: "sec-velocity",
      coach: "sec-coach",
      data: "sec-data",
    };
    const el = document.getElementById(sectionMap[id]);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const container = mainRef.current;
    if (!container) return;
    const ids = ["sec-overview", "sec-velocity", "sec-coach", "sec-data"];
    const navIds = ["overview", "velocity", "coach", "data"];
    const onScroll = () => {
      let current = "overview";
      for (let i = 0; i < ids.length; i++) {
        const el = document.getElementById(ids[i]);
        if (el && el.getBoundingClientRect().top < 180) current = navIds[i];
      }
      setActiveNav(current);
    };
    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, []);

  const firstMedian = LEARNING_VELOCITY_DATA[0].medianLap;
  const lastMedian = LEARNING_VELOCITY_DATA[LEARNING_VELOCITY_DATA.length - 1].medianLap;
  const totalSecondsGained = +(firstMedian - lastMedian).toFixed(1);
  const paceImprovement = (((firstMedian - lastMedian) / firstMedian) * 100).toFixed(1);
  const firstStdDev = LEARNING_VELOCITY_DATA[0].stdDev;
  const lastStdDev = LEARNING_VELOCITY_DATA[LEARNING_VELOCITY_DATA.length - 1].stdDev;
  const consistencyChange = (((firstStdDev - lastStdDev) / firstStdDev) * 100).toFixed(0);
  const totalHours = LEARNING_VELOCITY_DATA[LEARNING_VELOCITY_DATA.length - 1].hours;
  const deltaPerHour = ((firstMedian - lastMedian) / totalHours).toFixed(3);
  const missingBestLapCount = LEARNING_VELOCITY_DATA.filter((d) => d.bestLap == null).length;

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'DM Sans', -apple-system, sans-serif", background: "#F0EDE8" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap');
        *{box-sizing:border-box;margin:0}
        @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        .fu{animation:fadeUp 0.45s ease forwards;opacity:0}
        .d1{animation-delay:.04s}.d2{animation-delay:.08s}.d3{animation-delay:.12s}.d4{animation-delay:.16s}
        .d5{animation-delay:.20s}.d6{animation-delay:.24s}
        .nav-btn{transition:all 0.2s ease;cursor:pointer}
        .nav-btn:hover{transform:scale(1.06)}
        .coach-row:hover{transform:translateY(-2px)}
        ::-webkit-scrollbar{width:6px}::-webkit-scrollbar-thumb{background:rgba(0,0,0,0.08);border-radius:6px}
      `}</style>

      <div style={{ width: 72, background: "#1a1a2e", borderRadius: "0 26px 26px 0", padding: "24px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, position: "sticky", top: 0, height: "100vh", zIndex: 10 }}>
        <div style={{ width: 44, height: 44, borderRadius: 14, background: "linear-gradient(135deg,#FF6B8A,#FF9A76)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, fontSize: 22 }}>🏎️</div>
        {SECTIONS.map((s) => {
          const isActive = activeNav === s.id;
          return (
            <div
              key={s.id}
              className="nav-btn"
              onClick={() => scrollTo(s.id)}
              title={s.label}
              style={{ width: 44, height: 44, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", background: isActive ? "linear-gradient(135deg,#FF6B8A,#FF9A76)" : "transparent", boxShadow: isActive ? "0 4px 18px rgba(255,107,138,0.45)" : "none", position: "relative" }}
            >
              <span style={{ fontSize: 18, filter: isActive ? "none" : "grayscale(0.8) opacity(0.4)" }}>{s.icon}</span>
              {isActive && <div style={{ position: "absolute", left: -2, width: 4, height: 20, borderRadius: 2, background: "#fff" }} />}
            </div>
          );
        })}
      </div>

      <div ref={mainRef} style={{ flex: 1, overflowY: "auto", padding: "32px 34px 48px" }}>
        <div className={`fu d1`} style={{ ...gradCard("#1a1a2e", "#16213e", 160), padding: "32px 34px", marginBottom: 18, opacity: show ? 1 : 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
            <div style={{ maxWidth: 760 }}>
              <div style={{ display: "inline-block", padding: "6px 12px", borderRadius: 20, background: "rgba(255,255,255,0.12)", fontSize: 12, fontWeight: 700, marginBottom: 14 }}>Learning Velocity & Constraint Strategy Dashboard</div>
              <h1 style={{ fontSize: 34, lineHeight: 1.08, marginBottom: 10, fontWeight: 700, color: "#FFF4E6" }}>How a late-starter, heavier driver closes the gap</h1>
            </div>
            <div style={{ minWidth: 240 }}>
              <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 8 }}>Season Span</div>
              <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 12 }}>{DRIVER_PROFILE.seasonSpan}</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <span style={{ background: "rgba(255,255,255,0.12)", padding: "6px 10px", borderRadius: 20, fontSize: 12 }}>Public demo version</span>
                <span style={{ background: "rgba(255,255,255,0.12)", padding: "6px 10px", borderRadius: 20, fontSize: 12 }}>Data can be refined later</span>
              </div>
            </div>
          </div>
        </div>

        <div className={`fu d2`} id="sec-overview" style={{ opacity: show ? 1 : 0 }}>
          <SectionHeader number="01" title="Constraints & Context" />
          <div style={{ display: "grid", gridTemplateColumns: "1.25fr 1fr", gap: 18 }}>
            <div style={card}>
              <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 14, color: "#1a1a2e" }}>Driver profile</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: 13 }}>
                <div><strong>Category:</strong> {DRIVER_PROFILE.category}</div>
                <div><strong>Experience at baseline:</strong> {DRIVER_PROFILE.experienceBaseline}</div>
                <div><strong>Height:</strong> {DRIVER_PROFILE.heightRange}</div>
                <div><strong>Weight:</strong> {DRIVER_PROFILE.weightRange}</div>
                <div><strong>Category avg. weight:</strong> {DRIVER_PROFILE.categoryAverageWeight}</div>
                <div><strong>Home track:</strong> {DRIVER_PROFILE.homeTrack}</div>
              </div>
              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>Track conditions</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {DRIVER_PROFILE.trackTags.map((t) => <span key={t} style={{ background: "#F7F3EE", padding: "6px 10px", borderRadius: 20, fontSize: 12 }}>{t}</span>)}
                </div>
              </div>
              <div style={{ marginTop: 14 }}>
                <div style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>Setup and equipment notes</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                  {DRIVER_PROFILE.setupTags.map((t) => <span key={t} style={{ background: "#FFF0F3", padding: "6px 10px", borderRadius: 20, fontSize: 12 }}>{t}</span>)}
                </div>
                <div style={{ fontSize: 12, color: "#666", lineHeight: 1.55 }}>{DRIVER_PROFILE.equipmentNotes}</div>
              </div>
            </div>
            <div style={{ display: "grid", gap: 16 }}>
              <MetricCard label="Total time gained" value={`${totalSecondsGained.toFixed(1)}s`} subtitle="Median lap time: first session vs latest session" trend={`${paceImprovement}% faster than baseline`} gradient={["#FF6B8A", "#FF9A76"]} icon="⏱️" />
              <MetricCard label="Δ pace per hour" value={`${deltaPerHour}s`} subtitle="Median lap-time gain per cumulative driving hour" trend="Learning velocity, not just endpoint speed" icon="📈" />
              <MetricCard label="Consistency change" value={`${consistencyChange}%`} subtitle="Change in standard deviation from first to latest session" trend="Smaller is more repeatable" icon="🎯" />
            </div>
          </div>
        </div>

        <div className={`fu d3`} id="sec-velocity" style={{ opacity: show ? 1 : 0 }}>
          <SectionHeader number="02" title="Learning Velocity" />
          <div style={card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, gap: 16, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#1a1a2e" }}>Median lap and consistency band by session</div>
                <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>Band shows one standard deviation above and below median lap.</div>
              </div>
              <div style={{ fontSize: 12, color: "#777" }}>{LEARNING_VELOCITY_DATA.length} sessions · {totalHours} cumulative hours</div>
            </div>
            <div style={{ width: "100%", height: 360 }}>
              <ResponsiveContainer>
                <ComposedChart data={LEARNING_VELOCITY_DATA}>
                  <CartesianGrid stroke="#eee" strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis domain={[50, 61]} tick={{ fontSize: 11 }} />
                  <Tooltip content={<ChartTip />} />
                  <Area type="monotone" dataKey="upperBand" stroke="none" fill="rgba(255,154,118,0.15)" />
                  <Area type="monotone" dataKey="lowerBand" stroke="none" fill="#fff" />
                  <Line type="monotone" dataKey="medianLap" name="Median lap" stroke="#FF6B8A" strokeWidth={3} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="bestLap" name="Best lap" stroke="#1a1a2e" strokeWidth={2} dot={{ r: 2 }} connectNulls={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className={`fu d4`} id="sec-coach" style={{ opacity: show ? 1 : 0 }}>
          <SectionHeader number="03" title="Coachability Loop" />
          <div style={{ display: "grid", gap: 14 }}>
            {COACHABILITY_DATA.map((item) => (
              <div key={item.id} className="coach-row" style={{ ...card, transition: "all 0.2s ease" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 20, flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: 260 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: 10, fontSize: 13, lineHeight: 1.55 }}>
                      <div style={{ color: "#888", fontWeight: 700 }}>Coach input</div>
                      <div style={{ color: "#222" }}>{item.input}</div>
                      <div style={{ color: "#888", fontWeight: 700 }}>Intervention</div>
                      <div style={{ color: "#222" }}>{item.intervention}</div>
                      <div style={{ color: "#888", fontWeight: 700 }}>Result metric</div>
                      <div style={{ color: "#222" }}>{item.resultMetric}</div>
                      <div style={{ color: "#888", fontWeight: 700 }}>Result detail</div>
                      <div style={{ color: "#222" }}>{item.resultDetail}</div>
                    </div>
                  </div>
                  <div style={{ minWidth: 120, textAlign: "right" }}>
                    <div style={{ fontSize: 11, color: "#888", marginBottom: 6 }}>Evidence</div>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, marginBottom: 10 }}>{item.evidence}</div>
                    <StatusBadge status={item.status} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`fu d5`} id="sec-data" style={{ opacity: show ? 1 : 0 }}>
          <SectionHeader number="04" title="Data Notes" />
          <div style={{ ...card, display: "grid", gap: 16 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#1a1a2e", marginBottom: 8 }}>Current public version</div>
              <p style={{ fontSize: 13, color: "#555", lineHeight: 1.65 }}>
                This public version is designed to demonstrate the structure of the analysis: constraints, session-level learning velocity, and a coachability loop. It combines real profile details, a real session dataset, and selected coaching notes. Some underlying labels and calculations remain provisional and may be refined after publication.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 14 }}>
              <MetricCard label="Session rows" value={`${LEARNING_VELOCITY_DATA.length}`} subtitle="Current dataset used in dashboard" icon="📑" />
              <MetricCard label="Missing best-lap values" value={`${missingBestLapCount}`} subtitle="Left blank rather than showing suspect values" icon="🧹" />
              <MetricCard label="Coachability entries" value={`${COACHABILITY_DATA.length}`} subtitle="Specific feedback → intervention → result loops" icon="🛠️" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
