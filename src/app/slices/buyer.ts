import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface Buyer{
    buyerLegalName:string,
    buyerPlaceOfBusi:string, //This is how MAD-API names it. Is it a typo? Hmm.... Maybe or maybe not
    buyerMobilePhone:string
    buyerAddress:string
    buyerBusinessName:string
}

const initialState: Buyer = {
    buyerLegalName:"",
    buyerPlaceOfBusi:"",
    buyerMobilePhone:"",
    buyerAddress:"",
    buyerBusinessName:""
}

const slice = createSlice({
    name: 'buyer',
    initialState,
    reducers: {
        setLegalName: (state, action: PayloadAction<string>) => {
            state.buyerLegalName = action.payload
        },
        setPlaceOfBusi: (state, action: PayloadAction<string>) => {
            state.buyerPlaceOfBusi = action.payload
        },
        setMobilePhone: (state, action: PayloadAction<string>) => {
            state.buyerMobilePhone = action.payload
        },
        setBuyerAddress: (state, action: PayloadAction<string>) => {
            state.buyerAddress = action.payload
        },
        setBuyerBusinessName: (state, action: PayloadAction<string>) => {
            state.buyerBusinessName = action.payload
        },
    }
})

export const actions = slice.actions
export default slice.reducer
