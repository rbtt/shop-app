import { useEffect, useCallback, useReducer, useState } from 'react'
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../App'
import { RootStackScreenProps } from '../../types'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import HeaderButton from '../../components/UI/HeaderButton'
import Product from '../../models/product'
import { createProduct, updateProduct } from '../../store/actions/products'
import Input from '../../components/UI/Input'
import Colors from '../../constants/Colors'

export interface StateKeys {
  title: string
  imageUrl: string
  price: string
  description: string
}
type Actions = {
  type: 'UPDATE'
  value: string
  isValid: boolean
  input: string
}

const formReducer = (
  state: {
    inputValues: {
      [key: string]: string
    }
    inputValidities: { [key: string]: boolean }
    formIsValid: boolean
  },
  action: Actions
) => {
  if (action.type === 'UPDATE') {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value,
    }
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    }
    let updatedFormIsValid = true
    for (let key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key]
    }
    return {
      formIsValid: updatedFormIsValid,
      inputValidities: updatedValidities,
      inputValues: updatedValues,
    }
  }
  return state
}

const EditProductsScreen = ({
  route,
  navigation,
}: RootStackScreenProps<'EditProducts'>) => {
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<null>()

  let editingProduct: Product | undefined
  if (route.params.productId) {
    editingProduct = useSelector((state: RootState) => {
      return state.products.userProducts.find(
        (prod) => prod.id === route.params.productId
      )
    })
  }

  const [formState, formDispatch] = useReducer(formReducer, {
    inputValues: {
      title: editingProduct ? editingProduct.title : '',
      imageUrl: editingProduct ? editingProduct.imageUrl : '',
      price: editingProduct ? editingProduct.price.toString() : '',
      description: editingProduct ? editingProduct.description : '',
    },
    inputValidities: {
      title: editingProduct ? true : false,
      imageUrl: editingProduct ? true : false,
      price: editingProduct ? true : false,
      description: editingProduct ? true : false,
    },
    formIsValid: editingProduct ? true : false,
  })

  useEffect(() => {
    if (error) {
      Alert.alert('An error occurred!', error, [{ text: 'Okay' }])
    }
    return () => {
      setError(null)
    }
  }, [error])

  const submitHandler = useCallback(async () => {
    if (!formState.formIsValid) {
      Alert.alert('Wrong Input', 'Please fill all the fields correctly.', [
        { text: 'Okay' },
      ])
      return
    }
    setError(null)
    setIsLoading(true)
    try {
      if (route.params.productId) {
        await dispatch(
          updateProduct(
            route.params.productId,
            formState.inputValues.title,
            formState.inputValues.imageUrl,
            parseFloat(formState.inputValues.price),
            formState.inputValues.description
          )
        )
        console.log('Updated')
      } else {
        await dispatch(
          createProduct(
            formState.inputValues.title,
            formState.inputValues.imageUrl,
            parseFloat(formState.inputValues.price),
            formState.inputValues.description
          )
        )
        console.log('Created New')
      }
      navigation.goBack()
    } catch (err: any) {
      setError(err.message)
    }

    setIsLoading(false)
  }, [dispatch, route.params.productId, formState])

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <HeaderButtons HeaderButtonComponent={HeaderButton}>
            <Item
              title='Add'
              iconName={Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'}
              buttonStyle={{ paddingLeft: 0 }}
              onPress={submitHandler}
            />
          </HeaderButtons>
        )
      },
      title: route.params.productId ? 'Edit Product' : 'Add Product',
    })
  }, [submitHandler])

  const inputChangeHandler = useCallback(
    (inputIdentifier: string, inputValue: string, inputValidity: boolean) => {
      formDispatch({
        type: 'UPDATE',
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier,
      })
    },
    [formDispatch]
  )

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size='large' color={Colors.primary} />
      </View>
    )
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior='padding'>
      <ScrollView style={styles.screen}>
        <View style={styles.form}>
          <View style={{borderWidth: 1, paddingHorizontal: 5}}>
            <Text>(dev)</Text>
            <Text>ID: {editingProduct?.id}</Text>
            <Text>OWNER ID: {editingProduct?.ownerId}</Text>
          </View>
          <Input
            id='title'
            label='Title'
            errorText='Please enter valid title!'
            onInputChange={inputChangeHandler}
            initialValue={editingProduct ? editingProduct.title : ''}
            initialyValid={!!editingProduct}
            required
            min={0}
          />
          {/* <View style={styles.formControl}>
                    <Text style={styles.label}>Title</Text>
                    <TextInput
                        style={styles.input}
                        value={formState.inputValues.title}
                        onChangeText={textChangeHandler.bind(this, 'title')}
                    />
                    {!formState.inputValidities.title && <Text>Please enter a valid title!</Text>}
                </View> */}
          <Input
            id='imageUrl'
            label='Image URL'
            errorText='Please enter valid Image URL!'
            onInputChange={inputChangeHandler}
            initialValue={editingProduct ? editingProduct.imageUrl : ''}
            initialyValid={!!editingProduct}
            required
            min={10}
          />
          <Input
            id='price'
            label='Price'
            errorText='Please enter valid price!'
            keyboardType='decimal-pad'
            onInputChange={inputChangeHandler}
            initialValue={editingProduct ? editingProduct.price.toString() : ''}
            initialyValid={!!editingProduct}
            required
            min={0}
          />
          <Input
            id='description'
            label='Description'
            errorText='Please enter valid description!'
            multiline
            numberOfLines={3}
            onInputChange={inputChangeHandler}
            initialValue={editingProduct ? editingProduct.description : ''}
            initialyValid={!!editingProduct}
            required
            min={10}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  screen: {},
  form: {
    margin: 20,
  },
})

export default EditProductsScreen
