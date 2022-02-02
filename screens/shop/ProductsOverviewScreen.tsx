import { StatusBar } from 'expo-status-bar'
import { StyleSheet, FlatList, Button, ActivityIndicator, View, Text } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../App'
import ProductItem from '../../components/shop/ProductItem'
import * as cartActions from '../../store/actions/cart'
import * as ProductActions from '../../store/actions/products'
import Colors from '../../constants/Colors'
import { useEffect, useState, useCallback } from 'react'
import { MaterialIcons } from '@expo/vector-icons'

const ProductsOverviewScreen = (props: NativeStackScreenProps<any>) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState(null)
  const products = useSelector((state: RootState) => state.products.availableProducts)
  const dispatch = useDispatch()

  const loadProducts = useCallback(async () => {
    // console.log('loaded')
    setError(null)
    // setIsLoading(true)
    setIsRefreshing(true)
    try {
      await dispatch(ProductActions.fetchProducts())
    } catch (err: any) {
      setError(err.message)
    }
    // setIsLoading(false)
    setIsRefreshing(false)
  }, [dispatch])

  // useEffect(() => {
  //     loadProducts()
  // }, [dispatch, loadProducts])

  useEffect(() => {
    // re-fetch products after navigating to screen
    const focusListener = props.navigation.addListener('focus', () => {
      setIsLoading(true)
      loadProducts().then(() => setIsLoading(false))
    })

    return focusListener
  }, [loadProducts])

  const selectItemHandler = (id: string, title: string) => {
    props.navigation.navigate('ProductDetails', { id, title })
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size='large' color={Colors.primary} />
        <StatusBar style='auto' />
      </View>
    )
  }
  if (!isLoading && products.length === 0) {
    return (
      <View style={styles.centered}>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ fontFamily: 'open-sans-bold', fontSize: 25 }}>
            No Products Found
          </Text>
          <MaterialIcons name='error-outline' size={33} />
        </View>
        <StatusBar style='auto' />
      </View>
    )
  }
  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={{ fontFamily: 'open-sans-bold', fontSize: 25 }}>
          An error occurred!
        </Text>
        <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text>
        <Button title='Try Again' onPress={loadProducts} color={Colors.primary} />
        <StatusBar style='auto' />
      </View>
    )
  }

  return (
    <FlatList
      refreshing={isRefreshing}
      onRefresh={loadProducts}
      data={products}
      renderItem={(itemData) => {
        return (
          <ProductItem
            product={itemData.item}
            onSelect={() => {
              selectItemHandler(itemData.item.id, itemData.item.title)
            }}
          >
            <Button
              title='View Details'
              onPress={() => {
                selectItemHandler(itemData.item.id, itemData.item.title)
              }}
              color={Colors.accent}
            />
            <Button
              title='Add to Cart'
              onPress={() => {
                dispatch(cartActions.addToCart(itemData.item))
              }}
              color={Colors.primary}
            />
          </ProductItem>
        )
      }}
    />
  )
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default ProductsOverviewScreen
