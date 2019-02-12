import React, { Component } from 'react';

class Page404 extends Component {
    render() {
        return (
            <div>
                <div className="no-result">
                    <i className="material-icons">build</i>
                    <h1>Błąd 404</h1>
                    <p>Strona o którą prosisz nie istnieje</p>
                </div>
            </div>
        )
    }
}

export { Page404 };