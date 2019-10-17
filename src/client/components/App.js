
import React from 'react';
import { Route, Redirect } from 'react-router';
import { Containers } from '@opuscapita/service-base-ui';

import ServiceProfileOverview from './ServiceProfileOverview/ServiceProfileOverview';

class App extends React.Component {
    render() {
        return (
            <div>
            <Containers.ServiceLayout serviceName="email-gateway">
                <Route path="/ServiceProfileOverview" component={ServiceProfileOverview} />

                <Redirect from="/" to="/ServiceProfileOverview" />
            </Containers.ServiceLayout>
            </div>
        )
    }
};

export default App;
