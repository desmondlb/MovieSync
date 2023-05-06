import React from 'react';
import socketio from 'socket.io-client';

export const socket = socketio.connect('http://3.91.52.183:5000');
export const SocketContext = React.createContext();