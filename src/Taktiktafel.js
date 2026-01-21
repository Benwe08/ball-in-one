import { useState, useRef, useEffect } from "react";
import Draggable from "react-draggable";
import React from "react";
import HandballF from "./assets/HandballFeld.png";
import FußballF from "./assets/FußballFeld.png"
import TennisF from "./assets/TennisFeld.png"
import VolleyballF from "./assets/VolleyballFeld.png"
import HandballB from "./assets/HandballBall.png";
import FußballB from "./assets/FußballBall.png"
import TennisB from "./assets/TennisBall.png"
import VolleyballB from "./assets/VolleyballBall.png"
import { createClient } from '@supabase/supabase-js';
import { FiChevronRight,FiPlay,FiChevronLeft,FiTrash2,FiSave, FiRefreshCw} from "react-icons/fi";
import { FaQuestion } from "react-icons/fa6";
import { TbFileExport, TbFileImport } from "react-icons/tb";


const supabase = createClient('https://fdwsacwvndkerbjbqcmi.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkd3NhY3d2bmRrZXJiamJxY21pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxNDQ2NjksImV4cCI6MjA4MzcyMDY2OX0.01CcKVq-bSO7M97DoT-o9PJ-jgVJ1RqTtarQRbktyiY');


const Liste = ({ title, children, isMobile }) => {
  let posl, post, w, h, bc,zi
  if (title === "Widgets:"){
    posl = isMobile ?'-1.4vw' :"-0.5vw";
    post = isMobile ?'72vw' :"5vw";
    w = isMobile ?'96.4vw' :"15.5vw";
    h = isMobile ?'25vw' :'40vw';
    bc = "rgb(23, 23, 23)";
    zi= 0
  }
  else if (title === "Spielzüge:"){
    posl = isMobile ?'-1.4vw' :"77vw"
    post = isMobile ?'98vw' :"5vw";
    w = isMobile ?'96.4vw' :"20.65vw";
    h = isMobile ?'70vw' :'40vw';
    bc = "rgb(23, 23, 23)";
    zi= 0
  }
  else{
    posl = isMobile ?'-1.4vw' :"-0.5vw"
    post = isMobile ?'11vw' :"5vw";
    w = isMobile ?'96.4vw' :"98vw";
    h = isMobile ?'70vw' :'40vw';
    bc = "rgb(23, 23, 23)";
    zi= -1
  }
  
  return (
    <div style={{
      width: w,   
      height: h,
      border: isMobile ?'0.3vw solid #2e2e2e' :'0.1vw solid #2e2e2e',
      backgroundColor:bc,
      color:"white",
      padding: '0.5vw',
      borderRadius: '0.2vw',
      position: 'absolute',
      left: posl,
      top: post,
      fontFamily: "sans-serif",
      fontWeight: "bold",
      display: "flex",
      flexDirection:"column",
      fontSize: isMobile ?'3vw' :"0.9vw",
      overflowY: "hidden",
      zIndex:zi
    }}>
      <h3 style={{margin: "0.5vw 0", borderBottom: isMobile ? "6vw solid #171717" : "1.5vw solid #171717"}}>{title}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', paddingBottom:"1vw",paddingTop:"1vw", overflowY:"auto", flexGrow:1 }}>
        {children}
        </div>
    </div>
  );
};

const Gespeichert = ({title, onClick, isMobile, tutInhalt,tutStep, istSichtbar}) => {
  return (
    <div
      onClick={() => onClick(title)} 
      style={{
      width: '100%',   
      height: isMobile? '15vw' : "8vw",  
      border: (tutStep > 0 && tutInhalt[tutStep - 1].i === "Spielzug" && istSichtbar) ? "0.3vw solid #00e5ff" : "0.25vw solid #00e5ff",
      padding: '0.5vw',
      borderRadius: '2vw',
      boxShadow: '2px 2px 5px rgba(0,0,0,0.1)',
      position: 'relative',
      backgroundColor: "#44c6d5",
      cursor: "pointer",
      fontFamily: "sans-serif",
      fontWeight: "bold",
      marginBottom: "0.5vw",
      boxSizing: "border-box",
      display:"flex", 
      alignItems:"center", 
      justifyContent:"center",
      color:(tutStep > 0 && tutInhalt[tutStep - 1].i === "Spielzug" && istSichtbar) ? "white" : "#212121"
    }}>
      
      <h3>{title}</h3>
    </div>
  );
}

const Szenewid = ({ title,isMobile }) => {
  return (
    <div style={{
      left: isMobile ?'39.8vw' :'5.5vw',
      top: isMobile ?'78vw' :'35.5vw',
      width: isMobile ?'20vw' :'5.5vw',   
      height: isMobile ?'8vw' :'3vw',
      position: 'absolute',  
      border: 'none',
      fontSize: isMobile ?'8vw' :'2.5vw',
      textAlign: 'center',
      fontFamily: "sans-serif",
      fontWeight: "bold",
      display: "inline-block",
      color: "white"
    }}>
      <h3>{title}</h3>
    </div>
  );
};

/* --------------------------------------------------
   A SINGLE WIDGET (original or clone)
   -------------------------------------------------- */
