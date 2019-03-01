import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {fetchSingleBeer} from '../store/singleBeer'
import {Card, Button, Container, Row, Col, Image} from 'react-bootstrap'
import {Link} from 'react-router-dom'
/**
 * COMPONENT
 */
export const UserHome = props => {
  console.log(props)
  const {email, beer} = props
  return (
    <div className="center">
      <h3>Welcome, {email}</h3>
      <h3>Featured Beer of the Month</h3>
      <br />
      <Container>
        <Row>
          <Col md={{span: 6, offset: 3}}>
            <Card>
              <Row>
                <Col xs={4}>
                  <Card.Img
                    className="thumbNail small-pad-bottom"
                    src={beer.imgURL}
                  />
                  <Link to="/beers/1">
                    <Button>See Beer</Button>
                  </Link>
                </Col>
                <Col xs={8}>
                  <Card.Body className="align-left">
                    <Card.Title>
                      {beer.title}{' '}
                      <span className="small-txt">{beer.type}</span>
                    </Card.Title>
                    <Card.Text>{beer.description}</Card.Text>
                    <Card.Text>${beer.price}</Card.Text>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    email: state.user.email,
    beer: state.singleBeer
  }
}

const mapDispatch = dispatch => {
  return {
    oneBeer: dispatch(fetchSingleBeer(1))
  }
}

export default connect(mapState, mapDispatch)(UserHome)

/**
 * PROP TYPES
 */
UserHome.propTypes = {
  email: PropTypes.string
}
