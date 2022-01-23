import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, Image, Button } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../App'
import { useEffect } from 'react';
import Colors from '../../constants/Colors';
import * as cartActions from '../../store/actions/cart'


const ProductDetails = (props: NativeStackScreenProps<any>) => {
    const dispatch = useDispatch()
    const product = useSelector((state: RootState) => {
        return state.products.availableProducts.find(prod => {
            return prod.id === props.route.params?.id
        })
    })

    // using params to avoid additional re-renders and using useEffect()
    useEffect(() => {
        props.navigation.setOptions({
            headerTitle: props.route.params?.title
        })
    }, [])

    return (
        <ScrollView>
            <StatusBar style='auto' />
            <Image source={{ uri: product?.imageUrl }} style={styles.image} />
            <View style={styles.button}>
                <Button
                    color={Colors.primary}
                    title='Add to Card'
                    onPress={() => {
                        product && dispatch(cartActions.addToCart(product))
                    }}
                />
            </View>
            <Text style={styles.price}>${product?.price.toFixed(2)}</Text>
            <Text style={styles.description}>{product?.description}</Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    image: { width: '100%', height: 300 },
    price: {
        fontFamily: 'open-sans-bold',
        fontSize: 20,
        color: '#888',
        textAlign: 'center',
        marginVertical: 20
    },
    description: {
        fontFamily: 'open-sans',
        fontSize: 15,
        textAlign: 'center',
        marginHorizontal: 20
    },
    button: {
        marginVertical: 10,
        alignItems: 'center'
    }
});

export default ProductDetails