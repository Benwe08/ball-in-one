import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { useState,useEffect } from "react";
import Taktiktafel from "./Taktiktafel";
import Logo from "./assets/ball-in-one-logo.png";
import Teameinstellung from "./Teameinstellung"
import Menu from "./menu"
import Impressums from "./Impressum"
import Datenschutzs from "./Datenschutz"
import JoinTeam from "./JoinTeam";
import { useUser } from "@clerk/clerk-react";
import { createClient } from '@supabase/supabase-js';
import { CgMenu } from "react-icons/cg";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function App() {
  const [istOffen, setIstOffen] = useState(false);
  const [Taktik, setTaktik] = useState(false);
  const [Impressum, setImpressum] = useState(false);
  const [Datenschutz, setDatenschutz] = useState(false);
  const [aktuellesTeam, setAktuellesTeam] = useState(null);

  const {user} = useUser();

  const params = new URLSearchParams(window.location.search);
  const einladungsCode = params.get("code");
  
  const [isOpenMen, setIsOpenMen] = useState(false);

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

  const neuwahl = () => {
    setTaktik(false)
    setImpressum(false)
    setDatenschutz(false)
  }

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
                style={{ width: isMobile ?'50vw' : "20vw", height: 'auto',top: isMobile ? "0vw" : "none", scale:"100%"}} 
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
              width: '100%',
              height: '100%',
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
          width: "100%",   
          height: isMobile ?'1vw' :"3.5vw",
          borderBottom: isMobile ?'0.3vw solid #2e2e2e' :'0.1vw solid #2e2e2e',
          borderRight: "none",
          borderLeft: "none",
          borderTop: "none",
          backgroundColor:"none",
          color:"white",
          borderRadius: '0vw',
          position: 'absolute',
          left: "0vw",
          top: isMobile ?'8vw' :"0vw",
          fontFamily: "sans-serif",
          fontWeight: "bold",
          display: "flex",
          flexDirection:"column",
          fontSize: isMobile ?'3vw' :"0.9vw",
          overflowY: "hidden",
          zIndex:1
        }}></div>
            <div style={{ 
              position: 'absolute', 
              top:isMobile ?'1.3vw' : '0.4vw', 
              right: isMobile ?'1.3vw' :'0.5vw', 
              zIndex: 1000,
            }}>
              <UserButton 
                appearance={{
                  elements: {
                    userButtonAvatarBox: {
                      width: isMobile ?'clamp(0vw, 6vw, 100vw)' : "clamp(0vw, 2.5vw, 100vw)",
                      height: isMobile ?'clamp(0vw, 6vw, 100vw)' : "clamp(0vw, 2.5vw, 100vw)"
                    }
                  }
                }}
                afterSignOutUrl="/" 
              />
            </div>
            <img 
                src={Logo} 
                alt="Ball-in-one" 
                style={{ width: isMobile ?'7vw' :'3vw', height:isMobile ?'7vw' : "3vw",position:"absolute",left:isMobile ? '8.8vw' : "3.5vw",top:isMobile ? '0.8vw' : "0.2vw", borderRadius:"50%",scale:"150%" }} 
              />
              <button onClick={() => setIstOffen(!istOffen)} style={{padding: 0,overflow: "hidden",right: isMobile ?'9vw' :"3.5vw",top: isMobile ?'1.3vw' :'0.4vw', position: "absolute", cursor:"pointer", width:isMobile ?'6vw' : "2.5vw", height:isMobile ?'6vw' :"2.5vw", backgroundColor:"#2e2e2e", color:"white", zIndex: 200, border: "none", borderRadius:"50%", fontSize:"3.5vw", textAlign: "center", justifyContent:"center", display:"flex", alignItems:"center"}}>
              {aktuellesTeam && aktuellesTeam.bild ? (
                <img 
                  src={aktuellesTeam.bild} 
                  alt="Team" 
                  style={{ width:isMobile ?'6vw' : "2.5vw", height:isMobile ?'6vw' : "2.5vw", objectFit: "cover" }} 
                />
              ):(
              <h3>+</h3>
              )}
              </button>
              <button onClick={() => setIsOpenMen(!isOpenMen)} style={{padding: 0 ,left:isMobile ? '2vw' : "0.6vw",top:isMobile ? '1.3vw' : '0.4vw', position: "absolute", width:isMobile ?'6vw' :"2.5vw",height:isMobile ?'6vw' :"2.5vw", border: isMobile ? "0.5vw solid #2e2e2e" : "0.15vw solid #2e2e2e",cursor:"pointer",display: 'flex',justifyContent: 'center',alignItems: 'center', borderRadius:"30%", fontSize:isMobile ?'4vw' :"1.5vw",backgroundColor: "#212121",color:"white", zIndex: 20}}>
                <CgMenu />
              </button>
              {istOffen && (
               
                <Teameinstellung schliessen={() => setIstOffen(false)} 
                setAktuellesTeam={setAktuellesTeam}
                isMobile={isMobile}
                />
            )}
            {isOpenMen && (
               
                <Menu schliessenmen={() => setIsOpenMen(false)} 
                isMobile={isMobile}
                neuwahl = {neuwahl}
                opentak={() => {setIsOpenMen(false); setTaktik(true) }}
                openimp={() => {setIsOpenMen(false); setImpressum(true) }}
                opendat={() => {setIsOpenMen(false); setDatenschutz(true) }}
                />
            )}
            {Taktik && (
            <Taktiktafel isMobile={isMobile} aktuellesTeam={aktuellesTeam}/>
            )}
            {Impressum && (
            <Impressums isMobile={isMobile}/>
            )}
            {Datenschutz && (
            <Datenschutzs isMobile={isMobile}/>
            )}
            </>
    )}
        </SignedIn>

        <SignedOut>

        </SignedOut>
      </main>
    </div>
  );
}