const Spieler = ({ id, orititle, onClone, onStopCommand, kennung,  x, y, ghost, isAnimating,isMoving, startPos,canEdit,aktuellerBall, isMobile, tutInhalt, tutStep, istSichtbar}) => {
  let we, h, b, br, bc, co, ta, fs, c, bi, bs, zi;
  const [isEditing, setIsEditing] = useState(false);
  const lastTap = useRef(0);
  const nodeRef = useRef(null);
  const ref = useRef(null);
  const [title, setTitle] = useState(orititle);
  const currentX = isAnimating && startPos ? startPos.x: x;
  const currentY = isAnimating && startPos ? startPos.y: y;

  const handleBlur = () => {
    setIsEditing(false); // WICHTIG: Reaktiviert das Ziehen (Draggable)
    
    const newTitle = ref.current.innerText; 

    setTitle(newTitle);
    
    onStopCommand(id, { x, y, title: newTitle }, true);
  };


    const handleDragStart = (e, data) => {
    if (ghost) return;

    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (now - lastTap.current < DOUBLE_TAP_DELAY) {
      lastTap.current = 0; 

    
        setIsEditing(true);
        return false;
  
    }
    
    lastTap.current = now;

    onClone(id, data, kennung);
    return true; // Erlaubt das Ziehen
  };


  if (kennung === 1){
    we = isMobile ?'8vw' :'4vw';
    h = isMobile ?'8vw' :'4vw';  
    b = (tutStep > 0 && tutInhalt[tutStep - 1].i === "Spieler" && istSichtbar) ? "0.2vw solid #00e5ff" : '0.2vw solid #ffff';
    br = '50%';
    bc = 'blue';
    bi = 'none'
    co = (tutStep > 0 && tutInhalt[tutStep - 1].i === "Spieler" && istSichtbar) ? "#d3d3d3" :  'white';
    ta = 'center';
    fs = isMobile ?'2.5vw' :'1vw';
    c = 'grab';
    bs = 'cover'
    zi = 1
  }
  
  else if (kennung === 2){
    we = isMobile ?'8vw' :'4vw';
    h = isMobile ?'8vw' :'4vw';  
    b = (tutStep > 0 && tutInhalt[tutStep - 1].i === "Spieler" && istSichtbar) ? "0.2vw solid #00e5ff" : '0.2vw solid #ffff';
    br = '50%';
    bc = 'red';
    bi = 'none'
    co = (tutStep > 0 && tutInhalt[tutStep - 1].i === "Spieler" && istSichtbar) ? "#d3d3d3" :  'white';
    ta = 'center';
    fs = isMobile ?'2.5vw' :'1vw';
    c = 'grab';
    bs = 'cover'
    zi = 1
  }

  else if (kennung === 3){
    we = isMobile ?'6vw' :'3vw';
    h = isMobile ?'6vw' :'3vw';  
    b = (tutStep > 0 && tutInhalt[tutStep - 1].i === "Spieler" && istSichtbar) ? "0.2vw solid #00e5ff" : '0.2vw solid #ffffff';
    br = '50%';
    bc = 'none'
    bi = `url(${aktuellerBall})`;
    co = (tutStep > 0 && tutInhalt[tutStep - 1].i === "Spieler" && istSichtbar) ? "#00e5ff" :  'white';
    ta = 'center';
    fs = '0px';
    c = 'grab';
    bs = isMobile ?'10vw 10vw' :'5.2vw 5.2vw'
    zi = 2
  }

  
  return (
    <Draggable
      nodeRef={nodeRef}
      position={{ x: currentX, y: currentY }}
      disabled={ghost || isAnimating || isMoving || isEditing}
      onStart={handleDragStart} 
      onStop={ghost ? () => {} : (e, data) => onStopCommand(id, data)}
    >
      <div
        ref={nodeRef}
        style={{
          width: we,    
          height: h,   
          border: b,
          borderRadius: br,
          backgroundImage: bi,
          position: 'absolute', 
          backgroundPosition: 'center',
          backgroundSize: bs,
          backgroundColor: bc,
          color: co,
          textAlign: ta,
          fontSize: fs,
          cursor: ghost ? "default" : c,
          opacity: ghost ? 0.6 : 1,
          pointerEvents: ghost ? "none" : "auto",
          zIndex: ghost ? 0 : zi,
          transition: isMoving ? "transform 1s ease-in-out" : "none",
          fontFamily: "sans-serif",
          fontWeight: "bold",
          display:"flex", alignItems:"center", justifyContent:"center",
          
        }}
      >
        <h3
          ref={ref}
          contentEditable={isEditing}
          onBlur={handleBlur}
          suppressContentEditableWarning
          style={{
            cursor: canEdit ? "text" : (ghost ? "default" : "grab"),
            outline: "none",
            userSelect: canEdit ? "text" : "none",
          }}
        >
          {title}
        </h3>
      </div>
    </Draggable>
  );
};



/* --------------------------------------------------
   MAIN COMPONENT
   -------------------------------------------------- */


