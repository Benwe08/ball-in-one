import { useState, useRef } from "react";
import Draggable from "react-draggable";
import React from "react";

const Liste = ({ title }) => {
  let posl, post, w
  if (title === "Widgets:"){
    posl = "0px";
    post = "100px";
    w = "250px"
  }
  else if (title === "Spielzüge:"){
    posl = "1470px";
    post = "100px";
    w = "350px"
  }
  
  return (
    <div style={{
      width: w,   
      height: '1000px',  
      maxWidth: '90%',   
      maxHeight: '80vh',
      border: '1px solid #ccc',
      padding: '5px',
      borderRadius: '5px',
      boxShadow: '2px 2px 5px rgba(0,0,0,0.1)',
      position: 'absolute',
      left: posl,
      top: post,
    }}>
      <h3>{title}</h3>
    </div>
  );
};

const Gespeichert = ({title, onClick, savesnumber}) => {
  const t = savesnumber * 100 + 100
  console.log(t)
  return (
    <div
      onClick={() => onClick(title)} 
      style={{
      width: '350px',   
      height: '100px',  
      maxWidth: '90%',   
      maxHeight: '80vh',
      border: '2px solid #000000',
      padding: '5px',
      borderRadius: '10px',
      boxShadow: '2px 2px 5px rgba(0,0,0,0.1)',
      position: 'absolute',
      backgroundColor: "orange",
      left: 1470,
      top: t + 100,
      cursor: "pointer"
    }}>
      <h3>{title}</h3>
    </div>
  );
}

const Szenewid = ({ title }) => {
  return (
    <div style={{
      left: '82px',
      top: '685px',
      width: '100px',   
      height: '70px',
      position: 'absolute',  
      maxWidth: '90%',   
      maxHeight: '80vh',
      border: 'none',
      fontSize: '40px',
      textAlign: 'center'
    }}>
      <h3>{title}</h3>
    </div>
  );
};

/* --------------------------------------------------
   A SINGLE WIDGET (original or clone)
   -------------------------------------------------- */
