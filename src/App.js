import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { useState } from "react";
import Taktiktafel from "./Taktiktafel";
import Logo from "./assets/ball-in-one-logo.png";
import Teameinstellung from "./Teameinstellung"

export default function App() {
  const [istOffen, setIstOffen] = useState(false);
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
                style={{ width: '40vw', height: 'auto', marginBottom: '20px' }} 
              />

              <SignInButton mode="modal">
                <button style={{ padding: '12px 24px', cursor: 'pointer', borderRadius: '5px', fontSize: '1.2rem' }}>
                  Login / Starten
                </button>
              </SignInButton>
            </div>
          </SignedOut>

      </header>

      <main>
        <SignedIn>
            <div style={{ 
              position: 'absolute', 
              top: '40px', 
              right: '40px', 
              zIndex: 1000,
              transform: "scale(2.5)"
            }}>
              <UserButton afterSignOutUrl="/" />
            </div>
            <img 
                src={Logo} 
                alt="Ball-in-one" 
                style={{ width: '150px', height: 'auto', marginBottom: '20px',position:"absolute",left:"0px",top:"-20px" }} 
              />
              <button onClick={() => setIstOffen(!istOffen)} style={{right: "100px",top: '15px', position: "absolute", cursor:"pointer", width: "75px", height:"75px", backgroundColor:"#9c9c9c", color:"white", zIndex: 200, border: "1px solid #9b9b9bff", borderRadius:"85px", fontSize:"60px", textAlign: "center", justifyContent:"center", display:"flex", alignItems:"center"}}>
              <h3>+</h3>
              </button>
              {istOffen && (
               
                <Teameinstellung schliessen={() => setIstOffen(false)}/> 

            )}

            <Taktiktafel />
        </SignedIn>

        <SignedOut>

        </SignedOut>
      </main>
    </div>
  );
}