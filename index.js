const express = require('express')
const exphbs  = require('express-handlebars')
const path = require('path')
const CombinedOrderBook = require('./OrderBook.js').CombinedOrderBook
const formatQuantities = require('./HandlebarsHelpers.js').formatQuantities
const API = require('./API.js')

const app = express()

let hbs = exphbs.create({
  helpers: {formatQuantities }
})

app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')
app.use(express.static('public'))

app.get('/', async (req, res) => {
  let precision = req.query.precision || 4

  let queries = [API.BittrexAPI.orderBook(precision), API.PoloniexAPI.orderBook(precision)]
  Promise.all(queries).then( ([bittrex, poloniex]) => {
    let combined = new CombinedOrderBook(bittrex, poloniex)

    res.render("home", {
      ob: combined,
      names: ["Bittrex", "Poloniex"]
    })
  })
})

PORT = process.env.PORT || 3001
console.log("Started server on port: ", PORT)
app.listen(PORT)
