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
              backgroundColor: '#ffffffff' 
            }}>
              
              <img 
                src={Logo} 
                alt="Ball-in-one" 
                style={{ width: isMobile ?'100vw' : "40vw", height: 'auto',top: isMobile ? "0vw" : "none", }} 
              />

              <SignInButton mode="modal">
                <button style={{ width: isMobile ?'50vw' : "20vw",height:isMobile ?'20vw' : "8vw", cursor: 'pointer', borderRadius: '5px', fontSize: '3vw' }}>
                  Login / Starten
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
                style={{ width: isMobile ?'15vw' :'8vw', height:isMobile ?'15vw' : "8vw",position:"absolute",left:"0vw",top:"-1vw" }} 
              />
              <button onClick={() => setIstOffen(!istOffen)} style={{padding: 0,overflow: "hidden",right: isMobile ?'12vw' :"5vw",top: '0.8vw', position: "absolute", cursor:"pointer", width:isMobile ?'10vw' : "4vw", height:isMobile ?'10vw' :"4vw", backgroundColor:"#9c9c9c", color:"white", zIndex: 200, border: "1px solid #9b9b9bff", borderRadius:"50%", fontSize:"3.5vw", textAlign: "center", justifyContent:"center", display:"flex", alignItems:"center"}}>
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