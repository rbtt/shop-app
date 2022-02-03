import { View, ActivityIndicator, StyleSheet } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Colors from '../constants/Colors'
import { RootStackScreenProps } from '../types'
import { useEffect } from 'react'
import { authenticate } from '../store/actions/auth'
import { useDispatch } from 'react-redux'

const StartupScreen = ({ navigation, route }: RootStackScreenProps<'StartupScreen'>) => {
  // console.log('StartScreen nav prop: ', navigation)
  const dispatch = useDispatch()
  useEffect(() => {
    const tryLogin = async () => {
      const userData = await AsyncStorage.getItem('userData')
      // console.log('From Storage: ', JSON.parse(userData!))
      if (!userData) {
        navigation.replace('AuthScreen')
        return
      }
      const transformedData = JSON.parse(userData)
      //   console.log('transformedData: ', transformedData)
      const { token, userId, expiryDate } = transformedData
      const expirationDate = new Date(expiryDate)

      if (expirationDate <= new Date() || !token || !userId) {
        navigation.replace('AuthScreen')
        return
      }
      navigation.replace('Drawer')
      dispatch(authenticate(userId, token))
    }
    tryLogin()
  }, [dispatch])
  return (
    <View style={styles.screen}>
      <ActivityIndicator size='large' color={Colors.primary} />
      {/* <StatusBar style='auto' /> */}
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default StartupScreen
