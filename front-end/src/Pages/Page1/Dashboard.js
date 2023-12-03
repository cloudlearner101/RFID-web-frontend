import React, { Component } from 'react';
import Login from '../Login';
import DrawerComponent from '../../DrawerComponent';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TablePagination from '@material-ui/core/TablePagination';
import CircularProgress from '@material-ui/core/CircularProgress';

import {
    Row, Col
  } from "reactstrap";
  
  import CustomCard from '../../CustomCard';
  
  let cards = [
    {
      order: 1,
      heading: "Tare Weight Vechile Count",
      count: 0,
      color: "#0095ff",
      icon: "fa fa-plus-square fa-4x"
    },
    {
      order: 2,
      heading: "Gross Weight Vechile Count",
      count: 0,
      color: "#008000",
      icon: "fa fa-medkit fa-4x"
    },
    { 
      order: 3,
      heading: "Pending for Gross Weight",
      count: 0,
      color: "#FF0000",
      icon: "fa fa-heartbeat fa-4x"
    }
  ]
  

class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
          loginSuccess: true,
          username: '',
          roleType: '',
          data: [],
          page: 0,
          rowsPerPage: 10,
          vehicleCount: 0,
          movementCount: 0,
          countDifference: 0,
          SpinnerFlag: false          
        }
        this._mounted = false;
    }
    

  componentDidMount() {
    this._mounted = true;
    let name = localStorage.getItem('username');
    this.setState({ username: name }, () => {
      this.getdata();
    });
  };

    UNSAFE_componentWillMount() {
      this._mounted = true;
      
    };
    componentWillUnmount() {
      this._mounted = false;
    };

    
    getdata() {
      this.setState({ SpinnerFlag: true })
      const payload = {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': "application/json",
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(this.state)
      };
      fetch(`${process.env.REACT_APP_API_URL}/rfid/getVehicleDetails`, payload).then((response) => response.json()).then((response) => {
        if (this._mounted) {
          if (response) {
            this.setState({ data: response.vehicleDetails})
            cards[0].count = response.vehicleCount;
            cards[1].count = response.movementCount;
            cards[2].count = response.countDifference;
          } else {
            this.setState({ data: undefined })
          }

        }
        this.setState({ SpinnerFlag: false })
      }).catch((error) => {
        this.setState({ SpinnerFlag: false })
        console.log(error)
      })
    };
    
    handleLogout = () => {
        this.setState({ loginSuccess: false });
        localStorage.removeItem('isLoggedIn'); // Remove the login status from localStorage
        localStorage.removeItem('roleType'); 
    };

    handleChangePage = (event, newPage) => {
      this.setState({ page: newPage });
  };

  handleChangeRowsPerPage = (event) => {
      this.setState({
          rowsPerPage: parseInt(event.target.value, 10),
          page: 0, // Reset page to the first page when changing rows per page
      });
  };


    render() {
      const { data, page, rowsPerPage } = this.state;

      // Calculate the start and end index for the current page
      const startIndex = page * rowsPerPage;
      const endIndex = startIndex + rowsPerPage;

      let pageData;
      // Slice the data array to display only the rows for the current page
      if(data.length){
         pageData = data.slice(startIndex, endIndex);
      }
      


      const headRows = [
        { id: 'VEHICLE_ID', alignment: 'left', disablePadding: false, label: "ID" },
        { id: 'VEHICLE_NUMBER', alignment: 'left', disablePadding: false, label: "Vechile Number" },
        { id: 'VEHICLE_TYPE', alignment: 'left', disablePadding: false, label: "Vechile Type" },
       
    ];
      return (
        <div>
          {
            this.state.SpinnerFlag ? <div className="SpinnerOpacity"><CircularProgress className="CircularProgressStyle" /></div> : null
          }
          {!this.state.loginSuccess ? (
            <Login />
          ) :


            <div>
              <DrawerComponent userRole={this.state.roleType} />
              <div className="content">
                <h3>Overview</h3>
                <Row>
                  {cards.map(card => {
                    return (
                      <Col lg="3" md="6" sm="6" key={card.order}>
                        <CustomCard heading={card.heading} count={card.count} icon={card.icon} color={card.color} />
                      </Col>
                    );
                  })}
                </Row>

              </div>
              <div>
                <hr></hr>
                </div>
              <Paper className="custom_paper">
            
                <div className="tableWrapper">
                  <h3>
                    Pending Gross Weight Vechile Report
                  </h3>
                        <Table aria-labelledby="tableTitle" size='medium'>
                            <TableHead className='table-head'>
                                <TableRow>
                                    {headRows.map(row => (
                                        <TableCell key={row.id}
                                            className={row.id === 'action' && this.props.editFlag === false ? 'hidden' : ''}
                                            align={row.alignment}
                                            style={{color: 'navajowhite' }}
                                            padding={row.disablePadding ? 'none' : 'default'}>
                                            {row.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {
                                    this.state.data.length ? pageData.map((SrvCnfg, index) => {

                                        return (
                                            <TableRow
                                                hover
                                                role="checkbox"
                                                tabIndex={-1}
                                            >

                                                <TableCell>{SrvCnfg.VEHICLE_ID}</TableCell>
                                                <TableCell>{SrvCnfg.VEHICLE_NUMBER}</TableCell>
                                                <TableCell>{SrvCnfg.VEHICLE_TYPE}</TableCell>
                                            </TableRow>
                                        );
                                    }) : <TableRow><TableCell colSpan={8} className="table_NoData_style">"No records found"</TableCell></TableRow>
                                }
                            </TableBody>
                        </Table>

                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={data.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onChangePage={this.handleChangePage}
                            onChangeRowsPerPage={this.handleChangeRowsPerPage}
                        />
                    </div>

                </Paper>

              <div>
                <button className="logout-button" onClick={this.handleLogout}> Logout</button>
              </div>
            </div>
          }
        </div>
        );
    }
}

export default Dashboard;