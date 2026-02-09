import { useUser } from "@clerk/clerk-react"; 
import { useState } from "react";
import fallback from "./assets/fallback-bild.png.png";
import { createClient } from "@supabase/supabase-js";


// Supabase Client (Keys bitte prüfen)
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function JoinTeam({isMobile}) {
  const [hatgeklappt, setHatgeklappt] = useState(false);
  const { user } = useUser();
  const [spielerDaten, setSpielerDaten] = useState([]);

  const beitreten = async () => {
    // STATT useSearchParams: Wir lesen den Code direkt aus der Adresszeile
    const aktuelleUrl = window.location.href;
    console.log("Gesamte URL:", aktuelleUrl);
    
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    console.log("Extrahierter Code-Wert:", code);

    if (!code || code === "" || code === "null" || code === "[object Object]") {
        console.error("Fehler: Der Code wurde nicht korrekt aus der URL gelesen.");
        alert("Der Einladungslink ist ungültig oder unvollständig.");
        return;
    }

    try {
      // 1. Team suchen
      const { data: teams, error: teamError } = await supabase
        .from('teams')
        .select('*')
        .eq('invite_code', code)

      if (teamError || !teams) {
        console.error("Supabase Fehler beim Suchen:", teamError.message);
          alert("Dieses Team existiert leider nicht.");
          return;
      }

      if (!teams || teams.length === 0) {
        alert("Dieses Team existiert leider nicht. Bitte prüfe den Link.");
        return;
        }

    const team = teams[0]; 

    const { data: existiertSchon, } = await supabase
      .from('team_mitglieder')
      .select('id')
      .eq('team_id', team.id)
      .eq('user_id', user.id) // Wir suchen nach der Clerk-ID des aktuellen Users
      .maybeSingle(); // Gibt ein Objekt zurück oder null, falls nichts gefunden wurde

    if (existiertSchon) {
      alert("Du bist bereits Mitglied dieses Teams!");
      window.location.href = "/"; // Direkt zum Dashboard/Startseite
      return;
    }

    console.log("Team gefunden:", team.name);

    setHatgeklappt(true)
    ladeSpieler(team.id)
    } catch (err) {
      console.error(err);
      alert("Fehler beim Beitreten: " + err.message);
    }
  };

  const eingeloggtals = async(spieler) => {
    if (!window.confirm("Bist du "+ spieler.Name + " ?")) return;

    try {
    // 2. Wir warten mit "await", bis die Datenbank fertig ist
    const { data, error } = await supabase
      .from('team_mitglieder')
      .update({ user_id: user.id })
      .eq('id', spieler.id)
      .select();

    if (error) {
      console.error("Datenbank-Fehler:", error.message);
      alert("Fehler beim Speichern: " + error.message);
      return;
    }

    console.log("Erfolgreich verknüpft:", data);

    // 3. Erst wenn alles geklappt hat, leiten wir weiter
    window.location.href = "/";

  } catch (err) {
    console.error("Allgemeiner Fehler:", err);
  }
};

  const ladeSpieler = async (teamID) => {
    console.log(teamID)

      const { data, error } = await supabase
      .from('team_mitglieder')
      .select(`
        id,
        user_id,
        Name,
        Nummer,
        nutzer (profilbild_url)
      `)
        .eq('team_id', teamID);

      if (!error && data) {
        setSpielerDaten(data);
      }
    };

  const playerCardStyle = {
      width:  isMobile ?'22vw':"17vw",
      height: isMobile ?'35vw':"10vw",
      position:"relative",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      cursor: "pointer",
      backgroundColor: "#212121",
      borderRadius: isMobile ? "4vw" : "2vw",
      border: "0.2vw solid #00e5ff",
      transition: "transform 0.2s",
    };

  const buttonStyle = {
    padding: '15px 30px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1.1rem',
    cursor: 'pointer',
    fontWeight: 'bold'
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '100px', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ backgroundColor: '#d8d8d8', padding: '40px', borderRadius: '15px', display: 'inline-block', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
        <h2>Team-Einladung</h2>
        <p>Du wurdest eingeladen, einem Team beizutreten.</p>
        <button onClick={beitreten} style={buttonStyle}>
          Jetzt Mitglied werden
        </button>
        <div style={{ marginTop: '20px' }}>
            <button onClick={() => window.location.href = "/"} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', textDecoration: 'underline' }}>
                Abbrechen
            </button>
        </div>
      </div>
      {hatgeklappt &&(

        <div 
        onClick={(e) => e.stopPropagation()}
        style={{ width:'100vw', height: "100vh", marginBottom: '20px', opacity: "1", zIndex:"1001", backgroundColor:"#171717", borderRadius:"none",position:"fixed", border:"0.2vw solid #2e2e2e", color:"white", fontFamily:"sans-serif", fontSize:"3vw", left:0, top: 0 }} 
              >
                <h3>Wer bist du?</h3>

        <div style={{ 
          display: "flex", 
          flexWrap: "wrap", 
          gap: "1.97vw", 
          padding: "1.97vw",
          justifyContent: "flex-start" ,
          width:"100%",
          boxSizing:"border-box"
        }}>
          
          {spielerDaten
          .filter((spieler) => spieler.user_id === null)
          .map((spieler) => (
            <div key={spieler.id} onClick={() => eingeloggtals(spieler)}style={playerCardStyle}>
              <img 
                src={spieler.nutzer?.profilbild_url|| fallback} 
                style={{ width:isMobile ? "20vw" : '6.5vw',height:isMobile ? "20vw" : "6.5vw", borderRadius: '10vw',objectFit:"cover",position:isMobile ? "absolute":"relative", left:"3%",top:isMobile ? "10%" : "0%", border:"0.3vw solid #8b8b8b" }} 
                alt="Profil"
              />
              <h3 style={{position:"absolute", fontSize:isMobile ? "3vw" : "1.5vw", top:isMobile ? "63%" : "10%", left:isMobile ? "0%" : "40%", display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical", overflow:"hidden", textOverflow:"ellipsis", width:isMobile ? "100%" : "50%"}}>{spieler.Name}</h3>
              <div
                style={{ width:isMobile ? "4.5vw" :  '2.5vw',height:isMobile ? "3vw" : "1.5vw", borderRadius: '5vw',objectFit:"cover",position:"absolute", right:"7%",top:isMobile ? "4%" : "7%", backgroundColor:"#00e5ff",fontSize:isMobile ? "1.5vw" : "1vw", color:"#2e2e2e", display:"flex",justifyContent:"center", alignItems:"center" }}>
                  <h3>{spieler.Nummer}</h3>
              </div>
              
              
            </div>
            
          ))}
          </div>

              </div>
        
        
      )}
    </div>
  );
}