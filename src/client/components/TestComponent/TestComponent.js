import React from 'react';
import { Components } from '@opuscapita/service-base-ui';

class TestComponent extends Components.ContextComponent {
    constructor(props) {
        super(props);
        this.state = {
            message: ''
        }
        console.log('from constructor');
    }
    componentDidMount() {
        this.setState({ message: 'work, woRK, WORK' })
        console.log('component did mount!');
    }

    render()
    {
        return(
            <div>
                <div className="nav">
                    <h1>{this.state.message}</h1>
                </div>
            </div>
        )
    }
};

export default TestComponent;