import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import ShopNavigator from './ShopNavigator'
import { RootState } from '../App'
import { useNavigation } from '@react-navigation/native'

const NavigationContainer: React.FC<any> = (props) => {
  const isAuth = useSelector((state: RootState) => !!state.auth.token)
  const navRef = useRef()
    
  useEffect(() => {
    if (!isAuth) {
      navRef.current.dispatch()
    }
  }, [isAuth])

  return <ShopNavigator ref={navRef} />
}

export default NavigationContainer
