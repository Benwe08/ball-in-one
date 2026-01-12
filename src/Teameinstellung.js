// Teameinstellung.js
import React, {useState, useEffect} from 'react';
import { createClient } from '@supabase/supabase-js';
import { useUser } from "@clerk/clerk-react";
import { FiShare2} from "react-icons/fi";

const supabase = createClient('https://fdwsacwvndkerbjbqcmi.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkd3NhY3d2bmRrZXJiamJxY21pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxNDQ2NjksImV4cCI6MjA4MzcyMDY2OX0.01CcKVq-bSO7M97DoT-o9PJ-jgVJ1RqTtarQRbktyiY');

export default function Teameinstellung({schliessen, setAktuellesTeam}) {

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

      const { data: uploadData, error: uploadError } = await supabase.storage
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

    const teamLoeschen = async (e, id) => {
        e.stopPropagation();
        const { error } = await supabase.from('teams').delete().eq('id', id);
        
        if (!error) {
          setMeineTeams(meineTeams.filter(t => t.id !== id));
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
        style={{ width: '40vw', height: '25vw', marginBottom: '20px', opacity: "1", zIndex:"1001", backgroundColor:"white", borderRadius:"4vw",position:"relative" }} 
              >
        <button 
          onClick={schliessen}
          style={{
            position:"absolute",
            top: "4%",         
            right: "4%",        
            width: "3vw",
            height: "3vw",
            backgroundColor:"#ffff",
            fontSize:"2vw",
            color: '#9c9c9c',
            border: '1px solid #9c9c9c',
            cursor: 'pointer',
            zIndex: 1002,
            borderRadius:"50%"
          }}
        >
          X
        </button>
        {!erstellenModus ? (
        <div className='no-scrollbar' style={{ display: "flex", flexWrap: "wrap", gap: "2vw", overflowY: "auto", maxHeight: "80%",padding: "2vw 2vw 3vw 4vw" }}>
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
                onClick={(e) => teamLoeschen(e, team.id)}
                style={{
                  position: "absolute",
                  top: "2%",
                  right: "5%",
                  width: "1.5vw",
                  height: "1.5vw",
                  backgroundColor: "#ff4d4d",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  cursor: "pointer",
                  fontSize: "1vw",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 10
                }}
              >
                x
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
                  width: "1.5vw",
                  height: "1.5vw",
                  backgroundColor: "#ffffff",
                  color: "black",
                  border: "1px solid black",
                  borderRadius: "50%",
                  cursor: "pointer",
                  fontSize: "1vw",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 10
                }}
              >
                <FiShare2 size="1.5vw" color='black'/>
              </button>
                <div style={{ 
                  width: "5vw", height: "5vw", borderRadius: "50%", 
                  backgroundColor: "#eee", overflow: "hidden", border: "1px solid #ccc" 
                }}>
                  {team.bild ? <img src={team.bild} style={{width: "100%", height: "100%", objectFit: "cover"}} /> : "⚽"}
                </div>
                <p style={{ fontSize: "1vw", marginTop: "0.5vw", color: "black" }}>{team.name}</p>
              </div>
            ))}

            {/* 2. DER PLUS-BUTTON (Zum Erstellen) */}
            <div onClick={() => setErstellenModus(true)} style={createCardStyle}>
              <span style={{ fontSize: "3vw", color: "#9c9c9c" }}>+</span>
              <p style={{ fontSize: "1vw", color: "#9c9c9c" }}>Neu</p>
            </div>
          </div>
        ):(
          <>
          <h2 style={{ color: "black", textAlign: "center", fontFamily:"sans-serif", top:"10%", fontSize:"2vw"}}>
          Team erstellen
          </h2>
          <button 
          onClick={() => setErstellenModus(false)}
          style={{
            position:"absolute",
            top: "4%",         
            left: "4%",        
            width: "3vw",
            height: "3vw",
            backgroundColor:"#ffff",
            fontSize:"2vw",
            color: '#9c9c9c',
            border: '1px solid #9c9c9c',
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
              style={{right: "5%",top: '25%', position: "absolute", cursor:"text", width: "20vw", height:"3vw", backgroundColor:"#ffffff", color:"black", border: "1px solid rgb(0, 0, 0)", borderRadius:"5vw", fontSize:"2vw", textAlign: "center", justifyContent:"center", display:"flex", alignItems:"center"}}
            />
          
        <div 
              onDrop={handleDrop} 
              onDragOver={handleDragOver}
              style={{width: "15vw",height: "15vw",border: "2px dashed #9c9c9c",borderRadius: "50%",display: "flex",justifyContent: "center",alignItems: "center",textAlign: "center",fontSize: "2vw",color: "#9c9c9c",backgroundColor: "#f9f9f9",cursor: "pointer",overflow: "hidden",margin: "1vw 1vw"}}
            >
        {teamBild ? (
          <img src={teamBild} alt="Vorschau" style={{width:"100%", heigth: "100%", objectFit:"cover"}} />
              ) : (
                <p>Bild hierher ziehen oder fallen lassen</p>
              )}
            </div>
            <button onClick={handleSpeichern} style={{ width:"20vw",height:"4vw", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "1vw", cursor: "pointer", fontSize: "1.5vw", top:"60%", right:"6%", position:"absolute" }}>
              Team Speichern
            </button>
            <button onClick={() => setErstellenModus(false)} style={{ width:"20vw",height:"4vw", backgroundColor: "#ff0000", color: "white", border: "none", borderRadius: "1vw", cursor: "pointer", fontSize: "1.5vw", top:"80%", right:"6%", position:"absolute" }}>Abbrechen</button>
    </>
        )}
    </div>
    </div>
  );
}


const teamCardStyle = {
  width: "9vw",
  height: "15vw",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  backgroundColor: "#f0f0f0",
  borderRadius: "1.5vw",
  border: "1px solid black",
  transition: "transform 0.2s"
};

const createCardStyle = {
  ...teamCardStyle,
  border: "2px dashed #9c9c9c",
  backgroundColor: "transparent"
};