import React, { Component } from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import DvrTwoToneIcon from '@mui/icons-material/DvrTwoTone';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ViewListIcon from '@mui/icons-material/ViewList';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { Link } from 'react-router-dom';

class DrawerComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      roleType: ''
    };
  }

  componentDidMount() {
    if(this.props.userRole !== undefined && this.props.userRole !== ''){
      this.setState({ roleType: this.props.userRole });
    }
    else{
      this.setState({ roleType: localStorage.getItem('roleType')});
    }
   
  }

  toggleDrawer = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  render() {
    const { roleType } = this.state || localStorage.getItem('roleType');

    return (
      <div>
        <div className="drawer-button">
          <ListItem button onClick={this.toggleDrawer}>
            <div className='list-item-text'>
              <ListItemText primary="RFID" />
            </div>

            <ListItemIcon>
              <FormatListBulletedIcon className='icon-style' />
            </ListItemIcon>
          </ListItem>
        </div>

        <Drawer open={this.state.isOpen} onClose={this.toggleDrawer}>
          <div
            role="presentation"
            onClick={this.toggleDrawer}
            onKeyDown={this.toggleDrawer}
          >
            {roleType === 'Admin'  ? 
            
              <List className='list-view'>
                <div className="inside-list-drawer">
                  <div>
                    <ListItem button onClick={this.toggleDrawer}>
                      <div className='inner-list-item-text icon-color'>
                        <ListItemText primary={roleType} />
                      </div>

                      <ListItemIcon>
                        <FormatListBulletedIcon className='inside-icon-style' />
                      </ListItemIcon>
                    </ListItem>
                  </div>
                  <div><hr color='white'></hr></div>
                </div>
                <ListItem button component={Link} to="/Dashboard">
                  <ListItemIcon>
                    <DashboardIcon className='icon-color'/>
                  </ListItemIcon>
                  <ListItemText primary="Overview" />
                </ListItem>
                <ListItem button component={Link} to="/pcConfiguration">
                  <ListItemIcon>
                    <DvrTwoToneIcon className='icon-color'/>
                  </ListItemIcon>
                  <ListItemText primary="PC Configuration" />
                </ListItem>
                <ListItem button component={Link} to="/vechileMaster">
                  <ListItemIcon>
                    <ViewListIcon className='icon-color'/>
                  </ListItemIcon>
                  <ListItemText primary="Vechile Master" />
                </ListItem>
                <ListItem button component={Link} to="/vechileMovement">
                  <ListItemIcon>
                    <LocalShippingIcon className='icon-color'/>
                  </ListItemIcon>
                  <ListItemText primary="Vechile Movement Report" />
                </ListItem>
                
              </List>
             : 
              <List className='list-view'>
                <div className="inside-list-drawer">
                  <div>
                    <ListItem button onClick={this.toggleDrawer}>
                      <div className='inner-list-item-text icon-color'>
                        <ListItemText primary={roleType}/>
                      </div>

                      <ListItemIcon>
                        <FormatListBulletedIcon className='inside-icon-style' />
                      </ListItemIcon>
                    </ListItem>
                  </div>
                  <div><hr color='white'></hr></div>
                </div>
                <ListItem button component={Link} to="/Dashboard">
                  <ListItemIcon>
                    <DashboardIcon className='icon-color'/>
                  </ListItemIcon >
                  <ListItemText primary="Overview" />
                </ListItem>
                <ListItem button component={Link} to="/vechileMaster">
                  <ListItemIcon>
                    <ViewListIcon className='icon-color'/>
                  </ListItemIcon>
                  <ListItemText primary="Vechile Master List" />
                </ListItem>
                <ListItem button component={Link} to="/vechileMovement">
                  <ListItemIcon>
                    <LocalShippingIcon className='icon-color' />
                  </ListItemIcon>
                  <ListItemText primary="Vechile Movement Report" />
                </ListItem>
              </List>
            }
          </div>
        </Drawer>
      </div>
    );
  }
}

export default DrawerComponent;
