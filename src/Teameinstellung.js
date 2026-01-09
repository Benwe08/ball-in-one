// Teameinstellung.js
import React from 'react';

export default function Teameinstellung({schliessen}) {
  return (
    
    <div 
    onClick={schliessen}
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
              zIndex: 1000,        
              backgroundColor: '#424242ff',
              opacity: "0.6"
            }}>
    </div>
  );
}