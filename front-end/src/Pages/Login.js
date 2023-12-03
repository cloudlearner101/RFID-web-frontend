import React, { Component } from 'react';
import Dashboard from './Page1/Dashboard';
import '../css/style.css';


class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      loginSuccess: false,
      showPassword: false, // State variable for showing/hiding the password
      role: ''
    };
  }

  componentDidMount() {
    // Check if the user is already logged in using a cookie or other storage mechanism
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (isLoggedIn) {
      this.setState({ loginSuccess: true });
    }
  }

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  validateCredentials = async (userName, password) => {
    const payload = {
      username: userName,
      password: password
    }

    const response = await fetch(`${process.env.REACT_APP_API_URL}/rfid/webUI/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      alert("Invalid  login Credentials")
      window.location.reload(false);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response;
  }

  handleLogin = async (e) => {
    e.preventDefault(); // Prevent the form from being submitted
    const { username, password } = this.state;
    try{
      const res = await this.validateCredentials(username, password);
      const data = await res.json();
      if (data.outputJson.webUiLogin.successFlag === "1") {
        this.setState({ loginSuccess: true });
        this.setState({ role: data.outputJson.webUiLogin.aaData.USER_TYPE });
        localStorage.setItem('roleType', data.outputJson.webUiLogin.aaData.USER_TYPE);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('leaseCode', data.outputJson.webUiLogin.aaData.LEASECODE)
        localStorage.setItem('username', data.outputJson.webUiLogin.aaData.USER_NAME)
        window.location.reload(false);
      } else {
        alert('Invalid credentials');
      }
    }catch(error){
console.log("invalid credentials")
    }
   
  };
  

  handleShowPassword = () => {
    // Toggle the state to show/hide the password
    this.setState((prevState) => ({
      showPassword: !prevState.showPassword,
    }));
  };

  render() {
    const { showPassword } = this.state;
    return (
      <div>
        {this.state.loginSuccess ? (
          <Dashboard userRole={this.state.role}/>
        ) : (
          <div className="offset-lg-4 col-lg-4">
            <form className='container main-container'>
              <div className='card'>
                <div className='card-header1'>
                  <h1 className='h1-center'>Login</h1>
                </div>

                <div className='card-body'>
                  <div className='row'>
                    <div className='col-lg-12'>
                      <div className='form-group'>
                        <label className='label-adjust'>User Name <span className='mandatory-symbol'>*</span></label>
                        <input
                          className='form-control'
                          type="text"
                          name="username"
                          placeholder="Username"
                          onChange={this.handleInputChange}
                        />
                      </div>

                      <div className='col-lg-12 mt10'>
                        <div className='form-group'>
                          <label className='label-adjust'>Password <span className='mandatory-symbol'>*</span></label>
                          <input
                            className='form-control'
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            value={this.state.password}
                            onChange={this.handleInputChange}
                          />
                        </div>
                      </div>


                    <div className='show-pass mt10'>
                    <label className='label-adjust'>Show Password</label>
                          <input
                          className='show-checkbox'
                            type="checkbox"
                            onChange={this.handleShowPassword}
                          />
                    </div>

                    </div>
                  </div>
                </div>

                <div className='card-footer'>
                  <button type='submit' className='login-button' onClick={this.handleLogin}>Login</button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    );
  }
}

export default Login;
