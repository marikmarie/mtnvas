import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

const initialState = {
	subscriptionId: '',
	serviceCode: '',
};

const slice = createSlice({
	name: 'bundleActivation',
	initialState,
	reducers: {
		setSubscriptionId: (state, action: PayloadAction<string>) => {
			state.subscriptionId = action.payload;
		},
		setServiceCode: (state, action: PayloadAction<string>) => {
			state.serviceCode = action.payload;
		},
	},
});

export const { setSubscriptionId, setServiceCode } = slice.actions;

export default slice.reducer;
