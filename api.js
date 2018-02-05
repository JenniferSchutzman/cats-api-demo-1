require('dotenv').config()
const express = require('express')
const app = express()
const HTTPError = require('node-http-error')
const bodyParser = require('body-parser')
const port = process.env.PORT || 5000
const { pathOr, compose, head, last, split, filter, toLower } = require('ramda')

const cats = [
  { name: 'Mittens', age: 3, gender: 'Female', breed: 'Tabby' },
  { name: 'Muffins', age: 2, gender: 'Male', breed: 'Siamese' },
  { name: 'Mr. Handsome', age: 8, gender: 'Male', breed: 'Tom' },
  { name: 'Miss Krunkles', age: 5, gender: 'Female', breed: 'Torty' }
]

app.get('/', (req, res) => res.send('meow.'))

//http://localhost:5000/cats?filter=breed:Tabby
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

app.listen(port, () => console.log('CATS! ', port))
