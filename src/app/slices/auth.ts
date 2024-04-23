import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

export type User = {
  name: string;
  email: string;
  role: string;
  createdAt: string;
} | null;

export interface Auth {
  user: User;
  token?: string;
}

const initialState: Auth = {
  user: null,
  token: "",
};

const slice = createSlice( {
  name: "auth",
  initialState,
  reducers: {
    signin: ( state, action: PayloadAction<Auth> ) => {
      console.log( "auth: ", action.payload )
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    signout: ( state ) => {
      state.user = null;
      state.token = "";
    },
  },
} );

export const { signin, signout } = slice.actions;
export const user = ( state: RootState ) => state.auth.user;
export const selectToken = ( state: RootState ) => state.auth.token;

export default slice.reducer
