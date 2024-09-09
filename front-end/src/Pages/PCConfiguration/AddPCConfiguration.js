import React, { Component } from 'react';

class AddPCConfiguration extends Component {

  constructor(props) {
    super(props);
    this.state = {
      inProgressFlag: false,

      PCConfigData: {
        ID: 0,
        username: '',
        password: '0',
        volumekey: '',
        apiAccessKey: '',
        userType: '',
        status: '',
        leaseCode : ''
      },
    }

  };

  UNSAFE_componentWillMount() {
    if (this.props.actionMode === 'EDIT') {
        const obj = { ...this.props.confiuredPcConfigDtata };
        // Update the state correctly
        this.setState({
            PCConfigData: {
                ...this.state.PCConfigData,
                username: obj.USER_NAME,
                password : obj.PASSWORD, 
                volumekey: obj.VOLUME_KEY, 
                apiAccessKey: obj.API_ACCESS_KEY ,
                userType : obj.USER_TYPE, 
                status : obj.STATUS, 
                id : obj.ID,
                leaseCode : obj.LEASECODE
            }
        });
    }
};


  handleSchedulerPages = (val, mode, data) => {
    this.setState({ schedulerPageStatus: val, ActionMode: mode, ConfiguredSchedulerData: data });
  };

  handleSaveData = (data) => {
    if (this.props.actionMode === 'ADD') {
      return new Promise((resolve, reject) => {
        fetch(`${process.env.REACT_APP_API_URL}/rfid/addNewUser`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.state.PCConfigData)
        })
          .then((response) => response.json()).then((response) => {
            if (response.addUser.successFlag === "1") {
              alert("User Added Successfully!!")
              this.props.handlePages(true)
            }
            if (response.addUser.successFlag === "0") {
              alert("Missing Required Fields!!")
              this.props.handlePages(true)
            }
          }).catch((error) => {

          })
      });

    } else if (this.props.actionMode === 'EDIT') {
      return new Promise((resolve, reject) => {
        fetch(`${process.env.REACT_APP_API_URL}/rfid/modifyUser/${this.state.PCConfigData.id}`, {
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.state.PCConfigData)
        })
          .then((response) => response.json()).then((response) => {
            if (response.userId) {
              alert("User Data Updated Successfully!!")
              this.props.handlePages(true)
            }
          
          }).catch((error) => {

          })
      });
    }

  }


  // Method to set ID in the state
  setID = (value) => {
    this.setState((prevState) => ({
      PCConfigData: {
        ...prevState.PCConfigData,
        id: value,
      },
    }));
  };

  // Method to set USER_NAME in the state
  setUserName = (value) => {
    this.setState((prevState) => ({
      PCConfigData: {
        ...prevState.PCConfigData,
        username: value,
      },
    }));
  };

  // Method to set PASSWORD in the state
  setPassword = (value) => {
    this.setState((prevState) => ({
      PCConfigData: {
        ...prevState.PCConfigData,
        password: value,
      },
    }));
  };

  // Method to set ACCESS_KEY in the state
  setAccessKey = (value) => {
    this.setState((prevState) => ({
      PCConfigData: {
        ...prevState.PCConfigData,
        apiAccessKey: value,
      },
    }));
  };

  // Method to set LEASE_CODE in the state
  setLeaseCode = (value) => {
    this.setState((prevState) => ({
      PCConfigData: {
        ...prevState.PCConfigData,
        leaseCode: value,
      },
    }));
  };

  // Method to set LOGIN_TYPE in the state
  setLoginType = (value) => {
    this.setState((prevState) => ({
      PCConfigData: {
        ...prevState.PCConfigData,
        userType: value,
      },
    }));
  };

  // Method to set VOLUME_KEY in the state
  setVolumeKey = (value) => {
    this.setState((prevState) => ({
      PCConfigData: {
        ...prevState.PCConfigData,
        volumekey: value,
      },
    }));
  };

  // Method to set STATUS in the state
  setStatus = (value) => {
    this.setState((prevState) => ({
      PCConfigData: {
        ...prevState.PCConfigData,
        status: value,
      },
    }));
  };


 
  render() {
    const { PCConfigData } = this.state;
    return (
      <React.Fragment>
        <div className="tableTitle">
         <h3 className='label-bold'>ADD PC Configuration</h3>
         </div>
        <div className="step">

          <div className="col-xs-10 col-sm-10 col-lg-10 config-block bc-color">

            <div class="flex-container bc-color">
              <div className="col-xs-12 col-sm-6 col-md-6 flex-width">
                <label className='label-bold'>ID</label>
                <div className="col-xs-12 col-sm-8 col-lg-8 text-box" >
                  <input type="text" className="form-control"
                    autoComplete="off"
                    required
                    disabled={this.props.actionMode === 'EDIT'}
                    value={PCConfigData.id}
                    onChange={(e) => this.setID(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-xs-12 col-sm-6 col-md-6 flex-width">
                <label className='label-bold' >User Name</label>
                <div className="col-xs-12 col-sm-8 col-lg-8 text-box" >
                  <input type="text" className="form-control"
                    autoComplete="off"
                    required
                    value={PCConfigData.username}
                    onChange={(e) => this.setUserName(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-xs-12 col-sm-6 col-md-6 flex-width">
                <label className='label-bold'>Password</label>
                <div className="col-xs-12 col-sm-8 col-lg-8 text-box" >
                  <input type="text" className="form-control"
                    autoComplete="off"
                    required
                    value={PCConfigData.password}
                    onChange={(e) => this.setPassword(e.target.value)}
                  />
                </div>
              </div>


              <div className="col-xs-12 col-sm-6 col-md-6 flex-width">
                <label className='label-bold'>Access key</label>
                <div className="col-xs-12 col-sm-8 col-lg-8 text-box" >
                  <input type="text" className="form-control"
                    autoComplete="off"
                    required
                    value={PCConfigData.apiAccessKey}
                    onChange={(e) => this.setAccessKey(e.target.value)}
                  />
                </div>
              </div>


              <div className="col-xs-12 col-sm-6 col-md-6 flex-width">
                <label className='label-bold'>Lease Code</label>
                <div className="col-xs-12 col-sm-8 col-lg-8 text-box" >
                  <input type="text" className="form-control"
                    autoComplete="off"
                    required
                    value={PCConfigData.leaseCode}
                    onChange={(e) => this.setLeaseCode(e.target.value)}
                  />
                </div>
              </div>


              <div className="col-xs-12 col-sm-6 col-md-6 flex-width">
                <label className='label-bold'>Login Type</label>
                <div className="col-xs-12 col-sm-8 col-lg-8 text-box" >
                  <input type="text" className="form-control"
                    autoComplete="off"
                    required
                    value={PCConfigData.userType}
                    onChange={(e) => this.setLoginType(e.target.value)}

                  />
                </div>
              </div>


              <div className="col-xs-12 col-sm-6 col-md-6 flex-width">
                <label className='label-bold' >Volume Key</label>
                <div className="col-xs-12 col-sm-8 col-lg-8 text-box" >
                  <input type="text" className="form-control"
                    autoComplete="off"
                    required
                    value={PCConfigData.volumekey}
                    onChange={(e) => this.setVolumeKey(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-xs-12 col-sm-6 col-md-6 flex-width">
                <label className='label-bold'>Status</label>
                <div className="col-xs-12 col-sm-8 col-lg-8 text-box" >
                  <input type="text" className="form-control"
                    autoComplete="off"
                    required
                    value={PCConfigData.status}
                    onChange={(e) => this.setStatus(e.target.value)}
                  />
                </div>
              </div>


            </div>


          </div>
        </div>

        <div className="col-xs-12 col-xs-12 col-sm-12 col-lg-12 ntf-form-footer button-right">
          <button type="button" className="save-submit" onClick={this.handleSaveData} >
            Save
          </button>
          <button type="button" className="cancel-submit" onClick={() => this.props.handlePages(true)}>
            Cancel
          </button>
        </div>


      </React.Fragment>
    );
  }
}

export default AddPCConfiguration;