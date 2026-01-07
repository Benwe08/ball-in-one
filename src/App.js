import React from 'react';
import Taktiktafel from './Taktiktafel'; 

function ausgewaehlt(){
  console.log("hi")
}

function MainApp() {
  return (
    <div className="container">
      <button onClick={ausgewaehlt} style={{left: "0px",top: '0px', position: "absolute", width:"1500px", height:"100px", border: "none", cursor:"pointer", borderRadius:"50px", backgroundColor: "orange"}}>
      </button>
      <Taktiktafel />
      
    </div>
  );
}

export default MainApp;