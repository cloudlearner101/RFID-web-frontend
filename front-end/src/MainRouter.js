import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Login from './Pages/Login';
import Dashboard from './Pages/Page1/Dashboard';
import PcConfiguration from './Pages/PCConfiguration/PcConfiguration';
import PrivateRoute from './PrivateRoute';
import VehicleMovementReport from './Pages/VehicleMovementReport/VehicleMovementReport';
import VehicleMasterList from './Pages/VehicleMaster/VehicleMasterList';
import LotConfiguration from './Pages/LotMaster/LotConfiguration';
import InternalMasterList from './Pages/InternalmovementReport/InternalMovementReport';


function AuthenticateRoute({ component: Component, authenticated, authSuccessUrl, ...rest }) {
 
    return <Route exact render={props => (localStorage.getItem('isLoggedIn') === true ? <Redirect to={authSuccessUrl} /> : <Component {...props} />)} {...rest} />;
}



const MainRouter = (props) => (


    <Switch>
        <Route exact path="/" component={Login} />
        <Route path="/login" component={Login} />
        <AuthenticateRoute exact path='/' component={Login} authSuccessUrl="/Dashboard" />

        {console.log("console.log(localStorage.getItem('isLoggedIn'));____", localStorage.getItem('isLoggedIn'))}
        <PrivateRoute
            path="/Dashboard"
            component={Dashboard}
            isAuthenticated={localStorage.getItem('isLoggedIn')}
            {...props}
        // isAuthenticated={isAuthenticated}
        />

        <PrivateRoute
            path="/pcConfiguration"
            component={PcConfiguration}
            isAuthenticated={localStorage.getItem('isLoggedIn')}
            {...props}
        />

        <PrivateRoute
            path="/VehicleMovement"
            component={VehicleMovementReport}
            isAuthenticated={localStorage.getItem('isLoggedIn')}
            {...props}
        />

        <PrivateRoute
            path="/VehicleMaster"
            component={VehicleMasterList}
            isAuthenticated={localStorage.getItem('isLoggedIn')}
            {...props}
        />

        <PrivateRoute
            path="/VehicleMaster"
            component={VehicleMasterList}
            isAuthenticated={localStorage.getItem('isLoggedIn')}
            {...props}
        />

<PrivateRoute
            path="/internalMaster"
            component={InternalMasterList}
            isAuthenticated={localStorage.getItem('isLoggedIn')}
            {...props}
        />

        <PrivateRoute
            path="/lotConfiguration"
            component={LotConfiguration}
            isAuthenticated={localStorage.getItem('isLoggedIn')}
            {...props}
        />
    </Switch>




)

export default MainRouter;
