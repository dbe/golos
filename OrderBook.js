function poloOrder(order) {
  return {
    price: parseFloat(order[0]),
    quantity: order[1],
  }
}

function bittrexOrder(order) {
  return {
    price: order.Rate,
    quantity: order.Quantity
  }
}

function aggregate(orders, precision) {
  let aggregated = []

  let last = {
    price: limitPrecision(orders[0].price, precision),
    quantity: orders[0].quantity
  }

  for(let i = 1; i < orders.length; i++) {
    let order = orders[i];
    order.price = limitPrecision(order.price, precision)

    if(last.price == order.price) {
      last.quantity += order.quantity
    } else {
      aggregated.push(last)
      last = order
    }
  }
  aggregated.push(last)
  return aggregated
}

function limitPrecision(num, precision) {
  let factor = 10 ** precision
  return Math.round(num * factor) / factor
}


class OrderBook {
  constructor(bids, asks, name, precision=4) {
    this.bids = aggregate(bids, precision)
    this.asks = aggregate(asks, precision)
    this.name = name
  }

  static fromPolo(data) {
    let asks = [];
    let bids = [];

    data.asks.forEach(ask => asks.push(poloOrder(ask)));
    data.bids.forEach(bid => bids.push(poloOrder(bid)));

    return new OrderBook(bids, asks, 'Poloniex')
  }

  static fromBittrex(data) {
    let asks = [];
    let bids = [];

    data.sell.forEach(ask => asks.push(bittrexOrder(ask)));
    data.buy.forEach(bid => bids.push(bittrexOrder(bid)));

    return new OrderBook(bids, asks, 'Bittrex')
  }
}

module.exports = OrderBook
