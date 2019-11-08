const express = require('express');
const path = require('path');
const request = require('request')
const OrderBook = require('./OrderBook.js');

const app = express();
const B_GET = 'https://api.bittrex.com/api/v1.1/public/getorderbook?market=BTC-ETH&type=both';
const P_GET = 'https://poloniex.com/public?command=returnOrderBook&currencyPair=BTC_ETH&depth=100'


app.use(express.static(path.join(__dirname, 'client/build')));
app.get('/foo', (req, res) => {
    request(B_GET, function(error, response, body) {
      let result = JSON.parse(body)['result']
      let ob = OrderBook.fromBittrex(result)
    });

    // request(P_GET, function(error, response, body) {
    //   let result = JSON.parse(body)
    //   ob = OrderBook.fromPolo(result)
    // });

    res.send("Done")
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
})

PORT = process.env.PORT || 3001;
console.log("Started server on port: ", PORT)
app.listen(PORT)
