describe("OrderBook", function() {
  var aggregate = require('../../OrderBook').aggregate;
  let orders = [
    {price: 100.124, quantity: 12.2},
    {price: 100.123, quantity: 15.2},
    {price: 55.1234567, quantity: 10},
    {price: 55.12567, quantity: 5},
  ]


  it("should aggregate correctly. Precision=2", function() {
    let expected = [
      {price: 100.12, quantity: 27.4},
      {price: 55.12, quantity: 10},
      {price: 55.13, quantity: 5},
    ]

    let ordersCopy = JSON.parse(JSON.stringify(orders))

    let aggregated = aggregate(orders, 2)
    expect(aggregated).toEqual(expected)

    //Check we didn't mutate orders
    expect(orders).toEqual(ordersCopy)
  })

  it("should aggregate correctly. Precision=0", function() {
    let expected = [
      {price: 100, quantity: 27.4},
      {price: 55, quantity: 15},
    ]

    let ordersCopy = JSON.parse(JSON.stringify(orders))

    let aggregated = aggregate(orders, 0)
    expect(aggregated).toEqual(expected)

    //Check we didn't mutate orders
    expect(orders).toEqual(ordersCopy)
  })
});
