import React, { Component } from 'react';

class AddLotConfiguration extends Component {

  constructor(props) {
    super(props);
    this.state = {
      inProgressFlag: false,

      LotConfigData: {
        ID: 0,
        lotNumber: '',
        status: '0',
        leaseCode: ''
      },
    }

  };

  UNSAFE_componentWillMount() {
    if (this.props.actionMode === 'EDIT') {
        const obj = { ...this.props.confiuredLotConfigData };
        // Update the state correctly
        this.setState({
          LotConfigData: {
                ...this.state.LotConfigData,
                lotNumber: obj.LOT_NUMBER,
                status : obj.STATUS, 
                leaseCode: obj.LEASE_CODE, 
                id : obj.id
            }
        });
    }
};


  handleSaveData = (data) => {
    if (this.props.actionMode === 'ADD') {
      return new Promise((resolve, reject) => {
        fetch(`http://localhost:3001/rfid/insertLotNumber`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.state.LotConfigData)
        })
          .then((response) => response.json()).then((response) => {
            if (response.successFlag === "1") {
              alert("Lot Added Successfully!!");
              this.props.handlePages(true);  // Navigate to another page or update the UI
            } else if (response.successFlag === "0") {
              alert("Missing Required Fields!!");
              this.props.handlePages(true);  // Handle UI update if fields are missing
            } else {
              // Handling case when the successFlag is not 1 or 0
              alert(response.message || "Unknown error occurred");
            }
          }).catch((error) => {

          })
      });

    } else if (this.props.actionMode === 'EDIT') {
      return new Promise((resolve, reject) => {
        fetch(`http://localhost:3001/rfid/updateLotNumber/${this.state.LotConfigData.id}`, {
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.state.LotConfigData)
        })
          .then((response) => response.json()).then((response) => {
            if (response.successFlag === "1") {
              alert("Lot Data Updated Successfully!!");
              this.props.handlePages(true);  // Navigate to another page or update UI
            } else if (response.successFlag === "0") {
              alert("Error updating Lot data. Please try again.");
              this.props.handlePages(false);  // Handle UI update if there was an issue
            } else {
              // Handle cases when successFlag is not present or response format is unexpected
              alert(response.message || "Unknown error occurred");
            }
          }).catch((error) => {

          })
      });
    }

  }

  // Method to set ID in the state
  setID = (value) => {
    this.setState((prevState) => ({
      LotConfigData: {
        ...prevState.LotConfigData,
        id: value,
      },
    }));
  };

  // Method to set LOT_NUMBER in the state
  setLotNumber = (value) => {
    this.setState((prevState) => ({
      LotConfigData: {
        ...prevState.LotConfigData,
        lotNumber: value,
      },
    }));
  };

  // Method to set STATUS in the state
  setStatus = (value) => {
    this.setState((prevState) => ({
      LotConfigData: {
        ...prevState.LotConfigData,
        status: value,
      },
    }));
  };


  // Method to set LEASE_CODE in the state
  setLeaseCode = (value) => {
    this.setState((prevState) => ({
      LotConfigData: {
        ...prevState.LotConfigData,
        leaseCode: value,
      },
    }));
  };
 
  render() {
    const { LotConfigData } = this.state;
    return (
      <React.Fragment>
        <div className="tableTitle">
         <h3 className='label-bold'>ADD LOT NUMBER</h3>
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
                    value={LotConfigData.id}
                    onChange={(e) => this.setID(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-xs-12 col-sm-6 col-md-6 flex-width">
                <label className='label-bold' >LOT NUMBER</label>
                <div className="col-xs-12 col-sm-8 col-lg-8 text-box" >
                  <input type="text" className="form-control"
                    autoComplete="off"
                    required
                    value={LotConfigData.lotNumber}
                    onChange={(e) => this.setLotNumber(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-xs-12 col-sm-6 col-md-6 flex-width">
                <label className='label-bold'>STATUS</label>
                <div className="col-xs-12 col-sm-8 col-lg-8 text-box" >
                  <input type="text" className="form-control"
                    autoComplete="off"
                    required
                    value={LotConfigData.status}
                    onChange={(e) => this.setStatus(e.target.value)}
                  />
                </div>
              </div>


              <div className="col-xs-12 col-sm-6 col-md-6 flex-width">
                <label className='label-bold'>LEASE CODE</label>
                <div className="col-xs-12 col-sm-8 col-lg-8 text-box" >
                  <input type="text" className="form-control"
                    autoComplete="off"
                    required
                    value={LotConfigData.leaseCode}
                    onChange={(e) => this.setLeaseCode(e.target.value)}
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

export default AddLotConfiguration;