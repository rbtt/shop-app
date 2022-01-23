import { CartItemIf } from '../../components/shop/CartItem'

export enum OrderActions {
    addOrder = 'ADD_ORDER'
}

export const addOrder = (cartItems: CartItemIf[], totalAmount: number) => {
    return {
        type: OrderActions.addOrder,
        orderData: {
            items: cartItems,
            amount: totalAmount
        }
    }
}