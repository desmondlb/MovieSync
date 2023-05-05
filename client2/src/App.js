import './App.css';
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import Landing from "./scenes/main";
import Room from "./scenes/room";
import { SocketContext, socket } from './context/socket';

function App() {
  return (
    <div className="App">
      <SocketContext.Provider value={socket}>
        <BrowserRouter> 
            <Routes>
              <Route path="/" element={<Navigate to="/landing" replace />} />
              <Route path="/landing" element={<Landing/>}/>
              <Route path="/room" element={<Room/>} />
            </Routes>
        </BrowserRouter>
      </SocketContext.Provider>
    </div>
  );
}

export default App;
