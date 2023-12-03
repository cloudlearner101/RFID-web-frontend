import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import DriveFileRenameOutlineSharpIcon from '@mui/icons-material/DriveFileRenameOutlineSharp';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';

import * as XLSX from 'xlsx';

let searchFocusStyle = {};
class PcConfigurationList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loginSuccess: true,
      roleType: '',
      data: [],
      page: 0,
      rowsPerPage: 10,
      SpinnerFlag: false
      
    };
    this._mounted = false;
  }

  componentDidMount() {
    this._mounted = true;
    this.getdata();
  };

  

  UNSAFE_componentWillMount() {
    this._mounted = true;
    
  };
  componentWillUnmount() {
    this._mounted = false;
  };


  getdata() {
    this.setState({ SpinnerFlag: true })
   
    fetch(`${process.env.REACT_APP_API_URL}/rfid/pcConfigDtls`).then((response) => response.json()).then((response) => {
      if (this._mounted) {
        if (response) {
          this.setState({ data: response.data })
        } else {
          this.setState({ data: undefined })
        }
      }
      this.setState({ SpinnerFlag: false })
    }).catch((error) => {
      this.setState({ SpinnerFlag: false })
     
    })
  };

  filterList = (event) => {
    searchFocusStyle = {};
    let updatedList = this.state.data;

    updatedList = updatedList.filter(function (item) {

      let userName = item.USER_NAME ? item.USER_NAME.toString().toLowerCase() : item.USER_NAME;
      let volumeKey = item.VOLUME_KEY ? item.VOLUME_KEY.toString().toLowerCase() : item.VOLUME_KEY;
      let leaseCode = item.LEASECODE ? item.LEASECODE.toLowerCase() : item.LEASECODE;
      //let sts = item.jobStatus ? item.jobStatus.toLowerCase() : item.jobStatus;
      let searchedValue = userName + volumeKey + leaseCode;

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
  getSelectedData = (data) => {
    
    fetch(`${process.env.REACT_APP_API_URL}/rfid/getPcConfigById/${data.ID}`).then((response) => response.json()).then((response) => {
      console.log("Response from edit api", response)
      if (response.data) {
        this.props.handlePages(false, 'EDIT', response.data)
      }
    }).catch((error) => {
      console.log(error)
    })
   
  };


  handleChangeRowsPerPage = (event) => {
    this.setState({
      rowsPerPage: parseInt(event.target.value, 10),
      page: 0, 
    });
  };

  handleChangePage = (event, newPage) => {
    this.setState({ page: newPage });
  };

 
  handleLogout = () => {
   
    this.setState({ loginSuccess: false });
    localStorage.removeItem('isLoggedIn'); // Remove the login status from localStorage
    localStorage.removeItem('roleType');
    window.location.reload(false)
  };


  handleExportClick = () => {
    const { data } = this.state;
    // Prepare data for export
    const exportData = data.map((row) => ({
      'ID': row.ID,
      'USER NAME': row.VOLUME_KEY,
      "PASSWORD": row.PASSWORD,
      "Volume Key": row.VOLUME_KEY,
      'API Access Key': row.API_ACCESS_KEY,
      'User Type': row.USER_TYPE,
      'Status': row.STATUS
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
      { id: 'id', alignment: 'left', disablePadding: false, label: "Id" },
      { id: 'userName', alignment: 'left', disablePadding: false, label: "User Name" },
      { id: 'password', alignment: 'left', disablePadding: false, label: "Password" },
      { id: 'volumeKey', alignment: 'left', disablePadding: false, label: "Volume Key" },
      { id: 'apiAccessKey', alignment: 'left', disablePadding: false, label: "API Access Key" },
      { id: 'userType', alignment: 'left', disablePadding: false, label: "User Type" },
      { id: 'status', alignment: 'left', disablePadding: false, label: "Status" },
      { id: 'leaseCode', alignment: 'left', disablePadding: false, label: "Lease Code" },
      { id: 'action', alignment: 'left', disablePadding: false, label: "Edit" }
    ];
    return (
      <div className="dashboard-container">
        {
          this.state.SpinnerFlag ? <div className="SpinnerOpacity"><CircularProgress className="CircularProgressStyle" /></div> : null
        }
        <div className='main-dhpc-export'>
          <Toolbar className="header">
            <Typography variant="h6" id="tableTitle">
              <p className='dhpc-style'>PC Configuratrion</p>
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

            <div style={{ flex: '-1 1 10%' }} />
            <div className="right-panel-action">
            <button type="button" className="mr-submit" onClick={() => this.props.handlePages(false, 'ADD')}>
            <p className='para-style'>+ Add New</p>
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

                        <TableCell>{SrvCnfg.ID}</TableCell>
                        <TableCell>{SrvCnfg.USER_NAME}</TableCell>
                        <TableCell>{SrvCnfg.PASSWORD}</TableCell>
                        <TableCell>{SrvCnfg.VOLUME_KEY}</TableCell>
                        <TableCell>{SrvCnfg.API_ACCESS_KEY}</TableCell>
                        <TableCell>{SrvCnfg.USER_TYPE}</TableCell>
                        <TableCell>{SrvCnfg.STATUS}</TableCell>
                        <TableCell>{SrvCnfg.LEASECODE}</TableCell>


                        {
                        this.props.editFlag ?
                        <TableCell align='left'>
                        <button className="btn p0">
                          <Tooltip title="Edit Config" placement="top">
                            <DriveFileRenameOutlineSharpIcon onClick={()=> this.getSelectedData(SrvCnfg)} />
                          </Tooltip>
                        </button>
                      </TableCell> : null
                      }

                        
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

export default PcConfigurationList