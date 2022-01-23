import { StyleSheet, FlatList } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../App'
import ProductItem from '../../components/shop/ProductItem'
import { useNavigation } from '@react-navigation/native';
import * as cartActions from '../../store/actions/cart'


const ProductsOverviewScreen = (props: NativeStackScreenProps<any>) => {
    const products = useSelector((state: RootState) => state.products.availableProducts)
    const navigation = useNavigation()
    const dispatch = useDispatch()
    return (
        <FlatList
            data={products}
            renderItem={itemData => {
                return <ProductItem
                    product={itemData.item}
                    onViewDetail={() => {
                        props.navigation.navigate('ProductDetails', { id: itemData.item.id, title: itemData.item.title })
                    }}
                    onAddToCart={() => {
                        dispatch(cartActions.addToCart(itemData.item))
                    }}
                />
            }}
        />
    );
}

const styles = StyleSheet.create({

});

export default ProductsOverviewScreen