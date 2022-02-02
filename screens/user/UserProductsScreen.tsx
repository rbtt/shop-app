import { StatusBar } from 'expo-status-bar'
import { Alert, Button, FlatList, View, Text, ActivityIndicator } from 'react-native'
import ProductItem from '../../components/shop/ProductItem'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../App'
import Colors from '../../constants/Colors'
import { deleteProduct } from '../../store/actions/products'
import { useNavigation } from '@react-navigation/native'
import { RootStackScreenProps } from '../../types'
import { useState, useEffect } from 'react'

const UserProductsScreen = (props: RootStackScreenProps<'UserProducts'>) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<any>()

  const navigation = useNavigation()
  const dispatch = useDispatch()
  const userProducts = useSelector((state: RootState) => state.products.userProducts)

  const editProductHandler = (id: string) => {
    navigation.navigate('EditProducts', {
      productId: id,
    })
  }

  const deleteHandler = async (id: string) => {
    Alert.alert('Are you sure?', 'Do you really want to delete this item ?', [
      { text: 'No', style: 'default' },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: async () => {
          setIsLoading(true)
          setError(null)
          try {
            await dispatch(deleteProduct(id))
          } catch (err: any) {
            setError(err.message)
          }
          setIsLoading(false)
        },
      },
    ])
  }

  useEffect(() => {
    if (error) {
      Alert.alert('An error occurred!', error, [{ text: 'Okay' }])
    }
    return () => {
      setError(null)
    }
  }, [error])

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size='large' color={Colors.primary} />
      </View>
    )
  }

  if (userProducts.length === 0) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>No products found. Maybe create some yourself.</Text>
      </View>
    )
  }

  return (
    <View>
      <StatusBar style='auto' />
      <FlatList
        data={userProducts}
        renderItem={(itemData) => {
          return (
            <ProductItem
              product={itemData.item}
              onSelect={() => editProductHandler(itemData.item.id)}
            >
              <Button
                title='Edit'
                color={Colors.accent}
                onPress={() => editProductHandler(itemData.item.id)}
              />
              <Button
                title='Delete'
                color={Colors.primary}
                onPress={() => deleteHandler(itemData.item.id)}
              />
            </ProductItem>
          )
        }}
      />
    </View>
  )
}

export default UserProductsScreen
