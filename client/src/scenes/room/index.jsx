import React from 'react';

import SocketComponent from '../../components/SocketComponent';

const Room = (props) => {
  // const location = useLocation();
  // console.log(location.state)
  return (
    <div>
    <header style={{backgroundColor: "#333", color: "#fff", padding: "20px", textAlign: "center" , marginBottom: "20px" }}>  
      <h1>Welcome to Movie Sync</h1>
	  </header>
      <SocketComponent/>
    </div>
  )
};
export default Room;