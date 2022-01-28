import { StatusBar } from 'expo-status-bar';
import { useEffect, useState, useCallback } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlatList, View, ActivityIndicator, StyleSheet, Text, Button } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../App';
import OrderItem from '../../components/shop/OrderItem';
import * as OrderActions from '../../store/actions/orders'
import Colors from '../../constants/Colors';
import { MaterialIcons } from '@expo/vector-icons'

const OrdersScreen = (props: NativeStackScreenProps<any>) => {
    const orders = useSelector((state: RootState) => {
        return state.orders.orders
    })
    const dispatch = useDispatch()

    // useEffect(() => {
    //     dispatch(OrderActions.fetchOrders())
    // }, [dispatch, OrderActions])

    const [isLoading, setIsLoading] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [error, setError] = useState(null)

    const loadOrders = useCallback(async () => {
        console.log('loaded')
        setError(null)
        // setIsLoading(true)
        setIsRefreshing(true)
        try {
            await dispatch(OrderActions.fetchOrders())
        } catch (err: any) {
            setError(err.message)
        }
        // setIsLoading(false)
        setIsRefreshing(false)
    }, [dispatch])

    // useEffect(() => {
    //     loadOrders()
    // }, [dispatch, loadOrders])

    useEffect(() => { // re-fetch products after navigating to screen
        const focusListener = props.navigation.addListener('focus', () => {
            setIsLoading(true)
            loadOrders().then(() => setIsLoading(false))
        })

        return focusListener
    }, [loadOrders])

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator
                    size='large'
                    color={Colors.primary}
                />
                <StatusBar style='auto' />
            </View>
        )
    }
    if (!isLoading && orders.length === 0) {
        return (
            <View style={styles.centered}>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ fontFamily: 'open-sans-bold', fontSize: 25 }}>No Orders Found</Text>
                    <MaterialIcons name='error-outline' size={33} />
                </View>
                <StatusBar style='auto' />
            </View>
        )
    }
    if (error) {
        return <View style={styles.centered}>
            <Text style={{ fontFamily: 'open-sans-bold', fontSize: 25 }}>
                An error occurred!
            </Text>
            <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text>
            <Button title='Try Again' onPress={loadOrders} color={Colors.primary} />
            <StatusBar style='auto' />
        </View>
    }
    return (
        <FlatList
            refreshing={isRefreshing}
            onRefresh={loadOrders}
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


const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default OrdersScreen