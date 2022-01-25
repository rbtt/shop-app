import PRODUCTS from '../../data/dummy-data'
import Product from '../../models/product'
import { updateProduct, createProduct, deleteProduct, ProductActions } from '../actions/products'

export const initialState = {
    availableProducts: PRODUCTS,
    userProducts: PRODUCTS.filter(prod => prod.ownerId === 'u1')
}

export default function (state = initialState,
    action: {
        type: ProductActions
        pid?: string
        payload?: {
            title: string
            imageUrl: string
            price: number
            description: string
        }
    }): typeof initialState {
    switch (action.type) {
        case ProductActions.deleteProduct:
            return {
                ...state,
                userProducts: state.userProducts.filter(product => {
                    return product.id !== action.pid
                }),
                availableProducts: state.availableProducts.filter(product => {
                    return product.id !== action.pid
                })
            }
        case ProductActions.updateProduct:
            if (action.pid && action.payload) {
                const userIndex = state.userProducts.findIndex(
                    prod => prod.id === action.pid
                )
                const allProdIndex = state.availableProducts.findIndex(
                    prod => prod.id === action.pid
                )
                const updatedProduct = new Product(
                    action.pid,
                    state.userProducts[userIndex].ownerId,
                    action.payload.title,
                    action.payload.imageUrl,
                    action.payload.description,
                    action.payload.price
                )
                let updatedUserProducts = [...state.userProducts]
                updatedUserProducts[userIndex] = updatedProduct
                let updateAllProducts = [...state.availableProducts]
                updateAllProducts[allProdIndex] = updatedProduct
                return {
                    ...state,
                    availableProducts: updateAllProducts,
                    userProducts: updatedUserProducts
                }
            }
        case ProductActions.createProduct:
            if (action.payload) {
                const newProduct = new Product(
                    new Date().toISOString(),
                    'u1',
                    action.payload.title,
                    action.payload.imageUrl,
                    action.payload.description,
                    action.payload.price
                )
                return {
                    ...state,
                    availableProducts: state.availableProducts.concat(newProduct),
                    userProducts: state.userProducts.concat(newProduct)
                }
            }

    }

    return state
}