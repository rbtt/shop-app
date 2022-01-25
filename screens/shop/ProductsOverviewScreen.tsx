import { StyleSheet, FlatList, Button } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../App'
import ProductItem from '../../components/shop/ProductItem'
import { useNavigation } from '@react-navigation/native';
import * as cartActions from '../../store/actions/cart'
import Colors from '../../constants/Colors';


const ProductsOverviewScreen = (props: NativeStackScreenProps<any>) => {
    const products = useSelector((state: RootState) => state.products.availableProducts)
    const navigation = useNavigation()
    const dispatch = useDispatch()

    const selectItemHandler = (id: string, title: string) => {
        props.navigation.navigate('ProductDetails', { id, title })
    }

    return (
        <FlatList
            data={products}
            renderItem={itemData => {
                return <ProductItem
                    product={itemData.item}
                    onSelect={() => {
                        selectItemHandler(itemData.item.id, itemData.item.title)
                    }}

                >
                    <Button title='View Details' onPress={() => {
                        selectItemHandler(itemData.item.id, itemData.item.title)
                    }} color={Colors.accent} />
                    <Button title='Add to Cart' onPress={() => {
                        dispatch(cartActions.addToCart(itemData.item))
                    }} color={Colors.primary} />
                </ProductItem>
            }}
        />
    );
}

const styles = StyleSheet.create({

});

export default ProductsOverviewScreen