import React, { useState } from "react";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const ADMIN_EMAIL = "admin@boarderscafe.jo";
const ADMIN_PASSWORD = "BoardersMafia2024!";

const ROLES = {
  GODFATHER: { name: "Godfather", nameAr: "الغودفاذر", team: "mafia", icon: "👑", desc: "Leader of the Mafia. Appears innocent to Sheriff." },
  SIREN: { name: "Siren", nameAr: "حورية البحر", team: "mafia", icon: "🧜", desc: "Mafia member. Can redirect Sheriff's investigation." },
  MAFIA: { name: "Mafia", nameAr: "مافيا", team: "mafia", icon: "🔫", desc: "Core Mafia muscle." },
  SHERIFF: { name: "Sheriff", nameAr: "الشريف", team: "civilian", icon: "⭐", desc: "Each night, investigates one player to reveal alignment." },
  DOCTOR: { name: "Doctor", nameAr: "الدكتور", team: "civilian", icon: "💊", desc: "Each night, protects one player from elimination." },
  SERIAL_KILLER: { name: "Serial Killer", nameAr: "القاتل المتسلسل", team: "neutral", icon: "🔪", desc: "Lone wolf. Kills independently. Wins alone." },
  SWITCHMAN: { name: "Switchman", nameAr: "المحوّل", team: "civilian", icon: "🔀", desc: "Can swap two players' positions/targets each night." },
  BOMBER: { name: "Bomber", nameAr: "المفجر", team: "civilian", icon: "💣", desc: "Can eliminate one player per game at will." },
  SILENCER: { name: "Silencer", nameAr: "الكاتم", team: "civilian", icon: "🤫", desc: "Can silence one player, preventing them from speaking." },
  CHAMELEON: { name: "Chameleon", nameAr: "الحرباء", team: "civilian", icon: "🦎", desc: "Copies the role of the player sitting next to them." },
  THIEF: { name: "Thief", nameAr: "اللص", team: "civilian", icon: "🦹", desc: "Can steal another player's role card once per game." },
  CIVILIAN: { name: "Civilian", nameAr: "مدني", team: "civilian", icon: "👤", desc: "No special ability. Use logic and deduction." },
};

const XP_TABLE = [0,100,250,450,700,1000,1350,1750,2200,2700,3250,3850,4500,5200,5950,6750,7600,8500,9450,10450];
const RANK_TITLES = ["Rookie","Suspect","Informant","Enforcer","Underboss","Consigliere","Capo","Boss","Don","Godfather"];

function getRank(level) {
  return RANK_TITLES[Math.min(Math.floor(level / 2), RANK_TITLES.length - 1)];
}
function getXPForLevel(lvl) { return XP_TABLE[Math.min(lvl, XP_TABLE.length-1)]; }

const TRANSLATIONS = {
  en: {
    signin: "Sign In", signup: "Sign Up", email: "Email", password: "Password",
    phone: "Phone", name: "Full Name", mainHub: "Hub", games: "Games",
    rankings: "Rankings", profile: "Profile", currentGame: "Current Game",
    gamesPlayed: "Games Played", gamesWon: "Games Won", winRate: "Win Rate",
    upcomingGames: "Upcoming Games", gameHistory: "Game History",
    joinGame: "Join Game", chooseYourSeat: "Choose Your Seat",
    yourRole: "Your Role", vote: "Vote", talking: "Talking Phase",
    voting: "Voting Phase", eliminated: "Eliminated", survived: "Survived",
    won: "Won", lost: "Lost", level: "Level", rank: "Rank",
    language: "Language", saveChanges: "Save Changes",
    followUs: "Follow us on Instagram", admin: "Admin Panel",
    noUpcoming: "No upcoming games", seatTaken: "Seat taken",
    confirmJoin: "Confirm Seat", leaderboard: "Leaderboard",
    xp: "XP", night: "Night", day: "Day", round: "Round",
    beginGame: "Begin Game", endGame: "End Game",
    distributeRoles: "Distribute Roles", nightActions: "Night Actions",
    killed: "Was killed", protected: "Was protected", investigated: "Was investigated",
  },
  ar: {
    signin: "تسجيل الدخول", signup: "إنشاء حساب", email: "الإيميل", password: "كلمة المرور",
    phone: "الهاتف", name: "الاسم الكامل", mainHub: "الرئيسية", games: "الألعاب",
    rankings: "الترتيب", profile: "الملف", currentGame: "اللعبة الحالية",
    gamesPlayed: "المباريات", gamesWon: "الانتصارات", winRate: "نسبة الفوز",
    upcomingGames: "الألعاب القادمة", gameHistory: "سجل الألعاب",
    joinGame: "انضم للعبة", chooseYourSeat: "اختر مقعدك",
    yourRole: "دورك", vote: "صوّت", talking: "جولة الكلام",
    voting: "جولة التصويت", eliminated: "تم إقصاؤه", survived: "نجا",
    won: "فاز", lost: "خسر", level: "المستوى", rank: "الرتبة",
    language: "اللغة", saveChanges: "حفظ التغييرات",
    followUs: "تابعنا على انستغرام", admin: "لوحة الإدارة",
    noUpcoming: "لا توجد ألعاب قادمة", seatTaken: "المقعد محجوز",
    confirmJoin: "تأكيد المقعد", leaderboard: "لوحة الصدارة",
    xp: "نقاط XP", night: "ليل", day: "نهار", round: "الجولة",
    beginGame: "ابدأ اللعبة", endGame: "أنهِ اللعبة",
    distributeRoles: "توزيع الأدوار", nightActions: "أحداث الليل",
    killed: "تم قتله", protected: "تم حمايته", investigated: "تم التحقيق معه",
  }
};

// ─── INITIAL DATA ─────────────────────────────────────────────────────────────
const initUsers = [
  { id: "admin", name: "Admin", email: ADMIN_EMAIL, password: ADMIN_PASSWORD, phone: "0791234567", isAdmin: true, avatar: null, level: 20, xp: 10450, gamesPlayed: 50, gamesWon: 35, history: [], lang: "en" },
  { id: "u1", name: "Rami Khalil", email: "rami@test.com", password: "pass123", phone: "0791111111", isAdmin: false, avatar: null, level: 8, xp: 2800, gamesPlayed: 24, gamesWon: 14, history: [], lang: "en" },
  { id: "u2", name: "Sara Nasser", email: "sara@test.com", password: "pass123", phone: "0792222222", isAdmin: false, avatar: null, level: 5, xp: 1100, gamesPlayed: 15, gamesWon: 7, history: [], lang: "en" },
  { id: "u3", name: "Zaid Mansour", email: "zaid@test.com", password: "pass123", phone: "0793333333", isAdmin: false, avatar: null, level: 12, xp: 5400, gamesPlayed: 38, gamesWon: 22, history: [], lang: "en" },
];

