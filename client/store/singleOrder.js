import axios from 'axios'
import {removeCartOnServer} from './cart'
import store from './index'
import {updateBeerInventory} from './singleBeer'

const UPDATE_ORDER_ON_STORE = 'UPDATE_ORDER_ON_STORE'

export const updateOrderOnStore = order => {
  return {
    type: UPDATE_ORDER_ON_STORE,
    order
  }
}
export const fetchSingleOrder = id => {
  return async dispatch => {
    const order = await axios.get(`/api/orders/${id}`)
    dispatch(updateOrderOnStore(order.data))
  }
}

export const createOrder = (fullOrder, history) => {
  return async dispatch => {
    const newOrder = await axios.post(`/api/orders`, fullOrder)
    console.log(
      'Inside singleOrder store createOrder thunk newOrder.Data**********:\n',
      newOrder.data
    )
    newOrder.data.orderItems.forEach(item => {
      console.log(
        'Inside singleOrder store createOrder thunk item.beer.id, item.beer.inventory, item,quantity*************:\n',
        item.beer.id,
        item.beer.inventory,
        item.quantity
      )
      dispatch(
        updateBeerInventory(item.beer.id, item.beer.inventory - item.quantity)
      )
    })
    dispatch(removeCartOnServer(store.getState().user.id))
    dispatch(updateOrderOnStore(newOrder.data))
    history.push(`/orders/${newOrder.data.id}`)
  }
}
export const markOrderAsCompleted = order => {
  return async dispatch => {
    const updatedOrder = await axios.put(`/api/orders/${order.id}`, {
      status: 'completed'
    })

    dispatch(updateOrderOnStore(updatedOrder.data))
  }
}
export const markOrderAsProcessing = order => {
  return async dispatch => {
    const updatedOrder = await axios.put(`/api/orders/${order.id}`, {
      status: 'processing'
    })

    dispatch(updateOrderOnStore(updatedOrder.data))
  }
}

export const markOrderAsCancelled = order => {
  return async dispatch => {
    const updatedOrder = await axios.put(`/api/orders/${order.id}`, {
      status: 'cancelled'
    })

    dispatch(updateOrderOnStore(updatedOrder.data))
  }
}

export const singleOrder = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_ORDER_ON_STORE:
      return action.order
    default:
      return state
  }
}
