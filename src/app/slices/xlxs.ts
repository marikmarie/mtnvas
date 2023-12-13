import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export interface DS {
	fdn: string
	accountId: string
	subscriberId: string
	sellerReferenceNo: string
	createdDate: string
}

interface XLXS {
	loading: boolean
	dataSource: DS[]
}

const initialState: XLXS = {
	loading: false,
	dataSource: [],
}

const slice = createSlice({
	name: 'xlxs',
	initialState,
	reducers: {
		toggleLoading: state => {
			state.loading = !state.loading
		},

		setDataSource: (state, action: PayloadAction<DS[]>) => {
			console.log('action', action.payload)
			state.dataSource = action.payload
		},
	},
})

export const { toggleLoading, setDataSource } = slice.actions
export default slice.reducer