const initUpcoming = [
  { id: "g1", title: "Friday Night Mafia", date: "2026-05-15T20:00", seats: 15, joined: [], status: "upcoming" },
  { id: "g2", title: "Saturday Special", date: "2026-05-16T21:00", seats: 17, joined: [], status: "upcoming" },
];

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [users, setUsers] = useState(initUsers);
  const [upcomingGames, setUpcomingGames] = useState(initUpcoming);
  const [currentUser, setCurrentUser] = useState(null);
  const [page, setPage] = useState("auth"); // auth | hub | games | rankings | profile | currentGame | admin | display
  const [authMode, setAuthMode] = useState("signin");
  const [gameState, setGameState] = useState(null); // active game state
  const [lang, setLang] = useState("en");
  const t = TRANSLATIONS[lang];
  const isRTL = lang === "ar";

  // Update lang from user preference
  useEffect(() => {
    if (currentUser) setLang(currentUser.lang || "en");
  }, [currentUser]);

  const updateUser = (id, updates) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
    if (currentUser?.id === id) setCurrentUser(prev => ({ ...prev, ...updates }));
  };

  const grantXP = (userId, amount) => {
    setUsers(prev => prev.map(u => {
      if (u.id !== userId) return u;
      let newXP = u.xp + amount;
      let newLevel = u.level;
      while (newLevel < 19 && newXP >= getXPForLevel(newLevel + 1)) newLevel++;
      const updated = { ...u, xp: newXP, level: newLevel };
      if (currentUser?.id === userId) setCurrentUser(updated);
      return updated;
    }));
  };

  const props = { users, setUsers, upcomingGames, setUpcomingGames, currentUser, setCurrentUser, page, setPage, authMode, setAuthMode, gameState, setGameState, lang, setLang, t, isRTL, updateUser, grantXP };

  return (
    <div style={{ fontFamily: "'Rajdhani', sans-serif", minHeight: "100vh", background: "#0a0a0a", color: "#fff", direction: isRTL ? "rtl" : "ltr" }}>
      <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Cinzel:wght@700;900&family=Cairo:wght@400;600;700&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #111; } ::-webkit-scrollbar-thumb { background: #2d7a3a; border-radius: 2px; }
        .btn-green { background: linear-gradient(135deg, #2d7a3a, #1a5c26); border: 1px solid #3a9e4a; color: #fff; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-family: 'Rajdhani', sans-serif; font-size: 15px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; transition: all 0.2s; }
        .btn-green:hover { background: linear-gradient(135deg, #3a9e4a, #2d7a3a); transform: translateY(-1px); box-shadow: 0 4px 20px rgba(45,122,58,0.4); }
        .btn-outline { background: transparent; border: 1px solid #2d7a3a; color: #2d7a3a; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-family: 'Rajdhani', sans-serif; font-size: 14px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; transition: all 0.2s; }
        .btn-outline:hover { background: rgba(45,122,58,0.1); }
        .btn-red { background: linear-gradient(135deg, #7a2d2d, #5c1a1a); border: 1px solid #9e3a3a; color: #fff; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-family: 'Rajdhani', sans-serif; font-size: 14px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; transition: all 0.2s; }
        .btn-red:hover { background: linear-gradient(135deg, #9e3a3a, #7a2d2d); }
        .card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 20px; }
        .input-field { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); border-radius: 10px; padding: 12px 16px; color: #fff; font-family: 'Rajdhani', sans-serif; font-size: 15px; outline: none; transition: border 0.2s; }
        .input-field:focus { border-color: #2d7a3a; }
        .input-field::placeholder { color: rgba(255,255,255,0.3); }
        .nav-item { display: flex; flex-direction: column; align-items: center; gap: 3px; cursor: pointer; padding: 8px 14px; border-radius: 10px; transition: all 0.2s; opacity: 0.5; font-size: 10px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; }
        .nav-item.active { opacity: 1; color: #2d7a3a; }
        .nav-item:hover { opacity: 0.8; }
        .xp-bar { height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden; }
        .xp-fill { height: 100%; background: linear-gradient(90deg, #2d7a3a, #5ecf74); border-radius: 3px; transition: width 0.5s; }
        .tag { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; }
        .tag-mafia { background: rgba(160,30,30,0.2); border: 1px solid rgba(160,30,30,0.4); color: #e05555; }
        .tag-civilian { background: rgba(45,122,58,0.2); border: 1px solid rgba(45,122,58,0.4); color: #5ecf74; }
        .tag-neutral { background: rgba(180,140,0,0.2); border: 1px solid rgba(180,140,0,0.4); color: #f0c040; }
        .pulse { animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        .fade-in { animation: fadeIn 0.3s ease; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .glow { box-shadow: 0 0 20px rgba(45,122,58,0.3); }
        .seat-btn { width: 56px; height: 56px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.04); color: #fff; font-size: 16px; font-weight: 700; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; }
        .seat-btn:hover:not(:disabled) { border-color: #2d7a3a; background: rgba(45,122,58,0.2); transform: scale(1.1); }
        .seat-btn.taken { opacity: 0.3; cursor: not-allowed; }
        .seat-btn.mine { border-color: #5ecf74; background: rgba(45,122,58,0.3); box-shadow: 0 0 12px rgba(45,122,58,0.5); }
        .role-card { background: linear-gradient(135deg, #111, #1a1a1a); border: 2px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 28px 20px; text-align: center; position: relative; overflow: hidden; }
        .role-card::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(45,122,58,0.08), transparent); }
        .timer { font-family: 'Cinzel', serif; font-size: 48px; color: #5ecf74; text-shadow: 0 0 20px rgba(94,207,116,0.5); }
        .admin-badge { background: linear-gradient(135deg, #ffd700, #ff9900); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 900; }
        .eliminated-overlay { position: absolute; inset: 0; background: rgba(160,30,30,0.15); border: 2px solid rgba(160,30,30,0.4); border-radius: 12px; display: flex; align-items: center; justify-content: center; }
        .rank-badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; border-radius: 20px; background: linear-gradient(135deg, rgba(45,122,58,0.2), rgba(45,122,58,0.05)); border: 1px solid rgba(45,122,58,0.3); font-size: 12px; font-weight: 700; color: #5ecf74; text-transform: uppercase; letter-spacing: 1px; }
      `}</style>

      {page === "auth" && <AuthPage {...props} />}
      {page === "display" && <DisplayScreen {...props} />}
      {page !== "auth" && page !== "display" && (
        <div style={{ maxWidth: 480, margin: "0 auto", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
          <div style={{ flex: 1, overflowY: "auto", paddingBottom: 80 }}>
            {page === "hub" && <HubPage {...props} />}
            {page === "games" && <GamesPage {...props} />}
            {page === "rankings" && <RankingsPage {...props} />}
            {page === "profile" && <ProfilePage {...props} />}
            {page === "currentGame" && <CurrentGamePage {...props} />}
            {page === "admin" && currentUser?.isAdmin && <AdminPage {...props} />}
          </div>
          <BottomNav {...props} />
        </div>
      )}
    </div>
  );
}

// ─── AUTH ─────────────────────────────────────────────────────────────────────
function AuthPage({ users, setUsers, setCurrentUser, setPage, authMode, setAuthMode, t, isRTL }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");

  const handle = (field, val) => setForm(p => ({ ...p, [field]: val }));

  const submit = () => {
    if (authMode === "signin") {
      const user = users.find(u => u.email === form.email && u.password === form.password);
      if (!user) return setError("Invalid email or password");
      setCurrentUser(user);
      setPage(user.isAdmin ? "admin" : "hub");
    } else {
      if (!form.name || !form.email || !form.phone || !form.password) return setError("All fields are required");
      if (users.find(u => u.email === form.email)) return setError("Email already registered");
      const newUser = { id: "u" + Date.now(), name: form.name, email: form.email, phone: form.phone, password: form.password, isAdmin: false, avatar: null, level: 1, xp: 0, gamesPlayed: 0, gamesWon: 0, history: [], lang: "en" };
      setUsers(p => [...p, newUser]);
      setCurrentUser(newUser);
      setPage("hub");
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, background: "radial-gradient(ellipse at 50% 0%, rgba(45,122,58,0.15) 0%, #0a0a0a 60%)" }}>
      <div style={{ marginBottom: 40, textAlign: "center" }}>
        <div style={{ fontSize: 52, marginBottom: 8 }}>🎭</div>
        <div style={{ fontFamily: "'Cinzel', serif", fontSize: 32, fontWeight: 900, letterSpacing: 2 }}>BOARDERS</div>
        <div style={{ fontFamily: "'Cinzel', serif", fontSize: 20, color: "#2d7a3a", letterSpacing: 6 }}>MAFIA</div>
      </div>

      <div className="card fade-in" style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ display: "flex", marginBottom: 24, background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: 4 }}>
          {["signin", "signup"].map(m => (
            <button key={m} onClick={() => { setAuthMode(m); setError(""); }} style={{ flex: 1, padding: "10px", border: "none", borderRadius: 8, background: authMode === m ? "#2d7a3a" : "transparent", color: "#fff", cursor: "pointer", fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: 1, textTransform: "uppercase", transition: "all 0.2s" }}>
              {m === "signin" ? t.signin : t.signup}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {authMode === "signup" && <input className="input-field" placeholder={t.name} value={form.name} onChange={e => handle("name", e.target.value)} />}
          <input className="input-field" placeholder={t.email} value={form.email} onChange={e => handle("email", e.target.value)} type="email" />
          {authMode === "signup" && <input className="input-field" placeholder={t.phone} value={form.phone} onChange={e => handle("phone", e.target.value)} type="tel" />}
          <input className="input-field" placeholder={t.password} value={form.password} onChange={e => handle("password", e.target.value)} type="password" />
          {error && <div style={{ color: "#e05555", fontSize: 13, fontWeight: 600 }}>{error}</div>}
          <button className="btn-green" style={{ width: "100%", marginTop: 4 }} onClick={submit}>
            {authMode === "signin" ? t.signin : t.signup}
          </button>
        </div>

        <div style={{ marginTop: 16, textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
          Admin: {ADMIN_EMAIL} / {ADMIN_PASSWORD}
        </div>
      </div>
    </div>
  );
}

// ─── BOTTOM NAV ───────────────────────────────────────────────────────────────
function BottomNav({ page, setPage, currentUser, gameState, t }) {
  const items = [
    { id: "hub", icon: "🏠", label: t.mainHub },
    { id: "games", icon: "🃏", label: t.games },
    { id: "currentGame", icon: "🎭", label: t.currentGame },
    { id: "rankings", icon: "🏆", label: t.rankings },
    { id: "profile", icon: "👤", label: t.profile },
  ];
  if (currentUser?.isAdmin) items.push({ id: "admin", icon: "⚙️", label: t.admin });

  return (
    <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: "rgba(10,10,10,0.95)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-around", padding: "8px 4px", zIndex: 100 }}>
      {items.map(item => (
        <div key={item.id} className={`nav-item ${page === item.id ? "active" : ""}`} onClick={() => setPage(item.id)}>
          <span style={{ fontSize: 20 }}>{item.icon}</span>
          <span>{item.label}</span>
          {item.id === "currentGame" && gameState?.status === "active" && (
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#5ecf74" }} className="pulse" />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── HUB ──────────────────────────────────────────────────────────────────────
function HubPage({ currentUser, upcomingGames, setUpcomingGames, gameState, setPage, t, isRTL }) {
  const u = currentUser;
  const winRate = u.gamesPlayed > 0 ? Math.round((u.gamesWon / u.gamesPlayed) * 100) : 0;
  const nextLevelXP = getXPForLevel(u.level + 1);
  const xpProgress = nextLevelXP > 0 ? Math.min((u.xp / nextLevelXP) * 100, 100) : 100;

  return (
    <div className="fade-in" style={{ padding: "20px 16px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <div style={{ fontFamily: "'Cinzel',serif", fontSize: 22, fontWeight: 900 }}>BOARDERS</div>
          <div style={{ fontFamily: "'Cinzel',serif", fontSize: 13, color: "#2d7a3a", letterSpacing: 4 }}>MAFIA</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ textAlign: isRTL ? "left" : "right" }}>
            <div style={{ fontSize: 15, fontWeight: 700 }}>{u.name}</div>
            <div className="rank-badge">{getRank(u.level)} · Lvl {u.level}</div>
          </div>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg, #2d7a3a, #1a5c26)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, border: "2px solid #3a9e4a" }}>
            {u.avatar ? <img src={u.avatar} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} /> : u.name[0]}
          </div>
        </div>
      </div>

      {/* XP Bar */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13 }}>
          <span style={{ color: "rgba(255,255,255,0.5)" }}>{t.level} {u.level}</span>
          <span style={{ color: "#5ecf74" }}>{u.xp} / {nextLevelXP} {t.xp}</span>
        </div>
        <div className="xp-bar"><div className="xp-fill" style={{ width: `${xpProgress}%` }} /></div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
        {[
          { label: t.gamesPlayed, value: u.gamesPlayed, icon: "🎮" },
          { label: t.gamesWon, value: u.gamesWon, icon: "🏆" },
          { label: t.winRate, value: winRate + "%", icon: "📊" },
        ].map(s => (
          <div key={s.label} className="card" style={{ textAlign: "center" }}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#5ecf74" }}>{s.value}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 0.5 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Upcoming Games */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>{t.upcomingGames}</div>
        {upcomingGames.filter(g => g.status === "upcoming").length === 0
          ? <div className="card" style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: 14 }}>{t.noUpcoming}</div>
          : upcomingGames.filter(g => g.status === "upcoming").map(game => (
            <UpcomingGameCard key={game.id} game={game} currentUser={currentUser} upcomingGames={upcomingGames} setUpcomingGames={setUpcomingGames} t={t} setPage={setPage} />
          ))}
      </div>

      {/* Instagram */}
      <a href="https://www.instagram.com/boarderscafe.jo?igsh=ZjFpc25kaGx2Mjg1" target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", borderRadius: 14, background: "linear-gradient(135deg, rgba(225,48,108,0.15), rgba(193,53,132,0.1))", border: "1px solid rgba(225,48,108,0.2)", textDecoration: "none", color: "#fff" }}>
        <span style={{ fontSize: 28 }}>📸</span>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15 }}>{t.followUs}</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>@boarderscafe.jo</div>
        </div>
        <span style={{ marginLeft: "auto", color: "rgba(255,255,255,0.4)" }}>→</span>
      </a>
    </div>
  );
}

function UpcomingGameCard({ game, currentUser, upcomingGames, setUpcomingGames, t, setPage }) {
  const joined = game.joined.includes(currentUser?.id);
  const date = new Date(game.date);

  const joinGame = () => {
    if (joined) return;
    setUpcomingGames(prev => prev.map(g => g.id === game.id ? { ...g, joined: [...g.joined, currentUser.id] } : g));
    setPage("currentGame");
  };

  return (
    <div className="card" style={{ marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{game.title}</div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
          🗓 {date.toLocaleDateString()} · {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          <span style={{ marginLeft: 8 }}>💺 {game.seats} seats</span>
        </div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>{game.joined.length} joined</div>
      </div>
      <button className={joined ? "btn-outline" : "btn-green"} style={{ fontSize: 12, padding: "8px 14px" }} onClick={joinGame}>
        {joined ? "✓ Joined" : t.joinGame}
      </button>
    </div>
  );
}

// ─── GAMES PAGE ───────────────────────────────────────────────────────────────
function GamesPage({ currentUser, upcomingGames, setUpcomingGames, gameState, setPage, t }) {
  const [tab, setTab] = useState("upcoming");
  const history = currentUser?.history || [];

  return (
    <div className="fade-in" style={{ padding: "20px 16px" }}>
      <div style={{ fontFamily: "'Cinzel',serif", fontSize: 20, fontWeight: 900, marginBottom: 20 }}>{t.games}</div>

      <div style={{ display: "flex", background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: 4, marginBottom: 20 }}>
        {[{ id: "upcoming", label: t.upcomingGames }, { id: "history", label: t.gameHistory }].map(tab_ => (
          <button key={tab_.id} onClick={() => setTab(tab_.id)} style={{ flex: 1, padding: "10px", border: "none", borderRadius: 8, background: tab === tab_.id ? "#2d7a3a" : "transparent", color: "#fff", cursor: "pointer", fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: 1, textTransform: "uppercase", transition: "all 0.2s" }}>
            {tab_.label}
          </button>
        ))}
      </div>

      {tab === "upcoming" && (
        <div>
          {upcomingGames.filter(g => g.status === "upcoming").map(game => (
            <UpcomingGameCard key={game.id} game={game} currentUser={currentUser} upcomingGames={upcomingGames} setUpcomingGames={setUpcomingGames} t={t} setPage={setPage} />
          ))}
          {upcomingGames.filter(g => g.status === "upcoming").length === 0 && (
            <div className="card" style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", padding: 40 }}>{t.noUpcoming}</div>
          )}
        </div>
      )}

      {tab === "history" && (
        <div>
          {history.length === 0 && (
            <div className="card" style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", padding: 40 }}>No games played yet</div>
          )}
          {history.map((game, i) => (
            <div key={i} className="card" style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div style={{ fontWeight: 700 }}>{game.title}</div>
                <span className={`tag ${game.won ? "tag-civilian" : "tag-mafia"}`}>{game.won ? t.won : t.lost}</span>
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", display: "flex", gap: 16, flexWrap: "wrap" }}>
                <span>Role: {ROLES[game.role]?.icon} {ROLES[game.role]?.name}</span>
                <span>{game.survived ? `✅ ${t.survived}` : `❌ ${t.eliminated}`}</span>
                <span>+{game.xpGained} XP</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── CURRENT GAME ─────────────────────────────────────────────────────────────
function CurrentGamePage({ currentUser, upcomingGames, setUpcomingGames, gameState, setGameState, users, setUsers, updateUser, grantXP, t, isRTL }) {
  const joinedGame = upcomingGames.find(g => g.joined.includes(currentUser?.id) && (g.status === "upcoming" || g.status === "active"));
  const [mySeat, setMySeat] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [myVote, setMyVote] = useState(null);

  // Find my seat from gameState
  useEffect(() => {
    if (gameState?.players) {
      const me = gameState.players.find(p => p.userId === currentUser?.id);
      if (me) setMySeat(me.seat);
    }
  }, [gameState]);

  if (!joinedGame) {
    return (
      <div style={{ padding: 24, textAlign: "center" }}>
        <div style={{ fontSize: 60, marginBottom: 16 }}>🎭</div>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{t.currentGame}</div>
        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>You haven't joined any upcoming game yet.</div>
      </div>
    );
  }

  // Seat selection
  if (!mySeat && joinedGame.status === "upcoming") {
    const takenSeats = (gameState?.players || []).map(p => p.seat);
    const seats = Array.from({ length: joinedGame.seats }, (_, i) => i + 1);
    const selectSeat = (seat) => {
      if (takenSeats.includes(seat)) return;
      const newPlayer = { userId: currentUser.id, name: currentUser.name, seat, role: null, eliminated: false, avatar: currentUser.avatar };
      setGameState(prev => {
        const base = prev || { gameId: joinedGame.id, title: joinedGame.title, players: [], phase: "waiting", round: 0, nightLog: [], votes: {}, talkingOrder: 1 };
        const existingIdx = base.players.findIndex(p => p.userId === currentUser.id);
        const players = existingIdx >= 0
          ? base.players.map(p => p.userId === currentUser.id ? { ...p, seat } : p)
          : [...base.players, newPlayer];
        return { ...base, players };
      });
      setMySeat(seat);
    };

    return (
      <div className="fade-in" style={{ padding: "20px 16px" }}>
        <div style={{ fontFamily: "'Cinzel',serif", fontSize: 20, fontWeight: 900, marginBottom: 4 }}>{joinedGame.title}</div>
        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginBottom: 28 }}>{t.chooseYourSeat}</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
          {seats.map(s => (
            <button key={s} className={`seat-btn ${takenSeats.includes(s) ? "taken" : ""}`} onClick={() => selectSeat(s)} disabled={takenSeats.includes(s)}>
              {s}
            </button>
          ))}
        </div>
        {mySeat && <div style={{ textAlign: "center", marginTop: 20, color: "#5ecf74", fontWeight: 700 }}>✓ Seat {mySeat} selected!</div>}
      </div>
    );
  }

  if (!gameState || gameState.phase === "waiting") {
    return (
      <div className="fade-in" style={{ padding: 24, textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
        <div style={{ fontFamily: "'Cinzel',serif", fontSize: 20, fontWeight: 900, marginBottom: 8 }}>{joinedGame.title}</div>
        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginBottom: 20 }}>Waiting for admin to start the game...</div>
        {mySeat && <div className="card" style={{ display: "inline-block", padding: "14px 28px" }}><span style={{ fontSize: 28, fontWeight: 900, color: "#5ecf74" }}>#{mySeat}</span><br /><span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Your Seat</span></div>}
        <div style={{ marginTop: 20, color: "rgba(255,255,255,0.3)", fontSize: 13 }}>{(gameState?.players || []).length} / {joinedGame.seats} players joined</div>
      </div>
    );
  }

  const me = gameState.players?.find(p => p.userId === currentUser.id);
  const myRole = me?.role ? ROLES[me.role] : null;
  const activePlayers = gameState.players?.filter(p => !p.eliminated) || [];
  const isMyTurnToTalk = gameState.phase === "talking" && gameState.talkingOrder === me?.seat;
  const isVotingPhase = gameState.phase === "voting";

  return (
    <div className="fade-in" style={{ padding: "16px" }}>
      {/* Game Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>{gameState.title}</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
            {t.round} {gameState.round} · {gameState.phase === "night" ? "🌙 " + t.night : gameState.phase === "voting" ? "🗳 " + t.voting : gameState.phase === "talking" ? "💬 " + t.talking : "🌅 " + t.day}
          </div>
        </div>
        {me?.eliminated && <span className="tag tag-mafia">ELIMINATED</span>}
      </div>

      {/* My Role Card */}
      {myRole && (
        <div className="role-card" style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>{t.yourRole}</div>
          <div style={{ fontSize: 52, marginBottom: 8 }}>{myRole.icon}</div>
          <div style={{ fontFamily: "'Cinzel',serif", fontSize: 22, fontWeight: 900, marginBottom: 6 }}>{myRole.name}</div>
          <span className={`tag tag-${myRole.team}`}>{myRole.team.toUpperCase()}</span>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 12, lineHeight: 1.5 }}>{myRole.desc}</div>
        </div>
      )}

      {/* Talking Phase */}
      {isMyTurnToTalk && (
        <div className="card glow" style={{ marginBottom: 16, borderColor: "#5ecf74", textAlign: "center" }}>
          <div className="pulse" style={{ fontSize: 13, color: "#5ecf74", fontWeight: 700, marginBottom: 4 }}>IT'S YOUR TURN TO TALK</div>
          <TalkTimer seconds={30} />
        </div>
      )}

      {/* Voting Phase */}
      {isVotingPhase && !me?.eliminated && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: "#f0c040" }}>🗳 {t.voting} — Choose who to eliminate</div>
          {hasVoted
            ? <div className="card" style={{ textAlign: "center", color: "#5ecf74", fontWeight: 700 }}>✓ Vote submitted for Seat #{myVote}</div>
            : <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {activePlayers.filter(p => p.userId !== currentUser.id).sort((a, b) => a.seat - b.seat).map(p => (
                  <button key={p.userId} onClick={() => {
                    setMyVote(p.seat);
                    setHasVoted(true);
                    setGameState(prev => ({ ...prev, votes: { ...(prev.votes || {}), [currentUser.id]: p.userId } }));
                  }} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer", color: "#fff", transition: "all 0.2s", textAlign: "left" }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #333, #222)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, border: "1px solid rgba(255,255,255,0.1)" }}>{p.seat}</div>
                    <span style={{ fontWeight: 700 }}>{p.name}</span>
                    <span style={{ marginLeft: "auto", color: "rgba(255,255,255,0.3)", fontSize: 20 }}>→</span>
                  </button>
                ))}
              </div>
          }
        </div>
      )}

      {/* Players List */}
      <div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Players ({activePlayers.length} active)</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {(gameState.players || []).sort((a, b) => a.seat - b.seat).map(p => (
            <div key={p.userId} style={{ position: "relative", padding: "10px 12px", borderRadius: 12, background: "rgba(255,255,255,0.03)", border: `1px solid ${p.eliminated ? "rgba(160,30,30,0.3)" : gameState.talkingOrder === p.seat && gameState.phase === "talking" ? "rgba(94,207,116,0.4)" : "rgba(255,255,255,0.07)"}`, opacity: p.eliminated ? 0.5 : 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg, #2d7a3a22, #111)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 13, border: "1px solid rgba(255,255,255,0.1)" }}>{p.seat}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.2 }}>{p.name}</div>
                  {p.eliminated && <div style={{ fontSize: 10, color: "#e05555" }}>ELIMINATED</div>}
                </div>
              </div>
              {gameState.talkingOrder === p.seat && gameState.phase === "talking" && !p.eliminated && (
                <div style={{ position: "absolute", top: 6, right: 8, width: 8, height: 8, borderRadius: "50%", background: "#5ecf74" }} className="pulse" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Night Log */}
      {gameState.nightLog && gameState.nightLog.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Night Events</div>
          {gameState.nightLog.slice(-5).map((log, i) => (
            <div key={i} style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", padding: "6px 12px", borderLeft: "2px solid rgba(255,255,255,0.1)", marginBottom: 4 }}>{log}</div>
          ))}
        </div>
      )}
    </div>
  );
}

function TalkTimer({ seconds: init }) {
  const [s, setS] = useState(init);
  useEffect(() => {
    const iv = setInterval(() => setS(p => p > 0 ? p - 1 : 0), 1000);
    return () => clearInterval(iv);
  }, []);
  return <div className="timer">{String(s).padStart(2, "0")}s</div>;
}

// ─── RANKINGS ─────────────────────────────────────────────────────────────────
function RankingsPage({ users, currentUser, t }) {
  const sorted = [...users].filter(u => !u.isAdmin).sort((a, b) => b.xp - a.xp).slice(0, 100);

  return (
    <div className="fade-in" style={{ padding: "20px 16px" }}>
      <div style={{ fontFamily: "'Cinzel',serif", fontSize: 20, fontWeight: 900, marginBottom: 4 }}>{t.leaderboard}</div>
      <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginBottom: 20 }}>Top 100 Players</div>

      {sorted.map((u, i) => {
        const isMe = u.id === currentUser?.id;
        const nextXP = getXPForLevel(u.level + 1);
        const prog = nextXP > 0 ? Math.min((u.xp / nextXP) * 100, 100) : 100;

        return (
          <div key={u.id} className="card" style={{ marginBottom: 10, borderColor: isMe ? "rgba(45,122,58,0.4)" : undefined, background: isMe ? "rgba(45,122,58,0.06)" : undefined }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ minWidth: 32, textAlign: "center", fontFamily: "'Cinzel',serif", fontWeight: 900, fontSize: i < 3 ? 20 : 16, color: i === 0 ? "#ffd700" : i === 1 ? "#c0c0c0" : i === 2 ? "#cd7f32" : "rgba(255,255,255,0.3)" }}>
                {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
              </div>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg, #2d7a3a, #1a5c26)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 16, border: isMe ? "2px solid #5ecf74" : "1px solid rgba(255,255,255,0.1)" }}>
                {u.avatar ? <img src={u.avatar} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} /> : u.name[0]}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                  <span style={{ fontWeight: 700, fontSize: 15 }}>{u.name} {isMe ? "(You)" : ""}</span>
                  <span style={{ fontSize: 12, color: "#5ecf74", fontWeight: 700 }}>Lvl {u.level}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span className="rank-badge" style={{ fontSize: 10 }}>{getRank(u.level)}</span>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{u.xp.toLocaleString()} XP</span>
                </div>
                <div className="xp-bar"><div className="xp-fill" style={{ width: `${prog}%` }} /></div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── PROFILE ──────────────────────────────────────────────────────────────────
function ProfilePage({ currentUser, updateUser, setLang, t, isRTL }) {
  const u = currentUser;
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: u.name, phone: u.phone });
  const fileRef = useRef();
  const winRate = u.gamesPlayed > 0 ? Math.round((u.gamesWon / u.gamesPlayed) * 100) : 0;

  const saveProfile = () => {
    updateUser(u.id, form);
    setEditing(false);
  };

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateUser(u.id, { avatar: reader.result });
    reader.readAsDataURL(file);
  };

  const switchLang = (l) => {
    setLang(l);
    updateUser(u.id, { lang: l });
  };

  return (
    <div className="fade-in" style={{ padding: "20px 16px" }}>
      <div style={{ fontFamily: "'Cinzel',serif", fontSize: 20, fontWeight: 900, marginBottom: 20 }}>{t.profile}</div>

      {/* Avatar */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <div style={{ width: 90, height: 90, borderRadius: "50%", background: "linear-gradient(135deg, #2d7a3a, #1a5c26)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, border: "3px solid #3a9e4a", margin: "0 auto 8px" }}>
            {u.avatar ? <img src={u.avatar} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} /> : u.name[0]}
          </div>
          <button onClick={() => fileRef.current.click()} style={{ position: "absolute", bottom: 8, right: 0, width: 28, height: 28, borderRadius: "50%", background: "#2d7a3a", border: "2px solid #0a0a0a", cursor: "pointer", fontSize: 14, color: "#fff" }}>✏️</button>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleAvatar} />
        </div>
        <div style={{ fontFamily: "'Cinzel',serif", fontSize: 20, fontWeight: 900 }}>{u.name}</div>
        <div className="rank-badge" style={{ margin: "6px auto", display: "inline-flex" }}>{getRank(u.level)} · Level {u.level}</div>
        {u.isAdmin && <div style={{ fontSize: 14, fontWeight: 900, color: "#ffd700", marginTop: 4 }}>⚙️ ADMIN</div>}
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
        {[
          { label: t.gamesPlayed, value: u.gamesPlayed }, { label: t.gamesWon, value: u.gamesWon },
          { label: t.winRate, value: winRate + "%" }, { label: t.xp, value: u.xp.toLocaleString() },
        ].map(s => (
          <div key={s.label} className="card" style={{ textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#5ecf74" }}>{s.value}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Edit Info */}
      {editing ? (
        <div className="card" style={{ marginBottom: 16 }}>
          <input className="input-field" style={{ marginBottom: 10 }} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder={t.name} />
          <input className="input-field" style={{ marginBottom: 14 }} value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder={t.phone} />
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn-green" style={{ flex: 1 }} onClick={saveProfile}>{t.saveChanges}</button>
            <button className="btn-outline" style={{ flex: 1 }} onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>📧 {u.email}</span>
          </div>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginBottom: 12 }}>📱 {u.phone}</div>
          <button className="btn-outline" style={{ width: "100%" }} onClick={() => setEditing(true)}>Edit Profile</button>
        </div>
      )}

      {/* Language */}
      <div className="card">
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>{t.language}</div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className={`btn-${u.lang === "en" ? "green" : "outline"}`} style={{ flex: 1 }} onClick={() => switchLang("en")}>🇬🇧 English</button>
          <button className={`btn-${u.lang === "ar" ? "green" : "outline"}`} style={{ flex: 1 }} onClick={() => switchLang("ar")}>🇯🇴 العربية</button>
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN PANEL ──────────────────────────────────────────────────────────────
function AdminPage({ users, setUsers, upcomingGames, setUpcomingGames, gameState, setGameState, grantXP, t, setPage }) {
  const [adminTab, setAdminTab] = useState("games");
  const [newGame, setNewGame] = useState({ title: "", date: "", seats: 15 });
  const [nightTarget, setNightTarget] = useState("");
  const [nightAction, setNightAction] = useState("killed");
  const [mafiaCount, setMafiaCount] = useState(3);
  const [showChameleon, setShowChameleon] = useState(false);
  const [showThief, setShowThief] = useState(false);

  const createGame = () => {
    if (!newGame.title || !newGame.date) return;
    setUpcomingGames(prev => [...prev, { id: "g" + Date.now(), ...newGame, joined: [], status: "upcoming" }]);
    setNewGame({ title: "", date: "", seats: 15 });
  };

  const beginGame = (gameId) => {
    const game = upcomingGames.find(g => g.id === gameId);
    if (!game) return;

    // Build players from gameState
    const existingPlayers = gameState?.players || [];
    let playerList = [...existingPlayers];

    // Auto-add joined players who haven't picked seats
    game.joined.forEach(uid => {
      if (!playerList.find(p => p.userId === uid)) {
        const u = users.find(u => u.id === uid);
        if (u) {
          const usedSeats = playerList.map(p => p.seat);
          let seat = 1;
          while (usedSeats.includes(seat)) seat++;
          playerList.push({ userId: uid, name: u.name, seat, role: null, eliminated: false, avatar: u.avatar });
        }
      }
    });

    // Distribute roles
    const rolePool = [
      "GODFATHER", "SIREN",
      ...Array(mafiaCount).fill("MAFIA"),
      "SHERIFF", "DOCTOR", "SERIAL_KILLER", "SWITCHMAN", "BOMBER", "SILENCER",
    ];
    if (showChameleon) rolePool.push("CHAMELEON");
    if (showThief) rolePool.push("THIEF");
    // Fill rest with civilians
    while (rolePool.length < playerList.length) rolePool.push("CIVILIAN");
    const shuffled = [...rolePool].sort(() => Math.random() - 0.5).slice(0, playerList.length);
    playerList = playerList.map((p, i) => ({ ...p, role: shuffled[i] }));

    setGameState({ gameId, title: game.title, players: playerList, phase: "talking", round: 1, talkingOrder: 1, nightLog: [], votes: {}, status: "active" });
    setUpcomingGames(prev => prev.map(g => g.id === gameId ? { ...g, status: "active" } : g));
    setAdminTab("control");
  };

  const nightEliminate = () => {
    if (!nightTarget) return;
    const seat = parseInt(nightTarget);
    const player = gameState?.players?.find(p => p.seat === seat);
    if (!player) return;
    const logMsg = `🌙 Night ${gameState.round}: Seat #${seat} (${player.name}) ${nightAction}`;
    if (nightAction === "killed") {
      setGameState(prev => ({
        ...prev,
        players: prev.players.map(p => p.seat === seat ? { ...p, eliminated: true } : p),
        nightLog: [...(prev.nightLog || []), logMsg],
        phase: "talking", talkingOrder: 1, round: prev.round + 1,
      }));
    } else {
      setGameState(prev => ({ ...prev, nightLog: [...(prev.nightLog || []), logMsg] }));
    }
    setNightTarget("");
  };

  const nextTalker = () => {
    if (!gameState) return;
    const activePlayers = gameState.players.filter(p => !p.eliminated).sort((a, b) => a.seat - b.seat);
    const currentIdx = activePlayers.findIndex(p => p.seat === gameState.talkingOrder);
    if (currentIdx < activePlayers.length - 1) {
      setGameState(prev => ({ ...prev, talkingOrder: activePlayers[currentIdx + 1].seat }));
    } else {
      setGameState(prev => ({ ...prev, phase: "voting", talkingOrder: null }));
    }
  };

  const resolveVotes = () => {
    if (!gameState) return;
    const voteCounts = {};
    Object.values(gameState.votes || {}).forEach(targetId => {
      const player = gameState.players.find(p => p.userId === targetId);
      if (player) voteCounts[player.seat] = (voteCounts[player.seat] || 0) + 1;
    });
    const topSeat = Object.keys(voteCounts).sort((a, b) => voteCounts[b] - voteCounts[a])[0];
    if (!topSeat) return;
    const eliminated = gameState.players.find(p => p.seat === parseInt(topSeat));
    const isMafia = eliminated && ROLES[eliminated.role]?.team === "mafia";
    const logMsg = `🗳 Round ${gameState.round}: Seat #${topSeat} (${eliminated?.name}) voted out${isMafia ? " [MAFIA]" : ""}`;

    // Grant XP to voters who voted correctly
    if (isMafia) {
      Object.entries(gameState.votes || {}).forEach(([voterId, targetId]) => {
        if (targetId === eliminated.userId) grantXP(voterId, 50);
      });
    }

    setGameState(prev => ({
      ...prev,
      players: prev.players.map(p => p.seat === parseInt(topSeat) ? { ...p, eliminated: true } : p),
      nightLog: [...(prev.nightLog || []), logMsg],
      phase: "night", votes: {},
    }));
  };

  const endGame = (winnerTeam) => {
    if (!gameState) return;
    gameState.players.forEach(p => {
      const userObj = users.find(u => u.id === p.userId);
      if (!userObj || userObj.isAdmin) return;
      const role = ROLES[p.role];
      const won = role?.team === winnerTeam;
      const xpGain = won ? 100 : 30;
      grantXP(p.userId, xpGain);
      const histEntry = { title: gameState.title, role: p.role, won, survived: !p.eliminated, xpGained: xpGain, date: new Date().toISOString() };
      setUsers(prev => prev.map(u => u.id === p.userId ? { ...u, gamesPlayed: u.gamesPlayed + 1, gamesWon: won ? u.gamesWon + 1 : u.gamesWon, history: [histEntry, ...(u.history || [])] } : u));
    });
    setGameState(null);
    setUpcomingGames(prev => prev.map(g => g.id === gameState.gameId ? { ...g, status: "completed" } : g));
  };

  const openDisplay = () => setPage("display");

  return (
    <div className="fade-in" style={{ padding: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <div style={{ fontFamily: "'Cinzel',serif", fontSize: 20, fontWeight: 900 }}>{t.admin}</div>
          <div style={{ fontSize: 12, color: "#ffd700" }} className="admin-badge">⚙️ ADMIN ACCESS</div>
        </div>
        <button className="btn-outline" style={{ fontSize: 12 }} onClick={openDisplay}>📺 Display Screen</button>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: 4, marginBottom: 20, overflowX: "auto", gap: 4 }}>
        {["games", "control", "players", "night"].map(tab => (
          <button key={tab} onClick={() => setAdminTab(tab)} style={{ flex: 1, minWidth: 70, padding: "8px 6px", border: "none", borderRadius: 8, background: adminTab === tab ? "#2d7a3a" : "transparent", color: "#fff", cursor: "pointer", fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: 1, textTransform: "uppercase", transition: "all 0.2s", whiteSpace: "nowrap" }}>
            {tab}
          </button>
        ))}
      </div>

      {/* Create Game */}
      {adminTab === "games" && (
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Create New Game</div>
          <div className="card" style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <input className="input-field" placeholder="Game Title" value={newGame.title} onChange={e => setNewGame(p => ({ ...p, title: e.target.value }))} />
              <input className="input-field" type="datetime-local" value={newGame.date} onChange={e => setNewGame(p => ({ ...p, date: e.target.value }))} />
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>Seats:</span>
                {[15, 16, 17].map(n => (
                  <button key={n} onClick={() => setNewGame(p => ({ ...p, seats: n }))} style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid", borderColor: newGame.seats === n ? "#2d7a3a" : "rgba(255,255,255,0.1)", background: newGame.seats === n ? "rgba(45,122,58,0.2)" : "transparent", color: "#fff", cursor: "pointer", fontWeight: 700 }}>{n}</button>
                ))}
              </div>
              <button className="btn-green" onClick={createGame}>+ Create Game</button>
            </div>
          </div>

          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Upcoming Games</div>
          {upcomingGames.filter(g => g.status === "upcoming").map(game => (
            <div key={game.id} className="card" style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{game.title}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{new Date(game.date).toLocaleString()} · {game.seats} seats · {game.joined.length} joined</div>
                </div>
              </div>

              {/* Role Config */}
              <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 12, marginBottom: 10 }}>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>Role Configuration</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 13 }}>Mafia count:</span>
                  {[3, 4].map(n => (
                    <button key={n} onClick={() => setMafiaCount(n)} style={{ padding: "4px 12px", borderRadius: 6, border: "1px solid", borderColor: mafiaCount === n ? "#2d7a3a" : "rgba(255,255,255,0.1)", background: mafiaCount === n ? "rgba(45,122,58,0.2)" : "transparent", color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 13 }}>{n}</button>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13 }}>
                    <input type="checkbox" checked={showChameleon} onChange={e => setShowChameleon(e.target.checked)} /> 🦎 Chameleon
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13 }}>
                    <input type="checkbox" checked={showThief} onChange={e => setShowThief(e.target.checked)} /> 🦹 Thief
                  </label>
                </div>
              </div>

              <button className="btn-green" style={{ width: "100%" }} onClick={() => beginGame(game.id)}>{t.beginGame}</button>
            </div>
          ))}
        </div>
      )}

      {/* Game Control */}
      {adminTab === "control" && gameState && (
        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontWeight: 700 }}>{gameState.title}</span>
              <span style={{ fontSize: 13, color: "#5ecf74" }}>{gameState.phase?.toUpperCase()} · R{gameState.round}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {gameState.phase === "talking" && <button className="btn-green" onClick={nextTalker}>Next Talker →</button>}
              {gameState.phase === "voting" && <button className="btn-green" onClick={resolveVotes}>Resolve Votes 🗳</button>}
              {gameState.phase === "night" && <button className="btn-green" onClick={() => setGameState(p => ({ ...p, phase: "talking", talkingOrder: 1, round: p.round + 1 }))}>Start Day ☀️</button>}
              <button className="btn-red" onClick={() => endGame("civilian")}>🏳 Civilians Win</button>
              <button className="btn-red" onClick={() => endGame("mafia")}>💀 Mafia Wins</button>
            </div>
          </div>

          {/* Talking Order */}
          {gameState.phase === "talking" && (
            <div className="card" style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>Currently Talking</div>
              {gameState.players?.filter(p => p.seat === gameState.talkingOrder).map(p => (
                <div key={p.userId} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#2d7a3a", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 18 }}>{p.seat}</div>
                  <div>
                    <div style={{ fontWeight: 700 }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Role: {ROLES[p.role]?.icon} {ROLES[p.role]?.name} [{ROLES[p.role]?.team}]</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Vote Counts */}
          {gameState.phase === "voting" && (
            <div className="card" style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>Vote Tally</div>
              {(() => {
                const vc = {};
                Object.values(gameState.votes || {}).forEach(uid => { vc[uid] = (vc[uid] || 0) + 1; });
                return Object.entries(vc).sort((a, b) => b[1] - a[1]).map(([uid, count]) => {
                  const p = gameState.players.find(x => x.userId === uid);
                  return p ? <div key={uid} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}><span>#{p.seat} {p.name}</span><span style={{ color: "#e05555", fontWeight: 700 }}>{count} votes</span></div> : null;
                });
              })()}
              <div style={{ marginTop: 8, color: "rgba(255,255,255,0.3)", fontSize: 12 }}>{Object.keys(gameState.votes || {}).length} votes cast</div>
            </div>
          )}
        </div>
      )}
      {adminTab === "control" && !gameState && (
        <div className="card" style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", padding: 40 }}>No active game. Start a game from the Games tab.</div>
      )}

      {/* Players List (Admin sees roles) */}
      {adminTab === "players" && gameState && (
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>All Players & Roles</div>
          {(gameState.players || []).sort((a, b) => a.seat - b.seat).map(p => (
            <div key={p.userId} className="card" style={{ marginBottom: 8, opacity: p.eliminated ? 0.5 : 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #2d7a3a, #111)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, border: "1px solid rgba(255,255,255,0.1)" }}>{p.seat}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{p.name} {p.eliminated ? "❌" : ""}</div>
                  {p.role && <div style={{ fontSize: 13, display: "flex", gap: 8, alignItems: "center", marginTop: 2 }}>
                    <span>{ROLES[p.role]?.icon} {ROLES[p.role]?.name}</span>
                    <span className={`tag tag-${ROLES[p.role]?.team}`}>{ROLES[p.role]?.team}</span>
                  </div>}
                </div>
                {!p.eliminated && (
                  <button className="btn-red" style={{ fontSize: 11, padding: "6px 10px" }} onClick={() => setGameState(prev => ({ ...prev, players: prev.players.map(x => x.userId === p.userId ? { ...x, eliminated: true } : x), nightLog: [...(prev.nightLog || []), `Admin eliminated Seat #${p.seat} (${p.name})`] }))}>
                    Elim.
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Night Actions */}
      {adminTab === "night" && gameState && (
        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Night Action</div>
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>Action Type</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {["killed", "protected", "investigated", "silenced", "switched"].map(a => (
                  <button key={a} onClick={() => setNightAction(a)} style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid", borderColor: nightAction === a ? "#2d7a3a" : "rgba(255,255,255,0.1)", background: nightAction === a ? "rgba(45,122,58,0.2)" : "transparent", color: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 700, textTransform: "capitalize" }}>{a}</button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>Target Seat #</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {(gameState.players || []).filter(p => !p.eliminated).sort((a, b) => a.seat - b.seat).map(p => (
                  <button key={p.seat} onClick={() => setNightTarget(String(p.seat))} style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid", borderColor: nightTarget === String(p.seat) ? "#2d7a3a" : "rgba(255,255,255,0.1)", background: nightTarget === String(p.seat) ? "rgba(45,122,58,0.2)" : "transparent", color: "#fff", cursor: "pointer", fontWeight: 700 }}>{p.seat}</button>
                ))}
              </div>
            </div>
            <button className="btn-green" style={{ width: "100%" }} onClick={nightEliminate} disabled={!nightTarget}>
              Execute Night Action
            </button>
          </div>

          <div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>Night Log</div>
            {(gameState.nightLog || []).map((log, i) => (
              <div key={i} style={{ padding: "8px 12px", borderLeft: "2px solid rgba(45,122,58,0.4)", marginBottom: 6, fontSize: 13, color: "rgba(255,255,255,0.7)" }}>{log}</div>
            ))}
          </div>
        </div>
      )}
      {adminTab === "night" && !gameState && (
        <div className="card" style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", padding: 40 }}>No active game.</div>
      )}
    </div>
  );
}

// ─── DISPLAY SCREEN ───────────────────────────────────────────────────────────
function DisplayScreen({ gameState, setPage, t }) {
  const [displayTimer, setDisplayTimer] = useState(30);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setDisplayTimer(p => {
          if (p <= 1) { clearInterval(timerRef.current); setTimerRunning(false); return 0; }
          return p - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [timerRunning]);

  const startTimer = () => { setDisplayTimer(30); setTimerRunning(true); };
  const resetTimer = () => { clearInterval(timerRef.current); setTimerRunning(false); setDisplayTimer(30); };

  const currentSpeaker = gameState?.players?.find(p => p.seat === gameState.talkingOrder && !p.eliminated);

  return (
    <div style={{ minHeight: "100vh", background: "#050505", display: "flex", flexDirection: "column", padding: 0, position: "relative" }}>
      {/* Back */}
      <button onClick={() => setPage("admin")} style={{ position: "absolute", top: 20, left: 20, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "8px 16px", color: "#fff", cursor: "pointer", fontSize: 13, zIndex: 10 }}>← Back</button>

      {/* Header */}
      <div style={{ textAlign: "center", padding: "40px 20px 20px" }}>
        <div style={{ fontFamily: "'Cinzel',serif", fontSize: 48, fontWeight: 900, letterSpacing: 4 }}>BOARDERS</div>
        <div style={{ fontFamily: "'Cinzel',serif", fontSize: 28, color: "#2d7a3a", letterSpacing: 12 }}>MAFIA</div>
        {gameState && (
          <div style={{ marginTop: 10, fontSize: 18, color: "rgba(255,255,255,0.5)" }}>
            {gameState.title} · Round {gameState.round} · {gameState.phase?.toUpperCase()}
          </div>
        )}
      </div>

      {!gameState ? (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center", color: "rgba(255,255,255,0.3)" }}>
            <div style={{ fontSize: 80, marginBottom: 20 }}>🎭</div>
            <div style={{ fontSize: 24, fontWeight: 700 }}>Waiting for game to start...</div>
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, padding: "0 40px 40px", maxWidth: 1200, margin: "0 auto", width: "100%" }}>
          {/* Current Speaker */}
          {gameState.phase === "talking" && currentSpeaker && (
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <div style={{ fontSize: 16, color: "rgba(255,255,255,0.4)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 20 }}>NOW SPEAKING</div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 30, background: "rgba(255,255,255,0.04)", border: "2px solid rgba(45,122,58,0.5)", borderRadius: 24, padding: "30px 50px" }} className="glow">
                <div style={{ width: 100, height: 100, borderRadius: "50%", background: "linear-gradient(135deg, #2d7a3a, #1a5c26)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, border: "3px solid #5ecf74" }}>
                  {currentSpeaker.avatar ? <img src={currentSpeaker.avatar} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} /> : currentSpeaker.name[0]}
                </div>
                <div>
                  <div style={{ fontFamily: "'Cinzel',serif", fontSize: 36, fontWeight: 900 }}>{currentSpeaker.name}</div>
                  <div style={{ fontSize: 20, color: "#5ecf74", fontWeight: 700 }}>Seat #{currentSpeaker.seat}</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 72, fontFamily: "'Cinzel',serif", color: displayTimer <= 10 ? "#e05555" : "#5ecf74", textShadow: `0 0 30px ${displayTimer <= 10 ? "rgba(224,85,85,0.5)" : "rgba(94,207,116,0.5)"}` }} className={displayTimer <= 10 ? "pulse" : ""}>{String(displayTimer).padStart(2, "0")}</div>
                  <div style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}>SECONDS</div>
                  <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <button className="btn-green" style={{ fontSize: 13, padding: "8px 16px" }} onClick={startTimer}>▶ Start</button>
                    <button className="btn-outline" style={{ fontSize: 13, padding: "8px 16px" }} onClick={resetTimer}>⟳</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Players Grid */}
          <div>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.3)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 16, textAlign: "center" }}>PLAYERS</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 16 }}>
              {(gameState.players || []).sort((a, b) => a.seat - b.seat).map(p => (
                <div key={p.userId} style={{ textAlign: "center", padding: "16px 12px", borderRadius: 16, background: p.eliminated ? "rgba(160,30,30,0.08)" : gameState.talkingOrder === p.seat ? "rgba(45,122,58,0.12)" : "rgba(255,255,255,0.03)", border: `1px solid ${p.eliminated ? "rgba(160,30,30,0.3)" : gameState.talkingOrder === p.seat ? "rgba(94,207,116,0.4)" : "rgba(255,255,255,0.07)"}`, opacity: p.eliminated ? 0.4 : 1, transition: "all 0.3s" }}>
                  <div style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg, #2d7a3a, #1a5c26)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, margin: "0 auto 10px", border: gameState.talkingOrder === p.seat ? "2px solid #5ecf74" : "1px solid rgba(255,255,255,0.1)" }}>
                    {p.avatar ? <img src={p.avatar} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} /> : p.name[0]}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{p.name}</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: "#5ecf74", fontFamily: "'Cinzel',serif" }}>#{p.seat}</div>
                  {p.eliminated && <div style={{ fontSize: 11, color: "#e05555", fontWeight: 700, marginTop: 4 }}>ELIMINATED</div>}
                  {gameState.talkingOrder === p.seat && !p.eliminated && <div style={{ fontSize: 11, color: "#5ecf74", fontWeight: 700, marginTop: 4 }} className="pulse">SPEAKING</div>}
                </div>
              ))}
            </div>
          </div>

          {/* Phase Banner */}
          {gameState.phase === "voting" && (
            <div style={{ marginTop: 30, textAlign: "center", padding: "20px", background: "rgba(240,192,64,0.08)", border: "1px solid rgba(240,192,64,0.3)", borderRadius: 16 }}>
              <div style={{ fontFamily: "'Cinzel',serif", fontSize: 28, fontWeight: 900, color: "#f0c040" }}>🗳 VOTING IN PROGRESS</div>
              <div style={{ color: "rgba(255,255,255,0.5)", marginTop: 8 }}>Players are voting on their devices</div>
            </div>
          )}
          {gameState.phase === "night" && (
            <div style={{ marginTop: 30, textAlign: "center", padding: "20px", background: "rgba(20,20,60,0.5)", border: "1px solid rgba(80,80,160,0.3)", borderRadius: 16 }}>
              <div style={{ fontFamily: "'Cinzel',serif", fontSize: 28, fontWeight: 900, color: "#8888ff" }}>🌙 NIGHT PHASE</div>
              <div style={{ color: "rgba(255,255,255,0.5)", marginTop: 8 }}>Mafia is active... close your eyes</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
