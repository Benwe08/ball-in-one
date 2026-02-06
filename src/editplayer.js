import { IoMdClose } from "react-icons/io";
import {useEffect, useState, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import fallback from "./assets/fallback-bild.png.png";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Editplayers({schliessen, isMobile, aktuellerspieler}) {

  const [username, setusername] = useState("");
  const [oldusername, setoldusername] = useState("");
  const [usernumber, setusernumber] = useState("");
  const [userbild, setuserbild] = useState("");


const handleSpeichern = async () => {
    if(username === ""){
        alert("Bitte gib einen Namen an");
        return
    }
    const {error} = await supabase
        .from('team_mitglieder')
        .update({
          Name: username,
          Nummer: usernumber,
        })
        .eq('id', aktuellerspieler)     

    if (error) {
        console.error("Fehler beim Speichern:", error.message);
        alert("Fehler: " + error.message);
        return;
    }
    
    schliessen()
}

const handleDelete = async () => {

    const {error} = await supabase
        .from('team_mitglieder')
        .delete()
        .eq('id', aktuellerspieler)     

    if (error) {
        console.error("Fehler beim Speichern:", error.message);
        alert("Fehler: " + error.message);
        return;
    }
    
    schliessen()
}

const ladeSpieler = useCallback(async () => {
      if (!aktuellerspieler) return;

      const { data, error } = await supabase
      .from('team_mitglieder')
      .select(`
        Name,
        Nummer,
        nutzer (profilbild_url)
      `)

        .eq('id', aktuellerspieler)
        .single();

      if (!error && data) {
        setusername(data.Name || "");
        setoldusername(data.Name)
        setusernumber(data.Nummer || "");
        setuserbild(data.nutzer?.profilbild_url || "")
      }
    }, [aktuellerspieler]);

useEffect(() => {
    ladeSpieler();
  }, [ladeSpieler]);

    
    return(
        <div 
            onClick={schliessen}
            style={{
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
                      backgroundColor: 'rgba(66, 66, 66, 0.8)',
                    }}>
                <div 
                onClick={(e) => e.stopPropagation()}
                style={{ width: isMobile ?'50vw':'50vw', height:  isMobile ?'40vw':'30vw', marginBottom: '20px', opacity: "1", zIndex:"1001", backgroundColor:"#171717", borderRadius:"1vw",position:"relative", border:"0.2vw solid #2e2e2e" }} 
                      >
                        <h3 style={{textAlign:"center", fontFamily:"sans-serif", color:"white", fontSize:isMobile ?'3vw':"2vw"}}>{oldusername} bearbeiten</h3>
                <button 
                  onClick={schliessen}
                  style={{
                    position:"absolute",
                    top: "2%",         
                    right: "2%",        
                    width:  isMobile ?'7vw':"3vw",
                    height:  isMobile ?'7vw':"3vw",
                    backgroundColor:"#171717",
                    fontSize: isMobile ?'5vw':"2vw",
                    color: '#9c9c9c',
                    border: 'none',
                    cursor: 'pointer',
                    zIndex: 1002,
                    borderRadius:"50%",
                    padding: 0
                  }}
                >
                <IoMdClose/>
                </button>
                <img 
                src={userbild|| fallback} 
                style={{ width:isMobile ?'13vw': '20vw',height:isMobile ?'13vw':"20vw", borderRadius: '15vw',objectFit:"cover",position:"absolute", left:isMobile ?'15%':"3%",top:isMobile ?'10%':"20%", border:"0.3vw solid #8b8b8b" }} 
                alt="Profil"
              />
                <input 
                    type="text" 
                    placeholder="Spieler Name" 
                    value={username}
                    onChange={(e) => setusername(e.target.value)}
                    style={{right:isMobile ?'6vw': "4vw",top:isMobile ?'20%': '25%', position: "absolute", cursor:"text", width: isMobile ?'35vw':"20vw", height:isMobile ?'9vw':"3vw", backgroundColor:"#ffffff", color:"black", border: isMobile ?'0.6vw solid #9c9c9c':"2px solid #9c9c9c", borderRadius:isMobile ?'20vw':"5vw", fontSize:isMobile ?'4vw':"2vw", textAlign: "center", justifyContent:"center", display:"flex", alignItems:"center"}}
                    />
                <input 
                    type="text" 
                    placeholder="Spieler Nummer" 
                    value={usernumber}
                    onChange={(e) => setusernumber(e.target.value)}
                    style={{right: isMobile ?'6vw':"4vw",top:isMobile ?'45%': '40%', position: "absolute", cursor:"text", width: isMobile ?'35vw':"20vw", height:isMobile ?'9vw':"3vw", backgroundColor:"#ffffff", color:"black", border: isMobile ?'0.6vw solid #9c9c9c':"2px solid #9c9c9c", borderRadius:isMobile ?'20vw':"5vw", fontSize:isMobile ?'4vw':"2vw", textAlign: "center", justifyContent:"center", display:"flex", alignItems:"center"}}
                    />
                <button onClick={handleSpeichern} style={{ width:isMobile ?'35vw':"20vw",height:isMobile ?'9vw':"4vw", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: isMobile ?'3vw':"1vw", cursor: "pointer", fontSize: isMobile ?'4vw':"1.5vw", top:isMobile ?'70%':"55%", right:isMobile ?'6vw':"4vw", position:"absolute" }}>
                Spieler Speichern
                </button>
                <button onClick={handleDelete} style={{ width:isMobile ?'35vw':"20vw",height:isMobile ?'9vw':"4vw", backgroundColor: "red", color: "white", border: "none", borderRadius: isMobile ?'3vw':"1vw", cursor: "pointer", fontSize: isMobile ?'4vw':"1.5vw", top:isMobile ?'70%':"72%", right:isMobile ?'6vw':"4vw", position:"absolute" }}>
                Spieler Löschen
                </button>
            </div>
            </div>
    )
}