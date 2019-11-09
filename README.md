# Overview
Golos is a simple website to show a combined order book for the Bittrex and Poloniex ETH/BTC exchanges. It is written in a way which can be easily extended to include more exchanges as well as more order pairs. You can aggregate the order book to a given level of decimal precision.

There is a notable lack of a front-end framework used. This was a design decision used based on the limited interactive nature of the site. If we were to add realtime updates, and other interactive features, I'd consider using something like React.

The live app is hosted at: https://afternoon-reef-46531.herokuapp.com/

# Style
The code is written in a noteably functional style. The OrderBook.js file is worth particular mention in this regard. The OrderBook and CombinedOrderBook are essentially just named tuples. The main logic of aggregating and combining order books is implemented in a purely functional way, no side effects or mutations. This allows for easy reasoning about the code as well as great unit testability.


# Testing
Unit testing is done with Jasmine. It covers the aggregate and combine functions, the most logically cruxy parts of the app.

To run tests:

```$ npm test```

# Run Locally
1. Clone the repo
2. ```npm install```
3. ```npm start```
4. Go to localhost:3001 in your browser


# TODOS
There are many notable shortcomings and features which need to be improved before this app would be production ready. In the interest of time-capping the work on this project, they have been left as tasks to do later.

1. **Numeric Precision**: Financial data requires numeric precision which floating point numbers don't provide at all magnitudes. Right now, I'm just using the regular Javascript Number class to store the prices and quantities, however in a robust production system, I'd use a precise decimal number type to maintain accuracy.
2. **Add more exchanges**: The way the code is architected, adding new exchanges is quite easy. You just need to create a new class extending the API base class, and fill in the relevant URL, NAME, and parseResults methods.
3. **Add more currency pairs**: The system is also created in a way where this would be quite simple. You just need to add a method to the API classes which translates a canonical currency pair to modify the query URL.
4.**Arbitrage Calculations**:It would be a cool feature to add cross-exchange arbitrage opportunity calculations, as well as in-exchange triangular arbitrage calculations. (I have another project with this implemented for GDAX API)
