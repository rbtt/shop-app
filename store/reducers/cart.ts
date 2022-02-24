import Product from '../../models/product'
import CartItem from '../../models/cart-item'
import { CartActions } from '../actions/cart'
import { OrderActions } from '../actions/orders'
import { ProductActions } from '../actions/products'

const initialState: {
  items: {
    [key: Product['id']]: CartItem
  }
  totalAmount: number
} = {
  items: {},
  totalAmount: 0,
}

export default (
  state = initialState,
  action: { type: string; product?: Product; pid?: string }
): typeof initialState => {
  switch (action.type) {
    case CartActions.addToCart:
      if (action.product) {
        const addedProduct = action.product
        const prodPrice = addedProduct.price
        const prodTitle = addedProduct.title
        const ownerPushToken = addedProduct.ownerPushToken

        if (state.items[addedProduct.id]) {
          // already have the item in card
          const updatedCartItem = new CartItem(
            state.items[addedProduct.id].quantity + 1,
            prodPrice,
            prodTitle,
            state.items[addedProduct.id].sum + prodPrice,
            ownerPushToken
          )
          return {
            ...state,
            items: {
              ...state.items,
              [addedProduct.id]: updatedCartItem,
            },
            totalAmount: state.totalAmount + prodPrice,
          }
        } else {
          const newCartItem = new CartItem(1, prodPrice, prodTitle, prodPrice,ownerPushToken)
          return {
            ...state,
            items: {
              ...state.items,
              [addedProduct.id]: newCartItem,
            },
            totalAmount: state.totalAmount + prodPrice,
          }
        }
      }
    case CartActions.removeFromCart:
      if (action.pid) {
        const selectedCartItem = state.items[action.pid]
        const currentQty = selectedCartItem.quantity
        let updatedCartItems
        if (currentQty > 1) {
          // need to reduce the qty
          const updatedCartItem = new CartItem(
            selectedCartItem.quantity - 1,
            selectedCartItem.productPrice,
            selectedCartItem.productTitle,
            selectedCartItem.sum - selectedCartItem.productPrice,
            selectedCartItem.ownerPushToken
          )
          updatedCartItems = { ...state.items, [action.pid]: updatedCartItem }
        } else {
          updatedCartItems = { ...state.items }
          delete updatedCartItems[action.pid]
        }
        return {
          ...state,
          items: updatedCartItems,
          totalAmount: state.totalAmount - selectedCartItem.productPrice,
        }
      }
    case OrderActions.addOrder:
      return initialState
    case ProductActions.deleteProduct:
      if (!state.items[action.pid!]) {
        return state
      }
      const updatedItems = { ...state.items }
      const itemTotal = state.items[action.pid!].sum
      delete updatedItems[action.pid!]
      return {
        ...state,
        items: updatedItems,
        totalAmount: state.totalAmount - itemTotal,
      }
  }
  return state
}
