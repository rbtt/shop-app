const apiKey = 'AIzaSyDpGho1xsV7d1YfLIveYyaAYeEA9BbX2k8'

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
    dispatch({ type: 'LOGIN', token: resData.idToken, userId: resData.localId })
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
  }
}
