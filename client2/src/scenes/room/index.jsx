import React from 'react';
import SocketComponent from '../../components/SocketComponent';
import DashPlayer from '../../components/DashPlayer';
const Room = (props) => {
  // const location = useLocation();
  // console.log(location.state)
  return (
    <div>
      <DashPlayer/>
      {/* <SocketComponent/> */}
    </div>
  )
};
export default Room;