import { IoMdArrowRoundBack, IoMdClose } from "react-icons/io";
import {useEffect, useState, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import fallback from "./assets/fallback-bild.png.png";
import React from "react";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Editplayers({schliessen, isMobile, aktuellerspieler,aktuellesTeam,userRechte}) {

  const [username, setusername] = useState("");
  const [oldusername, setoldusername] = useState("");
  const [usernumber, setusernumber] = useState("");
  const [userbild, setuserbild] = useState("");
  const [rollensett, setrollensett] = useState(false);
  const [rollenDaten, setRollenDaten] = useState([]);
  const [aktiveRollenIds, setAktiveRollenIds] = useState([]);

          const ladeRolle = useCallback(async () => {
      if (!aktuellesTeam) return;

      const { data, error } = await supabase
      .from('rollen')
      .select(`*
      `)
        .eq('team_id', aktuellesTeam.id)
        .order('name', { ascending: true });

      if (!error && data) {
        setRollenDaten(data);
      }
    }, [aktuellesTeam]);


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

const delet1 = async () => {

    const {error} = await supabase
        .from('spieler_rollen')
        .delete()
        .eq('spieler_id', aktuellerspieler)     

    if (error) {
        console.error("Fehler beim Speichern:", error.message);
        alert("Fehler: " + error.message);
        return;
    }


    
    delet2()
}

const delet2 = async () => {

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



const handleDelete = async () => {

    delet1()
    
    schliessen()
}





const toggleRolle = async (rollenId) => {
  if (!aktuellerspieler) return;

  const istAktiv = aktiveRollenIds.includes(rollenId);

  if (istAktiv) {
    await supabase.from('spieler_rollen').delete()
      .eq('spieler_id', aktuellerspieler).eq('rollen_id', rollenId);
    
    // Lokal aus dem State entfernen
    setAktiveRollenIds(prev => prev.filter(id => id !== rollenId));
  } else {
    await supabase.from('spieler_rollen').insert([
      { spieler_id: aktuellerspieler, rollen_id: rollenId }
    ]);
    
    // Lokal zum State hinzufügen
    setAktiveRollenIds(prev => [...prev, rollenId]);
  }
};




const ladeSpieler = useCallback(async () => {
      if (!aktuellerspieler) return;

      const { data, error } = await supabase
      .from('team_mitglieder')
      .select(`
        Name,
        Nummer,
        nutzer (profilbild_url),
        spieler_rollen (rollen_id)
      `)

        .eq('id', aktuellerspieler)
        .single();

      if (!error && data) {
        setusername(data.Name || "");
        setoldusername(data.Name)
        setusernumber(data.Nummer || "");
        setuserbild(data.nutzer?.profilbild_url || "")

        const ids = data.spieler_rollen?.map(r => r.rollen_id) || [];
        setAktiveRollenIds(ids);
      }
    }, [aktuellerspieler]);

const getKontrastFarbe = (hexColor) => {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  const helligkeit = (r * 299 + g * 587 + b * 114) / 1000;

  return helligkeit > 128 ? "black" : "white";
};

useEffect(() => {
    ladeRolle();
  }, [ladeRolle]);

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
                style={{ width: isMobile ?'80vw':'60vw', height:  isMobile ?'90vw':'40vw', marginBottom: '20px', opacity: "1", zIndex:"1001", backgroundColor:"#171717", borderRadius:"1vw",position:"relative", border:"0.2vw solid #2e2e2e" }} 
                      >
                        {userRechte?.kannSpielerbearbeiten ? (
                        <h3 style={{textAlign:"center", fontFamily:"sans-serif", color:"white", fontSize:isMobile ?'3vw':"2vw"}}>{oldusername} bearbeiten</h3>
                        ):(
                          <h3 style={{textAlign:"center", fontFamily:"sans-serif", color:"white", fontSize:isMobile ?'3vw':"2vw"}}>{oldusername}</h3>
                        )}

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
                {!rollensett ? (
                  <>
                <img 
                src={userbild|| fallback} 
                style={{ width:isMobile ?'45vw': '30vw',height:isMobile ?'45vw':"30vw", borderRadius: '50%',objectFit:"cover",position:"absolute", left:isMobile ?'15%':"3%",top:isMobile ?'10%':"15%", border:"0.3vw solid #8b8b8b" }} 
                alt="Profil"
              />
                {userRechte?.kannSpielerbearbeiten ? (
                  <>
                <input 
                    type="text" 
                    placeholder="Spieler Name" 
                    value={username}
                    onChange={(e) => setusername(e.target.value)}
                    style={{right:isMobile ?'40vw': "4vw",top:isMobile ?'62%': '25%', position: "absolute", cursor:"text", width: isMobile ?'35vw':"20vw", height:isMobile ?'9vw':"3vw", backgroundColor:"#ffffff", color:"black", border: isMobile ?'0.6vw solid #9c9c9c':"2px solid #9c9c9c", borderRadius:isMobile ?'20vw':"5vw", fontSize:isMobile ?'4vw':"2vw", textAlign: "center", justifyContent:"center", display:"flex", alignItems:"center"}}
                    />
                <input 
                    type="text" 
                    placeholder="Spieler Nummer" 
                    value={usernumber}
                    onChange={(e) => setusernumber(e.target.value)}
                    style={{right: isMobile ?'40vw':"4vw",top:isMobile ?'75%': '36%', position: "absolute", cursor:"text", width: isMobile ?'35vw':"20vw", height:isMobile ?'9vw':"3vw", backgroundColor:"#ffffff", color:"black", border: isMobile ?'0.6vw solid #9c9c9c':"2px solid #9c9c9c", borderRadius:isMobile ?'20vw':"5vw", fontSize:isMobile ?'4vw':"2vw", textAlign: "center", justifyContent:"center", display:"flex", alignItems:"center"}}
                    />
                    
                
                <button onClick={handleSpeichern} style={{ width:isMobile ?'35vw':"20vw",height:isMobile ?'9vw':"4vw", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: isMobile ?'3vw':"1vw", cursor: "pointer", fontSize: isMobile ?'4vw':"1.5vw", top:isMobile ?'65%':"66%", right:isMobile ?'3vw':"4vw", position:"absolute" }}>
                Spieler Speichern
                </button>
                <button onClick={handleDelete} style={{ width:isMobile ?'35vw':"20vw",height:isMobile ?'9vw':"4vw", backgroundColor: "red", color: "white", border: "none", borderRadius: isMobile ?'3vw':"1vw", cursor: "pointer", fontSize: isMobile ?'4vw':"1.5vw", top:isMobile ?'80%':"78%", right:isMobile ?'3vw':"4vw", position:"absolute" }}>
                Spieler Löschen
                </button>
                </>
                ):(
                  <>
                  <h3 style={{textAlign:"center", fontFamily:"sans-serif", color:"white", fontSize:isMobile ?'5vw':"2vw",left:isMobile ?'6vw': "35vw",top:isMobile ?'60%': '15%', position: "absolute",}}>Name: {oldusername}</h3>
                  <h3 style={{textAlign:"center", fontFamily:"sans-serif", color:"white", fontSize:isMobile ?'5vw':"2vw",left:isMobile ?'6vw': "35vw",top:isMobile ?'70%': '25%', position: "absolute",}}>Nummer: {usernumber}</h3>
                    </>
                )}
                {userRechte?.kannRollenVerwalten && (
                <button onClick={()=> setrollensett(true)} style={{ width:isMobile ?'35vw':"20vw",height:isMobile ?'9vw':"4vw", backgroundColor: "#666666", color: "white", border: "none", borderRadius: isMobile ?'3vw':"1vw", cursor: "pointer", fontSize: isMobile ?'4vw':"1.5vw", top:isMobile ?'87%':"45%", right:isMobile ?'40vw':"4vw", position:"absolute" }}>
                Rollen bearbeiten
                </button>
                )}
                </>
                ):(
                  <div style={{
                  display: 'flex',
                  flexDirection: 'row',    // Von links nach rechts
                  flexWrap: 'wrap',       // Umbrechen, wenn die Zeile voll ist
                  gap: '10px',            // Abstand zwischen den Rollen
                  padding: '20px',
                  justifyContent: 'flex-start', // Mittig ausrichten (optional)
                  width: '100%',
                  maxHeight: '80%',       // Damit es nicht über das Modal hinausragt
                  overflowY: 'auto'       // Scrollbar, falls es zu viele Rollen sind
                }}>
                  {rollenDaten.map((rollen) => {
                    const istAusgewaehlt = aktiveRollenIds.includes(rollen.id);
                    return(
                  <div onClick={() =>rollen.main ? console.log("nichts") : toggleRolle(rollen.id)} style={{width: isMobile ?'17vw': "10vw",height: isMobile ?'17vw':"10vw",position:"relative",borderRadius:"1vw",cursor: "pointer",border: istAusgewaehlt ? "0.3vw solid green" : "0.3vw solid red",fontSize: isMobile ?'2.5vw':"1.5vw", fontFamily:"sans-serif", backgroundColor:rollen.farbe, textAlign: "center", justifyContent:"center", display:"flex",transition: "all 0.2s ease" , alignItems:"center",color:getKontrastFarbe(rollen.farbe)}}>{rollen.main ? "*" : ""}{rollen.name}{rollen.main ? "*" : ""}

                  </div>
                    );
                })}
                <button 
                  onClick={() => setrollensett(false)}
                  style={{
                    position:"absolute",
                    top: "2%",         
                    left: "2%",        
                    width: isMobile ?'7vw':"3vw",
                    height: isMobile ?'7vw':"3vw",
                    backgroundColor:"#171717",
                    fontSize:isMobile ?'5vw':"2vw",
                    color: '#9c9c9c',
                    border: 'none',
                    cursor: 'pointer',
                    zIndex: 1002,
                    borderRadius:"50%",
                  }}
                >
                  <IoMdArrowRoundBack />
                </button>
                </div>
                )}
            </div>
            </div>
    )
}