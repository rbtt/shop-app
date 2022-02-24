import { ThunkDispatch } from 'redux-thunk'
import Product from '../../models/product'
import * as Notifications from 'expo-notifications'

export enum ProductActions {
  deleteProduct = 'DELETE_PRODUCT',
  createProduct = 'CREATE_PRODUCT',
  updateProduct = 'UPDATE_PRODUCT',
  fetchProducts = 'SET_PRODUCTS',
}

type FirebaseResponse = {
  [key: string]: {
    title: string
    imageUrl: string
    description: string
    price: number
    ownerId: string
    ownerPushToken: string
  }
}

export const fetchProducts = () => {
  return async (dispatch: any, getState: any) => {
    const userId = getState().auth.userId
    const response = await fetch(
      'https://rn-shop-app-c205f-default-rtdb.europe-west1.firebasedatabase.app/products.json'
    )
    if (!response.ok) {
      throw new Error('Something went wrong with the server.')
    }
    const data: FirebaseResponse = await response.json()
    let transformedData = []
    for (let key in data) {
      transformedData.push(
        new Product(
          key,
          data[key].ownerId,
          data[key].title,
          data[key].imageUrl,
          data[key].description,
          data[key].price,
          data[key].ownerPushToken
        )
      )
    }
    dispatch({
      type: ProductActions.fetchProducts,
      payload: transformedData,
      userProducts: transformedData.filter((prod) => prod.ownerId === userId),
    })
  }
}

export const deleteProduct = (productId: string) => {
  return async (dispatch: any, getState: any) => {
    const token = getState().auth.token
    const response = await fetch(
      `https://rn-shop-app-c205f-default-rtdb.europe-west1.firebasedatabase.app/products/${productId}.json?auth=${token}`,
      {
        method: 'DELETE',
      }
    )
    if (!response.ok) {
      throw new Error('Something went wrong while deleting..')
    }
    dispatch({ type: ProductActions.deleteProduct, pid: productId })
  }
}

export const createProduct = (
  title: string,
  imageUrl: string,
  price: number,
  description: string
) => {
  return async (dispatch: any, getState: any) => {
    // getting permissions and push token
    let pushToken
    const allowed = await Notifications.getPermissionsAsync()
    if (!allowed) {
      const data = await Notifications.requestPermissionsAsync()
      if (!data.granted) {
        pushToken = null
        console.log('Notification Permissions Denied!')
      }
    }
    pushToken = (await Notifications.getExpoPushTokenAsync()).data

    // storing product to firebase
    const token = getState().auth.token
    const userId = getState().auth.userId
    const response = await fetch(
      `https://rn-shop-app-c205f-default-rtdb.europe-west1.firebasedatabase.app/products.json?auth=${token}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          imageUrl,
          price,
          description,
          ownerId: userId,
          ownerPushToken: pushToken,
        }),
      }
    )
    const data = await response.json()

    dispatch({
      type: ProductActions.createProduct,
      payload: {
        id: data.name,
        title,
        imageUrl,
        price,
        description,
        ownerid: userId,
        pushToken,
      },
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
  return async (dispatch: any, getState: any) => {
    const token = getState().auth.token
    const response = await fetch(
      `https://rn-shop-app-c205f-default-rtdb.europe-west1.firebasedatabase.app/products/${id}.json?auth=${token}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, imageUrl, price, description }),
      }
    )
    if (!response.ok) {
      throw new Error('Something went wrong with the server.')
    }
    dispatch({
      type: ProductActions.updateProduct,
      pid: id,
      payload: { title, imageUrl, price, description },
    })
  }
}
