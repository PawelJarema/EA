import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import RawImage from './RawImage';
import sizeMe from 'react-sizeme';
import { ImageProgress } from '../Progress';
import PriceHelper from '../../helpers/priceHelper';
import { auctionPath } from './functions';

import { IMAGE_ASPECT_RATIO } from './constants';

class AuctionPhoto extends Component {
    render() {
        const 
            { auction, height } = this.props;

        return (
            <div ref={(e) => this.photoRef = e} className="photo" style={ height ? { height } : null }>
                <ImageProgress />
                {
                    <RawImage link={auction} />
                }
            </div>
        );
    }
}

class Auction extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    onSize(size) {
        const height = size.width / IMAGE_ASPECT_RATIO;
        this.setState({ photoHeight: height });
    }

    render() {
        const 
            { auction } = this.props;

        if (!auction)
            return null;

        const current_price = auction.price.current_price || auction.price.start_price;

        return (
            <Link to={auctionPath(auction)}>
                <div className="auction">
                    <AuctionPhoto auction={ auction } onSize={ this.onSize.bind(this) } height={ this.state.photoHeight } />
                    <div className="title">
                        <h2>{auction.title}</h2>
                    </div>
                    <div className="description">
                        <p>{auction.shortdescription}</p>
                    </div>
                    <div className="price-div">
                        <span className="price">Aktualna cena: <span className="value">{ PriceHelper.write(current_price) }</span></span>
                    </div>
                </div>
            </Link>
        );
    }
}

AuctionPhoto = sizeMe({ monitorHeight: true })(AuctionPhoto);
export default Auction;