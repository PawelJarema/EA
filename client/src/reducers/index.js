import { combineReducers } from 'redux';
import userReducer from './userReducer';
import categoryReducer from './categoryReducer';
import flashReducer from './flashReducer';
import authReducer from './authReducer';
import auctionReducer from './auctionReducer';
import myAuctionReducer from './myAuctionReducer';
import statisticReducer from './statisticReducer';
import otherUserReducer from './otherUserReducer';
import opinionReducer from './opinionReducer';
import invoiceReducer from './invoiceReducer';
import chatReducer from './chatReducer';
import adminReducer from './adminReducer';
import adminPanelReducer from './adminPanelReducer';
import techBreakReducer from './techBreakReducer';
import adminDocumentReducer from './adminDocumentReducer';
import importExportReducer from './importExportReducer';
import cookieReducer from './cookieReducer';
import photosReducer from './photosReducer';
import lastAuctionReducer from './lastAuctionReducer';

export default combineReducers({
   admin: adminReducer,
   user: userReducer,
   categories: categoryReducer,
   flash: flashReducer,
   emails: authReducer,
   auctions: auctionReducer,
   my_auctions: myAuctionReducer,
   auction_count: statisticReducer,
   other_user: otherUserReducer,
   opinions: opinionReducer,
   invoices: invoiceReducer,
   chats: chatReducer,
   admin_panel: adminPanelReducer,
   tech_break: techBreakReducer,
   documents: adminDocumentReducer,
   exported: importExportReducer,
   cookies: cookieReducer,
   photos: photosReducer,
   last_auction: lastAuctionReducer
});