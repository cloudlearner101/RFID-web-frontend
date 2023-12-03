import React from 'react';
import { Header } from 'react-mdl';

class MainHeader extends React.Component {
render() {
  
        return (
            <Header className="main_header_style">
            <h1 className='txt-center'>Welcome to RFID DMG - Dispatch Reports</h1>
            </Header>
        );
    }
};


export default MainHeader;