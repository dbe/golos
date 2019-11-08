describe("CombinedOrderBook", function() {
  var combine = require('../../OrderBook').combine;
  let aName = "Nakamoto industries"
  let aOrders = [
    {price: 100.12, quantity: 12.2},
    {price: 55.54, quantity: 10},
  ]

  let bName = "Buterin inc"
  let bOrders = [
    {price: 100.12, quantity: 10.2},
    {price: 55.55, quantity: 44},
  ]


  it("should combine correctly.", function() {
    let expected = [
      {price: 100.12, quantities: [
        {name: "Nakamoto industries", quantity: 12.2},
        {name: "Buterin inc", quantity: 10.2},
      ]},
      {price: 55.55, quantities: [{name: "Buterin inc", quantity: 44}]},
      {price: 55.54, quantities: [{name: "Nakamoto industries", quantity: 10}]},
    ]

    let aOrdersCopy = JSON.parse(JSON.stringify(aOrders))
    let bOrdersCopy = JSON.parse(JSON.stringify(bOrders))

    let combined = combine(aOrders, aName, bOrders, bName)
    expect(combined).toEqual(expected)

    //Check we didn't mutate orders
    expect(aOrders).toEqual(aOrdersCopy)
    expect(bOrders).toEqual(bOrdersCopy)
  })
});
