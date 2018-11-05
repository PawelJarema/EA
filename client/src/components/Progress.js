import React, { Component } from 'react';
import './Progress.css'

class Progress extends Component {
    render() {
        return (
            <div className="progressScreen">
                <div className="progress-circle"></div>
            </div>
        );
    }
}

export default Progress;