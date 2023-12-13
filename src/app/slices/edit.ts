import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type {Item} from "../../typings/types";

const initialState:{item:Item | null}= {
    item: null
}

const slice = createSlice({
    name: 'edit',
    initialState,
    reducers: {
        add: (state, action: PayloadAction<Item>) => {
            state.item = action.payload;
        },
        remove: (state,) => {
            state.item = null
        },
    },
})
export const { add, remove } = slice.actions
export default slice.reducer
