import React, { Component } from 'react';
import './Progress.css'


class ImageProgress extends Component {
    render() {
        return (
            <span className="image-progress">
                <span></span>
                <span></span>
                <span></span>
            </span>
        );
    }
}

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
export { ImageProgress };