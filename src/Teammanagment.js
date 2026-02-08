import {  useEffect, useState, useCallback } from "react";
import { createClient } from '@supabase/supabase-js';
import fallback from "./assets/fallback-bild.png.png";
import NeuerSpielers from "./Neuerspieler";
import Editplayers from "./editplayer";
import NeueRolles from "./NeueRolle";
import EditRolles from "./editrolle";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);



export default function Teammanagments({isMobile, aktuellesTeam, userRechte, neuladensss}) {
  const [neuerspieler, setneuerspieler] = useState(false);
  const [edispieler, setedispieler] = useState(false);
  const [neuroll, setneuroll] = useState(false);
  const [editroll, seteditrolle] = useState(false);
  const [welcherspieler, setwelcherspieler] = useState();
  const [welcherolle, setwelcherolle] = useState();
  const [spielerDaten, setSpielerDaten] = useState([]);
  const [rollenDaten, setRollenDaten] = useState([]);


const neuladen = () => {
  neuladensss()
  setneuerspieler(false)
  setneuroll(false)
  seteditrolle(false)
  setwelcherspieler()
  setedispieler(false)
  ladeSpieler()
    ladeRolle()
    console.log(userRechte)

}

const Liste = ({ title, children, isMobile }) => {
  let posl, post, w, h, bc,zi, bo, br
  if (title === "Spieler"){
    posl = isMobile ?'30vw' :"20vw";
    post = isMobile ?'10.5vw' :"5vw";
    w = isMobile ?'65vw' :"78vw";
    h = isMobile ?'85vh' :'80vh';
    bc = "#212121";
    bo = isMobile ?'0.3vw solid #2e2e2e' :'0.1vw solid #2e2e2e';
    br = isMobile ? "10vw": "4vw"
    zi= 0
  }
  else if (title === "  "){
    posl = isMobile ?'2vw' :"3vw";
    post = isMobile ?'10.5vw' :"5vw";
    w = isMobile ?'25vw' :"15vw";
    h = isMobile ?'85vh' :'80vh';
    bc = "#212121";
    bo = isMobile ?'0.3vw solid #2e2e2e' :'0.1vw solid #2e2e2e';
    br = isMobile ? "10vw": "4vw"
    zi= 0
  }
  
  return (
    <div style={{
      width: w,   
      height: h,
      border: bo,
      backgroundColor:bc,
      color:"white",
      borderRadius: br,
      position: 'absolute',
      left: posl,
      top: post,
      fontFamily: "sans-serif",
      fontWeight: "bold",
      display: "flex",
      flexDirection:"column",
      fontSize: isMobile ?'3vw' :"5vh",
      overflowY: "hidden",
      zIndex:zi,
      textAlign:"center"
    }}>
         <h3 style={{margin:(title === "Spieler") ? "0.5vw 0" : "0vw 0", }}>{title}</h3>
      <div className='no-scrollbar' style={{ display: 'flex', flexDirection: 'column', paddingBottom:"0vw",paddingTop:"0vw", overflowY:"auto", flexGrow:1, }}>
        {children}
        </div>
    </div>
  );
};


      const ladeSpieler = useCallback(async () => {
      if (!aktuellesTeam) return;

      const { data, error } = await supabase
      .from('team_mitglieder')
      .select(`
        id,
        user_id,
        Name,
        Nummer,
        nutzer (profilbild_url),
        spieler_rollen (
        rollen (
          id,
          name,
          farbe
          )
        )
      `)
        .eq('team_id', aktuellesTeam.id)
        .order('Name', { ascending: true });

      if (!error && data) {
        setSpielerDaten(data);
      }
    }, [aktuellesTeam]);


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


const neuopen= () => {
  if (aktuellesTeam === null){
    alert("Du bist in keinem Team und kannst somit keine Spieler erstellen")
    return;
  }
  setneuerspieler(!neuerspieler)
}


useEffect(() => {
    ladeSpieler();
  }, [ladeSpieler]);

useEffect(() => {
    ladeRolle();
  }, [ladeRolle]);


const editspieler = (spielerID) => {
  setedispieler(!edispieler)
  setwelcherspieler(spielerID)
}
const nr = () => {
  setneuroll(!neuroll)
}
const er = (rolleID) => {
  seteditrolle(!editroll)
  setwelcherolle(rolleID)
}

const getKontrastFarbe = (hexColor) => {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  const helligkeit = (r * 299 + g * 587 + b * 114) / 1000;

  return helligkeit > 128 ? "black" : "white";
};

const playerCardStyle = {
      width:  isMobile ?'18.8vw':"17vw",
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
const createCardStyle = {
      ...playerCardStyle,
      border: "0.2vw dashed #9c9c9c",
      backgroundColor: "transparent"
    };


    return(
      <div>
        <Liste title="Spieler" isMobile={isMobile}>
        <div style={{ 
          display: "flex", 
          flexWrap: "wrap", 
          gap: "1.95vw", 
          padding: "1.95vw",
          justifyContent: "flex-start" ,
          width:"100%",
          boxSizing:"border-box"
        }}>
          
          {spielerDaten.map((spieler) => (
            <div key={spieler.id} onClick={() => editspieler(spieler.id)} style={playerCardStyle}>
              <img 
                src={spieler.nutzer?.profilbild_url|| fallback} 
                style={{ width:isMobile ?'13vw': '6.5vw',height:isMobile ?'13vw':"6.5vw", borderRadius: '15vw',objectFit:"cover",position:"absolute", left:isMobile ?'15%':"3%",top:isMobile ?'10%':"10%", border:"0.3vw solid #8b8b8b" }} 
                alt="Profil"
              />
              <h3 style={{position:"absolute", fontSize:isMobile ?'2.5vw':"1.5vw", top:isMobile ?'45%':"10%", left:isMobile ?'5%':"40%", display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical", overflow:"hidden", textOverflow:"ellipsis", width:isMobile ?'90%':"50%"}}>{spieler.Name}</h3>
              <div style={{
                position: "absolute",
                bottom: "8%",            
                left: isMobile ? "5%" : "40%",
                width: isMobile ? "90%" : "55%",
                maxHeight: isMobile ? "12vw" : "3vw", 
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",        
                gap: "4px",
                overflow: "hidden",     
                pointerEvents: "none"    
              }}>
                {spieler.spieler_rollen?.map((sr) => (
                  <div 
                    key={sr.rollen.id}
                    style={{
                      backgroundColor: sr.rollen.farbe,
                      color: getKontrastFarbe(sr.rollen.farbe),
                      fontSize: isMobile ? "1.5vw" : "0.7vw",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      whiteSpace: "nowrap",
                      border:"0.1vw solid white"
                    }}
                  >
                    {sr.rollen.name}
                  </div>
                ))}
              </div>
              {spieler.Nummer !== null && spieler.Nummer !== "" && (
              <div
                style={{ width: isMobile ?'5vw':'2.5vw',height:isMobile ?'3vw':"1.5vw", borderRadius: isMobile ?'10vw':'5vw',objectFit:"cover",position:"absolute", right:isMobile ?'10%':"7%",top:isMobile ?'2%':"7%", backgroundColor:"#00e5ff",fontSize:isMobile ?'1.5vw':"1vw", color:"#2e2e2e", display:"flex",justifyContent:"center", alignItems:"center" }}>
                  <h3>{spieler.Nummer}</h3>
              </div>
              )}
              
              
            </div>
            
          ))}
          {userRechte?.kannSpielerErstellen && (
          <div onClick={() => neuopen()} style={createCardStyle}>
              <p style={{ fontSize: isMobile ?'3.3vw':"1.5vw", color: "#9c9c9c", fontFamily:"sans-serif", textAlign:"center" }}>Neuen Spieler erstellen</p>

            </div>
          )}
        </div>
        

      </Liste>
        <Liste title="  " isMobile={isMobile}>
          <div 
          
          style={{ 
          display: "flex", 
          flexWrap: "wrap", 
          paddingTop:"1.5vw",
          justifyContent: "flex-start" ,
          width:"100%",
          boxSizing:"border-box"
        }}>
          {userRechte?.kannRollenVerwalten && (
          <button onClick={() => nr()} style={{width:  "100%",height: isMobile ?'8vw':"5vw",position:"relative",display: "flex",flexDirection: "row",alignItems: "center",cursor: "pointer",backgroundColor: "#00e5ff",borderRadius: isMobile ? "2vw" : "2vw",border: "0.2vw solid #00e5ff",fontSize: isMobile ?'2.5vw':"1.5vw", fontFamily:"sans-serif", marginBottom:"1vw"}}>Neue Rolle erstellen</button>
          )}
          {rollenDaten.map((rollen) => (
            <div onClick={() =>userRechte?.kannRollenVerwalten ? er(rollen.id) : (console.log("fehlende Rechte"))} style={{width:  "100%",height: isMobile ?'8vw':"5vw",position:"relative",flexDirection: "row",borderRadius:"1vw",cursor: "pointer",border: "0.1vw solid white",fontSize: isMobile ?'2.5vw':"1.5vw", fontFamily:"sans-serif", backgroundColor:rollen.farbe, textAlign: "center", justifyContent:"center", display:"flex", alignItems:"center",color:getKontrastFarbe(rollen.farbe)}}>{rollen.main ? "*" : ""}{rollen.name}{rollen.main ? "*" : ""}

            </div>
          ))}
          </div>
        </Liste>
      {neuerspieler && (
                     
                      <NeuerSpielers schliessen={() => neuladen()} 
                      isMobile={isMobile}
                      aktuellesTeam={aktuellesTeam}
                      />
                  )}
      {edispieler && (
                     
                      <Editplayers schliessen={() => neuladen()} 
                      isMobile={isMobile}
                      aktuellesTeam={aktuellesTeam}
                      aktuellerspieler={welcherspieler}
                      userRechte={userRechte}
                      />
                  )}
      {neuroll && (
                     
                      <NeueRolles schliessen={() => neuladen()} 
                      isMobile={isMobile}
                      aktuellesTeam={aktuellesTeam}
                      aktuellerspieler={welcherspieler}
                      />
                  )}
      {editroll && (
                     
                      <EditRolles schliessen={() => neuladen()} 
                      isMobile={isMobile}
                      aktuellesTeam={aktuellesTeam}
                      aktuellerolle={welcherolle}
                      />
                  )}
      </div>
    )
}