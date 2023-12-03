import React from "react";
import { BrowserRouter } from "react-router-dom";
import MainRouter from "./MainRouter";
import MainHeader from "./MainHeader";
import MainFooter from "./MainFooter";

const App = props => (
  
  <BrowserRouter basename="/rfid-web-app">
  <MainHeader/>
  <div>
  <MainRouter/>
  </div>
    
     <footer>
        <MainFooter/>
      </footer>
  </BrowserRouter>
);

export default App;