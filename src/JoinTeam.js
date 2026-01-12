import { useUser } from "@clerk/clerk-react"; 
import { createClient } from "@supabase/supabase-js";

// Supabase Client (Keys bitte prüfen)
const supabase = createClient(
  'https://fdwsacwvndkerbjbqcmi.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkd3NhY3d2bmRrZXJiamJxY21pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxNDQ2NjksImV4cCI6MjA4MzcyMDY2OX0.01CcKVq-bSO7M97DoT-o9PJ-jgVJ1RqTtarQRbktyiY' 
);

export default function JoinTeam() {
  const { user } = useUser();

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
        .select('id')
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

    const team = teams[0]; // Wir nehmen das erste gefundene Team
    console.log("Team gefunden:", team.name);

      // 2. User eintragen
      const { error: joinError } = await supabase
        .from('team_mitglieder')
        .insert([{ 
          team_id: team.id, 
          user_id: user.id, 
          rolle: 'mitglied' 
        }]);

      if (joinError) {
          if (joinError.code === '23505') {
              alert("Du bist bereits in diesem Team!");
          } else {
              throw joinError;
          }
      } else {
          alert("Erfolgreich beigetreten!");
      }

      // STATT navigate: Seite neu laden und Code aus URL entfernen
      window.location.href = "/";

    } catch (err) {
      console.error(err);
      alert("Fehler beim Beitreten: " + err.message);
    }
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
      <div style={{ backgroundColor: '#f9f9f9', padding: '40px', borderRadius: '15px', display: 'inline-block', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
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
    </div>
  );
}