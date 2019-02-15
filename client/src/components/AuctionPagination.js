import React, { Component } from 'react';
import { DEFAULT, NEW, TITLE, CHEAP, EXPENSIVE, POPULAR, ENDING } from '../constants/sort';
import './Pagination.css';

class AuctionPagination extends Component {
    render() {
        const { page, pages, per_page, sort, clickHandler, sortCallback, perPageCallback } = this.props;

        if (pages < 1)
            return null;

        return (
            <div className="pagination-wrapper">
                <div className="pagination">
                    <span className="pagination-sort">
                        <select onChange={ (e) => sortCallback(e.target.value) } value={ (sort || DEFAULT) }>
                            <option>{ DEFAULT }</option>
                            <option>{ NEW }</option>
                            <option>{ TITLE }</option>
                            <option>{ CHEAP }</option>
                            <option>{ EXPENSIVE }</option>
                            <option>{ POPULAR }</option>
                            <option>{ ENDING }</option>
                        </select>
                        <span className="word">po</span>
                        <span>
                            <input type="number" min="1" max="50" step="1" onChange={ (e) => { perPageCallback(e.target.value) }} value={ per_page } />
                            ogłoszeń
                        </span>
                    </span>
                    <span className="pagination-pages">
                        <span>
                            strona
                            <input type="number" min="1" max={pages} step="1" onChange={ (e) => { clickHandler(e.target.value) }} value={ page } />
                            <span className="word">na</span>
                            <span className="word">
                                { pages }
                            </span>
                        </span>
                    </span>
                </div>
            </div>
        );
    }
}

export { AuctionPagination };