import React, { useState } from "react";

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

export default AdminPage;
