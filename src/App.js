import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import Taktiktafel from "./Taktiktafel";
import Logo from "./assets/ball-in-one-logo.png";

export default function App() {
  return (
    <div>
      <header >
        <SignedOut>
            {/* 1. Ein Container, der den ganzen Bildschirm füllt */}
            <div style={{
              position: 'fixed',    // Fixiert über dem Rest der Seite
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
              
              {/* 2. Das Logo */}
              <img 
                src={Logo} 
                alt="Ball-in-one" 
                style={{ width: '40vw', height: 'auto', marginBottom: '20px' }} 
              />

              {/* 3. Der Login-Button direkt darunter */}
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
            <Taktiktafel />
        </SignedIn>

        <SignedOut>

        </SignedOut>
      </main>
    </div>
  );
}