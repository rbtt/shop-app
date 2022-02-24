import { Text, View, StyleSheet, Image, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native'
import { Ionicons } from '@expo/vector-icons'


export interface CartItemIf {
    totalAmount: number,
    productId: string,
    productTitle: string
    productPrice: number,
    quantity: number,
    sum: number,
    ownerPushToken: string
}

const CartItem: React.FC<{
    cartItem: CartItemIf
    onRemove?: () => void,
    deleteable?: boolean
}> = (props) => {

    let TouchableComponent = TouchableOpacity as any
    if (Platform.OS === 'android') TouchableComponent = TouchableNativeFeedback
    return (
        <View style={styles.cartItem}>
            <View style={styles.itemData}>
                <Text style={styles.qty}>{props.cartItem.quantity}x </Text><Text style={styles.mainText} numberOfLines={1}>{props.cartItem.productTitle}</Text>
            </View>
            <View style={styles.itemData}>
                <Text style={styles.mainText} numberOfLines={1}>${props.cartItem.productPrice.toFixed(2)}</Text>
                {props.deleteable &&
                    <TouchableComponent onPress={props.onRemove} style={styles.deleteButton}>
                        <Ionicons
                            name={Platform.OS === 'android' ? 'md-trash' : 'ios-trash'}
                            size={23}
                            color='red'
                        />
                    </TouchableComponent>
                }
            </View>
        </View>
    )
}

// TODO better alignment
const styles = StyleSheet.create({
    cartItem: {
        width: '100%',
        padding: 10,
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginHorizontal: 20,
    },
    deleteButton: {
        marginLeft: 20
    },
    itemData: {
        flexDirection: 'row',
        width: '70%'
    },
    qty: {
        fontFamily: 'open-sans-bold',
        color: '#888',
        fontSize: 16
    },
    mainText: {
        fontFamily: 'open-sans-bold',
        fontSize: 16,

    }
})

export default CartItem