import { OrderActions } from '../actions/orders'
import Order from '../../models/order'
import { CartItemIf } from '../../components/shop/CartItem'

type OrderAction = {
    type: OrderActions,
    orderData: {
        id: string,
        items: CartItemIf[],
        amount: number,
        date: Date
    },
    ordersData: {
        [key: string]: {
            cartItems: CartItemIf[],
            date: Date,
            totalAmount: number
        }
    }
}

const initialState: {
    orders: Order[]
} = {
    orders: []
}

export default (state = initialState, action: OrderAction) => {
    switch (action.type) {
        case OrderActions.addOrder:
            const newOrder = new Order(
                action.orderData.id,
                action.orderData.items,
                action.orderData.amount,
                action.orderData.date
            )
            return {
                ...state,
                orders: state.orders.concat(newOrder)
            }
        case OrderActions.fetchOrders:
            let fetchedOrders = []
            for (let key in action.ordersData) {
                fetchedOrders.push(new Order(
                    key,
                    action.ordersData[key].cartItems,
                    action.ordersData[key].totalAmount,
                    action.ordersData[key].date
                ))
            }
            return {
                ...state,
                orders: fetchedOrders
            }
    }

    return state
}