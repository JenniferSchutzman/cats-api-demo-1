require('dotenv').config()
const express = require('express')
const app = express()
const HTTPError = require('node-http-error')
const bodyParser = require('body-parser')
const port = process.env.PORT || 5000
const {
  not,
  isEmpty,
  propOr,
  append,
  pathOr,
  compose,
  head,
  last,
  split,
  filter,
  find,
  toLower,
  reject
} = require('ramda')

var cats = [
  { name: 'Mittens', age: 3, gender: 'Female', breed: 'Tabby' },
  { name: 'Muffins', age: 2, gender: 'Male', breed: 'Siamese' },
  { name: 'Mr. Handsome', age: 8, gender: 'Male', breed: 'Tom' },
  { name: 'Miss Krunkles', age: 5, gender: 'Female', breed: 'Torty' }
]

app.use(bodyParser.json())

app.get('/', (req, res) => res.send('meow.'))

app.post('/cats', (req, res, next) => {
  // req.body
  const catToAdd = propOr({}, 'body', req)

  if (not(isEmpty(catToAdd))) {
    // add the cat to the cats array

    cats = append(catToAdd, cats)

    res.send(cats)
  } else {
    // tell the client, where's the cat?
    next(new HTTPError(400, 'Missing cat resource in request body.'))
  }
})

app.put('/cats/:name', (req, res, next) => {
  const catToAdd = propOr({}, 'body', req)
  if (not(isEmpty(catToAdd))) {
    const deletedCat = cat => cat.name === catToAdd.name
    cats = compose(append(catToAdd), reject(deletedCat))(cats)
    res.send(cats)
  } else {
    next(new HTTPError(400, 'Missing cat resource in request body.'))
  }
})

app.get('/cats/:name', (req, res, next) => {
  const foundCat = find(cat => cat.name === req.params.name, cats)

  if (foundCat) {
    res.send(foundCat)
  } else {
    next(new HTTPError(404, 'Cat Not Found'))
  }
})

app.delete('/cats/:name', (req, res, next) => {
  const foundCat = find(cat => cat.name === req.params.name, cats)
  const deletedCat = cat => cat.name === foundCat.name

  if (foundCat) {
    cats = reject(deletedCat, cats)
    res.send(cats)
  } else {
    next(new HTTPError(404, 'Cat Not Found'))
  }
})

app.get('/cats', (req, res) => {
  // req.query.filter
  const queryFilter = pathOr('no filter', ['query', 'filter'], req) // 'no filter' or 'breed:Tabby'

  if (queryFilter === 'no filter') {
    res.send(cats)
  } else {
    const searchProp = compose(head, split(':'))(queryFilter) // 'breed'
    var searchValue = compose(last, split(':'))(queryFilter) // 'tabby'

    function catFilter(cat) {
      searchValue = isNaN(Number(searchValue))
        ? toLower(searchValue)
        : searchValue
      const catValue = isNaN(Number(cat[searchProp]))
        ? toLower(cat[searchProp])
        : Number(cat[searchProp])

      return catValue == searchValue //return true or false
    }

    res.send(filter(catFilter, cats))
  }
})

// recording / logging the error
app.use((err, req, res, next) => {
  console.log(req.method, req.path, err.status, ' error: ', err)
  next(err)
})

// sends the error response object
app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.send({ status: err.status || 500, message: err.message })
  next(err)
})

app.listen(port, () => console.log('CATS! ', port))
