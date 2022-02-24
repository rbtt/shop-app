import PRODUCTS from '../../data/dummy-data'
import Product from '../../models/product'
import { ProductActions } from '../actions/products'

export const initialState: {
  availableProducts: Product[]
  userProducts: Product[]
} = {
  availableProducts: [],
  userProducts: [],
}

export default function (
  state = initialState,
  action: {
    type: ProductActions
    pid?: string
    payload:
      | {
          id: string
          title: string
          imageUrl: string
          price: number
          description: string
          ownerId: string
        }
      | any
    userProducts:
      | {
          id: string
          title: string
          imageUrl: string
          price: number
          description: string
          ownerId: string
        }
      | any
  }
): typeof initialState {
  switch (action.type) {
    case ProductActions.fetchProducts:
      return {
        ...state,
        availableProducts: action.payload as Product[],
        userProducts: action.userProducts as Product[],
      }
    case ProductActions.deleteProduct:
      return {
        ...state,
        userProducts: state.userProducts.filter((product: any) => {
          return product.id !== action.pid
        }),
        availableProducts: state.availableProducts.filter((product: any) => {
          return product.id !== action.pid
        }),
      }
    case ProductActions.updateProduct:
      if (action.pid && action.payload) {
        const userIndex = state.userProducts.findIndex(
          (prod: any) => prod.id === action.pid
        )
        const allProdIndex = state.availableProducts.findIndex(
          (prod) => prod.id === action.pid
        )
        const updatedProduct = new Product(
          action.pid,
          state.userProducts[userIndex].ownerId,
          action.payload.title,
          action.payload.imageUrl,
          action.payload.description,
          action.payload.price,
          action.payload.ownerPushToken
        )
        let updatedUserProducts = [...state.userProducts]
        updatedUserProducts[userIndex] = updatedProduct
        let updateAllProducts = [...state.availableProducts]
        updateAllProducts[allProdIndex] = updatedProduct
        return {
          ...state,
          availableProducts: updateAllProducts,
          userProducts: updatedUserProducts,
        }
      }
    case ProductActions.createProduct:
      if (action.payload) {
        const newProduct = new Product(
          action.payload.id,
          action.payload.ownerId,
          action.payload.title,
          action.payload.imageUrl,
          action.payload.description,
          action.payload.price,
          action.payload.ownerPushToken
        )
        return {
          ...state,
          availableProducts: state.availableProducts.concat(newProduct),
          userProducts: state.userProducts.concat(newProduct),
        }
      }
  }

  return state
}
