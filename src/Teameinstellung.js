// Teameinstellung.js
import React, {useState, useEffect} from 'react';
import { createClient } from '@supabase/supabase-js';
import { useUser } from "@clerk/clerk-react";
import { FiShare2, FiLogOut} from "react-icons/fi";

const supabase = createClient('https://fdwsacwvndkerbjbqcmi.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkd3NhY3d2bmRrZXJiamJxY21pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxNDQ2NjksImV4cCI6MjA4MzcyMDY2OX0.01CcKVq-bSO7M97DoT-o9PJ-jgVJ1RqTtarQRbktyiY');

export default function Teameinstellung({schliessen, setAktuellesTeam, isMobile}) {

  const [erstellenModus, setErstellenModus] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [teamBild, setTeamBild] = useState(null);
  const [bildDatei, setBildDatei] = useState(null);
  const { user } = useUser();
  const [meineTeams, setMeineTeams] = useState([]);


  useEffect(() => {
  async function teamsLaden() {
    if (!user) return;
    
    // Hole alle Team-IDs, bei denen der User Mitglied ist
    const { data: mitgliedschaften } = await supabase
      .from('team_mitglieder')
      .select('team_id')
      .eq('user_id', user.id);

    if (mitgliedschaften && mitgliedschaften.length > 0) {
      const teamIds = mitgliedschaften.map(m => m.team_id);
      
      // Lade jetzt die echten Team-Daten für diese IDs
      const { data: teams } = await supabase
        .from('teams')
        .select('*')
        .in('id', teamIds);

      setMeineTeams(teams || []);
    }}
    teamsLaden();
}, [user]);

  const handleSpeichern = async () => {
    // 1. Validierung: Haben wir einen Namen, einen User und eine Datei?
    if (!teamName || !user || !bildDatei) {
      alert("Bitte gib einen Team-Namen ein und lade ein Bild hoch!");
      return;
    }

    try {
      // A: BILD-UPLOAD ZUM STORAGE
      // Wir erstellen einen eindeutigen Dateinamen (Zeitstempel + Name), damit nichts überschrieben wird
      const fileExt = bildDatei.name.split('.').pop();
      const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = fileName; // Pfad im Bucket

      const {error: uploadError } = await supabase.storage
        .from('teambilder') // Dein Bucket-Name
        .upload(filePath, bildDatei);

      if (uploadError) {
        throw new Error("Fehler beim Bild-Upload: " + uploadError.message);
      }

      // B: ÖFFENTLICHE URL DES BILDES HOLEN
      const { data: urlData } = supabase.storage
        .from('teambilder')
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;

      // C: TEAM-DATEN IN DIE DATENBANK SCHREIBEN
      const neuesTeam = {
        user_id: user.id,   // Clerk User ID
        name: teamName,     // Aus dem Input-Feld
        bild: publicUrl     // Jetzt die URL aus dem Storage, nicht mehr der Base64-String!
      };

      const { data: dbData, error: dbError } = await supabase
        .from('teams')
        .insert([neuesTeam])
        .select();

      if (dbError) {
        throw new Error("Fehler beim Speichern in der Tabelle: " + dbError.message);
      }

      // D: ERFOLG - UI AKTUALISIEREN
      // Wir fügen das neue Team der Liste hinzu und schließen den Erstellen-Modus
      setMeineTeams([...meineTeams, dbData[0]]);
      setTeamName("");
      setTeamBild(null); // Vorschau leeren
      setBildDatei(null); // Datei-State leeren
      setErstellenModus(false);

      const neuErstelltesTeam = dbData[0];

      // Ersteller automatisch als Admin-Mitglied hinzufügen
      const { error: mitgliedError } = await supabase
        .from('team_mitglieder')
        .insert([{
          team_id: neuErstelltesTeam.id,
          user_id: user.id,
          rolle: 'admin'
        }]);

      if (mitgliedError) {
        console.error("Fehler beim Hinzufügen des Mitglieds:", mitgliedError.message);
      }

    } catch (error) {
      console.error("Gesamtfehler:", error.message);
      alert(error.message);
    }
    
  };


  const handleDrop = (e) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0]; 

      if (file && file.type.startsWith("image/")) {
        setBildDatei(file);

        const reader = new FileReader();
        reader.onload = () => {
          setTeamBild(reader.result); 
        };
        reader.readAsDataURL(file);
      }
    };

    const teamCardStyle = {
      width:  isMobile ?'22vw':"9vw",
      height: isMobile ?'35vw':"15vw",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      backgroundColor: "#212121",
      borderRadius: "1vw",
      border: "0.2vw solid #2e2e2e",
      transition: "transform 0.2s",
    };

    const createCardStyle = {
      ...teamCardStyle,
      border: "2px dashed #9c9c9c",
      backgroundColor: "transparent"
    };


    const kopiereEinladungsLink = (team) => {
      // 1. Sicherheitscheck: Existiert das Team und hat es einen Code?
      // WICHTIG: Prüfe in Supabase, ob die Spalte invite_code (mit Unterstrich) heißt!
      const code = team.invite_code || team.inviteCode; 

      if (!code) {
        alert("Dieses Team hat noch keinen Einladungscode. Bitte erstelle ein neues Team oder prüfe die Datenbank.");
        console.log("Team-Objekt ohne Code:", team);
        return;
      }

      // 2. Link korrekt zusammenbauen
      const baseUrl = window.location.origin; // http://localhost:3000
      const link = `${baseUrl}/join?code=${code}`;

      // 3. Kopieren
      navigator.clipboard.writeText(link);
      alert(`Link für "${team.name}" kopiert!`);
    };
    const handleDragOver = (e) => {
      e.preventDefault(); // Verhindert, dass der Browser das Bild einfach nur öffnet
    };

    const teamVerlassen = async (e, teamId) => {
      e.stopPropagation();

      if (!user) return;

      if (!window.confirm("Möchtest du dieses Team wirklich verlassen?")) return;

      try {

        const { error } = await supabase
          .from('team_mitglieder')
          .delete()
          .eq('team_id', teamId)
          .eq('user_id', user.id); 

        if (error) throw error;

        setMeineTeams(meineTeams.filter(t => t.id !== teamId));
        
        alert("Du hast das Team verlassen.");
      } catch (error) {
        console.error("Fehler beim Verlassen des Teams:", error.message);
        alert("Fehler: " + error.message);
      }
    };

    const dateiAuswaehlen = () => {
      document.getElementById('hidden-file-input').click();
    };

    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file && file.type.startsWith("image/")) {
        setBildDatei(file);

        const reader = new FileReader();
        reader.onload = () => {
          setTeamBild(reader.result); 
        };
        reader.readAsDataURL(file);
      }
    };

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
              backgroundColor: 'rgba(66, 66, 66, 0.8)',
            }}>
        <div 
        onClick={(e) => e.stopPropagation()}
        style={{ width: isMobile ?'80vw':'40vw', height:  isMobile ?'60vw':'25vw', marginBottom: '20px', opacity: "1", zIndex:"1001", backgroundColor:"#171717", borderRadius:"1vw",position:"relative", border:"0.2vw solid #2e2e2e" }} 
              >
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
          X
        </button>
        {!erstellenModus ? (
          
          <div style={{ 
            display: "flex", 
            flexDirection: "column", 
            height: "100%", 
            width: "100%",
            paddingTop: isMobile ? '12vw' : '0vw',
          }}>

            <div style={{ 
            display: "flex", 
            flexDirection: "column", 
            height: "10%", 
            width: "100%",
            paddingTop: isMobile ? '12vw' : '1vw',
            border: '0.1vw solid #2e2e2e',
            borderRadius:"1vw"
          }}>

          
            
            {/* --- DER TITEL --- */}
            <h2 style={{ 
              color: "white", 
              fontFamily: "sans-serif", 
              fontSize: isMobile ? '6vw' : "1.7vw", 
              margin: "0 0 2vw 4vw", // Abstand nach links (wie die Kacheln) und unten
              fontWeight: "white"
            }}>
              Meine Teams
            </h2>
            </div>

        <div className='no-scrollbar' style={{ display: "flex", flexWrap: "wrap", gap: "2vw", overflowY: "auto", maxHeight: "79%",padding: "0vw 0vw 2vw 4vw" ,paddingTop: isMobile ?'12vw' : "1vw", paddingBottom: isMobile ?'0vw' : "0vw"}}>

          
          
            {/* 1. BESTEHENDE TEAMS ANZEIGEN */}
            {meineTeams.map((team) => (
              <div 
                key={team.id}
                onClick={() => {
                  setAktuellesTeam(team);
                  schliessen();
                }}
                style={{...teamCardStyle, position: "relative"}}
              >
                <button 
                onClick={(e) => teamVerlassen(e, team.id)}
                style={{
                  position: "absolute",
                  top: "2%",
                  right: "5%",
                  width: isMobile ?'5vw':"2vw",
                  height: isMobile ?'5vw':"2vw",
                  backgroundColor: "#ff4d4d",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  cursor: "pointer",
                  fontSize: isMobile ?'3vw':"1.2vw",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 10,
                  padding: 0
                }}
              >
                <FiLogOut />
              </button>
                <button 
                onClick={(e) => {
                  e.stopPropagation();
                  kopiereEinladungsLink(team)
                }}
                style={{
                  position: "absolute",
                  top: "2%",
                  left: "5%",
                  width: isMobile ?'5vw':"2vw",
                  height: isMobile ?'5vw':"2vw",
                  backgroundColor: "#ffffff",
                  color: "black",
                  border: "1px solid black",
                  borderRadius: "50%",
                  cursor: "pointer",
                  fontSize: isMobile ?'3vw':"1.25vw",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 10,
                  padding: 0
                }}
              >
                <FiShare2 color='black'/>
              </button>
                <div style={{ 
                  width: isMobile ?'15vw':"5vw", height:isMobile ?'15vw': "5vw", borderRadius: "50%", 
                  backgroundColor: "#eee", overflow: "hidden", border: "1px solid #ccc" 
                }}>
                  {team.bild ? <img src={team.bild} style={{width: "100%", height: "100%", objectFit: "cover"}}  alt='Team Logo'/> : "⚽"}
                </div>
                <p style={{ fontSize: isMobile ?'3.3vw':"1vw", marginTop: "0.5vw", color: "white", fontFamily:"sans-serif" }}>{team.name}</p>
              </div>
            ))}

            {/* 2. DER PLUS-BUTTON (Zum Erstellen) */}
            <div onClick={() => setErstellenModus(true)} style={createCardStyle}>
              <span style={{ fontSize: isMobile ?'10vw':"3vw", color: "#9c9c9c" }}>+</span>
              <p style={{ fontSize: isMobile ?'3.3vw':"1vw", color: "#9c9c9c", fontFamily:"sans-serif", textAlign:"center" }}>Neues Team erstellen</p>
            </div>
          </div>
          </div>
        ):(
          <>
          <h2 style={{ color: "white", textAlign: "center", fontFamily:"sans-serif", top:"10%", fontSize:isMobile ?'5vw':"2vw", border:"none", borderRadius:"2vw"}}>
          Team erstellen
          </h2>
          <button 
          onClick={() => setErstellenModus(false)}
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
            transform: "rotate(90deg)"
          }}
        >
          V
        </button>
        <input 
              type="text" 
              placeholder="Team Name" 
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              style={{right: "5%",top: '25%', position: "absolute", cursor:"text", width: isMobile ?'35vw':"20vw", height:isMobile ?'9vw':"3vw", backgroundColor:"#ffffff", color:"black", border: isMobile ?'0.6vw solid #9c9c9c':"2px solid #9c9c9c", borderRadius:isMobile ?'20vw':"5vw", fontSize:isMobile ?'4vw':"2vw", textAlign: "center", justifyContent:"center", display:"flex", alignItems:"center"}}
            />
          
        <input 
          type="file" 
          id="hidden-file-input"
          accept="image/*" 
          style={{ display: 'none' }} 
          onChange={handleFileChange} 
        />

        <div 
              onDrop={handleDrop} 
              onDragOver={handleDragOver}
              onClick={dateiAuswaehlen}
              style={{width:isMobile ?'35vw': "15vw",height:isMobile ?'35vw': "15vw",border: isMobile ?'0.6vw dashed #9c9c9c':"2px dashed #9c9c9c",borderRadius: "50%",display: "flex",justifyContent: "center",alignItems: "center",textAlign: "center",fontSize: isMobile ?'5vw':"2vw",color: "#9c9c9c",backgroundColor: "#f9f9f9",cursor: "pointer",overflow: "hidden",margin: "1vw 1vw", fontFamily:"sans-serif"}}
            >
        {teamBild ? (
          <img src={teamBild} alt="Vorschau" style={{width:"100%", height: "100%", objectFit:"cover"}} />
              ) : (
                <p>Bild hierher ziehen oder fallen lassen</p>
              )}
            </div>
            <button onClick={handleSpeichern} style={{ width:isMobile ?'35vw':"20vw",height:isMobile ?'9vw':"4vw", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: isMobile ?'3vw':"1vw", cursor: "pointer", fontSize: isMobile ?'4vw':"1.5vw", top:isMobile ?'60%':"60%", right:"6%", position:"absolute" }}>
              Team Speichern
            </button>
            <button onClick={() => setErstellenModus(false)} style={{ width:isMobile ?'35vw':"20vw",height:isMobile ?'9vw':"4vw", backgroundColor: "#ff0000", color: "white", border: "none", borderRadius: isMobile ?'3vw':"1vw", cursor: "pointer", fontSize: isMobile ?'4vw':"1.5vw", top:isMobile ?'80%':"80%", right:"6%", position:"absolute" }}>Abbrechen</button>
    </>
        )}
    </div>
    </div>
  );
}


