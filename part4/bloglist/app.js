const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

const { PORT }= require('./utils/config')

app.use(cors())
app.use(express.json())

app.use('/api', require('./routes/blogs'))

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})