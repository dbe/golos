const express = require('express')
const exphbs  = require('express-handlebars')
const path = require('path')
const CombinedOrderBook = require('./OrderBook.js').CombinedOrderBook
const API = require('./API.js')

const app = express()
app.engine('handlebars', exphbs())
app.set('view engine', 'handlebars')
app.use(express.static('public'))


app.get('/', async (req, res) => {
  let precision = req.query.precision || 4

  // let bittrex = API.BittrexAPI.orderBook()
  let poloniex = API.PoloniexAPI.orderBook()
  console.log('poloniex: ', poloniex);
  // console.log('poloniex: ', poloniex);
  // let combined = new CombinedOrderBook(bittrex, poloniex)
  // console.log('combined: ', combined);
  res.send("hi")
})

PORT = process.env.PORT || 3001;
console.log("Started server on port: ", PORT)
app.listen(PORT)
