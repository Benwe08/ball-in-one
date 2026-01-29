import { useState, useEffect} from "react";
import { IoMdClose } from "react-icons/io";

export default function Menu({schliessenmen, isMobile, opentak,openimp,opendat, neuwahl}) {


const [isOpen, setIsOpen] = useState(false);
const [IsHoveredtak, setIsHoveredtak] = useState(false);
const [IsHoveredimp, setIsHoveredimp] = useState(false);
const [IsHovereddat, setIsHovereddat] = useState(false);

useEffect(() => {
    // Sobald die Komponente geladen ist, fahren wir sie rein
    setIsOpen(true);
  }, []);

const Schliessenfun = () => {
    setIsOpen(false);
    setTimeout(() => {
      schliessenmen();
    }, 300); 
  };

return(
<div 
    onClick={Schliessenfun}
    style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            display: 'flex',         
            zIndex: 1000,        
            backgroundColor: isOpen ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0)', // Hintergrund blendet mit ein
            transition: 'background-color 0.5s ease'
            }}>
        <div 
        onClick={(e) => e.stopPropagation()}
        style={{ width: isMobile ?'30vw':'20vw', height:  isMobile ?'100%':'100%', opacity: "1", zIndex:"1001", backgroundColor:"#171717", borderTopRightRadius:"1vw",borderBottomRightRadius:"1vw",position:"absolute", borderRight:"0.2vw solid #2e2e2e",transition: 'left 0.3s ease-in-out', left:isOpen ? "0vw" : "-100vw" }} 
              >
        <button 
          onClick={Schliessenfun}
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
          <IoMdClose />
        </button>
        <button 
        onMouseEnter={() => setIsHoveredtak(true)}
        onMouseLeave={() => setIsHoveredtak(false)}
        onClick={() => {
            neuwahl();
            opentak();
        }}
        style={{
            position:"absolute",
            top: "20%",         
            left: "4%",        
            width:  isMobile ?'27vw':"18vw",
            height:  isMobile ?'4vw':"2vw",
            backgroundColor:IsHoveredtak ? '#4a4a4a' : "#171717",
            fontSize: isMobile ?'3vw':"1.5vw",
            color: IsHoveredtak ? '#171717' : '#4a4a4a',
            border: 'none',
            cursor: 'pointer',
            pointerEvents: "painted",
            zIndex: 1002,
            borderRadius:"0.5vw",
            textAlign:"left"
          }}
        >
          Taktiktafel
        </button>
        <button 
        onMouseEnter={() => setIsHoveredimp(true)}
        onMouseLeave={() => setIsHoveredimp(false)}
        onClick={() => {
            neuwahl();
            openimp();
        }}
        style={{
            position:"absolute",
            bottom: "5%",         
            left: "4%",        
            width:  isMobile ?'27vw':"18vw",
            height:  isMobile ?'4vw':"2vw",
            backgroundColor:IsHoveredimp ? '#4a4a4a' : "#171717",
            fontSize: isMobile ?'3vw':"1.5vw",
            color: IsHoveredimp ? '#171717' : '#4a4a4a',
            border: 'none',
            cursor: 'pointer',
            pointerEvents: "painted",
            zIndex: 1002,
            borderRadius:"0.5vw",
            textAlign:"left"
          }}
        >
          Impressum
        </button>
        <button 
        onMouseEnter={() => setIsHovereddat(true)}
        onMouseLeave={() => setIsHovereddat(false)}
        onClick={() => {
            neuwahl();
            opendat();
        }}
        style={{
            position:"absolute",
            bottom: "10%",         
            left: "4%",        
            width:  isMobile ?'27vw':"18vw",
            height:  isMobile ?'4vw':"2vw",
            backgroundColor:IsHovereddat ? '#4a4a4a' : "#171717",
            fontSize: isMobile ?'3vw':"1.5vw",
            color: IsHovereddat ? '#171717' : '#4a4a4a',
            border: 'none',
            cursor: 'pointer',
            pointerEvents: "painted",
            zIndex: 1002,
            borderRadius:"0.5vw",
            textAlign:"left"
          }}
        >
          Datenschutz
        </button>
</div>
</div>
);

}