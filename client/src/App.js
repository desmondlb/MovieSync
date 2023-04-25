import './App.css';
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import Landing from "./scenes/landing";
import Room from "./scenes/room";

function App() {
  return (
    <div className="App">
      <BrowserRouter> 
          <Routes>
            <Route path="/" element={<Navigate to="/landing" replace />} />
            <Route path="/landing" element={<Landing/>}/>
            <Route path="/room" element={<Room/>} />
          </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
