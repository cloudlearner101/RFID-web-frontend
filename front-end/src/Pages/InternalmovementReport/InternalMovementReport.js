import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TablePagination from '@material-ui/core/TablePagination';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

import * as XLSX from 'xlsx';


class InternalMasterList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loginSuccess: true,
            totalNetWeight:0,
            roleType: '',
            data: [],
            page: 0,
            rowsPerPage: 10,
            startDate: new Date(),
            endDate: new Date(),
            SpinnerFlag: false
        }
    }

    componentDidMount() {
        this._mounted = true;
        // console.log("hello")
        this.getdata();
    };

    componentWillUnmount() {
        this._mounted = false;
    };


    getdata() {
        this.setState({ SpinnerFlag: true })
        
        let role = localStorage.getItem('roleType');
        if (role === 'Admin') {
            fetch(`${process.env.REACT_APP_API_URL}/rfid/internalVehicleMovement/all`).then((response) => response.json()).then((response) => {
                if (this._mounted) {
                    if (response) {
                        this.setState({ data: response.data })
                        const totalNetWeight = response.data.reduce((sum, row) => sum + (parseFloat(row.NET_WEIGHT) || 0), 0);
                        this.setState({ totalNetWeight: totalNetWeight})
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
            fetch(`${process.env.REACT_APP_API_URL}/rfid/internalVehicleMovement/${localStorage.getItem('leaseCode')}`).then((response) => response.json()).then((response) => {
                if (this._mounted) {
                    if (response) {
                        this.setState({ data: response.data })
                        const totalNetWeight = response.data.reduce((sum, row) => sum + (parseFloat(row.NET_WEIGHT) || 0), 0);
                        this.setState({ totalNetWeight: totalNetWeight})
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
        let role = localStorage.getItem('roleType');
        if (role === 'Admin') {
            fetch(`${process.env.REACT_APP_API_URL}/rfid/getIvmByDate?startDate=${startDate}&endDate=${endDate}`,payload).then((response) => response.json()).then((response) => {
                if (response) {
                    if(response.message === "No data found for the given Lease Code and date range"){
                        alert("No Details Found for the Given Date Range")
                        this.setState({ SpinnerFlag: false })
                    }
                    else{
                        this.setState({ data: response.data})
                        this.setState({ SpinnerFlag: false })
                        const totalNetWeight = response.data.reduce((sum, row) => sum + (parseFloat(row.NET_WEIGHT) || 0), 0);
                        this.setState({ totalNetWeight: totalNetWeight})
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
        }
        else{
        fetch(`${process.env.REACT_APP_API_URL}/rfid/getIvmByLeaseCodeAndDate?leaseCode=${leaseCode}&startDate=${startDate}&endDate=${endDate}`,payload).then((response) => response.json()).then((response) => {
            if (response) {
                if(response.message === "No data found for the given Lease Code and date range"){
                    alert("No Details Found for the Given Date Range")
                    this.setState({ SpinnerFlag: false })
                }
                else{
                    this.setState({ data: response.data})
                    this.setState({ SpinnerFlag: false })
                    const totalNetWeight = response.data.reduce((sum, row) => sum + (parseFloat(row.NET_WEIGHT) || 0), 0);
                    this.setState({ totalNetWeight: totalNetWeight})
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
       }
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
    
        // Calculate the total net weight
        const totalNetWeight = data.reduce((sum, row) => sum + (parseFloat(row.NET_WEIGHT) || 0), 0);
    
        // Prepare the export data
        const exportData = data.map((row) => ({
          'SL NO': row.ID,
          'Vehicle Number': row.VEHICLE_NUMBER,
          'Type of Material': row.MATERIAL_TYPE,
          'Tare Weight': row.TARE_WEIGHT,
          'Gross Weight': row.GROSS_WEIGHT,
          'Net Weight': row.NET_WEIGHT,
          'Tare Date & Time': row.JOURNEY_START_DATE,
          'Gross Date & Time': row.JOURNEY_END_DATE
        }));
    
        // Add the total row
        exportData.push({
          'SL NO': '',
          'Vehicle Number': '',
          'Type of Material': '',
          'Tare Weight': '',
          'Gross Weight': '',
          'Net Weight': `Total: ${totalNetWeight.toFixed(2)}`,
          'Journey Start Date': '',
          'Journey End Date': ''
        });
    
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
            { id: 'SL_NO', alignment: 'left', disablePadding: false, label: "SL NO" },
            { id: 'VEHICLE_NUMBER', alignment: 'left', disablePadding: false, label: "Vehicle Number" },
            { id: 'MATERIAL_TYPE', alignment: 'left', disablePadding: false, label: "Material Type" },
            { id: 'TARE_WEIGHT', alignment: 'left', disablePadding: false, label: "Tare Weight" },
            { id: 'GROSS__WEIGHT', alignment: 'left', disablePadding: false, label: "Gross Weight" },
            { id: 'NET_WEIGHT', alignment: 'left', disablePadding: false, label: "Net Weight" },
            { id: 'TARE_DATE_TIME', alignment: 'left', disablePadding: false, label: "TARE DATE TIME" },
            { id: 'GROSS_DATE_TIME', alignment: 'left', disablePadding: false, label: "GROSS DATE TIME" }
        ];
        return (
            <div className="dashboard-container">
                {
                        this.state.SpinnerFlag ? <div className="SpinnerOpacity"><CircularProgress className="CircularProgressStyle" /></div> : null
                    }
                <div className='main-dhpc-export'>
                    <Toolbar className="header">
                        <Typography variant="h6" id="tableTitle">
                            <p className='dhpc-style'>Internal Movement Report</p>
                        </Typography>

                        <div style={{ flex: '1 1 10%' }} />
                        <p className='total-net-weight'>Total Net Weight</p>
                        <div className="right-panel-action">
                            <input
                                type='text'
                                value={this.state.totalNetWeight}
                                readOnly
                                className="netWeight"
                            />
                            
                        </div>
                        <div className="right-panel-action">
                            <p className="mt">MT</p>
                        </div>
                        
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
                                            color='sienna'
                                            style={{color: 'sienna',fontWeight: 'bold' }}
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
                                                <TableCell>{SrvCnfg.MATERIAL_TYPE}</TableCell>
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

export default InternalMasterList;