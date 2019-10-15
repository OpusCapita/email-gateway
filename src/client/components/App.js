
import React from 'react';
import { Route } from 'react-router';
import { Containers } from '@opuscapita/service-base-ui';

import TestComponent from './TestComponent/TestComponent';

class App extends React.Component {
    render() {
        return (
            <Containers.ServiceLayout serviceName="email-gateway">
                <Route exact path="/" component={TestComponent} />  
            </Containers.ServiceLayout>
        )
    }
};

export default App;
