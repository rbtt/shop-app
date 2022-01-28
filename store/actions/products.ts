import { ThunkDispatch } from 'redux-thunk'
import Product from '../../models/product'

export enum ProductActions {
    deleteProduct = 'DELETE_PRODUCT',
    createProduct = 'CREATE_PRODUCT',
    updateProduct = 'UPDATE_PRODUCT',
    fetchProducts = 'SET_PRODUCTS'
}

type FirebaseResponse = {
    [key: string]: {
        title: string,
        imageUrl: string,
        description: string,
        price: number
    }
}

export const fetchProducts = () => {
    return async (dispatch: any) => {
        try {
            const response = await fetch('https://rn-shop-app-c205f-default-rtdb.europe-west1.firebasedatabase.app/products.json')
            if (!response.ok) {
                throw new Error('Something went wrong with the server.')
            }
            const data: FirebaseResponse = await response.json()
            let transformedData = []
            for (let key in data) {
                transformedData.push(new Product(key, 'u1', data[key].title, data[key].imageUrl, data[key].description, data[key].price))
            }
            dispatch({ type: ProductActions.fetchProducts, payload: transformedData })
        } catch (err) {
            throw err
        }
    }
}

export const deleteProduct = (productId: string) => {
    return async (dispatch: any) => {
        const response = await fetch(`https://rn-shop-app-c205f-default-rtdb.europe-west1.firebasedatabase.app/products/${productId}.json`, {
            method: 'DELETE'
        })
        if (!response.ok) { throw new Error('Something went wrong while deleting..') }
        dispatch({ type: ProductActions.deleteProduct, pid: productId })
    }

}

export const createProduct = (
    title: string,
    imageUrl: string,
    price: number,
    description: string
) => {
    return async (dispatch: any) => {
        // any async code can be executed
        const response = await fetch('https://rn-shop-app-c205f-default-rtdb.europe-west1.firebasedatabase.app/products.json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, imageUrl, price, description })
        })
        const data = await response.json()
        dispatch({
            type: ProductActions.createProduct,
            payload: { id: data.name, title, imageUrl, price, description }
        })
    }
}

export const updateProduct = (
    id: string,
    title: string,
    imageUrl: string,
    price: number,
    description: string
) => {
    return async (dispatch: any) => {
        const response = await fetch(`https://rn-shop-app-c205f-default-rtdb.europe-west1.firebasedatabase.app/products/${id}.json`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, imageUrl, price, description })
        })
        if (!response.ok) {
            throw new Error('Something went wrong with the server.')
        }
        dispatch({
            type: ProductActions.updateProduct,
            pid: id,
            payload: { title, imageUrl, price, description }
        })
    }
}