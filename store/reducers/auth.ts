const initialState = {
  token: null,
  userId: null,
}

export default (state = initialState, action: any) => {
  switch (action.type) {
    case 'SIGNUP':
      return {
        token: action.token,
        userId: action.userId,
      }
    case 'LOGIN':
      return {
        token: action.token,
        userId: action.userId,
      }
    case 'AUTH':
      return {
        token: action.payload.token,
        userId: action.payload.userId,
      }
    case 'LOGOUT':
      return initialState
    default:
      return state
  }
}
