import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

export type User = {
  email: "george.onen@mtn.com"
  name: "george onen"
  role: "CEX"
} | null;


export interface Auth {
  user: User;
  jwtToken?: string;
}

const initialState: Auth = {
  user: null,
  jwtToken: "",
};

const slice = createSlice( {
  name: "auth",
  initialState,
  reducers: {
    signin: ( state, action: PayloadAction<{ user: User }> ) => {
      state.user = action.payload.user;
    },
    signout: ( state ) => {
      state.user = null;
      state.jwtToken = "";
    },
  },
} );

export const { signin, signout } = slice.actions;
export const user = ( state: RootState ) => state.auth.user;
export const selectToken = ( state: RootState ) => state.auth.jwtToken;

export default slice.reducer
