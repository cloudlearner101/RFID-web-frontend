import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Login from './Pages/Login';
import Dashboard from './Pages/Page1/Dashboard';
import PcConfiguration from './Pages/PCConfiguration/PcConfiguration';
import PrivateRoute from './PrivateRoute';
import VechileMovementReport from './Pages/VechileMovementReport/VechileMovementReport';
import VechileMasterList from './Pages/VechileMaster/VechileMasterList';



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
            path="/vechileMovement"
            component={VechileMovementReport}
            isAuthenticated={localStorage.getItem('isLoggedIn')}
            {...props}
        />

        <PrivateRoute
            path="/vechileMaster"
            component={VechileMasterList}
            isAuthenticated={localStorage.getItem('isLoggedIn')}
            {...props}
        />
    </Switch>




)

export default MainRouter;
