import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Checkbox } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import TablePagination from '@material-ui/core/TablePagination';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import DriveFileRenameOutlineSharpIcon from '@mui/icons-material/DriveFileRenameOutlineSharp';
import * as XLSX from 'xlsx';


let searchFocusStyle = {};
class VechileMasterList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loginSuccess: true,
            roleType: '',
            data: [],
            page: 0,
            rowsPerPage: 10,
            SpinnerFlag: false
        }
    }

    componentDidMount() {
        this._mounted = true;
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
        if(role=='Admin'){
            fetch(`${process.env.REACT_APP_API_URL}/rfid/vehicleMaster/all`).then((response) => response.json()).then((response) => {
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
            fetch(`${process.env.REACT_APP_API_URL}/rfid/vehicleMaster/${localStorage.getItem('leaseCode')}`).then((response) => response.json()).then((response) => {
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

    filterList = (event) => {
        searchFocusStyle = {};
        let updatedList = this.state.data;
    
        updatedList = updatedList.filter(function (item) {
    
          let vechNumber = item.VEHICLE_NUMBER ? item.VEHICLE_NUMBER.toString().toLowerCase() : item.VEHICLE_NUMBER;
          let leaseCode = item.LEASE_CODE ? item.LEASE_CODE.toString().toLowerCase() : item.LEASE_CODE;
          let tagId = item.TAG_ID ? item.TAG_ID.toLowerCase() : item.TAG_ID;
          let searchedValue = vechNumber + leaseCode + tagId;
    
          return searchedValue.indexOf(event.target.value.toLowerCase()) !== -1;
    
        });
    
        this.setState({ data: updatedList});
        if (event.target.value) {
          searchFocusStyle = { width: '200px' };
          this.setState({ rowsPerPage: 10000, page: 0 })
        } else {
          this.getdata();
          this.setState({ rowsPerPage: 10, page: 0 })
        }
      };


    //Update API
    getSelectedData = (job) => {
        console.log("edit api should call");
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

    handleExportClick = () => {
        const { data } = this.state;
        
        const exportData = data.map((row) => ({
          'ID': row.ID,
          'Vechile Number': row.VEHICLE_NUMBER,
          "Tag ID": row.TAG_ID,
          "Vechile Type": row.VEHICLE_TYPE,
          'Lease Code': row.LEASE_CODE,
          'Modified Date': row.MODIFIED_DATE,
          'Tare Weight': row.TARE_WEIGHT,
          
        }));
    
        // Create a worksheet from the data
        const ws = XLSX.utils.json_to_sheet(exportData);
    
        // Create a workbook with the worksheet
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Exported Data');
    
        // Save the workbook as an XLSX file
        XLSX.writeFile(wb, 'exported_data.xlsx');
      };

    handleLogout = () => {

        this.setState({ loginSuccess: false });
        localStorage.removeItem('isLoggedIn'); // Remove the login status from localStorage
        localStorage.removeItem('roleType');
        window.location.reload(false)
    };



    render() {
        const { data, page, rowsPerPage } = this.state;

        // Calculate the start and end index for the current page
        const startIndex = page * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;

        // Slice the data array to display only the rows for the current page
        const pageData = data.slice(startIndex, endIndex);

        const headRows = [
            { id: 'VEHICLE_ID', alignment: 'left', disablePadding: false, label: "ID" },
            { id: 'VEHICLE_NUMBER', alignment: 'left', disablePadding: false, label: "Vechile Number" },
            { id: 'TAG_ID', alignment: 'left', disablePadding: false, label: "Tag ID" },
            { id: 'VEHICLE_TYPE', alignment: 'left', disablePadding: false, label: "Vechile Type" },
            { id: 'LEASE_CODE', alignment: 'left', disablePadding: false, label: "Lease Code" },
            { id: 'MODIFIED_DATE', alignment: 'left', disablePadding: false, label: "Modified Date" },
            { id: 'TARE_WEIGHT', alignment: 'left', disablePadding: false, label: "Tare Weight" },
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
                            <p className='dhpc-style'>Vechile Master</p>
                        </Typography>

                        <div style={{ flex: '1 1 35%' }} />
                        {
                            this.state.data ?
                                <div className="search-input-box mr10s">
                                    <input type="text" className="form-control" style={searchFocusStyle} placeholder="Search..." onChange={this.filterList}/>
                                    <i className="glyphicon glyphicon-search" />
                                </div> : null
                        }
                        <div style={{ flex: '-1 1 10%' }} />
                        <div className="right-panel-action">

                            <button type="button" className="mr-submit"  onClick={() => this.handleExportClick()}>
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
                                                <TableCell>{SrvCnfg.TAG_ID}</TableCell>
                                                <TableCell>{SrvCnfg.VEHICLE_TYPE}</TableCell>
                                                <TableCell>{SrvCnfg.LEASE_CODE}</TableCell>
                                                <TableCell>{SrvCnfg.MODIFIED_DATE}</TableCell>
                                                <TableCell>{SrvCnfg.TARE_WEIGHT}</TableCell>
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