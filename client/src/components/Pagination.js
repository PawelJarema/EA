import React, { Component } from 'react';

class Pagination extends Component {
    render() {
        const { page, pages, clickHandler } = this.props;

        if (pages > 1) {
            return (
                <div className="pagination-wrapper">
                    <div className="pagination">
                        {
                            Array.from({length: pages}, (v, k) => (k + 1)).map(index => (
                                <a key={'page_' + index} 
                                    onClick={() => clickHandler(index)}
                                    className={index === page ? 'active' : ''}
                                >{index}</a>
                            ))
                        }
                    </div>
                </div>
            );
        } else {
            return null;
        }
    }
}

export { Pagination };