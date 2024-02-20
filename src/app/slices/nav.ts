import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import type { RootState } from '../store'

export type SEGMENT = string

interface Nav {
	collapsed: boolean
	activeLink: SEGMENT
}

const initialState: Nav = {
	collapsed: false,
	activeLink: 'invoices',
}

const slice = createSlice( {
	name: 'nav',
	initialState,
	reducers: {
		toggleNav: state => {
			state.collapsed = !state.collapsed
		},
		setCollapsedValue: ( state, action: PayloadAction<boolean> ) => {
			state.collapsed = action.payload.valueOf()
		},
		setActiveLink: ( state, action: PayloadAction<SEGMENT> ) => {
			state.activeLink = action.payload
		},
	},
} )

export const { toggleNav, setActiveLink, setCollapsedValue } = slice.actions
export const selectCollapsedValue = ( state: RootState ) => state.nav.collapsed
export const selectActiveLink = ( state: RootState ) => state.nav.activeLink
export default slice.reducer
