const request = require('request')
const util = require('util')
const OrderBook = require('./OrderBook.js').OrderBook

const requestPromise = util.promisify(request);

class API {
  static orderBook(precision=4) {
    return requestPromise(this.URL).then(response => {
      let [asks, bids] = this.parseResponse(response)
      return new OrderBook(asks, bids, this.NAME, precision)
    })
  }
}

class PoloniexAPI extends API {
  static get URL() {return 'https://poloniex.com/public?command=returnOrderBook&currencyPair=BTC_ETH&depth=100'}
  static get NAME() {return 'Poloniex'}

  static parseResponse(response) {
    let data = JSON.parse(response.body)
    let asks = [];
    let bids = [];

    data.asks.forEach(ask => asks.push(this.parseOrder(ask)));
    data.bids.forEach(bid => bids.push(this.parseOrder(bid)));

    return [asks, bids]
  }

  static parseOrder(order) {
    return {
      price: parseFloat(order[0]),
      quantity: order[1],
    }
  }
}

class BittrexAPI extends API {
  static get URL() {return 'https://api.bittrex.com/api/v1.1/public/getorderbook?market=BTC-ETH&type=both'}
  static get NAME() {return 'Bittrex'}

  static parseResponse(response) {
    let data = JSON.parse(response.body)['result']
    let asks = [];
    let bids = [];

    data.sell.forEach(ask => asks.push(this.parseOrder(ask)));
    data.buy.forEach(bid => bids.push(this.parseOrder(bid)));

    return [asks, bids]
  }

  static parseOrder(order) {
    return {
      price: order.Rate,
      quantity: order.Quantity
    }
  }
}

module.exports = {
  BittrexAPI,
  PoloniexAPI
}
