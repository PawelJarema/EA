import React, { Component } from 'react';

class Pagination extends Component {
    render() {
        const { page, pages, clickHandler } = this.props;

        if (pages < 2)
            return null;

        let range = { from: 1, to: pages, shift: false };
        if (pages > 10) {
            range.shift = true;
            range.from = page < 6 ? 1 : page - 5;
            range.to = range.from + 11 > pages ? pages - range.from + 1 : 11;
        }
      
        return (
            <div className="pagination-wrapper">
                <div className="pagination">
                    {
                        range.shift && page > 1 && <a className="pagination-chevron" onClick={() => clickHandler(page - 1)}><i className="material-icons">chevron_left</i></a>
                    }
                    {
                        Array.from({length: range.to}, (v, k) => (k + range.from)).map(index => (
                            <a key={'page_' + index} 
                                onClick={() => clickHandler(index)}
                                className={index === page ? 'active' : ''}
                            >{index}</a>
                        ))
                    }
                    {
                        range.shift && page < pages && <a className="pagination-chevron" onClick={() => clickHandler(page + 1)}><i className="material-icons">chevron_right</i></a>
                    }
                </div>
            </div>
        );
    }
}

export { Pagination };