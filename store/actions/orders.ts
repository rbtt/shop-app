import { CartItemIf } from '../../components/shop/CartItem'
import * as Notifications from 'expo-notifications'

export enum OrderActions {
  addOrder = 'ADD_ORDER',
  fetchOrders = 'FETCH_ORDERS',
}

export const fetchOrders = () => {
  return async (dispatch: any, getState: any) => {
    try {
      const userId = getState().auth.userId
      const response = await fetch(
        `https://rn-shop-app-c205f-default-rtdb.europe-west1.firebasedatabase.app/orders/${userId}.json`
      )

      if (!response.ok) {
        throw new Error('Server Error')
      }

      const resData = await response.json()
      // console.log('from action: ', resData)
      await dispatch({
        type: OrderActions.fetchOrders,
        ordersData: resData,
      })
    } catch (err) {
      console.warn(err)
    }
  }
}

export const addOrder = (cartItems: CartItemIf[], totalAmount: number) => {
  return async (dispatch: any, getState: any) => {
    const token = getState().auth.token
    const userId = getState().auth.userId
    const date = new Date()
    const response = await fetch(
      `https://rn-shop-app-c205f-default-rtdb.europe-west1.firebasedatabase.app/orders/${userId}.json?auth=${token}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartItems,
          totalAmount,
          date: date.toISOString(),
        }),
      }
    )

    if (!response.ok) {
      throw new Error('Server Error')
    }
    const resData = await response.json()

    await dispatch({
      type: OrderActions.addOrder,
      orderData: {
        id: resData.name,
        items: cartItems,
        amount: totalAmount,
        date,
      },
    })

    for (let item of cartItems) {
      await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          host: 'exp.host',
          accept: 'application/json',
          'accept-encoding': 'gzip, deflate',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          to: item.ownerPushToken,
          title: `New Order for your item`,
          body: `${item.quantity}X ${item.productTitle} ordered`,
        }),
      })
    }
  }
}
