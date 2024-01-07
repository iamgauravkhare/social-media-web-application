import { combineReducers } from "@reduxjs/toolkit";

import userSlice from "./userSlice";
import authenticationSlice from "./authenticationSlice";

const rootReducer = combineReducers({
  authenticationData: authenticationSlice,
  userData: userSlice,
});

export default rootReducer;
