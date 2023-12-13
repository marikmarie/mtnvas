import storage from 'redux-persist/lib/storage'
import { configureStore } from '@reduxjs/toolkit'
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist'
import authReducer from './slices/auth'
import navReducer from './slices/nav'
import itemsReducer from './slices/items'
import editReducer from './slices/edit'
import buyerReducer from './slices/buyer'
import xlxsReducer from './slices/xlxs'

const persistedNavReducer = persistReducer({ key: 'nav', storage }, navReducer)
const persistedAuthReducer = persistReducer({ key: 'auth', storage }, authReducer)

const store = configureStore({
	reducer: {
		auth: persistedAuthReducer,
		nav: persistedNavReducer,
		items: itemsReducer,
		edit: editReducer,
		buyer: buyerReducer,
		xlxs: xlxsReducer,
	},
	devTools: process.env.NODE_ENV !== 'production',
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
			},
		}),
})

export const persistor = persistStore(store)
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store
