import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Checkbox } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import TablePagination from '@material-ui/core/TablePagination';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import CircularProgress from '@material-ui/core/CircularProgress';
import DriveFileRenameOutlineSharpIcon from '@mui/icons-material/DriveFileRenameOutlineSharp';

import * as XLSX from 'xlsx';


class VechileMasterList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loginSuccess: true,
            roleType: '',
            data: [],
            page: 0,
            rowsPerPage: 10,
            startDate: new Date,
            endDate: new Date,
            SpinnerFlag: false
        }
    }

    componentDidMount() {
        this._mounted = true;
        console.log("hello")
        this.getdata();
    };

    componentWillUnmount() {
        this._mounted = false;
    };


    getdata() {
        this.setState({ SpinnerFlag: true })
        const payload = {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': "application/json",
                'Access-Control-Allow-Origin': '*'
            }
        };
        let role = localStorage.getItem('roleType');
        if (role == 'Admin') {
            fetch(`${process.env.REACT_APP_API_URL}/rfid/vehicleMovement/all`).then((response) => response.json()).then((response) => {
                if (this._mounted) {
                    if (response) {
                        this.setState({ data: response.data })
                    } else {
                        this.setState({ data: undefined })
                    }
                }
                this.setState({ SpinnerFlag: false })
            }).catch((error) => {
                console.log(error)
                this.setState({ SpinnerFlag: false })
            })
        }
        else{
            this.setState({ SpinnerFlag: true })
            fetch(`${process.env.REACT_APP_API_URL}/rfid/vehicleMovement/${localStorage.getItem('leaseCode')}`).then((response) => response.json()).then((response) => {
                if (this._mounted) {
                    if (response) {
                        this.setState({ data: response.data })
                    } else {
                        this.setState({ data: undefined })
                    }
                }
                this.setState({ SpinnerFlag: false })
            }).catch((error) => {
                this.setState({ data: undefined })
                this.setState({ SpinnerFlag: false })
            })
        }
    };


    getdataByDates= () => {
        let startDate = this.state.startDate;
        let endDate = this.state.endDate;
        let leaseCode = localStorage.getItem('leaseCode')
        this.setState({ SpinnerFlag: true })
        const payload = {
          method: "GET",
          headers: {
            'Accept': 'application/json',
            'Content-Type': "application/json",
            'Access-Control-Allow-Origin': '*'
          }
        };
        fetch(`${process.env.REACT_APP_API_URL}/rfid/getVmByLeaseCodeAndDate?leaseCode=${leaseCode}&startDate=${startDate}&endDate=${endDate}`,payload).then((response) => response.json()).then((response) => {
            if (response) {
                if(response.message == "No data found for the given Lease Code and date range"){
                    alert("No Details Found for the Given Date Range")
                    this.setState({ SpinnerFlag: false })
                }
                else{
                    this.setState({ data: response.data})
                    this.setState({ SpinnerFlag: false })
                }
              
            } else {
              this.setState({ data: [] })
              this.setState({ SpinnerFlag: false })
              alert("No Details Found for the Given Date Range")

            }
    
        }).catch((error) => {
            this.setState({ SpinnerFlag: false })
          console.log(error)
        })
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


    handleLogout = () => {
        this.setState({ loginSuccess: false });
        localStorage.removeItem('isLoggedIn'); // Remove the login status from localStorage
        localStorage.removeItem('roleType');
        window.location.reload(false)
    };


    handleStartDateChange = (e) => {
        const startDate = e.target.value;
        if (startDate <= this.state.endDate) {
            this.setState({ startDate });
        } else {
            this.setState({ startDate, endDate: startDate });
        }
    };

    handleEndDateChange = (e) => {
        const endDate = e.target.value;
        if (endDate >= this.state.startDate) {
            this.setState({ endDate });
        } else {
            this.setState({ endDate, startDate: endDate });
        }
    };

    handleExportClick = () => {
        const { data } = this.state;
        
        const exportData = data.map((row) => ({
          'ID': row.ID,
          'Vechile Number': row.VEHICLE_NUMBER,
          "Vechile Type": row.VEHICLE_TYPE,
          "Tag ID": row.TAG_ID,
          'Transporter Name': row.TRANSPORTER_NAME,
          'Tare Weight': row.TARE_WEIGHT,
          'Gross Weight': row.GROSS_WEIGHT,
          'Net Weight' :row.NET_WEIGHT,
          'Journey Start Date' : row.JOURNEY_START_DATE,
          'Journey End Date' : row.JOURNEY_END_DATE 
        }));
    
        // Create a worksheet from the data
        const ws = XLSX.utils.json_to_sheet(exportData);
    
        // Create a workbook with the worksheet
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Exported Data');
    
        // Save the workbook as an XLSX file
        XLSX.writeFile(wb, 'exported_data.xlsx');
      };


    render() {
        const { data, page, rowsPerPage } = this.state;

        // Calculate the start and end index for the current page
        const startIndex = page * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;

        // Slice the data array to display only the rows for the current page
        const pageData = data.slice(startIndex, endIndex);

        const headRows = [
            { id: 'ID', alignment: 'left', disablePadding: false, label: "ID" },
            { id: 'VEHICLE_NUMBER', alignment: 'left', disablePadding: false, label: "Vechile Number" },
            { id: 'VEHICLE_TYPE', alignment: 'left', disablePadding: false, label: "Vechile Type" },
            { id: 'TAG_ID', alignment: 'center', disablePadding: false, label: "Tag ID" },
            { id: 'TRANSPORTER_NAME', alignment: 'left', disablePadding: false, label: "Transporter Name" },
            { id: 'TARE_WEIGHT', alignment: 'left', disablePadding: false, label: "Tare Weight" },
            { id: 'GROSS_WEIGHT', alignment: 'left', disablePadding: false, label: "Gross Weight" },
            { id: 'NET_WEIGHT', alignment: 'left', disablePadding: false, label: "Net Weight" },
            { id: 'JOURNEY_START_DATE', alignment: 'left', disablePadding: false, label: "Journey Start Date" },
            { id: 'JOURNEY_END_DATE', alignment: 'left', disablePadding: false, label: "Journey End Date" },
            // { id: 'action', alignment: 'left', disablePadding: false, label: "Edit" }
        ];
        return (
            <div className="dashboard-container">
                {
                        this.state.SpinnerFlag ? <div className="SpinnerOpacity"><CircularProgress className="CircularProgressStyle" /></div> : null
                    }
                <div className='main-dhpc-export'>
                    <Toolbar className="header">
                        <Typography variant="h6" id="tableTitle">
                            <p className='dhpc-style'>Vechile Movement Report</p>
                        </Typography>

                        <div style={{ flex: '1 1 35%' }} />
                        <div className="right-panel-action">
                            <input
                                type='date'
                                value={this.state.startDate}
                                onChange={this.handleStartDateChange}
                                className="date-input"
                            />
                        </div>
                        <div className="right-panel-action">
                            <input
                                type='date'
                                value={this.state.endDate}
                                onChange={this.handleEndDateChange}
                                className="date-input"
                            />
                        </div>
                        <div className="right-panel-action">
                            <button type="button" className="mr-submit" onClick={this.getdataByDates} >
                                <p className='para-style'>Submit</p>
                            </button>
                        </div>
                        <div style={{ flex: '-1 1 10%' }} />
                        <div className="right-panel-action">

                            <button type="button" className="mr-submit"  onClick={() => this.handleExportClick()} >
                                <p className='para-style'>Export</p>
                            </button>
                        </div>

                    </Toolbar>
                </div>
                <hr></hr>
                <Paper className="custom_paper">
                    <div className="tableWrapper">
                        <Table aria-labelledby="tableTitle" size='medium'>
                            <TableHead className='table-head'>
                                <TableRow className='table-cell-head'>
                                    {headRows.map(row => (
                                        <TableCell  key={row.id}
                                            className={row.id === 'action' && this.props.editFlag === false ? 'hidden' : 'table-cell-head'}
                                            align={row.alignment}
                                            color='navajowhite'
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

                                                <TableCell>{SrvCnfg.ID}</TableCell>
                                                <TableCell>{SrvCnfg.VEHICLE_NUMBER}</TableCell>
                                                <TableCell>{SrvCnfg.VEHICLE_TYPE}</TableCell>
                                                <TableCell>{SrvCnfg.TAG_ID}</TableCell>
                                                <TableCell>{SrvCnfg.TRANSPORTER_NAME}</TableCell>
                                                <TableCell>{SrvCnfg.TARE_WEIGHT}</TableCell>
                                                <TableCell>{SrvCnfg.GROSS_WEIGHT}</TableCell>
                                                <TableCell>{SrvCnfg.NET_WEIGHT}</TableCell>
                                                <TableCell>{SrvCnfg.JOURNEY_START_DATE}</TableCell>
                                                <TableCell>{SrvCnfg.JOURNEY_END_DATE}</TableCell>
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
        );
    }
}

export default VechileMasterList;