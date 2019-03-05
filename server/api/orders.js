const router = require('express').Router()
const {
  Beer,
  Review,
  Category,
  Brewery,
  User,
  Order,
  OrderItem
} = require('../db/models')
const {isLoggedIn, isAdmin} = require('./checkCredentials')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
module.exports = router

//CREATE ORDER
router.post('/', async (req, res, next) => {
  console.log(req.body.order)
  try {
    let newOrder = {
      ...req.body.order,
      orderDate: new Date(),
      userId: req.user.id,
      status: 'created',
      totalCost: req.body.cart.reduce(
        (accum, orderItem) => accum + orderItem.beer.price * orderItem.quantity,
        0
      )
    }
    newOrder = await Order.create(newOrder)
    const orderItems = req.body.cart.map(lineItem => {
      return {
        userId: req.user.id,
        orderId: newOrder.id,
        beerId: lineItem.beer.id,
        quantity: lineItem.quantity,
        price: lineItem.beer.price
      }
    })
    await OrderItem.bulkCreate(orderItems)
    newOrder = await Order.findOne({
      where: {id: newOrder.id},
      include: OrderItem
    })
    res.json(newOrder)
  } catch (error) {
    next(error)
  }
})
//UPDATE ORDER
router.put('/:id', async (req, res, next) => {
  try {
    await Order.update(req.body, {
      where: {id: req.params.id}
    })
    const updatedOrder = await Order.findById(req.params.id, {
      include: [{model: OrderItem, include: [{model: Beer}]}]
    })
    res.json(updatedOrder)
  } catch (error) {
    next(error)
  }
})

//GET SINGLE ORDER
router.get('/:id', async (req, res, next) => {
  try {
    const singleOrder = await Order.findById(req.params.id, {
      include: [{model: OrderItem, include: [{model: Beer}]}]
    })
    res.status(200).json(singleOrder)
  } catch (error) {
    next(error)
  }
})

//GET ORDERS
router.get('/', isLoggedIn, async (req, res, next) => {
  try {
    if (req.user.userType === 'admin') {
      const allOrders = await Order.findAll({
        include: [{model: OrderItem, include: [{model: Beer}]}]
      })
      res.json(allOrders)
    } else {
      const allOrders = await Order.findAll({
        where: {
          userId: req.user.id
        },
        include: [{model: OrderItem, include: [{model: Beer}]}]
      })
      res.json(allOrders)
    }
  } catch (error) {
    next(error)
  }
})

//SET ORDER ITEMS
