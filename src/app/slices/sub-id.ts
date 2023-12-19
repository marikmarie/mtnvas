import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

const initialState = {
    subscriptionId: "",
};

const slice = createSlice( {
    name: "subId",
    initialState,
    reducers: {
        setSubscriptionId: ( state, action: PayloadAction<string> ) => {
            state.subscriptionId = action.payload;
        },
    },
} );

export const { setSubscriptionId } = slice.actions;
export const subscriptionId = ( state: RootState ) => state.subId.subscriptionId

export default slice.reducer
