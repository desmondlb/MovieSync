import React from 'react';
import socketio from 'socket.io-client';

// export const server_ip = "34.202.237.67"
export const socket = socketio.connect('http://34.202.237.67:5000');
export const SocketContext = React.createContext();