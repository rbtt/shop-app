import {
  View,
  Button,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  ActivityIndicator,
  Alert,
} from 'react-native'
import { RootStackScreenProps } from '../../types'
import Input from '../../components/UI/Input'
import Card from '../../components/UI/Card'
import Colors from '../../constants/Colors'
import { LinearGradient } from 'expo-linear-gradient'
import { useDispatch } from 'react-redux'
import * as authActions from '../../store/actions/auth'
import { useState, useEffect, useCallback, useReducer } from 'react'

type AuthState = {
  inputValues: {
    email: string
    password: string
  }
  inputValidities: {
    email: boolean
    password: boolean
  }
  formIsValid: boolean
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

const AuthScreen = ({ route, navigation }: RootStackScreenProps<'AuthScreen'>) => {
  const dispatch = useDispatch()
  const [isSignUp, setIsSignUp] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<null>()
  const [formState, formDispatch] = useReducer(formReducer, {
    inputValues: {
      email: '',
      password: '',
    },
    inputValidities: {
      email: false,
      password: false,
    },
    formIsValid: false,
  })

  useEffect(() => {
    if (error) {
      Alert.alert('Something went wrong', error, [{ text: 'Okay' }])
    }
    return () => {
      setError(null)
    }
  }, [error])

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

  const authHandler = async () => {
    let action
    if (isSignUp) {
      action = authActions.signup(
        formState.inputValues.email,
        formState.inputValues.password
      )
    } else {
      action = authActions.signin(
        formState.inputValues.email,
        formState.inputValues.password
      )
    }
    setIsLoading(true)
    try {
      await dispatch(action)
      navigation.replace('Drawer')
    } catch (err: any) {
      setError(err.message)
      setIsLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView style={styles.screen}>
      <LinearGradient colors={['#ffedff', '#ffe3ff']} style={styles.gradient}>
        <Card style={styles.authContainer}>
          <ScrollView>
            <Input
              id='email'
              label='E-MAIL'
              keyboardType='email-address'
              onInputChange={inputChangeHandler}
              required
              email
              autoCapitalize='none'
              errorText='Please enter a valid email adress!'
              initialValue=''
            />
            <Input
              id='password'
              label='PASSWORD'
              keyboardType='default'
              secureTextEntry
              onInputChange={inputChangeHandler}
              required
              autoCapitalize='none'
              errorText='Please enter a valid password!'
              initialValue=''
              minLength={5}
            />
            <View style={styles.btnContainer}>
              {isLoading ? (
                <ActivityIndicator size='large' color={Colors.primary} />
              ) : (
                <Button
                  title={isSignUp ? 'Sign Up' : 'Login'}
                  color={Colors.primary}
                  onPress={authHandler}
                />
              )}
            </View>
            <View style={styles.btnContainer}>
              {!isLoading && (
                <Button
                  title={`Swith to ${isSignUp ? 'Login' : 'Sign Up'}`}
                  color={Colors.accent}
                  onPress={() => setIsSignUp((prev) => !prev)}
                />
              )}
            </View>
          </ScrollView>
        </Card>
      </LinearGradient>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  authContainer: {
    width: '100%',
    maxWidth: 400,
    maxHeight: 400,
    padding: 20,
  },
  btnContainer: {
    marginTop: 10,
  },
})

export default AuthScreen
