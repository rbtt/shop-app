import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import ProductItem from '../../components/shop/ProductItem';
import { useSelector } from 'react-redux';
import { RootState } from '../../App';

const UserProductsScreen = () => {
    const userProducts = useSelector((state: RootState) => state.products.userProducts)
    return (
        <FlatList
            data={userProducts}
            renderItem={itemData => {
                return <ProductItem
                    product={itemData.item}
                    
                />
            }}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default UserProductsScreen