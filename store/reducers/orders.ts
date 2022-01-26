import { OrderActions } from '../actions/orders'
import Order from '../../models/order'
import { addOrder } from '../actions/orders'

const initialState: {
    orders: Order[]
} = {
    orders: []
}

export default (state = initialState, action: ReturnType<typeof addOrder>) => {
    switch (action.type) {
        case OrderActions.addOrder:
            const newOrder = new Order(
                (Math.floor(Math.random() * 1000000) + 1).toString(),
                action.orderData.items,
                action.orderData.amount,
                new Date()
            )
            return {
                ...state,
                orders: state.orders.concat(newOrder)
            }
    }

    return state
}