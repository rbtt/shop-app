import { Button, Platform, View, Text } from 'react-native'
import {
  NavigationContainer,
  NavigationProp,
  useNavigation,
} from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import ProductsOverviewScreen from '../screens/shop/ProductsOverviewScreen'
import ProductDetails from '../screens/shop/ProductDetails'
import CartScreen from '../screens/shop/CartScreen'
import OrdersScreen from '../screens/shop/OrdersScreen'
import UserProductsScreen from '../screens/user/UserProductsScreen'
import EditProductsScreen from '../screens/user/EditProductsScreen'
import AuthScreen from '../screens/user/AuthScreen'
import StartupScreen from '../screens/StartScreen'

import Colors from '../constants/Colors'
import { OverflowMenuProvider } from 'react-navigation-header-buttons'
import HeaderButton from '../components/UI/HeaderButton'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import {
  createDrawerNavigator,
  DrawerContent,
  DrawerItem,
  DrawerNavigationProp,
} from '@react-navigation/drawer'
import { Ionicons } from '@expo/vector-icons'
import { RootStackParamList } from '../types'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../store/actions/auth'
import { useCallback, useEffect } from 'react'
import { RootState } from '../App'

const Stack = createNativeStackNavigator<RootStackParamList>()
const Drawer = createDrawerNavigator()

const defaultHeaderOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === 'android' ? Colors.primary : '',
  },
  headerTitleStyle: {
    fontFamily: 'open-sans-bold',
  },
  headerBackTitleStyle: {
    fontFamily: 'open-sans',
  },
  headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary,
}

const ProductsNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName='ProductsOverview'
      screenOptions={({ navigation }) => {
        // console.log(navigation.getState().index !== 0)
        return {
          headerRight: (navInfo) => {
            return (
              <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item
                  title='Cart'
                  iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
                  onPress={() => {
                    navigation.navigate('CartScreen')
                  }}
                  color={navInfo.tintColor}
                />
              </HeaderButtons>
            )
          },

          // headerShown: false,
        }
      }}
    >
      <Stack.Screen
        name='ProductsOverview'
        component={ProductsOverviewScreen}
        options={({ navigation }: any) => {
          return {
            ...defaultHeaderOptions,
            headerTitleAlign: 'center',
            title: 'Available Products',
            headerLeft: () => {
              return (
                <HeaderButtons HeaderButtonComponent={HeaderButton}>
                  <Item
                    title='Drawer'
                    iconName={Platform.OS === 'android' ? 'md-menu-sharp' : 'ios-menu'}
                    onPress={() => {
                      navigation.toggleDrawer()
                    }}
                    buttonStyle={{ paddingLeft: 0 }}
                  />
                </HeaderButtons>
              )
            },
          }
        }}
      />
      <Stack.Screen
        name='ProductDetails'
        component={ProductDetails}
        options={defaultHeaderOptions}
      />
      <Stack.Screen
        name='CartScreen'
        component={CartScreen}
        options={{
          ...defaultHeaderOptions,
          headerRight: () => <></>,
          title: 'Cart',
        }}
      />
      {/* <Stack.Screen
                name='OrdersScreen'
                component={OrdersScreen}
                options={{
                    ...defaultHeaderOptions,
                    headerRight: () => <></>,
                    title: 'Place an Order'
                }}
            /> */}
    </Stack.Navigator>
  )
}

const AdminNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='UserProducts'
        component={UserProductsScreen}
        options={({ navigation }: any) => {
          return {
            ...defaultHeaderOptions,
            headerTitleAlign: 'center',
            title: 'Your Products',
            headerLeft: () => {
              return (
                <HeaderButtons HeaderButtonComponent={HeaderButton}>
                  <Item
                    title='Drawer'
                    iconName={Platform.OS === 'android' ? 'md-menu-sharp' : 'ios-menu'}
                    onPress={() => {
                      navigation.toggleDrawer()
                    }}
                    buttonStyle={{ paddingLeft: 0 }}
                  />
                </HeaderButtons>
              )
            },
            headerRight: () => {
              return (
                <HeaderButtons HeaderButtonComponent={HeaderButton}>
                  <Item
                    title='Add'
                    iconName={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
                    onPress={() => {
                      navigation.navigate('EditProducts', {})
                    }}
                    buttonStyle={{ paddingLeft: 0 }}
                  />
                </HeaderButtons>
              )
            },
          }
        }}
      />
      <Stack.Screen
        name='EditProducts'
        component={EditProductsScreen}
        options={({ navigation }) => {
          return {
            ...defaultHeaderOptions,
            headerTitleAlign: 'center',
          }
        }}
      />
    </Stack.Navigator>
  )
}

