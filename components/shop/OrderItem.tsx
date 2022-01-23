import { useState } from 'react'
import { View, Text, Button, StyleSheet } from 'react-native'
import { RootState } from '../../App'
import CartItem, { CartItemIf } from './CartItem'
import Colors from '../../constants/Colors'

export type OrderItemProps = {
    amount: number,
    date: string,
    items: CartItemIf[]
}

const OrderItem: React.FC<OrderItemProps> = (props) => {
    const [showDetails, setShowDetails] = useState(false)
    return (
        <View style={styles.orderItem}>
            <View style={styles.summary}>
                <Text style={styles.totalAmount}>${props.amount.toFixed(2)}</Text>
                <Text style={styles.date}>{props.date}</Text>
            </View>
            <Button
                color={Colors.primary}
                title={showDetails ? 'Hide Details' : 'Show Details'}
                onPress={() => setShowDetails(s => !s)}
            />
            {showDetails && <View style={styles.itemsContainer}>
                {props.items.map(cartItem => {
                    return <CartItem
                        key={cartItem.productId}
                        cartItem={cartItem}
                    />
                })}
            </View>}
        </View>
    )
}

export default OrderItem

const styles = StyleSheet.create({
    orderItem: {
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 5, // for android(shadow doesn't work)
        borderRadius: 10,
        backgroundColor: 'white',
        margin: 20,
        padding: 10,
        alignItems: 'center'
    },
    summary: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 15
    },
    totalAmount: {
        fontFamily: 'open-sans-bold',
        fontSize: 16
    },
    date: {
        fontFamily: 'open-sans',
        fontSize: 16,
        color: '#888'
    },
    itemsContainer: {}
})