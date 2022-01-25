import { StatusBar } from 'expo-status-bar';
import { Alert, Button, FlatList } from 'react-native';
import ProductItem from '../../components/shop/ProductItem';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../App';
import Colors from '../../constants/Colors';
import { deleteProduct } from '../../store/actions/products';
import { useNavigation } from '@react-navigation/native';
import { RootStackScreenProps } from '../../types';

const UserProductsScreen = (props: RootStackScreenProps<'UserProducts'>) => {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const userProducts = useSelector((state: RootState) => state.products.userProducts)
    const editProductHandler = (id: string) => {
        navigation.navigate('EditProducts' as any, {
            productId: id
        })
    }

    const deleteHandler = (id: string) => {
        Alert.alert('Are you sure?', 'Do you really want to delete this item ?', [
            { text: 'No', style: 'default' },
            {
                text: 'Yes', style: 'destructive', onPress: () => {
                    dispatch(deleteProduct(id))
                }
            }
        ])
    }

    return (
        <FlatList
            data={userProducts}
            renderItem={itemData => {
                return <ProductItem product={itemData.item} onSelect={() => editProductHandler(itemData.item.id)}>
                    <Button title='Edit'
                        color={Colors.accent}
                        onPress={() => editProductHandler(itemData.item.id)}
                    />
                    <Button
                        title='Delete'
                        color={Colors.primary}
                        onPress={() => deleteHandler(itemData.item.id)}
                    />
                </ProductItem>
            }}
        />
    );
}

export default UserProductsScreen