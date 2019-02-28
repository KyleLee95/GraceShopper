const router = require('express').Router()
const {Beer, Review, Category, Brewery} = require('../db/models')
module.exports = router

//CREATE BEER
router.post('/', async (req, res, next) => {
  try {
    //Create new beer
    const newBeer = await Beer.create({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      inventory: req.body.inventory,
      abv: req.body.abv,
      ibu: req.body.ibu,
      type: req.body.type
    })
    //Assign tags to the newly created beer
    const tagsArr = req.body.tags.split(' ')
    let tagToBeAssigned

    for (let i = 0; i < tagsArr.length; i++) {
      tagToBeAssigned = await Category.findOrCreate({
        where: {
          tag: tagsArr[i]
        }
      })
      newBeer.addCategory(tagToBeAssigned[0].id)
    }

    //Assign brewery to the newly created beer
    const breweryToBeAssigned = await Brewery.findOrCreate({
      where: {
        name: req.body.brewery
      }
    })
    newBeer.setBrewery(breweryToBeAssigned[0].id)
    res.status(201).json(newBeer)
  } catch (error) {
    next(error)
  }
})

router.get('/', async (req, res, next) => {
  try {
    const beers = await Beer.findAll({include: {model: Category}})
    if (beers.length > 0) res.json(beers)
    else {
      res.sendStatus(500)
    }
  } catch (err) {
    next(err)
  }
})

router.get('/search', async (req, res, next) => {
  try {
    const beers = await Beer.findAll({
      include: {model: Category, where: {tag: req.query.tag}}
    })
    res.send(beers)
  } catch (err) {
    next(err)
  }
})

router.get('/:beerId', async (req, res, next) => {
  try {
    const beer = await Beer.findById(req.params.beerId, {
      include: [Review, Category]
    })
    !beer ? res.sendStatus(500) : res.json(beer)
  } catch (error) {
    next(error)
  }
})

//Admin routes

const isAdmin = (req, res, next) => {
  if (req.user.userType === 'admin') {
    next()
  } else {
    const err = new Error('Must be an admin')
    res.status(401)
    next(err)
  }
}

router.delete('/:beerId', isAdmin, async (req, res, next) => {
  try {
    const toDelete = await Beer.findById(req.params.beerId)
    await toDelete.destroy()
    res.status(201).send('Successfully deleted Beer')
  } catch (error) {
    next(error)
  }
})

router.put('/:beerId', isAdmin, async (req, res, next) => {
  try {
    const editedBeer = await Beer.findById(req.params.beerId, {
      include: {model: Category}
    })
    const updatedBeer = await editedBeer.update(req.body, {
      fields: Object.keys(req.body)
    })

    res.status(200).send(updatedBeer)
  } catch (err) {
    next(err)
  }
})
