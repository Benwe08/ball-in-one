import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { useState } from "react";
import Taktiktafel from "./Taktiktafel";
import Logo from "./assets/ball-in-one-logo.png";
import Teameinstellung from "./Teameinstellung"
import JoinTeam from "./JoinTeam";

export default function App() {
  const [istOffen, setIstOffen] = useState(false);
  const [aktuellesTeam, setAktuellesTeam] = useState(null);

  const params = new URLSearchParams(window.location.search);
  const einladungsCode = params.get("code");
  
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
                style={{ width: '40vw', height: 'auto' }} 
              />

              <SignInButton mode="modal">
                <button style={{ width: "20vw",height:"8vw", cursor: 'pointer', borderRadius: '5px', fontSize: '1.2rem' }}>
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
                      width: "clamp(0vw, 4.2vw, 100vw)",
                      height: "clamp(0vw, 4.2vw, 100vw)"
                    }
                  }
                }}
                afterSignOutUrl="/" 
              />
            </div>
            <img 
                src={Logo} 
                alt="Ball-in-one" 
                style={{ width: '8vw', height: "8vw",position:"absolute",left:"0vw",top:"-1vw" }} 
              />
              <button onClick={() => setIstOffen(!istOffen)} style={{overflow: "hidden",right: "5vw",top: '0.8vw', position: "absolute", cursor:"pointer", width: "4vw", height:"4vw", backgroundColor:"#9c9c9c", color:"white", zIndex: 200, border: "1px solid #9b9b9bff", borderRadius:"50%", fontSize:"3.5vw", textAlign: "center", justifyContent:"center", display:"flex", alignItems:"center"}}>
              {aktuellesTeam && aktuellesTeam.bild ? (
                <img 
                  src={aktuellesTeam.bild} 
                  alt="Team" 
                  style={{ width: "4vw", height: "4vw", objectFit: "cover" }} 
                />
              ):(
              <h3>+</h3>
              )}
              </button>
              {istOffen && (
               
                <Teameinstellung schliessen={() => setIstOffen(false)} 
                setAktuellesTeam={setAktuellesTeam}
                />
            )}

            <Taktiktafel />
            </>
    )}
        </SignedIn>

        <SignedOut>

        </SignedOut>
      </main>
    </div>
  );
}