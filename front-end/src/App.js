import React from "react";
import { BrowserRouter } from "react-router-dom";
import MainRouter from "./MainRouter";
import MainHeader from "./MainHeader";
import MainFooter from "./MainFooter";

const App = props => (
  
  <BrowserRouter >
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