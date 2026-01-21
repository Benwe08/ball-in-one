import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { useState,useEffect } from "react";
import Taktiktafel from "./Taktiktafel";
import Logo from "./assets/ball-in-one-logo.png";
import Teameinstellung from "./Teameinstellung"
import JoinTeam from "./JoinTeam";
import { useUser } from "@clerk/clerk-react";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://fdwsacwvndkerbjbqcmi.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkd3NhY3d2bmRrZXJiamJxY21pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxNDQ2NjksImV4cCI6MjA4MzcyMDY2OX0.01CcKVq-bSO7M97DoT-o9PJ-jgVJ1RqTtarQRbktyiY');

export default function App() {
  const [istOffen, setIstOffen] = useState(false);
  const [aktuellesTeam, setAktuellesTeam] = useState(null);

  const {user} = useUser();

  const params = new URLSearchParams(window.location.search);
  const einladungsCode = params.get("code");
  
  useEffect(() => {
    async function initialesTeamLaden() {
      if (!user) return;

      // 1. Mitgliedschaften holen
      const { data: mitgliedschaften } = await supabase
        .from('team_mitglieder')
        .select('team_id')
        .eq('user_id', user.id);

      if (mitgliedschaften && mitgliedschaften.length > 0) {
        const teamIds = mitgliedschaften.map(m => m.team_id);
        
        // 2. Team-Daten holen
        const { data: teams } = await supabase
          .from('teams')
          .select('*')
          .in('id', teamIds);

        if (teams && teams.length > 0) {
          // 3. Das erste Team setzen, wenn noch keins ausgewählt wurde
          setAktuellesTeam(teams[0]);
        }
      }
    }

    if (user) {
      initialesTeamLaden();
    }
  }, [user]); // Wird ausgeführt, sobald der User eingeloggt ist



  const [isMobile, setIsMobile] = useState(window.innerWidth < window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div>
      
      <header >
        <SignedOut>
            
            <div style={{
              position: 'fixed',    
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              display: 'flex',      
              flexDirection: 'column', 
              justifyContent: 'center', 
              alignItems: 'center',     
              zIndex: 1000,        
              backgroundColor: '#171717' 
            }}>
              
              <img 
                src={Logo} 
                alt="Ball-in-one" 
                style={{ width: isMobile ?'50vw' : "20vw", height: 'auto',top: isMobile ? "0vw" : "none"}} 
              />

              <SignInButton mode="modal">
                <button style={{ width: isMobile ?'50vw' : "20vw",height:isMobile ?'20vw' : "8vw", cursor: 'pointer', borderRadius: '1vw', fontSize: '3vw', color:"white", backgroundColor:"#44c6d5", border:"0.25vw solid #00e5ff" }}>
                  Login
                </button>
              </SignInButton>
            </div>
          </SignedOut>

      </header>

      <main>
        <SignedIn>
          {einladungsCode ? (
      <JoinTeam />
    ) : (
      <>
      <div 
    style={{
              position: 'fixed',    // Fixiert über dem Rest der Seite
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              display: 'flex',      
              flexDirection: 'column', 
              justifyContent: 'center', 
              alignItems: 'center',     
              zIndex: -1,        
              backgroundColor: '#171717',
              pointerEvents:"none"
            }}
        />
            <div style={{ 
              position: 'absolute', 
              top: '0.8vw', 
              right: '0.5vw', 
              zIndex: 1000,
            }}>
              <UserButton 
                appearance={{
                  elements: {
                    userButtonAvatarBox: {
                      width: isMobile ?'clamp(0vw, 10vw, 100vw)' : "clamp(0vw, 4.2vw, 100vw)",
                      height: isMobile ?'clamp(0vw, 10vw, 100vw)' : "clamp(0vw, 4.2vw, 100vw)"
                    }
                  }
                }}
                afterSignOutUrl="/" 
              />
            </div>
            <img 
                src={Logo} 
                alt="Ball-in-one" 
                style={{ width: isMobile ?'10vw' :'5vw', height:isMobile ?'10vw' : "5vw",position:"absolute",left:isMobile ? '2vw' : "0.6vw",top:isMobile ? '1.2vw' : "0.1vw", borderRadius:"50%"}} 
              />
              <button onClick={() => setIstOffen(!istOffen)} style={{padding: 0,overflow: "hidden",right: isMobile ?'12vw' :"5vw",top: '0.8vw', position: "absolute", cursor:"pointer", width:isMobile ?'10vw' : "4vw", height:isMobile ?'10vw' :"4vw", backgroundColor:"#2e2e2e", color:"white", zIndex: 200, border: "none", borderRadius:"50%", fontSize:"3.5vw", textAlign: "center", justifyContent:"center", display:"flex", alignItems:"center"}}>
              {aktuellesTeam && aktuellesTeam.bild ? (
                <img 
                  src={aktuellesTeam.bild} 
                  alt="Team" 
                  style={{ width:isMobile ?'10vw' : "4vw", height:isMobile ?'10vw' : "4vw", objectFit: "cover" }} 
                />
              ):(
              <h3>+</h3>
              )}
              </button>
              {istOffen && (
               
                <Teameinstellung schliessen={() => setIstOffen(false)} 
                setAktuellesTeam={setAktuellesTeam}
                isMobile={isMobile}
                />
            )}

            <Taktiktafel isMobile={isMobile} aktuellesTeam={aktuellesTeam}/>
            </>
    )}
        </SignedIn>

        <SignedOut>

        </SignedOut>
      </main>
    </div>
  );
}