const AuthNavigator = () => {
  const navigation = useNavigation()
  const isAuth = useSelector((state: RootState) => !!state.auth.token)
  const dispatch = useDispatch()
  useEffect(() => {
    if (!isAuth) {
      // console.log('AuthNavigator re-rendering')
      dispatch(logout())
      navigation.navigate('StartupScreen')
    }
  }, [isAuth])
  return (
    <Stack.Navigator initialRouteName='StartupScreen'>
      <Stack.Screen
        name='StartupScreen'
        component={StartupScreen}
        options={{
          ...defaultHeaderOptions,
          title: 'Loading..',
          headerTitleAlign: 'center',
          // headerShown: false
        }}
      />
      <Stack.Screen
        name='AuthScreen'
        component={AuthScreen}
        options={{
          // headerShown: false,
          ...defaultHeaderOptions,
          title: 'Authenticate',
          headerTitleAlign: 'center',

          headerLeft: () => <View />,
        }}
      />
      <Stack.Screen
        name='Drawer'
        component={OrdersNavigator}
        options={({ route, navigation }) => {
          // console.log(route)
          return { headerShown: false }
        }}
      />
    </Stack.Navigator>
  )
}

const OrdersNavigator = () => {
  const dispatch = useDispatch()
  return (
    <Drawer.Navigator
      drawerContent={(props) => {
        // console.log(props)
        return (
          <View style={{ flex: 1 }}>
            <DrawerContent
              descriptors={props.descriptors}
              navigation={props.navigation}
              state={props.state}
            />
            <DrawerItem
              label='Logout'
              onPress={() => {
                dispatch(logout())
                props.navigation.navigate('StartupScreen')
              }}
              icon={(props) => {
                return <Ionicons name='exit' size={props.size} color={props.color} />
              }}
              activeTintColor={Colors.primary}
              // inactiveTintColor={Colors.primary}
              pressColor={Colors.primary}
              pressOpacity={0.6}

              // labelStyle={{ fontSize: 16, marginLeft: 0 }}
            />
          </View>
        )
      }}
      screenOptions={({ navigation }) => {
        return {
          // headerRight: (navInfo) => {
          //   return (
          //     <HeaderButtons HeaderButtonComponent={HeaderButton}>
          //       <Item
          //         title='Cart'
          //         iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
          //         onPress={() => {
          //           navigation.navigate('CartScreen')
          //         }}
          //       />
          //     </HeaderButtons>
          //   )
          // },
          // headerShown: false,

          drawerActiveTintColor: Colors.primary,
          headerLeft: (navInfo) => {
            return (
              <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item
                  title='Drawer'
                  iconName={Platform.OS === 'android' ? 'md-menu-sharp' : 'ios-menu'}
                  onPress={() => {
                    navigation.toggleDrawer()
                  }}
                  buttonStyle={{ paddingStart: 10 }}
                />
              </HeaderButtons>
            )
          },
        }
      }}
    >
      <Drawer.Screen
        name='Products'
        component={ProductsNavigator}
        options={{
          ...defaultHeaderOptions,
          headerShown: false,
          drawerIcon: ({ color, size, focused }) => {
            return (
              <Ionicons
                name={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
                size={size}
                color={color}
              />
            )
          },
        }}
      />
      <Drawer.Screen
        name='Orders'
        component={OrdersScreen}
        options={{
          ...defaultHeaderOptions,
          title: 'Your Orders',
          headerTitleAlign: 'center',
          drawerIcon: ({ color, size, focused }) => {
            return (
              <Ionicons
                name={Platform.OS === 'android' ? 'md-list' : 'ios-list'}
                size={size}
                color={color}
              />
            )
          },
        }}
      />
      <Drawer.Screen
        name='Admin'
        component={AdminNavigator}
        options={{
          ...defaultHeaderOptions,
          title: 'Your Products',
          headerTitleAlign: 'center',
          headerShown: false,
          drawerIcon: ({ color, size, focused }) => {
            return (
              <Ionicons
                name={Platform.OS === 'android' ? 'md-person' : 'ios-person'}
                size={size}
                color={color}
              />
            )
          },
        }}
      />
    </Drawer.Navigator>
  )
}

const ShopNavigator = () => {
  return (
    <NavigationContainer>
      <OverflowMenuProvider>
        <AuthNavigator />
      </OverflowMenuProvider>
    </NavigationContainer>
  )
}

export default ShopNavigator
