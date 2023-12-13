import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import {Item} from "../../typings/types";

const initialState = {
	goods: [] as Item[],
}

const slice = createSlice({
	name: 'items',
	initialState,
	reducers: {
		addSelected: (state, action: PayloadAction<Item[]>) => {
			const uniqueItemIds = new Set(state.goods.map(item => item.id));
			const filtered = action.payload.filter(item => !uniqueItemIds.has(item.id));
			state.goods = [...state.goods, ...filtered];
		},
		remove: (state, action: PayloadAction<{ id: string }>) => {
			state.goods = state.goods.filter(item => item.id !== action.payload.id)
		},
		addDiscount: (state, action: PayloadAction<{ name: string; discount: number }>) => {
			state.goods = state.goods.map(item => {
				if (item?.goodsCategoryName === action.payload.name) {
					return { ...item, discount: action.payload.discount }
				}
				return item
			})
		},
	},
})

export const { addSelected, addDiscount, remove } = slice.actions
export default slice.reducer
