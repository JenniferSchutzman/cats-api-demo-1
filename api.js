require('dotenv').config()
const express = require('express')
const app = express()
const HTTPError = require('node-http-error')
const bodyParser = require('body-parser')
const port = process.env.PORT || 5000

const cats = [
  { name: 'Mittens', age: 3, gender: 'Female', breed: 'Tabby' },
  { name: 'Muffins', age: 2, gender: 'Male', breed: 'Siamese' },
  { name: 'Mr. Handsome', age: 8, gender: 'Male', breed: 'Tom' },
  { name: 'Miss Krunkles', age: 5, gender: 'Female', breed: 'Torty' }
]

app.get('/', (req, res) => res.send('meow.'))
app.get('/cats', (req, res) => res.send(cats))

app.listen(port, () => console.log('CATS! ', port))
