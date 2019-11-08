const express = require('express')
const exphbs  = require('express-handlebars')
const path = require('path')
const request = require('request')
const util = require('util')

const OrderBook = require('./OrderBook.js').OrderBook;

const app = express()
app.engine('handlebars', exphbs())
app.set('view engine', 'handlebars')

const B_GET = 'https://api.bittrex.com/api/v1.1/public/getorderbook?market=BTC-ETH&type=both';
const P_GET = 'https://poloniex.com/public?command=returnOrderBook&currencyPair=BTC_ETH&depth=100'

app.use(express.static('public'))

app.get('/', (req, res) => {
  let precision = req.query.precision || 4

  request(B_GET, function(error, response, body) {
    let result = JSON.parse(body)['result']
    let ob = OrderBook.fromBittrex(result, precision)
    res.render("home", {
      ob: ob
    })
  })

    // request(P_GET, function(error, response, body) {
    //   let result = JSON.parse(body)
    //   ob = OrderBook.fromPolo(result)
    // });
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
})

PORT = process.env.PORT || 3001;
console.log("Started server on port: ", PORT)
app.listen(PORT)
