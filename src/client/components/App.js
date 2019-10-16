
import React from 'react';
import { Route, Redirect } from 'react-router';
import { Containers } from '@opuscapita/service-base-ui';

import TestComponent from './TestComponent/TestComponent';

class App extends React.Component {
    render() {
        console.log('App.js rendering');
        return (
            <div>
            <Containers.ServiceLayout serviceName="email-gateway">
                <Route path="/test" component={TestComponent} />

                <Redirect from="/" to="/test" />
            </Containers.ServiceLayout>
            </div>
        )
    }
};

export default App;
