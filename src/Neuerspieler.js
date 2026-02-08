import { IoMdClose } from "react-icons/io";
import {useState} from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Neuerspielers({schliessen, isMobile, aktuellesTeam}) {

  const [username, setusername] = useState("");
  const [usernumber, setusernumber] = useState("");


const handleSpeichern = async () => {
    if (username === "") {
        alert("Bitte gib einen Namen an");
        return;
    }

    try {
        // 1. Schritt: Den neuen Spieler in 'team_mitglieder' erstellen
        // .select().single() ist wichtig, um die ID des neuen Spielers zu erhalten
        const { data: neuerSpieler, error: spielerError } = await supabase
            .from('team_mitglieder')
            .insert([{
                team_id: aktuellesTeam.id,
                user_id: null,
                rolle: 'mitglied',
                Name: username,
                Nummer: usernumber,
            }])
            .select()
            .single();

        if (spielerError) throw spielerError;

        // 2. Schritt: Die ID der Rolle mit main: 2 für dieses Team finden
        const { data: rolleData, error: rollenSucheError } = await supabase
            .from('rollen')
            .select('id')
            .eq('team_id', aktuellesTeam.id)
            .eq('main', 2)
            .single();

        // Falls eine Rolle mit main: 2 existiert, weisen wir sie zu
        if (rolleData && !rollenSucheError) {
            // 3. Schritt: Verknüpfung in 'spieler_rollen' erstellen
            const { error: verknuepfungsError } = await supabase
                .from('spieler_rollen')
                .insert([{
                    spieler_id: neuerSpieler.id,
                    rollen_id: rolleData.id
                }]);

            if (verknuepfungsError) {
                console.error("Fehler beim Zuweisen der Rolle:", verknuepfungsError.message);
                // Wir werfen hier keinen harten Fehler, da der Spieler ja schon erstellt wurde
            }
        } else {
            console.warn("Keine Standard-Rolle (main: 2) für dieses Team gefunden.");
        }

        // Alles erfolgreich -> Fenster schließen
        schliessen();

    } catch (error) {
        console.error("Fehler beim Speichern:", error.message);
        alert("Fehler: " + error.message);
    }
};



    
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
                style={{ width: isMobile ?'50vw':'30vw', height:  isMobile ?'40vw':'20vw', marginBottom: '20px', opacity: "1", zIndex:"1001", backgroundColor:"#171717", borderRadius:"1vw",position:"relative", border:"0.2vw solid #2e2e2e" }} 
                      >
                        <h3 style={{textAlign:"center", fontFamily:"sans-serif", color:"white", fontSize:isMobile ?'3vw':"2vw"}}>Neuen Spieler erstellen</h3>
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
                <input 
                    type="text" 
                    placeholder="Spieler Name" 
                    value={username}
                    onChange={(e) => setusername(e.target.value)}
                    style={{right:isMobile ?'6vw': "4vw",top:isMobile ?'20%': '30%', position: "absolute", cursor:"text", width: isMobile ?'35vw':"20vw", height:isMobile ?'9vw':"3vw", backgroundColor:"#ffffff", color:"black", border: isMobile ?'0.6vw solid #9c9c9c':"2px solid #9c9c9c", borderRadius:isMobile ?'20vw':"5vw", fontSize:isMobile ?'4vw':"2vw", textAlign: "center", justifyContent:"center", display:"flex", alignItems:"center"}}
                    />
                <input 
                    type="text" 
                    placeholder="Spieler Nummer" 
                    value={usernumber}
                    onChange={(e) => setusernumber(e.target.value)}
                    style={{right: isMobile ?'6vw':"4vw",top:isMobile ?'45%': '50%', position: "absolute", cursor:"text", width: isMobile ?'35vw':"20vw", height:isMobile ?'9vw':"3vw", backgroundColor:"#ffffff", color:"black", border: isMobile ?'0.6vw solid #9c9c9c':"2px solid #9c9c9c", borderRadius:isMobile ?'20vw':"5vw", fontSize:isMobile ?'4vw':"2vw", textAlign: "center", justifyContent:"center", display:"flex", alignItems:"center"}}
                    />
                <button onClick={handleSpeichern} style={{ width:isMobile ?'35vw':"20vw",height:isMobile ?'9vw':"4vw", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: isMobile ?'3vw':"1vw", cursor: "pointer", fontSize: isMobile ?'4vw':"1.5vw", top:isMobile ?'70%':"70%", right:isMobile ?'6vw':"4vw", position:"absolute" }}>
                Spieler Speichern
                </button>
            </div>
            </div>
    )
}