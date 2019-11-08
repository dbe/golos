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
    let price = limitPrecision(order.price, precision)

    if(last.price == price) {
      last.quantity += order.quantity
    } else {
      aggregated.push(last)
      last = {price, quantity: order.quantity}
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

  static fromPolo(data, precision=4) {
    let asks = [];
    let bids = [];

    data.asks.forEach(ask => asks.push(poloOrder(ask)));
    data.bids.forEach(bid => bids.push(poloOrder(bid)));

    return new OrderBook(bids, asks, 'Poloniex', precision)
  }

  static fromBittrex(data, precision=4) {
    let asks = [];
    let bids = [];

    data.sell.forEach(ask => asks.push(bittrexOrder(ask)));
    data.buy.forEach(bid => bids.push(bittrexOrder(bid)));

    return new OrderBook(bids, asks, 'Bittrex', precision)
  }
}

//O(n + m) time complexity, requires lists to be sorted in decending price order
function combine(a, aName, b, bName) {
  let orders = []
  let i = 0
  let j = 0

  while(i < a.length && j < b.length) {
    if(a[i].price == b[j].price) {
      orders.push({
        price: a[i].price,
        quantities: [
          {name: aName, quantity: a[i].quantity},
          {name: bName, quantity: b[j].quantity},
        ]
      })

      i++
      j++
    } else if(a[i].price > b[j].price) {
      orders.push({price: a[i].price, quantities: [{name: aName, quantity: a[i].quantity}]})
      i++
    } else {
      orders.push({price: b[j].price, quantities: [{name: bName, quantity: b[j].quantity}]})
      j++
    }
  }

  //Handle when we only have elements from a single list left
  while(i < a.length) {
    orders.push({price: a[i].price, quantities: [{name: aName, quantity: a[i].quantity}]})
    i++
  }

  while(j < b.length) {
    orders.push({price: b[j].price, quantities: [{name: bName, quantity: b[j].quantity}]})
    j++
  }

  return orders
}

class CombinedOrderBook {
  constructor(a, b) {
    this.asks = combine(a.asks, a.name, b.asks, b.name)
    this.bids = combine(a.bids, a.name, b.bids, b.name)
  }
}

module.exports = {
  CombinedOrderBook,
  OrderBook,
  aggregate,
  combine
}
