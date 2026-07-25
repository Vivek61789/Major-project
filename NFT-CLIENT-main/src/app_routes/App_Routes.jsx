import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Landing from "../pages/Landing/Landing";
import Register from "../pages/auth/Register";
import CreateEvent from "../pages/orgnaizer/CreateEvent";
import Events from "../pages/Events/Events";
import Event from "../pages/Events/Event";
import Organizer from "../pages/orgnaizer/Organizer";

const App_Routes = () => {
    const location = useLocation();
  return (
    
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<Landing />} />

      <Route path="/register" element={<Register />} />
      {/* <Route path="/create-event" element={<CreateEvent />} /> */}
      <Route path="/events" element={<Events />} />
      <Route path="/event/:id/:contract" element={<Event />} />
      <Route path="/organizer-dashboard" element={<Organizer  />} />
    </Routes>
  );
};

export default App_Routes;
