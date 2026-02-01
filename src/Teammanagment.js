import {  useEffect, useState, useCallback } from "react";
import { createClient } from '@supabase/supabase-js';
import fallback from "./assets/fallback-bild.png.png";
import NeuerSpielers from "./Neuerspieler";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);



export default function Teammanagments({isMobile, aktuellesTeam}) {
  const [neuerspieler, setneuerspieler] = useState(false);
  const [spielerDaten, setSpielerDaten] = useState([]);


const neuladen = () => {
  setneuerspieler(false)
  ladeSpieler()

}

const Liste = ({ title, children, isMobile }) => {
  let posl, post, w, h, bc,zi, bo, br
  if (title === "Spieler"){
    posl = isMobile ?'0vw' :"20vw";
    post = isMobile ?'71.5vw' :"5vw";
    w = isMobile ?'48vw' :"78vw";
    h = isMobile ?'10vw' :'40vw';
    bc = "#212121";
    bo = isMobile ?'0.3vw solid #2e2e2e' :'0.1vw solid #2e2e2e';
    br = isMobile ? "10vw": "4vw"
    zi= 0
  }
  else if (title === "  "){
    posl = isMobile ?'0vw' :"3vw";
    post = isMobile ?'71.5vw' :"5vw";
    w = isMobile ?'48vw' :"15vw";
    h = isMobile ?'10vw' :'40vw';
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
      fontSize: isMobile ?'3vw' :"4vw",
      overflowY: "hidden",
      zIndex:zi,
      textAlign:"center"
    }}>
         <h3 style={{margin: "0.5vw 0", }}>{title}</h3>
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
        nutzer (profilbild_url)
      `)
        .eq('team_id', aktuellesTeam.id);

      if (!error && data) {
        setSpielerDaten(data);
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
const createCardStyle = {
      ...playerCardStyle,
      border: "2px dashed #9c9c9c",
      backgroundColor: "transparent"
    };


    return(
      <div>
        <Liste title="Spieler" isMobile={isMobile}>
        <div style={{ 
          display: "flex", 
          flexWrap: "wrap", 
          gap: "1.97vw", 
          padding: "1.97vw",
          justifyContent: "flex-start" ,
          width:"100%",
          boxSizing:"border-box"
        }}>
          
          {spielerDaten.map((spieler) => (
            <div key={spieler.id} style={playerCardStyle}>
              <img 
                src={spieler.nutzer?.profilbild_url|| fallback} 
                style={{ width: '6.5vw',height:"6.5vw", borderRadius: '10vw',objectFit:"cover",position:"absolute", left:"3%", border:"0.3vw solid #8b8b8b" }} 
                alt="Profil"
              />
              <h3 style={{position:"absolute", fontSize:"1.5vw", top:"10%", left:"40%", display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical", overflow:"hidden", textOverflow:"ellipsis", width:"50%"}}>{spieler.Name}</h3>
              <div
                style={{ width: '2.5vw',height:"1.5vw", borderRadius: '5vw',objectFit:"cover",position:"absolute", right:"7%",top:"7%", backgroundColor:"#00e5ff",fontSize:"1vw", color:"#2e2e2e", display:"flex",justifyContent:"center", alignItems:"center" }}>
                  <h3>{spieler.Nummer}</h3>
              </div>
              
              
            </div>
            
          ))}
          <div onClick={() => neuopen()} style={createCardStyle}>
              <p style={{ fontSize: isMobile ?'3.3vw':"1.5vw", color: "#9c9c9c", fontFamily:"sans-serif", textAlign:"center" }}>Neuen Spieler erstellen</p>
            </div>
          
        </div>

      </Liste>
        <Liste title="  " isMobile={isMobile}/>
      {neuerspieler && (
                     
                      <NeuerSpielers schliessen={() => neuladen()} 
                      isMobile={isMobile}
                      aktuellesTeam={aktuellesTeam}
                      />
                  )}
      </div>
    )
}