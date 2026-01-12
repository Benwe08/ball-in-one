import { useState, useRef } from "react";
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
import { FiChevronRight,FiPlay,FiChevronLeft,FiRotateCcw,FiTrash2,FiSave,FiUpload,FiDownload,FiEdit3 } from "react-icons/fi";

const Liste = ({ title, children }) => {
  let posl, post, w
  if (title === "Widgets:"){
    posl = "0vw";
    post = "5vw";
    w = "15vw"
  }
  else if (title === "Spielzüge:"){
    posl = "77vw"
    post = "5vw";
    w = "19vw"
  }
  
  return (
    <div style={{
      width: w,   
      height: '40vw', 
      border: '1px solid #ccc',
      padding: '0.5vw',
      borderRadius: '1vw',
      position: 'absolute',
      left: posl,
      top: post,
      fontFamily: "sans-serif",
      fontWeight: "bold",
      display: "flex",
      flexDirection:"column",
      fontSize: "0.9vw",
      overflowY: "hidden"
    }}>
      <h3 style={{margin: "0.5vw 0", borderBottom: "1.5vw solid #ffffff"}}>{title}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', paddingBottom:"1vw",paddingTop:"1vw", overflowY:"auto", flexGrow:1 }}>
        {children}
        </div>
    </div>
  );
};

const Gespeichert = ({title, onClick,style}) => {
  return (
    <div
      onClick={() => onClick(title)} 
      style={{
      width: '100%',   
      height: '8vw',  
      border: '0.2vw solid #000000',
      padding: '0.5vw',
      borderRadius: '0.5vw',
      boxShadow: '2px 2px 5px rgba(0,0,0,0.1)',
      position: 'relative',
      backgroundColor: "orange",
      cursor: "pointer",
      fontFamily: "sans-serif",
      fontWeight: "bold",
      marginBottom: "0.5vw",
      boxSizing: "border-box",
      display:"flex", 
      alignItems:"center", 
      justifyContent:"center"
    }}>
      <h3>{title}</h3>
    </div>
  );
}

const Szenewid = ({ title }) => {
  return (
    <div style={{
      left: '5.5vw',
      top: '35.5vw',
      width: '5.5vw',   
      height: '3vw',
      position: 'absolute',  
      border: 'none',
      fontSize: '2.5vw',
      textAlign: 'center',
      fontFamily: "sans-serif",
      fontWeight: "bold",
      display: "inline-block"
    }}>
      <h3>{title}</h3>
    </div>
  );
};

/* --------------------------------------------------
   A SINGLE WIDGET (original or clone)
   -------------------------------------------------- */
const Spieler = ({ id, orititle, onClone, onStopCommand, kennung,  x, y, ghost, isAnimating,isMoving, startPos,canEdit,aktuellerBall}) => {
  let we, h, b, br, bc, co, ta, fs, c, bi, bs, zi;
  const nodeRef = useRef(null);
  const ref = useRef(null);
  const [title, setTitle] = useState(orititle);
  const currentX = isAnimating && startPos ? startPos.x: x;
  const currentY = isAnimating && startPos ? startPos.y: y;

  const handleBlur = () => {
    const newTitle = ref.current.innerText;
    setTitle(newTitle);
    onStopCommand(id, { x, y, title: newTitle }, true);
  };


  if (kennung === 1){
    we = '4vw';
    h = '4vw';  
    b = '0.15vw solid #000000';
    br = '50%';
    bc = 'blue';
    bi = 'none'
    co = 'white';
    ta = 'center';
    fs = '1vw';
    c = 'grab';
    bs = 'cover'
    zi = 1
  }
  
  else if (kennung === 2){
    we = '4vw';
    h = '4vw';  
    b = '0.15vw solid #000000';
    br = '50%';
    bc = 'red';
    bi = 'none'
    co = 'white';
    ta = 'center';
    fs = '1vw';
    c = 'grab';
    bs = 'cover'
    zi = 1
  }

  else if (kennung === 3){
    we = '3vw';
    h = '3vw';  
    b = '0px solid #ccc';
    br = '50%';
    bc = 'none'
    bi = `url(${aktuellerBall})`;
    co = 'white';
    ta = 'center';
    fs = '0px';
    c = 'grab';
    bs = '5.2vw 5.2vw'
    zi = 2
  }

  
  return (
    <Draggable
      nodeRef={nodeRef}
      position={{ x: currentX, y: currentY }}
      disabled={ghost || isAnimating || isMoving || canEdit}
      onStart={ghost ? () => {} : (e, data) => onClone(id, data, kennung)} 
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
          display:"flex", alignItems:"center", justifyContent:"center"
        }}
      >
        <h3
          ref={ref}
          contentEditable={canEdit && !ghost}
          suppressContentEditableWarning
          onBlur={handleBlur}
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