const Taktiktafel = ({ isMobile, aktuellesTeam }) => {
  const [szene, setSzene] = useState(0);
  const [sportart, setSportart] = useState("H");
  const [isAnimating, setIsAnimating] = useState(false);
  const [tutStep, setTutStep] = useState(0);
  const tutInhalt = [
    { t: "Willkommen!", d: "Die zu benutzenden Knöpfe etc. werden im Tutorial mit blinkendem türkisem Rand und Schrift markiert (Siehe Tutorial Knopf)", i:"Tutorial"},
    { t: "Sportart", d: "Wählen sie zuerst ihre Sportart aus.", i:"Sportart" },
    { t: "Spieler", d: "Ziehen sie die Icons mit dem Namen TW und den Ball auf das Spielfeld.", i:"Spieler"  },
    { t: "Umbenennen", d: "Klicken sie zweimal auf die Icons um den Namen ändern zu können.", i:"Spieler"  },
    { t: "Löschen", d: "Ziehen sie ein Icon aus dem Spielfeld um es zu löschen.", i:"Spieler"  },
    { t: "Szenen", d: "Klicken sie auf den Pfeil nach rechts um in die nächste Szene zu kommen.", i:"Knopfvor"  },
    { t: "Bewegung", d: "Bewegen sie ihre Icons auf dem Spielfeld.", i:"Spieler"  },
    { t: "Rückgang", d: "Klicken sie auf den Pfeil nach links um in die vorherige Szene zu kommen.", i:"Knopfzur"  },
    { t: "Animation", d: "Drücken sie auf den Play Button um die Animation abzuspielen." , i:"Play" },
    { t: "Speichern", d: "Klicken sie auf den Speicher Knopf um den aktuellen Spielzug zu speichern." , i:"Save" },
    { t: "Laden", d: "Klicken sie auf den Spielzug um ihn erneut zu laden." , i:"Spielzug" },
    { t: "Löschen", d: "Klicken sie auf den Mülleimer und dann auf den zu löschenden Spielzug zum löschen. Zum abbbrechen wieder auf den Mülleimer klicken." , i:"Löschen" },
    { t: "Exportieren", d: "Klicken sie auf Export und dann auf den zu exportierenden Spielzug zum exportieren. Zum abbbrechen wieder auf Export klicken." , i:"Export" },
    { t: "Importieren", d: "Klicken sie auf Import um einen heruntergeladenen Spielzug zu importieren." , i:"Import" },
    { t: "Aufräumen", d: "Klicken sie auf den Neustart Knopf um das Spielfeld zu leeren." , i:"Clear" },
    { t: "Fertig", d: "Jetzt sind sie bereit für Ball-in-one." , i:"" },
  ];

  const [isMoving, setIsMoving] = useState(false);
  const [gespeicherteZuege, setGespeicherteZuege] = useState([]);
  const [isExporting, setIsExporting] = useState(false);
  const [isdeleting, setIsdeleting] = useState(false);
  const [istSichtbar, setIstSichtbar] = useState(true);
  const previousScene = szene > 0 ? szene - 1 : null;
  const bilderFMap = {
  H: HandballF,
  F: FußballF,
  V: VolleyballF,
  T: TennisF
  };
    const bilderBMap = {
  H: HandballB,
  F: FußballB,
  V: VolleyballB,
  T: TennisB
  };
  const aktuellerBall = bilderBMap[sportart]
  const aktuellesFeld = bilderFMap[sportart]
  const [szenen, setSzenen] = useState({
    0: [
      { id: 1,familie: Math.random().toString(36).substr(2, 9), kennung: 1, x: isMobile ? 1 :2,  y: isMobile ? 78 : 10 ,title: "TW"},
      { id: 2,familie: Math.random().toString(36).substr(2, 9), kennung: 2, x: isMobile ? 12 : 10,  y:isMobile ? 78: 10,title: "TW"},
      { id: 3,familie: Math.random().toString(36).substr(2, 9), kennung: 3, x: isMobile ? 7.5 : 6.5,  y:isMobile ? 88: 15,title: ""}
    ]
  });
  const [, setWindowSize] = useState({ w: window.innerWidth, h: window.innerWidth });

  React.useEffect(() => {
    const handleResize = () => {
      setWindowSize({ w: window.innerWidth, h: window.innerWidth });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const intervall = setInterval(() => {
      setIstSichtbar((prev) => !prev);
    }, 500); // 500ms = hartes Blinken

    return () => clearInterval(intervall); // Wichtig: Timer stoppen, wenn Komponente schließt
  }, []);

  const clear = () => {
  const resetId = Date.now();
  setSzene(0);

  const basisWidgets = [
      { id: `b1-${resetId}`, familie: Math.random().toString(36).substr(2, 9), kennung: 1, x: isMobile ? 1 :2,  y:isMobile ? 78 : 10 , title: "TW" },
      { id: `b2-${resetId}`, familie: Math.random().toString(36).substr(2, 9), kennung: 2, x: isMobile ? 12 :10,  y:isMobile ? 78 : 10, title: "TW" },
      { id: `b3-${resetId}`, familie: Math.random().toString(36).substr(2, 9), kennung: 3, x: isMobile ? 7.5 :6.5,  y:isMobile ? 88 : 15, title: "" }
  ];

  setSzenen({
    0: basisWidgets
  });

  setIsAnimating(false);
  setIsMoving(false);
  isAutoPlaying.current = false;
  setPlaying(false);
};

const tutorialp = () => {
  if (tutStep < tutInhalt.length) {
    setTutStep(prev => prev + 1); // Erhöht den Schritt (1, 2, 3...)
  } else {
    setTutStep(0);// Schließt das Tutorial nach dem letzten Schritt
  }
};

const tutorialm = () => {
  if (tutStep < tutInhalt.length) {
    setTutStep(prev => prev - 1); // Erhöht den Schritt (1, 2, 3...)
  } else {
    setTutStep(0);// Schließt das Tutorial nach dem letzten Schritt
  }
};

  useEffect(() => {
    setSzenen(prevSzenen => {
      const updatedSzenen = { ...prevSzenen };
      const desk = { xStart: 16.1, width: 60.9, yStart: 6 };
      const mob = { xStart: 0, width: 95, yStart: 12 };

      Object.keys(updatedSzenen).forEach(sceneKey => {
        updatedSzenen[sceneKey] = updatedSzenen[sceneKey].map(widget => {
          // BASIS-WIDGETS (ID 1, 2, 3) 
          // Diese behalten feste Positionen am Rand/Menü
          if ((widget.x === 2 || widget.x === 1) && (widget.y === 78 || widget.y === 10)) return { ...widget, x: isMobile ? 1 : 2, y: isMobile ? 78 : 10 };
          if ((widget.x === 10 ||widget.x === 12) && (widget.y === 78 || widget.y ===   10)) return { ...widget, x: isMobile ? 12 : 10, y: isMobile ? 78 : 10 };
          if ((widget.x === 6.5 || widget.x === 7.5) && (widget.y === 88 || widget.y === 15)) return { ...widget, x: isMobile ? 7.5 : 6.5, y: isMobile ? 88 : 15 };



          // GEKLONTE SPIELE  (ID > 3)
          // Hier ist die Umrechnung für das Spielfeld
          if (isMobile) {
            const relX = (widget.x - desk.xStart) / desk.width;
            const relY = (widget.y - desk.yStart);
            const scaleFactor = mob.width / desk.width;
            
            // Verhindere, dass Werte außerhalb des Feldes zu 0/NaN werden
            const newX = mob.xStart + (relX * mob.width);
            const newY = mob.yStart + (relY * scaleFactor);
            
            return { ...widget, x: isNaN(newX) ? widget.x : newX, y: isNaN(newY) ? widget.y : newY };
          } else {
            const relX = (widget.x - mob.xStart) / mob.width;
            const relY = (widget.y - mob.yStart);
            const scaleFactor = desk.width / mob.width;
            
            const newX = desk.xStart + (relX * desk.width);
            const newY = desk.yStart + (relY * scaleFactor);
            
            return { ...widget, x: isNaN(newX) ? widget.x : newX, y: isNaN(newY) ? widget.y : newY };
          }
        });
      });
      return updatedSzenen;
    });
  }, [isMobile]);

  const cloneWidget = (id, data, kennung) => {


    const xRelativ = (data.x / window.innerWidth) * 100;
    const yRelativ = (data.y / window.innerWidth) * 100;

        if (isMobile? (yRelativ <= 60) : (xRelativ >= 15)) return;

    setSzenen(prev => {
      const original = prev[szene].find(w => w.id === id);


        let startX = xRelativ;
        let startY = yRelativ;

        if (kennung === 1) { startX = isMobile ? 1 : 2; startY = isMobile ? 78 : 10; }
        if (kennung === 2) { startX = isMobile ? 12 : 10; startY = isMobile ? 78 : 10; }
        if (kennung === 3) { startX = isMobile ? 7.5 : 6.5; startY = isMobile ? 88 : 15; }


      const newWidget = {
        id: Date.now() + Math.random(),
        familie: Math.random().toString(36).substr(2, 9),  
        title: original?.title ?? "TW",
        x: startX,
        y: startY,
        kennung
      };

      const updated = {
        ...prev,
        [szene]: [...prev[szene], newWidget]
      };

      Object.keys(prev)
        .map(Number)
        .filter(s => s > szene)
        .forEach(s => {
          updated[s] = [
            ...updated[s],
            {
              ...newWidget,
              id: Date.now() + Math.random()
            }
          ];
        });

      return updated;
    });
  };

  function spielzugloeschen() {
    if (isdeleting) {
      setIsdeleting(false)
    }
    else{
      setIsdeleting(true)
    }
  }

  function exporting() {
    if (gespeicherteZuege.length === 0) {
      alert("Keine Spielzüge vorhanden!");
      return;
    }

    setIsExporting(!isExporting);
    setIsdeleting(false);
  }

  function importing() {

    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";

    input.onchange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const importierteZuege = JSON.parse(event.target.result);
          
          setGespeicherteZuege(prev => [...prev, ...importierteZuege]);
          alert("Spielzüge erfolgreich importiert!");
        } catch (err) {
          alert("Fehler beim Lesen der Datei. Ist es ein gültiges JSON?");
        }
      };
      reader.readAsText(file);
    };

    input.click();
  }

  useEffect(() => {
    const ladeSpielzuege = async () => {
      if (!aktuellesTeam) return;

      const { data, error } = await supabase
        .from('spielzuege')
        .select('*')
        .eq('team_id', aktuellesTeam.id);

      if (!error && data) {
        setGespeicherteZuege(data);
      }
    };

    ladeSpielzuege();
  }, [aktuellesTeam]);

