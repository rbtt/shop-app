export enum ProductActions {
    deleteProduct = 'DELETE_PRODUCT',
    createProduct = 'CREATE_PRODUCT',
    updateProduct = 'UPDATE_PRODUCT'
}

export const deleteProduct = (productId: string) => {
    return { type: ProductActions.deleteProduct, pid: productId }
}

export const createProduct = (
    title: string,
    imageUrl: string,
    price: number,
    description: string
) => {
    return {
        type: ProductActions.createProduct,
        payload: { title, imageUrl, price, description }
    }
}

export const updateProduct = (
    id: string,
    title: string,
    imageUrl: string,
    price: number,
    description: string
) => {
    return {
        type: ProductActions.updateProduct,
        pid: id,
        payload: { title, imageUrl, price, description }
    }
}