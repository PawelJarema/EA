import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Logo extends Component {
    render() {
        return (
            <Link to="/"><div className="logo"><img src="/assets/logo.png" alt="logo"/></div></Link>
        );
    }
}

export default Logo;