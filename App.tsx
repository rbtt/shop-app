import { composeWithDevTools } from 'redux-devtools-extension'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import ReduxThunk from 'redux-thunk'
import { Provider } from 'react-redux'

import productsReducer from './store/reducers/products'
import cartReducer from './store/reducers/cart'
import orderReducer from './store/reducers/orders'
import authReducer from './store/reducers/auth'

import ShopNavigator from './navigation/ShopNavigator'
import * as Font from 'expo-font'
import AppLoading from 'expo-app-loading'
import { useState } from 'react'
import { LogBox } from 'react-native'

import * as Notifications from 'expo-notifications'

Notifications.setNotificationHandler({
  handleNotification: async() => {
    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true
    }
  }
})

const fetchFonts = () => {
  return Font.loadAsync({
    'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
    'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf'),
  })
}

const rootReducer = combineReducers({
  products: productsReducer,
  cart: cartReducer,
  orders: orderReducer,
  auth: authReducer,
})
export type RootState = ReturnType<typeof store.getState>

const store = createStore(rootReducer, applyMiddleware(ReduxThunk))
export type AppDispatch = typeof store.dispatch

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false)
  if (!fontLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onError={(err) => console.warn(err)}
        onFinish={() => setFontLoaded(true)}
      />
    )
  }
  LogBox.ignoreLogs(['Setting a timer'])
  return (
    <Provider store={store}>
      <ShopNavigator />
    </Provider>
  )
}
