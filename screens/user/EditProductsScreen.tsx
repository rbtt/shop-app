import { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Platform, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../App';
import { RootStackScreenProps } from '../../types';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/UI/HeaderButton'
import Product from '../../models/product';
import { createProduct, updateProduct } from '../../store/actions/products';

const EditProductsScreen = ({ route, navigation }: RootStackScreenProps<'EditProducts'>) => {
    const dispatch = useDispatch()

    let editingProduct: Product | undefined;
    if (route.params.productId) {
        editingProduct = useSelector((state: RootState) => {
            return state.products.userProducts.find(prod => prod.id === route.params.productId)
        })
    }
    const [title, setTitle] = useState(editingProduct ? editingProduct.title : '')
    const [imageUrl, setImageUrl] = useState(editingProduct ? editingProduct.imageUrl : '')
    const [price, setPrice] = useState(editingProduct ? editingProduct.price.toString() : '')
    const [description, setDescription] = useState(editingProduct ? editingProduct.description : '')

    const submitHandler = useCallback(() => {
        if (route.params.productId) {
            dispatch(updateProduct(route.params.productId, title, imageUrl, parseFloat(price), description))
            console.log('Updated')
            navigation.goBack()
        } else {
            dispatch(createProduct(title, imageUrl, parseFloat(price), description))
            console.log('Created New')
            navigation.goBack()
        }
    }, [dispatch, route.params.productId, title, imageUrl, price, description])
    useEffect(() => {
        navigation.setOptions({
            headerRight: () => {
                return <HeaderButtons HeaderButtonComponent={HeaderButton}>
                    <Item
                        title='Add'
                        iconName={Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'}
                        buttonStyle={{ paddingLeft: 0 }}
                        onPress={submitHandler}
                    />
                </HeaderButtons>
            },
            title: route.params.productId ? 'Edit Product' : 'Add Product'
        })
    }, [submitHandler])




    return (
        <ScrollView style={styles.screen}>
            <View style={styles.form}>
                <View style={styles.formControl}>
                    <Text style={styles.label}>Title</Text>
                    <TextInput style={styles.input} value={title} onChangeText={text => setTitle(text)} />
                </View>
                <View style={styles.formControl}>
                    <Text style={styles.label}>Image URL</Text>
                    <TextInput style={styles.input} value={imageUrl} onChangeText={text => setImageUrl(text)} />
                </View>
                <View style={styles.formControl}>
                    <Text style={styles.label}>Price</Text>
                    <TextInput style={styles.input} value={price} onChangeText={text => setPrice(text)} />
                </View>
                <View style={styles.formControl}>
                    <Text style={styles.label}>Description</Text>
                    <TextInput style={styles.input} value={description} onChangeText={setDescription} />
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    screen: {},
    form: {
        margin: 20
    },
    formControl: {
        width: '100%'
    },
    label: {
        fontFamily: 'open-sans-bold',
        marginVertical: 8
    },
    input: {
        paddingHorizontal: 2,
        paddingVertical: 5,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1
    }
})

export default EditProductsScreen