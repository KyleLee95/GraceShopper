import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {Card, Button, Container, Row, Col, Image, Table} from 'react-bootstrap'
import {
  fetchSingleOrder,
  markOrderAsCompleted,
  markOrderAsProcessing,
  markOrderAsCancelled
} from '../store/singleOrder'

class SingleOrder extends React.Component {
  componentDidMount() {
    const id = parseInt(this.props.match.params.orderId, 10)
    this.props.fetchSingleOrder(id)
  }

  render() {
    const {
      singleOrder,
      onMarkOneOrderAsProcessing,
      onMarkOneOrderAsCompleted,
      onMarkOneOrderAsCancelled,
      user
    } = this.props
    console.log('SINGLE ORDER', singleOrder)
    if (user.userType === 'admin') {
      return (
        <div>
          <Link to="/orders">
            <Button>All Orders</Button>
          </Link>
          <Container>
            <Row>
              <Col xs={12} sm={4}>
                <Card>
                  <Card.Body>
                    <Card.Text>
                      Order #: {singleOrder.id}
                      <br />
                      Status: {singleOrder.status}
                      <br />
                      Ordered On: {singleOrder.orderDate}
                      <br />
                      <strong>Shipping To:</strong>
                      <br />
                      {user.firstName}
                      {user.lastName}
                      {singleOrder.streetAddress}
                      <br />
                      {singleOrder.city},
                      {singleOrder.state}
                      <br />
                      {singleOrder.zipCode}
                      <br />
                      {singleOrder.phoneNumber}
                      <br />
                    </Card.Text>
                  </Card.Body>
                  <Button
                    onClick={() =>
                      onMarkOneOrderAsProcessing({
                        id: singleOrder.id,
                        phoneNumber: singleOrder.phoneNumber,
                        streetAddress: singleOrder.streetAddress,
                        city: singleOrder.city,
                        zipCode: singleOrder.zipCode,
                        state: singleOrder.state,
                        status: 'processing'
                      })
                    }
                  >
                    Mark as Processing
                  </Button>
                  <br />
                  <Button
                    onClick={() =>
                      onMarkOneOrderAsCompleted({
                        id: singleOrder.id,
                        phoneNumber: singleOrder.phoneNumber,
                        streetAddress: singleOrder.streetAddress,
                        city: singleOrder.city,
                        zipCode: singleOrder.zipCode,
                        state: singleOrder.state,
                        status: 'completed'
                      })
                    }
                  >
                    Mark as Completed
                  </Button>
                  <br />
                  <Button
                    onClick={() =>
                      onMarkOneOrderAsCancelled({
                        id: singleOrder.id,
                        phoneNumber: singleOrder.phoneNumber,
                        streetAddress: singleOrder.streetAddress,
                        city: singleOrder.city,
                        zipCode: singleOrder.zipCode,
                        state: singleOrder.state,
                        status: 'Cancelled'
                      })
                    }
                  >
                    Mark as Cancelled
                  </Button>
                </Card>
              </Col>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Product ID:</th>
                    <th>Item:</th>
                    <th>Qty:</th>
                    <th>Price:</th>
                  </tr>
                </thead>

                <tbody>
                  {singleOrder.orderItems
                    ? singleOrder.orderItems[0]
                      ? singleOrder.orderItems[0].beer
                        ? singleOrder.orderItems.map(orderItem => (
                            <tr key={orderItem.id}>
                              <td>{orderItem.id}</td>
                              <td>
                                <Image
                                  src={orderItem.beer.imgURL}
                                  className="cartImg float-left"
                                />
                                <Link to={`/beers/${orderItem.beer.id}`}>
                                  {orderItem.beer.title}
                                </Link>
                              </td>
                              <td>{orderItem.quantity}</td>
                              <td>{orderItem.price}</td>
                            </tr>
                          ))
                        : 'No Items'
                      : 'No Items'
                    : 'No Items'}
                  <br />
                  <tr>
                    <td>
                      {' '}
                      <strong>Subtotal</strong>
                    </td>
                    <td />
                    <td />
                    <td>
                      {' '}
                      <strong>{singleOrder.totalCost}</strong>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Row>
          </Container>
        </div>
      )
    } else {
      return (
        <div>
          <Link to="/orders">
            <Button>All Orders</Button>
          </Link>
          <Container>
            <Row>
              <Col xs={12} sm={4}>
                <Card>
                  <Card.Body>
                    <Card.Text>
                      Order #: {singleOrder.id}
                      <br />
                      Status: {singleOrder.status}
                      <br />
                      Ordered On: {singleOrder.orderDate}
                      <br />
                      <strong>Shipping To:</strong>
                      <br />
                      {user.firstName}
                      {user.lastName}
                      {singleOrder.streetAddress}
                      <br />
                      {singleOrder.city},
                      {singleOrder.state}
                      <br />
                      {singleOrder.zipCode}
                      <br />
                      {singleOrder.phoneNumber}
                      <br />
                    </Card.Text>
                  </Card.Body>

                  <Button
                    onClick={() =>
                      onMarkOneOrderAsCancelled({
                        id: singleOrder.id,
                        phoneNumber: singleOrder.phoneNumber,
                        streetAddress: singleOrder.streetAddress,
                        city: singleOrder.city,
                        zipCode: singleOrder.zipCode,
                        state: singleOrder.state,
                        status: 'Cancelled'
                      })
                    }
                  >
                    Mark as Cancelled
                  </Button>
                </Card>
              </Col>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Product ID:</th>
                    <th>Item:</th>
                    <th>Qty:</th>
                    <th>Price:</th>
                  </tr>
                </thead>

                <tbody>
                  {singleOrder.orderItems
                    ? singleOrder.orderItems.map(orderItem => (
                        <tr key={orderItem.id}>
                          <td>{orderItem.id}</td>
                          <td>{orderItem.id}</td>
                          <td>{orderItem.quantity}</td>
                          <td>{orderItem.price}</td>
                        </tr>
                      ))
                    : 'No Items'}
                </tbody>
              </Table>
            </Row>
          </Container>
        </div>
      )
    }
  }
}

const mapStateToProps = state => {
  return {
    singleOrder: state.singleOrder,
    user: state.user
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchSingleOrder: id => dispatch(fetchSingleOrder(id)),
    onMarkOneOrderAsProcessing: order => dispatch(markOrderAsProcessing(order)),
    onMarkOneOrderAsCompleted: order => dispatch(markOrderAsCompleted(order)),
    onMarkOneOrderAsCancelled: order => dispatch(markOrderAsCancelled(order))
  }
}

export const ConnectedSingleOrder = connect(
  mapStateToProps,
  mapDispatchToProps
)(SingleOrder)