async function spielzugspeichern() {
  console.log("Starte Speichervorgang...");
  console.log("Aktuelles Team:", aktuellesTeam);
  console.log("Szenen Daten:", szenen);

  const name = prompt("Name des Spielzugs:");
  if (!name) return;

  if (!aktuellesTeam?.id) {
    console.error("STOPP: Keine Team-ID vorhanden!");
    alert("Fehler: Du musst ein Team ausgewählt haben.");
    return;
  }

  try {
    const { data, error } = await supabase
      .from('spielzuege')
      .insert([{ 
        team_id: Number(aktuellesTeam.id), // Sicherstellen, dass es eine Zahl ist
        name: name, 
        daten: szenen,
        is_mobile_data: isMobile
      }])
      .select();

    if (error) {
      console.error("Supabase Error Details:", error);
      alert(`Fehler: ${error.message} (${error.code})`);
    } else {
      console.log("Erfolgreich gespeichert:", data);
      setGespeicherteZuege(prev => [...prev, data[0]]);
      alert("Gespeichert!");
    }
  } catch (err) {
    console.error("Unerwarteter Fehler:", err);
  }
}

  
  function angeklicktvor() {
    setSzene(prev => {
      const next = prev + 1;

      setSzenen(s => {

        if (s[next]) return s;

        return {
          ...s,
          [next]: s[prev].map(w => ({
            ...w,
            id: Date.now() + Math.random()
          }))
        };
      });

      return next;
    });
  }



  function angeklicktzur() {
    setSzene(prev => Math.max(0, prev - 1));
  }





