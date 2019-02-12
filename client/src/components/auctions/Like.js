import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as auctionActions from '../../actions/auctionActions';

class LikeAuction extends Component {
    render() {
        const { user, auction } = this.props;

        if (String(user._id) === String(auction._user)) return null;
        
        return (
            <span className="like-auction">
                { 
                    user && !auction.ended && (
                        <i className="material-icons like-icon" 
                            onClick={ 
                                (e) => { 
                                    if (e.target.innerHTML.indexOf('outline') !== -1) {
                                        e.target.innerHTML = 'favorite';
                                        this.props.likeAuction(auction._id, true);
                                    } else {
                                        e.target.innerHTML = 'favorite_outline';
                                        this.props.likeAuction(auction._id, false);
                                    }
                                }
                            }
                        >
                            { auction.liked ? 'favorite' : 'favorite_outline' }
                        </i>
                    )
                }
            </span>
        );
    }
}

LikeAuction = connect(null, auctionActions)(LikeAuction);
export default LikeAuction;