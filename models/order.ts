import { CartItemIf } from '../components/shop/CartItem'
import moment from 'moment'

class Order {
  constructor(
    public id: string,
    public items: CartItemIf[],
    public totalAmount: number,
    public date: Date
  ) {}

  get readableDate() {
    // return this.date.toLocaleDateString('en-EN', {
    //     year: 'numeric',
    //     month: 'long',
    //     day: 'numeric',
    //     hour: '2-digit',
    //     minute: '2-digit'
    // })
    return moment(this.date).format('DD MMMM YYYY, HH:mm')
  }
}

export default Order
