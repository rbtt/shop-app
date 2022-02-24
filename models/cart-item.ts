class CartItem {
  constructor(
    public quantity: number,
    public productPrice: number,
    public productTitle: string,
    public sum: number,
    public ownerPushToken: string
  ) {}
}

export default CartItem
