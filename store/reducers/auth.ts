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
    default:
      return state
  }
}
