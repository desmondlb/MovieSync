import React from 'react';
import { useLocation } from 'react-router-dom';
import SocketComponent from '../../components/SocketComponent';

const Room = (props) => {
  // const location = useLocation();
  // console.log(location.state)
  return (
    <div>
      <SocketComponent/>
    </div>
  )
};
export default Room;