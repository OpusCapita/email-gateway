
import React from 'react';
import { Route, Redirect } from 'react-router';
import { Containers } from '@opuscapita/service-base-ui';

import ServiceProfileEditor from './ServiceProfileEditor';
import ServiceProfileOverview from './ServiceProfileOverview'

class App extends React.Component {
    render() {
        return (
            <Containers.ServiceLayout serviceName='routing'>
                <Route path="/service-profile/edit(/:id)" component={ServiceProfileEditor} />
                <Route path="/service-profile/search" component={ServiceProfileOverview} />

                <Redirect from="/" to="/service-profile/search" />
            </Containers.ServiceLayout>
        )
    }
}

export default App;
