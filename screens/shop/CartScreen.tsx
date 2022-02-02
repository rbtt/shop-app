import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View, FlatList, Button, ActivityIndicator } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '../../App'
import Colors from '../../constants/Colors'
import CartItem from '../../components/shop/CartItem'
import * as cartActions from '../../store/actions/cart'
import * as ordersActions from '../../store/actions/orders'
import { useNavigation } from '@react-navigation/native'
import Card from '../../components/UI/Card'
import { useState } from 'react'

const CartScreen = () => {
  const [isLoading, setIsLoading] = useState(false)
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const cartTotal = useSelector((state: RootState) => state.cart.totalAmount)
  const cartItems = useSelector((state: RootState) => {
    const transformedCartItems = []
    for (let key in state.cart.items) {
      transformedCartItems.push({
        productId: key,
        productTitle: state.cart.items[key].productTitle,
        productPrice: state.cart.items[key].productPrice,
        quantity: state.cart.items[key].quantity,
        sum: state.cart.items[key].sum,
        totalAmount: 0,
      })
    }
    return transformedCartItems.sort((a, b) => (a.productId > b.productId ? 1 : -1))
  })

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size='large' color={Colors.primary} />
      </View>
    )
  }

  return (
    <View style={styles.screen}>
      <Card style={styles.summary}>
        <Text style={styles.summaryText}>
          Total:
          <Text style={styles.amount}>
            ${cartTotal.toFixed(2) === '-0.00' ? '0.00' : cartTotal.toFixed(2)}
          </Text>
        </Text>
        <Button
          color={Colors.accent}
          title='Order Now'
          disabled={cartItems.length === 0}
          onPress={async () => {
            setIsLoading(true)
            await dispatch(ordersActions.addOrder(cartItems, cartTotal))
            setIsLoading(false)
            navigation.navigate('Orders' as any)
          }}
        />
      </Card>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.productId}
        renderItem={(itemData) => {
          return (
            <CartItem
              onRemove={() => {
                dispatch(cartActions.removeFromCart(itemData.item.productId))
              }}
              cartItem={itemData.item}
              deleteable
            />
          )
        }}
      />
      <StatusBar style='auto' />
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    margin: 20,
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    padding: 10,
  },
  summaryText: {
    fontFamily: 'open-sans-bold',
    fontSize: 18,
  },
  amount: {
    color: Colors.primary,
  },
})

export default CartScreen
