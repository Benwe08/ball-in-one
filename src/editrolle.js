import { IoMdClose } from "react-icons/io";
import {useEffect, useState, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import { MdOutlineCheckBox, MdOutlineCheckBoxOutlineBlank } from "react-icons/md";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function EditRolles({schliessen, isMobile, aktuellesTeam, aktuellerolle}) {

  const [rolename, setrolename] = useState("");
  const [oldrolename, setoldrolename] = useState("");
  const [rolfarb, setrolfarb] = useState("");
  const [taTab, setTaTab] = useState(false);
  const [rollb, setrollb] = useState(false);
  const [spieErb, setSpieErb] = useState(false);
  const [spidelb, setSpidel] = useState(false);
  const [main, setmain] = useState(false)


const handleSpeichern = async () => {
    if(rolename === ""){
        alert("Bitte gib einen Namen an");
        return
    }
    const {error} = await supabase
        .from('rollen')
        .update([{
          team_id: aktuellesTeam.id,
          name: rolename,
          farbe: rolfarb,
          TaTa: taTab,
          SpieEr: spieErb,
          Spidel: spidelb,
          Roll: rollb,
        }])
        .eq("id", aktuellerolle)

    if (error) {
        console.error("Fehler beim Speichern:", error.message);
        alert("Fehler: " + error.message);
        return; // Funktion abbrechen, damit das Fenster NICHT schließt
    }
    
    schliessen()
}
const delet1 = async () => {

    const {error} = await supabase
        .from('spieler_rollen')
        .delete()
        .eq('rollen_id', aktuellerolle)     

    if (error) {
        console.error("Fehler beim Speichern:", error.message);
        alert("Fehler: " + error.message);
        return;
    }


    
    delet2()
}

const delet2 = async () => {

    const {error} = await supabase
        .from('rollen')
        .delete()
        .eq('id', aktuellerolle)     

    if (error) {
        console.error("Fehler beim Speichern:", error.message);
        alert("Fehler: " + error.message);
        return;
    }


    
    schliessen()
}


const handleDelete = () => {

    delet1()
}


const ladeRolle = useCallback(async () => {
      if (!aktuellerolle) return;

      const { data, error } = await supabase
      .from('rollen')
      .select(`*`)

        .eq('id', aktuellerolle)
        .single();

      if (!error && data) {
        setoldrolename(data.name)
        setrolename(data.name)
        setrolfarb(data.farbe)
        setTaTab(data.TaTa)
        setSpieErb(data.SpieEr)
        setSpidel(data.Spidel)
        setrollb(data.Roll)
        setmain(data.main)
      }
    }, [aktuellerolle]);


useEffect(() => {
    ladeRolle();
  }, [ladeRolle]);

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
                style={{ width: isMobile ?'80vw':'80vw', height:  isMobile ?'90vw':'40vw', marginBottom: '20px', opacity: "1", zIndex:"1001", backgroundColor:"#171717", borderRadius:"1vw",position:"relative", border:"0.2vw solid #2e2e2e" }} 
                      >
                        <h3 style={{textAlign:"center", fontFamily:"sans-serif", color:"white", fontSize:isMobile ?'3vw':"2vw"}}>{oldrolename} bearbeiten</h3>
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
                    placeholder="Rollen Name" 
                    value={rolename}
                    onChange={(e) => setrolename(e.target.value)}
                    style={{right:isMobile ?'45vw': "4vw",top:isMobile ?'20%': '20%', position: "absolute", cursor:"text", width: isMobile ?'30vw':"20vw", height:isMobile ?'9vw':"3vw", backgroundColor:"#ffffff", color:"black", border: isMobile ?'0.6vw solid #9c9c9c':"2px solid #9c9c9c", borderRadius:isMobile ?'20vw':"5vw", fontSize:isMobile ?'4vw':"2vw", textAlign: "center", justifyContent:"center", display:"flex", alignItems:"center"}}
                    />
                
                <input 
                    type="color" 
                    value={rolfarb} 
                    onChange={(e) => setrolfarb(e.target.value)} 
                    style={{
                    border: 'none',
                    width: isMobile ?'40vw':'15vw',
                    height:isMobile ?'40vw': '15vw',
                    
                    cursor: 'pointer',
                    backgroundColor: 'transparent',   
                    position: "absolute",
                    right:isMobile ?'4vw': "6vw",
                    top:isMobile ?'12%': '55%',
                    }}
                />
                <button onClick={handleSpeichern} style={{ width:isMobile ?'30vw':"20vw",height:isMobile ?'9vw':"4vw", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: isMobile ?'3vw':"1vw", cursor: "pointer", fontSize: isMobile ?'4vw':"1.5vw", top:isMobile ?'32%':"30%", right:isMobile ?'45vw':"4vw", position:"absolute" }}>
                Rolle Speichern 
                </button>
                {!main && (
                <button onClick={handleDelete} style={{ width:isMobile ?'30vw':"20vw",height:isMobile ?'9vw':"4vw", backgroundColor: "red", color: "white", border: "none", borderRadius: isMobile ?'3vw':"1vw", cursor: "pointer", fontSize: isMobile ?'4vw':"1.5vw", top:isMobile ?'44%':"42%", right:isMobile ?'45vw':"4vw", position:"absolute" }}>
                Rolle Löschen 
                </button>
                )}
                <button onClick={() => main === 1 ? console.log("nichts") :setrollb(!rollb)} style={{ width:isMobile ?'100%':"65%",height:isMobile ?'9vw':"4vw", backgroundColor: "#171717", color: "white", border: "0.1vw solid #2e2e2e",cursor: "pointer", fontSize: isMobile ?'4vw':"2vw", top:isMobile ?'60%':"20%", left:"0vw", position:"absolute", textAlign: "center", justifyContent:"center", display:"flex", alignItems:"center" }}>
                Rollen erstellen & verwalten {!rollb ? <MdOutlineCheckBoxOutlineBlank /> : <MdOutlineCheckBox/>}
                </button>
                <button onClick={() =>main === 1 ? console.log("nichts") : setTaTab(!taTab)} style={{ width:isMobile ?'100%':"65%",height:isMobile ?'9vw':"4vw", backgroundColor: "#171717", color: "white", border: "0.1vw solid #2e2e2e",cursor: "pointer", fontSize: isMobile ?'4vw':"2vw", top:isMobile ?'70%':"30%", left:"0vw", position:"absolute", textAlign: "center", justifyContent:"center", display:"flex", alignItems:"center" }}>
                Taktiken erstellen {!taTab ? <MdOutlineCheckBoxOutlineBlank /> : <MdOutlineCheckBox/>}
                </button>
                <button onClick={() =>main === 1? console.log("nichts") : setSpieErb(!spieErb)} style={{ width:isMobile ?'100%':"65%",height:isMobile ?'9vw':"4vw", backgroundColor: "#171717", color: "white", border: "0.1vw solid #2e2e2e",cursor: "pointer", fontSize: isMobile ?'4vw':"2vw", top:isMobile ?'80%':"40%", left:"0vw", position:"absolute", textAlign: "center", justifyContent:"center", display:"flex", alignItems:"center" }}>
                Spieler erstellen {!spieErb ? <MdOutlineCheckBoxOutlineBlank /> : <MdOutlineCheckBox/>}
                </button>
                <button onClick={() => main === 1? console.log("nichts") :setSpidel(!spidelb)} style={{ width:isMobile ?'100%':"65%",height:isMobile ?'9vw':"4vw", backgroundColor: "#171717", color: "white", border: "0.1vw solid #2e2e2e",cursor: "pointer", fontSize: isMobile ?'4vw':"2vw", top:isMobile ?'90%':"50%", left:"0vw", position:"absolute", textAlign: "center", justifyContent:"center", display:"flex", alignItems:"center" }}>
                Spieler bearbeiten {!spidelb ? <MdOutlineCheckBoxOutlineBlank /> : <MdOutlineCheckBox/>}
                </button>
            </div>
            </div>
    )
}