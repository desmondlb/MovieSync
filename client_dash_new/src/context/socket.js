import React from 'react';
import socketio from 'socket.io-client';

const ip = "localhost";
export const server_ip = ip;
export const socket = socketio.connect('http://'+ip+':5000');
export const SocketContext = React.createContext();