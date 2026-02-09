// Teameinstellung.js
import React, {useState, useEffect,} from 'react';
import { createClient } from '@supabase/supabase-js';
import { useUser } from "@clerk/clerk-react";
import { FiShare2} from "react-icons/fi";
import { IoMdArrowRoundBack, IoMdClose, IoMdSettings } from 'react-icons/io';
import { QRCodeSVG } from 'qrcode.react';
import { FaCopy } from 'react-icons/fa';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Teameinstellung({schliessen, setAktuellesTeam, isMobile}) {

  const [erstellenModus, setErstellenModus] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [aktteam, setaktteam] = useState("");
  const [teamsname, setteamsname] = useState("");
  const [username, setusername] = useState("");
  const [usernumber, setusernumber] = useState("");
  const [teamBild, setTeamBild] = useState(null);
  const [teamsbild, setteamsbild] = useState(null);
  const [bildDatei, setBildDatei] = useState(null);
  const { user } = useUser();
  const [ansicht, setAnsicht] = useState(false);
  const [bearbeitung, setBearbeitung] = useState(false);
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
    if (!teamName || !user || !bildDatei || !username) {
      alert("Bitte gib einen Team-Namen ein und lade ein Bild hoch!");
      return;
    }

    try {
      const fileExt = bildDatei.name.split('.').pop();
      const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = fileName;

      const {error: uploadError } = await supabase.storage
        .from('teambilder') 
        .upload(filePath, bildDatei);

      if (uploadError) {
        throw new Error("Fehler beim Bild-Upload: " + uploadError.message);
      }


      const { data: urlData } = supabase.storage
        .from('teambilder')
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;


      const neuesTeam = {
        user_id: user.id,   
        name: teamName,     
        bild: publicUrl     
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
      setusername("")
      setTeamBild(null); // Vorschau leeren
      setBildDatei(null); // Datei-State leeren
      setErstellenModus(false);

      const neuErstelltesTeam = dbData[0];

      console.log("jadhwajkd")
      const { data: adminMitglied, error: mitgliedError } = await supabase
        .from('team_mitglieder')
        .insert([{
          team_id: neuErstelltesTeam.id,
          user_id: user.id,
          Name: username,
          Nummer: usernumber,
        }])
        .select() // Gibt die Daten zurück
        .single();
      if (mitgliedError) {
        console.error("Fehler beim Hinzufügen des Mitglieds:", mitgliedError.message);
      }

      const { data: erstellteRollen, error: rollenError } = await supabase
        .from('rollen')
        .insert([
          {
            team_id: neuErstelltesTeam.id,
            name: 'Trainer',
            farbe: '#ff0000', // Rot für Trainer
            TaTa: true, // Darf Taktik
            SpieEr: true, // Darf Spieler erstellen
            Spidel: true, // Darf löschen
            Roll: true, // Darf Rollen verwalten
            main: 1  // Main Wert 1
          },
          {
            team_id: neuErstelltesTeam.id,
            name: 'Spieler',
            farbe: '#ffffff', // Blau für Spieler
            TaTa: false,
            SpieEr: false,
            Spidel: false,
            Roll: false,
            main: 2  // Main Wert 2
          }
        ])
        .select();

      if (rollenError) {
        console.error("Fehler beim Erstellen der Standard-Rollen:", rollenError.message);
      } else if (adminMitglied && erstellteRollen) {
        // 3. OPTIONAL: Dem Admin direkt die Trainer-Rolle (main: 1) zuweisen
        // Damit der Ersteller sofort die Rechte hat
        const trainerRolle = erstellteRollen.find(r => r.main === 1);
        const spielerRolle = erstellteRollen.find(r => r.main === 2);
        
        await supabase
          .from('spieler_rollen')
          .insert([{
            spieler_id: adminMitglied.id,
            rollen_id: trainerRolle.id
          },{
            spieler_id: adminMitglied.id,
            rollen_id: spielerRolle.id
          }]);
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

      const handleDrop2 = (e) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0]; 

      if (file && file.type.startsWith("image/")) {
        setBildDatei(file);

        const reader = new FileReader();
        reader.onload = () => {
          setteamsbild(reader.result); 
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
      borderRadius: isMobile ? "4vw" : "2vw",
      border: "0.2vw solid #2e2e2e",
      transition: "transform 0.2s",
    };

    const createCardStyle = {
      ...teamCardStyle,
      border: "2px dashed #9c9c9c",
      backgroundColor: "transparent"
    };

const generiereLink = (team) =>{
  const code = team.invite_code || team.inviteCode; 

        if (!code) {
          alert("Dieses Team hat noch keinen Einladungscode. Bitte erstelle ein neues Team oder prüfe die Datenbank.");
          console.log("Team-Objekt ohne Code:", team);
          return;
        }

        // 2. Link korrekt zusammenbauen
        const baseUrl = window.location.origin;
        const link = `${baseUrl}/join?code=${code}`;
        return link;
}


    const kopiereEinladungsLink = (team) => {
      const link = generiereLink(team)

      // 3. Kopieren
      navigator.clipboard.writeText(link);
      alert(`Link für "${team.name}" kopiert!`);
    };
    const handleDragOver = (e) => {
      e.preventDefault(); // Verhindert, dass der Browser das Bild einfach nur öffnet
    };

const teamVerlassen = async (teamId) => {
  if (!user) return;
  if (!window.confirm("Möchtest du dieses Team wirklich verlassen?")) return;

  try {
    // 1. Hole die interne ID des Mitglieds aus der team_mitglieder Tabelle
    const { data: mitglied, error: findError } = await supabase
      .from('team_mitglieder')
      .select('id')
      .eq('team_id', teamId)
      .eq('user_id', user.id)
      .single();

    if (findError || !mitglied) throw new Error("Mitgliedschaft nicht gefunden.");

    // 2. Lösche alle Rollen-Verknüpfungen für dieses Mitglied
    const { error: roleError } = await supabase
      .from('spieler_rollen')
      .delete()
      .eq('spieler_id', mitglied.id); // Nutzt die interne ID (Integer)

    if (roleError) throw roleError;

    // 3. Lösche das Mitglied selbst aus dem Team
    const { error: memberError } = await supabase
      .from('team_mitglieder')
      .delete()
      .eq('id', mitglied.id);

    if (memberError) throw memberError;

    // 4. UI aktualisieren
    setMeineTeams(meineTeams.filter(t => t.id !== teamId));
    alert("Du hast das Team verlassen.");
    
    // Optional: Wenn das aktive Team verlassen wurde, zurücksetzen
    // setAktuellesTeam(null); 
    
    schliessen();

  } catch (error) {
    console.error("Fehler beim Verlassen:", error.message);
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

    const handleFileChange2 = (e) => {
      const file = e.target.files[0];
      if (file && file.type.startsWith("image/")) {
        setBildDatei(file);

        const reader = new FileReader();
        reader.onload = () => {
          setteamsbild(reader.result); 
        };
        reader.readAsDataURL(file);
      }
    };

const handleSpeichern2 = async () => {
    if(teamsname === ""){
        alert("Bitte gib einen Namen an");
        return
    }
    const {error} = await supabase
        .from('teams')
        .update([{
          name: teamsname,
          bild: teamsbild
        }])
        .eq("id", aktteam.id)

    if (error) {
        console.error("Fehler beim Speichern:", error.message);
        alert("Fehler: " + error.message);
        return; // Funktion abbrechen, damit das Fenster NICHT schließt
    }
    
    schliessen()
}



const teilen = (team) => {
  setAnsicht(true)
  setaktteam(team)
}

const insbearbeiten = (team) => {
  setaktteam(team)
  setBearbeitung(true)
  
}

useEffect(() => {
  const ladeDaten = async () => {
    if (bearbeitung && aktteam?.id) {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .eq('id', aktteam.id)
        .single();

      if (!error && data) {
        setteamsname(data.name);
        setteamsbild(data.bild);
        setTeamBild(data.bild); 
      }
    }
  };
  ladeDaten();
}, [bearbeitung, aktteam]);


  return (
    
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
        style={{ width:ansicht?isMobile ?'90vw':'30vw':  isMobile ?'80vw':'40vw', height: ansicht?isMobile ?'110vw':'40vw': isMobile ?'60vw':'25vw', marginBottom: '20px', opacity: "1", zIndex:"1001", backgroundColor:"#171717", borderRadius:"1vw",position:"relative", border:"0.2vw solid #2e2e2e" }} 
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
        <IoMdClose/>
        </button>
        {!erstellenModus && !ansicht && !bearbeitung && (
          
          <div style={{ 
            display: "flex", 
            flexDirection: "column", 
            height: "100%", 
            width: "100%",
            paddingTop: isMobile ? '0vw' : '0vw',
          }}>

            <div style={{ 
            display: "flex", 
            flexDirection: "column", 
            height: "16%", 
            width: "100%",
            paddingTop: isMobile ? '2vw' : '1vw',
            borderBottom: '0.1vw solid #2e2e2e',
            borderRadius:"0vw"
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

        <div className='no-scrollbar' style={{ display: "flex", flexWrap: "wrap", gap: "2vw", overflowY: "auto",padding: "0vw 0vw 2vw 4vw" ,paddingTop: isMobile ?'2vw' : "1vw", paddingBottom: isMobile ?'2vw' : "0vw"}}>

          
          
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
                onClick={(e) => {
                  e.stopPropagation();
                  insbearbeiten(team);
                }}
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
                <IoMdSettings />
              </button>
                <button 
                onClick={(e) => {
                  e.stopPropagation();
                  teilen(team);
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
        )}
        {erstellenModus && !ansicht && !bearbeitung && (
          <>
          <h2 style={{ color: "white", textAlign: "center", fontFamily:"sans-serif", fontSize:isMobile ?'5vw':"2vw", borderBottom:'0.1vw solid #2e2e2e', borderRadius:"0vw", marginTop:"3.2%"}}>
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
          }}
        >
          <IoMdArrowRoundBack />
        </button>
        <input 
              type="text" 
              placeholder="Team Name" 
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              style={{right: "5%",top: '20%', position: "absolute", cursor:"text", width: isMobile ?'35vw':"20vw", height:isMobile ?'9vw':"3vw", backgroundColor:"#ffffff", color:"black", border: isMobile ?'0.6vw solid #9c9c9c':"2px solid #9c9c9c", borderRadius:isMobile ?'20vw':"5vw", fontSize:isMobile ?'4vw':"2vw", textAlign: "center", justifyContent:"center", display:"flex", alignItems:"center"}}
            />
        <input 
              type="text" 
              placeholder="Dein Name" 
              value={username}
              onChange={(e) => setusername(e.target.value)}
              style={{right: "5%",top: '32.5%', position: "absolute", cursor:"text", width: isMobile ?'35vw':"20vw", height:isMobile ?'9vw':"3vw", backgroundColor:"#ffffff", color:"black", border: isMobile ?'0.6vw solid #9c9c9c':"2px solid #9c9c9c", borderRadius:isMobile ?'20vw':"5vw", fontSize:isMobile ?'4vw':"2vw", textAlign: "center", justifyContent:"center", display:"flex", alignItems:"center"}}
            />
        <input 
              type="text" 
              placeholder="Deine Nummer" 
              value={usernumber}
              onChange={(e) => setusernumber(e.target.value)}
              style={{right: "5%",top: '45%', position: "absolute", cursor:"text", width: isMobile ?'35vw':"20vw", height:isMobile ?'9vw':"3vw", backgroundColor:"#ffffff", color:"black", border: isMobile ?'0.6vw solid #9c9c9c':"2px solid #9c9c9c", borderRadius:isMobile ?'20vw':"5vw", fontSize:isMobile ?'4vw':"2vw", textAlign: "center", justifyContent:"center", display:"flex", alignItems:"center"}}
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
        {!erstellenModus && ansicht && !bearbeitung && (
          <>
            <div style={{ background: 'white', padding: '1vw', borderRadius: '1vw', display: 'inline-block',marginTop:isMobile ?'12vw':"4vw", marginLeft:isMobile ?'8vw':"2.5vw" }}>
            <QRCodeSVG 
              value={generiereLink(aktteam)} 
              size={isMobile ?'70vw':"23vw"}      // Größe in Pixeln
              bgColor={"#ffffff"} 
              fgColor={"#000000"} 
              level={"L"}
            />
          </div>
          <div style={{
            width: '85%',           // Breite angepasst
            height: isMobile ?'10vw':"4.5vw", 
            backgroundColor: '#ffffff',
            border: "0.2vw solid #2e2e2e",
            borderRadius: "1vw",
            overflow: "hidden",
            display: "flex",        // Aktiviert Flexbox für die Reihe
            alignItems: "stretch",
            margin:isMobile ?'6vw':"2vw"   // Macht Input und Button gleich hoch
          }}>
            <input 
              type="text" 
              value={generiereLink(aktteam)} 
              readOnly 
              style={{
                flex: 1,             // Nimmt den Platz links vom Button ein
                padding: '0 1vw',    // Horizontaler Abstand innen
                backgroundColor: 'transparent',
                border: "none",
                outline: "none",
                fontSize: isMobile ? "4vw" : "1.2vw",
                color: "black",
                display: "flex",
                alignItems: "center", // Vertikale Zentrierung des Textes
                height: "100%"
              }}
            />
            <button
              onClick={() => kopiereEinladungsLink(aktteam)}
              style={{
                width: '20%',
                backgroundColor: '#171717',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                fontSize: isMobile ? "5vw" : "2vw",
                display: "flex",
                alignItems: "center",    // Text im Button zentrieren
                justifyContent: "center"
              }}
            >
              <FaCopy />
            </button>
          </div>
          <button 
          onClick={() => setAnsicht(false)}
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
        <div
          onClick={() => setAnsicht(false)}
          style={{
            position:"absolute",
            top: "2%",         
            left: isMobile ?'10%':"15%",        
            width: isMobile ?'78%':"20vw",
            height: isMobile ?'7vw':"3vw",
            backgroundColor:"#171717",
            fontSize:isMobile ?'5vw':"2vw",
            color: '#ffffff',
            border: 'none',
            cursor: 'pointer',
            zIndex: 1002,
            fontFamily:"sans-serif",
            textAlign:"center"
          }}
        >
          {aktteam.name} teilen
        </div>
          </>
        )}
        {!erstellenModus && !ansicht && bearbeitung && (
          <>
          <h2 style={{ color: "white", textAlign: "center", fontFamily:"sans-serif", fontSize:isMobile ?'5vw':"2vw", borderBottom:'0.1vw solid #2e2e2e', borderRadius:"0vw", marginTop:"3.2%"}}>
          {aktteam.name} bearbeiten
          </h2>
          <button 
          onClick={() => setBearbeitung(false)}
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
        <input 
              type="text" 
              placeholder="Team Name" 
              value={teamsname}
              onChange={(e) => setteamsname(e.target.value)}
              style={{right: "5%",top: '20%', position: "absolute", cursor:"text", width: isMobile ?'35vw':"20vw", height:isMobile ?'9vw':"3vw", backgroundColor:"#ffffff", color:"black", border: isMobile ?'0.6vw solid #9c9c9c':"2px solid #9c9c9c", borderRadius:isMobile ?'20vw':"5vw", fontSize:isMobile ?'4vw':"2vw", textAlign: "center", justifyContent:"center", display:"flex", alignItems:"center"}}
            />
            <input 
          type="file" 
          id="hidden-file-input"
          accept="image/*" 
          style={{ display: 'none' }} 
          onChange={handleFileChange2} 
        />

        <div 
              onDrop={handleDrop2} 
              onDragOver={handleDragOver}
              onClick={dateiAuswaehlen}
              style={{width:isMobile ?'35vw': "15vw",height:isMobile ?'35vw': "15vw",border: isMobile ?'0.6vw dashed #9c9c9c':"2px dashed #9c9c9c",borderRadius: "50%",display: "flex",justifyContent: "center",alignItems: "center",textAlign: "center",fontSize: isMobile ?'5vw':"2vw",color: "#9c9c9c",backgroundColor: "#f9f9f9",cursor: "pointer",overflow: "hidden",margin: "1vw 1vw", fontFamily:"sans-serif"}}
            >
        {teamsbild ? (
          <img src={teamsbild} alt="Vorschau" style={{width:"100%", height: "100%", objectFit:"cover"}} />
              ) : (
                <p>Bild hierher ziehen oder fallen lassen</p>
              )}
            </div>
            <button onClick={handleSpeichern2} style={{ width:isMobile ?'35vw':"20vw",height:isMobile ?'9vw':"4vw", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: isMobile ?'3vw':"1vw", cursor: "pointer", fontSize: isMobile ?'4vw':"1.5vw", top:isMobile ?'60%':"60%", right:"6%", position:"absolute" }}>
              Team Speichern
            </button>
            <button onClick={() => teamVerlassen(aktteam.id)} style={{ width:isMobile ?'35vw':"20vw",height:isMobile ?'9vw':"4vw", backgroundColor: "#ff0000", color: "white", border: "none", borderRadius: isMobile ?'3vw':"1vw", cursor: "pointer", fontSize: isMobile ?'4vw':"1.5vw", top:isMobile ?'80%':"80%", right:"6%", position:"absolute" }}>Team verlassen</button>
    
          </>
        )}
    </div>
    </div>
  );
}


