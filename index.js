const express = require('express')
const exphbs  = require('express-handlebars')
const path = require('path')
const Handlebars = require('handlebars')
const CombinedOrderBook = require('./OrderBook.js').CombinedOrderBook
const API = require('./API.js')

const app = express()

let hbs = exphbs.create({
  helpers: {
    formatQuantities: function(quantities, names) {
      console.log('quantities: ', quantities);
      console.log('names: ', names);

      let total = quantities.reduce((acc, q) => acc + q.quantity, 0).toFixed(2)
      ret = '' + total

      let byName = {}
      quantities.forEach(q => byName[q.name] = q.quantity)

      ret += "("

      for(let i = 0; i < names.length; i++) {
        let name = names[i]
        ret += `<span class="api-${name}">`

        let q = byName[name]
        if(q == undefined) {
          ret += "0"
        } else {
          ret += q.toFixed(2)
        }
        ret += '</span>'
        if(i != names.length - 1) {
          ret += ', '
        }
      }

      ret += ')'

      // for(let i = 0; i < quantities.length; i++) {
      //   let q = quantities[i]
      //   ret += `<span class="api-${q.name}">(`
      //   ret += `${q.name}:`
      //   ret += q.quantity.toFixed(2)
      //   ret += ')</span>'
      // }

      return new Handlebars.SafeString(ret)
    }
  }
})

app.engine('handlebars', hbs.engine)



app.set('view engine', 'handlebars')
app.use(express.static('public'))


app.get('/', async (req, res) => {
  let precision = req.query.precision || 4

  queries = [API.BittrexAPI.orderBook(precision), API.PoloniexAPI.orderBook(precision)]
  Promise.all(queries).then( ([bittrex, poloniex]) => {
    let combined = new CombinedOrderBook(bittrex, poloniex)

    res.render("home", {
      ob: combined,
      names: ["Bittrex", "Poloniex"]
    })
  })
})

PORT = process.env.PORT || 3001;
console.log("Started server on port: ", PORT)
app.listen(PORT)