const Taktiktafel = ({ title }) => {
  const [szene, setSzene] = useState(0);
  const [sportart, setSportart] = useState("H");
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [gespeicherteZuege, setGespeicherteZuege] = useState([]);
  const [isExporting, setIsExporting] = useState(false);
  const [isdeleting, setIsdeleting] = useState(false);
  const previousScene = szene > 0 ? szene - 1 : null;
  const [isEditingText, setIsEditingText] = useState(false);
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
      { id: 1,familie: Math.random().toString(36).substr(2, 9), kennung: 1, x: 2,  y: 10 ,title: "TW"},
      { id: 2,familie: Math.random().toString(36).substr(2, 9), kennung: 2, x: 10,  y: 10,title: "TW"},
      { id: 3,familie: Math.random().toString(36).substr(2, 9), kennung: 3, x: 6.5,  y: 15,title: ""}
    ]
  });
  const [windowSize, setWindowSize] = useState({ w: window.innerWidth, h: window.innerWidth });

  React.useEffect(() => {
    const handleResize = () => {
      setWindowSize({ w: window.innerWidth, h: window.innerWidth });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const clear = () => {

  setSzene(0);

  setSzenen({
    0: [
      { id: 1, familie: Math.random().toString(36).substr(2, 9), kennung: 1, x: 2,  y: 10 , title: "TW" },
      { id: 2, familie: Math.random().toString(36).substr(2, 9), kennung: 2, x: 10,  y: 10, title: "TW" },
      { id: 3, familie: Math.random().toString(36).substr(2, 9), kennung: 3, x: 6.5,  y: 15, title: "" }
    ]
  });

  setIsAnimating(false);
  setIsMoving(false);
  isAutoPlaying.current = false;
  setPlaying(false);
};

  const cloneWidget = (id, data, kennung) => {


    const xRelativ = (data.x / window.innerWidth) * 100;
    const yRelativ = (data.y / window.innerWidth) * 100;

        if (xRelativ >= 15) return;

    setSzenen(prev => {
      const original = prev[szene].find(w => w.id === id);

      const newWidget = {
        id: Date.now() + Math.random(),
        familie: Math.random().toString(36).substr(2, 9),  
        title: original?.title ?? "TW",
        x: xRelativ,
        y: yRelativ,
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

  function spielzugspeichern() {
  const name = prompt("Name des Spielzugs:", "");
  if (!name) return;

  const neuerZug = {
    id: Date.now(),
    title: name,
    daten: JSON.parse(JSON.stringify(szenen)) // Tiefe Kopie der aktuellen Szenen
  };

  setGespeicherteZuege(prev => [...prev, neuerZug]);
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


    if (!isTitleChange && (xRelativ < 15 || xRelativ > 75 || yRelativ < 5 || yRelativ > 41 ) && !String(id).startsWith("main")) {
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
      <img src={aktuellesFeld} alt="Externes Bild" style={{left: "16.1vw",top: "6vw", position: "absolute", width: '60.9vw', height: 'auto'}} />
      <Liste title="Widgets:" />
      <button onClick={angeklicktvor} style={{left: "11vw",top: '37.9vw', position: "absolute",width:"4.5vw",height:"4.5vw", borderRadius:"50%", border: "0.1vw solid black", cursor:"pointer", fontSize:"3.5vw", display:"flex", alignItems:"center", justifyContent:"center",backgroundColor:"white"}}>
      <FiChevronRight />
      </button>
      <button onClick={angeklicktzur} style={{left: "0.8vw",top: '37.9vw', position: "absolute",width:"4.5vw",height:"4.5vw", borderRadius:"50%", border: "0.1vw solid black", cursor:"pointer", fontSize:"3.5vw", display:"flex", alignItems:"center", justifyContent:"center",backgroundColor:"white"}}>
      <FiChevronLeft />
      </button>
      <Szenewid title={szene} />
      <button onClick={abspielen} style={{left: "5vw",top: '31vw', position: "absolute", width:"6.5vw", height:"6.5vw",cursor:"pointer", borderRadius:"50%", border:"0.5vw solid black", fontSize:"4vw", display:"flex", alignItems:"center", justifyContent:"center", paddingLeft:"1vw",backgroundColor:"white"}}>
      <FiPlay/>
      </button>
      <button onClick={clear} style={{left: "11vw",top: '27vw', position: "absolute", width:"4vw",height:"4vw", border: "0.15vw solid black",cursor:"pointer",display: 'flex',justifyContent: 'center',alignItems: 'center', borderRadius:"50%", fontSize:"2.5vw",backgroundColor:"white"}}>
        <FiRotateCcw />
      </button>
      <button onClick={() => setIsEditingText(!isEditingText)} style={{left: "1.5vw",top: '27vw', position: "absolute", width:"4vw",height:"4vw", border: "0.15vw solid black",cursor:"pointer",display: 'flex',justifyContent: 'center',alignItems: 'center', borderRadius:"50%", fontSize:"2.5vw",backgroundColor: isEditingText ? "black" : "white",color: isEditingText ? "white" : "black"}}>
        <FiEdit3 />
      </button>
      <Liste title="Spielzüge:" >
      {gespeicherteZuege.map((zug, index) => (
        <Gespeichert 
          key={zug.id}
          title={zug.title}
          savesnumber={index}
          style={{ top: 100 + (index * 110) + "px",
            border: isdeleting  ? '3px solid red' : '2px solid #0000',
            opacity: (isExporting || isdeleting) ? 0.8 : 1
           }} 
          onClick={() => {
            if (isdeleting) {
              setGespeicherteZuege(prev => prev.filter(z => z.id !== zug.id));
              setIsdeleting(false); 
              console.log("Gelöscht:", zug.title);
            } else if (isExporting) {
              const dataStr = JSON.stringify([zug], null, 2); // Exportiert nur diesen einen Zug
              const dataBlob = new Blob([dataStr], { type: "application/json" });
              const url = URL.createObjectURL(dataBlob);
              const link = document.createElement("a");
              link.href = url;
              link.download = `${zug.title}.json`;
              link.click();
              URL.revokeObjectURL(url);
              
              setIsExporting(false); // Modus nach Klick beenden
            } else {
              console.log("Lade Spielzug:", zug.title);
              setSzenen(zug.daten); 
              setSzene(0);          
            }
          }}
        />
      ))}
      </Liste>
      <button onClick={spielzugspeichern} style={{left: "83vw",top: '5.5vw', position: "absolute", width:"3.5vw",height:"3.5vw", border: "0.3vw solid black", cursor:"pointer", borderRadius:"50%",fontSize:"2.7vw",display:"flex", alignItems:"center", justifyContent:"center",backgroundColor:"white"}}>
      <FiSave color="black"/>
      </button>
      <button onClick={spielzugloeschen} style={{left: "86.4vw",top: '5.5vw',color: isdeleting ? "white" : "black" ,position: "absolute", width:"3.5vw",height:"3.5vw", border: "0.3vw solid black", cursor:"pointer", borderRadius:"50%",fontSize:"2.7vw",display:"flex", alignItems:"center", justifyContent:"center",backgroundColor:isdeleting ? "black" : "white"}}>
        <FiTrash2/>
      </button>
      <button onClick={importing} style={{left: "89.8vw",top: '5.5vw', position: "absolute", width:"3.5vw",height:"3.5vw", border: "0.3vw solid black", cursor:"pointer", borderRadius:"50%",fontSize:"2.7vw",display:"flex", alignItems:"center", justifyContent:"center",backgroundColor:"white"}}>
        <FiDownload/>
      </button>
      <button onClick={exporting} style={{left: "93.2vw",top: '5.5vw',color: isExporting ? "white" : "black", position: "absolute", width:"3.5vw",height:"3.5vw", border: "0.3vw solid black", cursor:"pointer", borderRadius:"50%",fontSize:"2.7vw",display:"flex", alignItems:"center", justifyContent:"center",backgroundColor:isExporting ? "black" : "white"}}>
        <FiUpload/>
      </button>
      <select 
        value={sportart} 
        onChange={(e) => setSportart(e.target.value)}
        style={{
          position: "absolute",
          left: "1.5vw",
          top: "22vw", // Über dem Edit-Button
          width: "13.5vw",
          height: "3vw",
          borderRadius: "0.5vw",
          border: "0.15vw solid black",
          fontFamily: "sans-serif",
          fontWeight: "bold",
          fontSize: "1vw",
          padding: "0.2vw",
          cursor: "pointer",
          backgroundColor: "white"
        }}
      >
        <option value="H">Handball</option>
        <option value="F">Fußball</option>
        <option value="V">Volleyball</option>
        <option value="T">Tennis</option>
      </select>

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
            const ghost = (szenen[previousScene] ?? []).find(
              g => g.familie === real.familie
            );
            console.log("REAL", real, "GHOST", ghost)
            if (!ghost) return null;

            if (real.x < 15 || ghost.x < 15) return null;

            const offset = real.kennung === 3 ? 1.5 : 2;

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
            canEdit={isEditingText}
            aktuellerBall={aktuellerBall}
          />

        </React.Fragment>
      );
    })}
    </div>
  );
};

export default Taktiktafel;