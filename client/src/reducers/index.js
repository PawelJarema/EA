import { combineReducers } from 'redux';
import userReducer from './userReducer';
import categoryReducer from './categoryReducer';
import flashReducer from './flashReducer';
import authReducer from './authReducer';
import auctionReducer from './auctionReducer';
import statisticReducer from './statisticReducer';
import otherUserReducer from './otherUserReducer';

export default combineReducers({
   user: userReducer,
   categories: categoryReducer,
   flash: flashReducer,
   emails: authReducer,
   auctions: auctionReducer,
   auction_count: statisticReducer,
   other_user: otherUserReducer
});