import React, { useState, useEffect, useRef } from "react";

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

export default DisplayScreen;