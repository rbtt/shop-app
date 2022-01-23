import { FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../App';
import OrderItem from '../../components/shop/OrderItem';

const OrdersScreen = () => {
    const orders = useSelector((state: RootState) => {
        return state.orders.orders
    })

    return (
        <FlatList
            data={orders}
            keyExtractor={item => item.id}
            renderItem={itemData => {
                return (
                    <OrderItem
                        amount={itemData.item.totalAmount}
                        date={itemData.item.readableDate}
                        items={itemData.item.items}
                    />
                )
            }}
        />
    );
}

export default OrdersScreen