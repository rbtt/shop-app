import AsyncStorage from '@react-native-async-storage/async-storage'

const apiKey = process.env.API_KEY 
let timer: NodeJS.Timeout

export const signin = (email: string, password: string) => {
  return async (dispatch: any) => {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      }
    )
    if (!response.ok) {
      const errorResData = await response.json()
      const errorId = errorResData.error.message
      let message = 'Something went wrong!'
      if (errorId === 'EMAIL_NOT_FOUND') {
        message =
          'There is no user record corresponding to this identifier. The user may have been deleted.'
      } else if (errorId === 'INVALID_PASSWORD') {
        message = 'The password is invalid or the user does not have a password.'
      } else if (errorId === 'USER_DISABLED') {
        message = 'The user account has been disabled by an administrator.'
      }
      throw new Error(message)
    }
    const resData = await response.json()
    // console.log(resData)
    const expirationDate = new Date(
      new Date().getTime() + parseInt(resData.expiresIn) * 1000
    )
    dispatch(setLogoutTimer(parseInt(resData.expiresIn) * 1000))
    // dispatch(setLogoutTimer(10000))
    // console.log('timer: ', timer)
    dispatch({ type: 'LOGIN', token: resData.idToken, userId: resData.localId })
    saveDataToStorage(resData.idToken, resData.localId, expirationDate)
  }
}

export const signup = (email: string, password: string) => {
  return async (dispatch: any) => {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      }
    )
    if (!response.ok) {
      const errorResData = await response.json()
      const errorId = errorResData.error.message
      let message = 'Something went wrong!'
      if (errorId === 'OPERATION_NOT_ALLOWED') {
        message = 'Password sign-in is disabled for this project.'
      } else if (errorId === 'EMAIL_EXISTS') {
        message = 'This email already exist!'
      } else if (errorId === 'TOO_MANY_ATTEMPTS_TRY_LATER') {
        message =
          'We have blocked all requests from this device due to unusual activity. Try again later.'
      }
      throw new Error(message)
    }
    const resData = await response.json()
    // console.log(resData)

    dispatch({ type: 'SIGNUP', token: resData.idToken, userId: resData.localId })
    const expirationDate = new Date(
      new Date().getTime() + parseInt(resData.expiresIn) * 1000
    )
    saveDataToStorage(resData.idToken, resData.localId, expirationDate)
  }
}

export const logout = () => {
  clearLogoutTimer()
  AsyncStorage.removeItem('userData')
  return { type: 'LOGOUT' }
}

export const authenticate = (userId: string, token: string) => {
  return (dispatch: any) => {
    dispatch({ type: 'AUTH', payload: { userId, token } })
  }
}

const clearLogoutTimer = () => {
  if (timer) {
    clearTimeout(timer)
    console.log('timer cleared')
  }
}

const setLogoutTimer = (expirationTime: number) => {
  return (dispatch: any) => {
    timer = setTimeout(() => {
      dispatch(logout())
    }, expirationTime)
  }
}

const saveDataToStorage = (token: string, userId: string, expirationDate: Date) => {
  AsyncStorage.removeItem('userData')
  AsyncStorage.setItem(
    'userData',
    JSON.stringify({ token, userId, expiryDate: expirationDate.toISOString() })
  )
}
