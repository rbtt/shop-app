import Product from "../../models/product"

export enum CartActions {
    removeFromCart = 'REMOVE_FROM_CART',
    addToCart = 'ADD_TO_CART'
}

export const addToCart = (product: Product) => {
    return {
        type: CartActions.addToCart,
        product
    }
}

export const removeFromCart = (productId: string) => {
    return {
        type: CartActions.removeFromCart,
        pid: productId
    }
}