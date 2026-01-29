export default function Impressums({isMobile}) {

    return(
        <div
            style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            display: 'flex',         
            zIndex: 1,        
            color:"white",
            textAlign:"center",
            alignItems:"flex-start"
            }}>
        <div
            style={{
            position: 'absolute',
            top: "13vw",
            left: "2vw",
            width: '40vw',
            height: '10vw',
            display: 'flex',         
            zIndex: 1,        
            color:"white",
            fontFamily:"sans-serif",
            fontSize:"4vw",
            textAlign:"center",
            alignItems:"center"
            }}>
        Name: Ben Westhoff
        </div>
        <div
            style={{
            position: 'absolute',
            top: "20vw",
            left: "2vw",
            width: '80vw',
            height: '10vw',
            display: 'flex',         
            zIndex: 1,        
            color:"white",
            fontFamily:"sans-serif",
            fontSize:"4vw",
            textAlign:"center",
            alignItems:"center"
            }}>
        Anschrift: Drostenfeld 19 59759 Arnsberg
        </div>
        <div
            style={{
            position: 'absolute',
            top: "27vw",
            left: "2vw",
            width: '80vw',
            height: '10vw',
            display: 'flex',         
            zIndex: 1,        
            color:"white",
            fontFamily:"sans-serif",
            fontSize:"4vw",
            textAlign:"center",
            alignItems:"center"
            }}>
        E-Mail: dev@ball-in-one.app
        </div>
        </div>
    )
}