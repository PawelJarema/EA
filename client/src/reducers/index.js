import { combineReducers } from 'redux';
import userReducer from './userReducer';
import categoryReducer from './categoryReducer';
import flashReducer from './flashReducer';
import authReducer from './authReducer';

export default combineReducers({
   user: userReducer,
   categories: categoryReducer,
   flash: flashReducer,
   emails: authReducer
});