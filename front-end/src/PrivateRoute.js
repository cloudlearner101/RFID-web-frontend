import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import DrawerComponent from './DrawerComponent';
import MainHeader from './MainHeader';

const PrivateRoute = ({ component: Component, isAuthenticated, ...rest }) => (
    
    <Route
        {...rest}
        
        render={(props) =>
            isAuthenticated ? <div>
                {console.log("private route is calling......", isAuthenticated)}
                <DrawerComponent />
                <Component {...props} />
            </div>
                : (
                    <Redirect to="/login" />
                )
        }
    />
);

export default PrivateRoute;
