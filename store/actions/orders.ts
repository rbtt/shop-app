import { CartItemIf } from '../../components/shop/CartItem'

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
  }
}