const isAutoPlaying = useRef(false);

  const [playing, setPlaying] = useState(false);

  function abspielen() {
    if (isAutoPlaying.current) {
      isAutoPlaying.current = false;
      setPlaying(false);
      return;
    }
    
    isAutoPlaying.current = true;
    setPlaying(true);
    starteSchritt(szene); 
  }

  function starteSchritt(aktuelleIdx) {
    if (!isAutoPlaying.current) return;

    setIsAnimating(true);
    setIsMoving(false);

    setTimeout(() => {
      if (!isAutoPlaying.current) return;

      setIsAnimating(false);
      setIsMoving(true);

      setTimeout(() => {
        if (!isAutoPlaying.current) return;
        
        const naechste = aktuelleIdx + 1;
        if (szenen[naechste]) {
          setIsMoving(false);
          setIsAnimating(true);
          setSzene(naechste);
          

          setTimeout(() => starteSchritt(naechste), 50); 
        } else {
          setIsMoving(false);
          setPlaying(false);
          isAutoPlaying.current = false;
        }
      }, 1000);
    }, 20); 
  }

  const handleStop = (id, data, isTitleChange = false) => {
    const xRelativ = (data.x / window.innerWidth) * 100;
    const yRelativ = (data.y / window.innerWidth) * 100;


    if (!isTitleChange && (isMobile ? (xRelativ < 1 || xRelativ > 90 || yRelativ < 10 || yRelativ > 65 ) : (xRelativ < 15 || xRelativ > 75 || yRelativ < 5 || yRelativ > 41 ))) {
      setSzenen(prev => ({
        ...prev,
        [szene]: prev[szene].filter(w => w.id !== id)
      }));
      return;
    }

    setSzenen(prev => ({
      ...prev,
      [szene]: prev[szene].map(w =>
        w.id === id ? {
          ...w,
          x: xRelativ, 
          y: yRelativ,
          title: data.title ?? w.title
        } : w
      )
    }));
  };


  return (
    <div
      style={{ position: "relative", width: "100%", height: "1000px" }}
    >
      <img src={aktuellesFeld} alt="Externes Bild" style={{left: isMobile ?'0vw' :"16.1vw",top: isMobile ?'12vw' :"6vw", position: "absolute", width: isMobile ?'95vw' :'60.9vw', height: 'auto'}} />
      <Liste title="Widgets:" isMobile={isMobile}/>
      <Liste title="" isMobile={isMobile}/>
      <button onClick={angeklicktvor} style={{padding: 0 ,color:(tutStep > 0 && tutInhalt[tutStep - 1].i === "Knopfvor" && istSichtbar) ? "#00e5ff" :  "#ffff", left:isMobile ?'60vw' : "11vw",top:isMobile ?'86vw' : '37.9vw', position: "absolute",width:isMobile ?'10vw' :"4.5vw",height:isMobile ?'10vw' :"4.5vw", borderRadius:"50%", border:(tutStep > 0 && tutInhalt[tutStep - 1].i === "Knopfvor" && istSichtbar) ? "0.3vw solid #00e5ff" :  "0.15vw solid #2e2e2e", cursor:"pointer", fontSize:isMobile ?'8vw' :"3.5vw", display:"flex", alignItems:"center", justifyContent:"center",backgroundColor:"#212121"}}>
      <FiChevronRight />
      </button>
      <button onClick={angeklicktzur} style={{padding: 0 ,color:(tutStep > 0 && tutInhalt[tutStep - 1].i === "Knopfzur" && istSichtbar) ? "#00e5ff" :   "#ffff",left: isMobile ?'30vw' :"0.8vw",top:isMobile ?'86vw' : '37.9vw', position: "absolute",width:isMobile ?'10vw' :"4.5vw",height:isMobile ?'10vw' :"4.5vw", borderRadius:"50%", border:(tutStep > 0 && tutInhalt[tutStep - 1].i === "Knopfzur" && istSichtbar) ? "0.3vw solid #00e5ff" :  "0.15vw solid #2e2e2e", cursor:"pointer", fontSize:isMobile ?'8vw' :"3.5vw", display:"flex", alignItems:"center", justifyContent:"center",backgroundColor:"#212121"}}>
      <FiChevronLeft />
      </button>
      <Szenewid title={szene} isMobile={isMobile}/>
      <button onClick={abspielen} style={{padding: 0 ,color:(tutStep > 0 && tutInhalt[tutStep - 1].i === "Play" && istSichtbar) ? "#00e5ff" :   "#ffff",left: isMobile ?'42.5vw' :"5vw",top: isMobile ?'72.5vw' :'31vw', position: "absolute", width:isMobile ?'15vw' :"6.5vw", height:isMobile ?'15vw' :"6.5vw",cursor:"pointer", borderRadius:"50%", border:(tutStep > 0 && tutInhalt[tutStep - 1].i === "Play" && istSichtbar) ? "0.5vw solid #00e5ff" : "0.15vw solid #2e2e2e", fontSize:isMobile ?'8vw' :"4vw", display:"flex", alignItems:"center", justifyContent:"center", paddingLeft:"1vw",backgroundColor:"#212121"}}>
      <FiPlay/>
      </button>
      <button onClick={clear} style={{padding: 0 ,color: (tutStep > 0 && tutInhalt[tutStep - 1].i === "Clear" && istSichtbar) ? "#00e5ff" :  "#ffff",left:isMobile ?'73vw' : "11vw",top: isMobile ?'74vw' :'27vw', position: "absolute", width:isMobile ?'10vw' :"4vw",height:isMobile ?'10vw' :"4vw", border: (tutStep > 0 && tutInhalt[tutStep - 1].i === "Clear" && istSichtbar) ? "0.3vw solid #00e5ff" : "0.15vw solid #2e2e2e",cursor:"pointer",display: 'flex',justifyContent: 'center',alignItems: 'center', borderRadius:"50%", fontSize:isMobile ?'6vw' :"2.5vw",backgroundColor:"#212121"}}>
        <FiRefreshCw />
      </button>
      <button onClick={tutorialp} style={{padding: 0 ,left:isMobile ? '13vw' : "5.5vw",top:isMobile ? '0vw' : '0.1vw', position: "absolute", width:isMobile ?'10vw' :"4.2vw",height:isMobile ?'10vw' :"4.2vw", border: (tutStep > 0 && tutInhalt[tutStep - 1].i === "Tutorial" && istSichtbar) ? "0.3vw solid #00e5ff" : "0.15vw solid #2e2e2e",cursor:"pointer",display: 'flex',justifyContent: 'center',alignItems: 'center', borderRadius:"50%", fontSize:isMobile ?'6vw' :"2.5vw",backgroundColor: "#212121",color:(tutStep > 0 && tutInhalt[tutStep - 1].i === "Tutorial" && istSichtbar) ? "#00e5ff" :  "white"}}>
        <FaQuestion />
      </button>
      <Liste title="Spielzüge:" isMobile={isMobile}>
      {gespeicherteZuege.map((zug, index) => (
        <Gespeichert 
          key={zug.id}
          isMobile={isMobile}
          tutInhalt={tutInhalt}
          tutStep={tutStep}
          istSichtbar={istSichtbar}
          title={zug.name}
          savesnumber={index}
          onClick={async() => {
            if (isdeleting) {
              const { error } = await supabase
                .from('spielzuege')
                .delete()
                .eq('id', zug.id);

              if (error) {
                alert("Fehler beim Löschen in der Datenbank");
              } else {
                setGespeicherteZuege(prev => prev.filter(z => z.id !== zug.id));
              }
              setIsdeleting(false)
            } else if (isExporting) {
              const dataStr = JSON.stringify([zug], null, 2); // Exportiert nur diesen einen Zug
              const dataBlob = new Blob([dataStr], { type: "application/json" });
              const url = URL.createObjectURL(dataBlob);
              const link = document.createElement("a");
              link.href = url;
              link.download = `${zug.name}.json`;
              link.click();
              URL.revokeObjectURL(url);
              
              setIsExporting(false); // Modus nach Klick beenden
            } else {
            console.log("Lade Spielzug:", zug.name);
                
                // 1. Wir nehmen die Rohdaten aus der Datenbank
                let geladeneDaten = JSON.parse(JSON.stringify(zug.daten)); 

                // 2. Definition der Spielfeld-Zonen (Deine Werte aus dem CSS/Style)
                const desk = { xStart: 16.1, width: 60.9, yStart: 6, height: 38 }; 
                const mob = { xStart: 0, width: 95, yStart: 12, height: 60 };

                // 3. Transformation NUR wenn der Speicher-Modus vom aktuellen Modus abweicht
                if (zug.is_mobile_data !== isMobile) {

                  const konvertierteSzenen = {};

                  Object.keys(geladeneDaten).forEach(szeneKey => {
                    konvertierteSzenen[szeneKey] = geladeneDaten[szeneKey].map(w => {
                      // Basis-Icons (TW/Ball im Menü) nicht transformieren

                      if ((w.x === 2 || w.x === 1) && (w.y === 78 || w.y === 10)) return { ...w, x: isMobile ? 1 : 2, y: isMobile ? 78 : 10 };
                      if ((w.x === 10 ||w.x === 12) && (w.y === 78 || w.y ===   10)) return { ...w, x: isMobile ? 12 : 10, y: isMobile ? 78 : 10 };
                      if ((w.x === 6.5 || w.x === 7.5) && (w.y === 88 || w.y === 15)) return { ...w, x: isMobile ? 7.5 : 6.5, y: isMobile ? 88 : 15 };


                      let newX, newY;

                      if (isMobile && !zug.is_mobile_data) {
                        // FALL: Ich bin am Handy, lade aber einen Desktop-Spielzug
                        // Berechne, wo das Icon relativ zum Desktop-Feld stand (0 bis 1)
                        console.log("dddd")
                        const relX = (w.x - desk.xStart) / desk.width;
                        const relY = (w.y - desk.yStart) / desk.height;

                        // Übertrage diese relative Position auf das Handy-Feld
                        newX = mob.xStart + (relX * mob.width);
                        newY = mob.yStart + (relY * mob.height);
                      } else if (!isMobile && zug.is_mobile_data) {
                        console.log("dddcccd")
                        // FALL: Ich bin am Desktop, lade aber einen Handy-Spielzug
                        const relX = (w.x - mob.xStart) / mob.width;
                        const relY = (w.y - mob.yStart) / mob.height;

                        newX = desk.xStart + (relX * desk.width);
                        newY = desk.yStart + (relY * desk.height);
                      }

                      return { ...w, x: newX, y: newY };
                    });
                  });
                  geladeneDaten = konvertierteSzenen;
                }

                // 4. State setzen
                setSzenen(geladeneDaten);
                setSzene(0);
            }
          }}
        />
      ))}
      </Liste>
      <button onClick={spielzugspeichern} style={{padding: 0 ,color:(tutStep > 0 && tutInhalt[tutStep - 1].i === "Save" && istSichtbar) ? "#00e5ff" :  "white",left: isMobile ?'50vw' :"83vw",top:isMobile ?'99.5vw' : '5.5vw', position: "absolute", width:isMobile ?'10vw' :"3.5vw",height:isMobile ?'10vw' :"3.5vw", border: (tutStep > 0 && tutInhalt[tutStep - 1].i === "Save" && istSichtbar) ? "0.3vw solid #00e5ff" : "0.15vw solid #2e2e2e", cursor:"pointer", borderRadius:"50%",fontSize:isMobile ?'8vw' :"2.7vw",display:"flex", alignItems:"center", justifyContent:"center",backgroundColor:"#212121"}}>
      <FiSave />
      </button>
      <button onClick={spielzugloeschen} style={{padding: 0 ,left:isMobile ?'61vw' : "87vw",top:isMobile ?'99.5vw' : '5.5vw',color: isdeleting ? "#212121" : ((tutStep > 0 && tutInhalt[tutStep - 1].i === "Löschen" && istSichtbar) ? "#00e5ff" :  "white") ,position: "absolute", width:isMobile ?'10vw' :"3.5vw",height:isMobile ?'10vw' :"3.5vw", border: (tutStep > 0 && tutInhalt[tutStep - 1].i === "Löschen" && istSichtbar) ? "0.3vw solid #00e5ff" : "0.15vw solid #2e2e2e", cursor:"pointer", borderRadius:"50%",fontSize:isMobile ?'8vw' :"2.7vw",display:"flex", alignItems:"center", justifyContent:"center",backgroundColor:isdeleting ? "#00e5ff" : "#212121"}}>
        <FiTrash2/>
      </button>
      <button onClick={exporting} style={{padding: 0 ,color: isExporting ? "#212121" :(tutStep > 0 && tutInhalt[tutStep - 1].i === "Export" && istSichtbar) ? "#00e5ff" :   "white",left:isMobile ?'72vw' : "91vw",top:isMobile ?'99.5vw' : '5.5vw', position: "absolute", width:isMobile ?'10vw' :"3.5vw",height:isMobile ?'10vw' :"3.5vw", border: (tutStep > 0 && tutInhalt[tutStep - 1].i === "Export" && istSichtbar) ? "0.3vw solid #00e5ff" : "0.15vw solid #2e2e2e", cursor:"pointer", borderRadius:"50%",fontSize:isMobile ?'8vw' :"2.7vw",display:"flex", alignItems:"center", justifyContent:"center",backgroundColor:isExporting ? "#00e5ff" : "#212121"}}>
        <TbFileExport />
      </button>
      <button onClick={importing} style={{padding: 0 ,left:isMobile ?'83vw' : "95vw",top:isMobile ?'99.5vw' : '5.5vw',color: (tutStep > 0 && tutInhalt[tutStep - 1].i === "Import" && istSichtbar) ? "#00e5ff" :  "white", position: "absolute", width:isMobile ?'10vw' :"3.5vw",height:isMobile ?'10vw' :"3.5vw", border: (tutStep > 0 && tutInhalt[tutStep - 1].i === "Import" && istSichtbar) ? "0.3vw solid #00e5ff" : "0.15vw solid #2e2e2e", cursor:"pointer", borderRadius:"50%",fontSize:isMobile ?'8vw' :"2.7vw",display:"flex", alignItems:"center", justifyContent:"center",backgroundColor:"#212121"}}>
        <TbFileImport />
      </button>
      <select 
        value={sportart} 
        onChange={(e) => setSportart(e.target.value)}
        style={{
          position: "absolute",
          left: isMobile ?'74vw' :"1.5vw",
          top: isMobile ?'86vw' :"22vw", // Über dem Edit-Button
          width: isMobile ?'20vw' :"13.5vw",
          height: isMobile ?'10vw' :"3vw",
          borderRadius: isMobile ?'3vw' :"0.5vw",
          border: (tutStep > 0 && tutInhalt[tutStep - 1].i === "Sportart" && istSichtbar) ? "0.15vw solid #00e5ff" : "0.15vw solid #2e2e2e",
          fontFamily: "sans-serif",
          fontWeight: "bold",
          fontSize: isMobile ?'3vw' :"1vw",
          padding: "0.2vw",
          cursor: "pointer",
          backgroundColor: "#212121"
          ,color:(tutStep > 0 && tutInhalt[tutStep - 1].i === "Sportart" && istSichtbar) ? "#00e5ff" :   "white",
        }}
      >
        <option value="H">Handball</option>
        <option value="F">Fußball</option>
        <option value="V">Volleyball</option>
        <option value="T">Tennis</option>
      </select>
      
      {tutStep > 0 && (
        <div style={{
          position: "absolute",
          top: isMobile ? "10vw" : "10vw",
          left: isMobile ? "25vw" : "35vw",
          width: isMobile ? "65vw" : "30vw",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          border: "0.4vw solid #44c6d5",
          borderRadius: "1.5vw",
          padding: "2vw",
          zIndex: 1000,
          boxShadow: "0 1vw 3vw rgba(0,0,0,0.3)",
          fontFamily: "sans-serif",
          display: "flex",
          flexDirection: "column",
          gap: "1vw"
        }}>
          <h2 style={{ margin: 0, color: "#44c6d5", fontSize: isMobile ? "5vw" : "1.8vw" }}>
            {tutInhalt[tutStep -1].t}
          </h2>
          <p style={{ margin: 0, fontSize: isMobile ? "3vw" : "1.1vw", lineHeight: 1.4 }}>
            {tutInhalt[tutStep - 1].d}
          </p>
          
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1vw" }}>
            <span style={{ fontSize: isMobile ? "2vw" : "1vw", color: "#666" }}>
              Schritt {tutStep} von {tutInhalt.length}
            </span>
            <button 
              onClick={tutorialm}
              style={{
                backgroundColor: "#44c6d5",
                border: "none",
                color: "white",
                padding: "0.5vw 1.5vw",
                borderRadius: "0.5vw",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              {tutStep > 1 ? "Zurück" : "Schliessen"}
            </button>
            <button 
              onClick={tutorialp}
              style={{
                backgroundColor: "#44c6d5",
                border: "none",
                color: "white",
                padding: "0.5vw 1.5vw",
                borderRadius: "0.5vw",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              {tutStep < tutInhalt.length ? "Weiter" : "Verstanden"}
            </button>
          </div>
          
          {/* Ein kleiner Schließen-Button oben rechts */}
          <button 
            onClick={() => setTutStep(0)}
            style={{
              position: "absolute",
              top: isMobile ? "0.5vw" : "0.5vw",
              right: isMobile ? "0.5vw" : "0.5vw",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: isMobile ? "2vw" : "1.2vw"
            }}
          >
            ✕
          </button>
        </div>
      )}

      <svg
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          opacity: (isMoving || isAnimating) ? 0 : 1

        }}
      >

        {previousScene !== null &&
          (szenen[szene] ?? []).map(real => {
            const playerSize = isMobile ? 8 : 4; 
            const ballSize = isMobile ? 6 : 3;
            const ghost = (szenen[previousScene] ?? []).find(
              g => g.familie === real.familie
            );
            console.log("REAL", real, "GHOST", ghost)
            if (!ghost) return null;

            if (isMobile ? (real.y >= 60 || ghost.y >=60) : (real.x < 15 || ghost.x < 15)) return null;

            const offset = real.kennung === 3 ? (ballSize / 2) : (playerSize / 2)

            const realX = ((real.x + offset) * window.innerWidth) / 100 ;
            const realY = ((real.y + offset) * window.innerWidth) / 100 ;
            const ghostX = ((ghost.x + offset) * window.innerWidth) / 100 ;
            const ghostY = ((ghost.y + offset) * window.innerWidth) / 100 ;

            return (
              <line
                key={"line-" + real.id}
                x1={ghostX}
                y1={ghostY}
                x2={realX}
                y2={realY}
                stroke="black"
                strokeWidth="4"
                strokeDasharray="6 4"
              />
            );
          })}
      </svg>


      {/* Ghost-Widgets der vorherigen Szene */}
      {previousScene !== null && !playing &&
        (szenen[previousScene] ?? []).map(w => (
          <Spieler
            key={"ghost-" + w.id}
            id={"ghost-" + w.id}
            orititle={w.title}
            onClone={() => {}}          
            onStopCommand={() => {}}    
            kennung={w.kennung}
            x={(w.x * window.innerWidth) / 100}
            y={(w.y * window.innerWidth) / 100}
            ghost={true}                
            aktuellerBall={aktuellerBall}
            isMobile={isMobile}
            tutInhalt={tutInhalt}
            tutStep={tutStep}
            istSichtbar={istSichtbar}
          />
        ))
      }


      {(szenen[szene] ?? []).map(w => {

        const ghost = previousScene !== null
        ? (szenen[previousScene] ?? []).find(g => g.familie === w.familie)
        : null;

        return(
        <React.Fragment key={w.id}>
          <Spieler
            key={w.id + "-1"}
            id={w.id}
            orititle={w.title}
            onClone={cloneWidget}
            onStopCommand={handleStop}
            kennung={w.kennung}
            x={(w.x * window.innerWidth) / 100} 
            y={(w.y * window.innerWidth) / 100}
            isAnimating={isAnimating}
            isMoving={isMoving}
            startPos={ghost ? {
                x:(ghost.x * window.innerWidth) / 100, 
                y:(ghost.y * window.innerWidth) / 100 
              } : null}
            aktuellerBall={aktuellerBall}
            isMobile={isMobile}
            tutInhalt={tutInhalt}
            istSichtbar={istSichtbar}
            tutStep={tutStep}
          />

        </React.Fragment>
      );
    })}
    </div>
  );
};

export default Taktiktafel;