const Spieler = ({ id, orititle, onClone, onStopCommand, kennung,  x, y, ghost, isAnimating,isMoving, startPos}) => {
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
    we = '70px';
    h = '70px';  
    b = '1px solid #ccc';
    br = '70px';
    bc = 'blue';
    bi = 'none'
    co = 'white';
    ta = 'center';
    fs = '17px';
    c = 'grab';
    bs = 'cover'
    zi = 1
  }
  
  else if (kennung === 2){
    we = '70px';
    h = '70px';  
    b = '1px solid #ccc';
    br = '70px';
    bc = 'red';
    bi = 'none'
    co = 'white';
    ta = 'center';
    fs = '17px';
    c = 'grab';
    bs = 'cover'
    zi = 1
  }

  else if (kennung === 3){
    we = '50px';
    h = '50px';  
    b = '0px solid #ccc';
    br = '70px';
    bc = 'none'
    bi = 'url(https://cdn.uhlsport.com/media/80/a4/de/1721458825/200190301_png.jpg?ts=1729089777)';
    co = 'white';
    ta = 'center';
    fs = '0px';
    c = 'grab';
    bs = '75px 75px'
    zi = 2
  }

  else{
    we = '70px';
    h = '70px';  
    b = '1px solid #ccc';
    br = '70px';
    bc = 'green';
    co = 'white';
    ta = 'center';
    fs = '17px';
    c = 'grab';
  }
  
  return (
    <Draggable
      nodeRef={nodeRef}
      position={{ x: currentX, y: currentY }}
      disabled={ghost || isAnimating || isMoving}
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
        }}
      >
        <h3
          ref={ref}
          contentEditable
          suppressContentEditableWarning
          onBlur={handleBlur}
          style={{
            cursor: "text",
            outline: "none",
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
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [gespeicherteZuege, setGespeicherteZuege] = useState([]);
  const [isExporting, setIsExporting] = useState(false);
  const [isdeleting, setIsdeleting] = useState(false);
  const previousScene = szene > 0 ? szene - 1 : null;
  const [szenen, setSzenen] = useState({
    0: [
      { id: 1,familie: crypto.randomUUID(), kennung: 1, x: 40,  y: 200 ,title: "TW"},
      { id: 2,familie: crypto.randomUUID(), kennung: 2, x: 150, y: 200 ,title: "TW"},
      { id: 3,familie: crypto.randomUUID(), kennung: 3, x: 105, y: 300 ,title: ""}
    ]
  });

  const clear = () => {

  setSzene(0);

  setSzenen({
    0: [
      { id: 1, familie: crypto.randomUUID(), kennung: 1, x: 40,  y: 200, title: "TW" },
      { id: 2, familie: crypto.randomUUID(), kennung: 2, x: 150, y: 200, title: "TW" },
      { id: 3, familie: crypto.randomUUID(), kennung: 3, x: 105, y: 300, title: "" }
    ]
  });

  setIsAnimating(false);
  setIsMoving(false);
  isAutoPlaying.current = false;
  setPlaying(false);
};

  const cloneWidget = (id, data, kennung) => {
    if (data.x >= 250) return;

    setSzenen(prev => {
      const original = prev[szene].find(w => w.id === id);

      const newWidget = {
        id: Date.now() + Math.random(),
        familie: crypto.randomUUID(),  
        title: original?.title ?? "TW",
        x: data.x,
        y: data.y,
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

    if (!isTitleChange && (data.x <= 250 ||  data.y <= 100) && !String(id).startsWith("main")) {
      setTimeout(() => {
        setSzenen(prev => ({
          ...prev,
          [szene]: prev[szene].filter(w => w.id !== id)
        }));
      }, 0);
      return;
    }


    setSzenen(prev => ({
      ...prev,
      [szene]: prev[szene].map(w =>
        w.id === id ? {
          ...w,
          x: data.x ?? w.x, 
          y: data.y ?? w.y,
          title: data.title ?? w.title
        } 
        : w
      )
    }));
  };


  return (
    <div
      style={{ position: "relative", width: "100%", height: "1000px" }}
    >
      <img src="https://t3.ftcdn.net/jpg/03/71/45/14/360_F_371451475_Udjp9ZLzy2XbO5aIcYdiJ92haFay2ZON.jpg" alt="Externes Bild" style={{left: "265px",top: "100px", position: "absolute", width: '1200px', height: '1000px', maxHeight: '80vh'}} />
      <Liste title="Widgets:" />
      <button onClick={angeklicktvor} style={{backgroundImage: "url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkOeoqBKYwzzLzMfKQvawRjfnKKZe3ofMHzA&s)",left: "185px",top: '730px', position: "absolute", padding: "35px 35px", backgroundPosition: 'center',backgroundSize: "115px 115px", border: "none", cursor:"pointer"}}>
      </button>
      <button onClick={angeklicktzur} style={{backgroundImage: "url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkOeoqBKYwzzLzMfKQvawRjfnKKZe3ofMHzA&s)",left: "10px",top: '730px', position: "absolute", padding: "35px 35px", backgroundPosition: 'center',backgroundSize: "115px 115px", border: "none", transform: "rotate(180deg)", cursor:"pointer"}}>
      </button>
      <Szenewid title={szene} />
      <button onClick={abspielen} style={{backgroundImage: "url(https://static.vecteezy.com/system/resources/thumbnails/035/753/221/small/video-play-button-icon-for-graphic-design-logo-web-site-social-media-mobile-app-ui-illustration-png.png)",left: "85px",top: '600px', position: "absolute", padding: "50px 50px", backgroundPosition: 'center',backgroundSize: "100px 100px", border: "none", cursor:"pointer", borderRadius:"50px"}}>
      </button>
      <button onClick={clear} style={{left: "35px",top: '540px', position: "absolute", width:"200px",height:"50px", border: "2px solid black",backgroundColor:"#ff0000ff", cursor:"pointer",color:"white" ,display: 'flex',justifyContent: 'center',alignItems: 'center',textAlign: 'center', borderRadius:"50px", fontSize:"25px"}}>
        <h3>clear</h3>
      </button>
      <Liste title="Spielzüge:" />
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
      <button onClick={spielzugspeichern} style={{backgroundImage: "url(https://img.freepik.com/vektoren-premium/diskette-schwarzes-symbol-schaltflaeche-speichern-vektorgrafik_833641-1549.jpg)",left: "1570px",top: '110px', position: "absolute", padding: "30px  30px", backgroundPosition: 'center',backgroundSize: "100px 100px", border: "none", cursor:"pointer", borderRadius:"0px"}}>
      </button>
      <button onClick={spielzugloeschen} style={{backgroundImage: "url(https://media.istockphoto.com/id/928418914/de/vektor/abfalleimer-m%C3%BClleimer-m%C3%BClleimer-symbol.jpg?s=612x612&w=0&k=20&c=AVBll3HCJn47siu14hATrHzVXBwEHKlR-HDeLtd5ynU=)",left: "1630px",top: '110px', position: "absolute", padding: "26px  26px", backgroundPosition: 'center',backgroundSize: "65px 65px", border: isdeleting ? "4px solid red" : "4px solid white", cursor:"pointer", borderRadius:"0px",}}>
      </button>
      <button onClick={importing} style={{backgroundImage: "url(https://t4.ftcdn.net/jpg/05/93/54/91/360_F_593549119_JOuhPhytRMiZLlvAZ5WHhpoDsRGd0Kzi.jpg)",left: "1750px",top: '110px', position: "absolute", padding: "26px  26px", backgroundPosition: 'center',backgroundSize: "60px 60px", cursor:"pointer", border: "none",}}>
      </button>
      <button onClick={exporting} style={{backgroundImage: "url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpz_Rc5k_62_4fHCD8u9Ji8woifs_-ZKiKRg&s)",left: "1689px",top: '110px', position: "absolute", padding: "26px  26px", backgroundPosition: 'center',backgroundSize: "60px 60px", cursor:"pointer",border: isExporting ? "4px solid blue" : "none",}}>
      </button>

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

            if (real.x < 250 || ghost.x < 250) return null;
            if (real.y > 100 || ghost.y > 100) return null;
            const size = real.kennung === 3 ? 50 : 70;
            const half = size / 2;

            const realX = real.x + half;
            const realY = real.y + half ;
            const ghostX = ghost.x + half;
            const ghostY = ghost.y + half;

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
            x={w.x}
            y={w.y}
            ghost={true}                
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
            x={w.x} 
            y={w.y}
            isAnimating={isAnimating}
            isMoving={isMoving}
            startPos={ghost ? { x: ghost.x, y: ghost.y } : null}
          />

        </React.Fragment>
      );
    })}
    </div>
  );
};

export default Taktiktafel;