import React from 'react';
import { Footer, FooterSection, FooterLinkList } from 'react-mdl';

class MainFooter extends React.Component {
    

    render() {
      
        // Custom CSS styles to remove list-style and padding
        const customStyles = {
            listStyle: 'none', // Remove list-style
            padding: 0, // Remove padding
            marginTop: "0px",
        };

        return (
            <Footer className="main_footer_style">
                <FooterSection type="left">
                    <FooterLinkList style={customStyles}>
                        <label><div style={{fontSize: 12,fontFamily: "Arial",padding: "15px", justifyContent: 'center'}}><i style={{fontSize: 10}}>Powered by</i> NEXINVENT TECHNOLOGIES PVT. LTD.</div></label>
                    </FooterLinkList>
                </FooterSection>
            </Footer>
        );
    }
}

export default MainFooter;
