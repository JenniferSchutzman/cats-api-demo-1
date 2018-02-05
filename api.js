require('dotenv').config()
const express = require('express')
const app = express()
const HTTPError = require('node-http-error')
const bodyParser = require('body-parser')
const port = process.env.PORT || 5000

app.get('/', (req, res) => res.send('meow.'))

app.listen(port, () => console.log('CATS! ', port))
