const express = require('express')
const app = express()
const PORT = 3001

app.use(express.json())

const person = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]


app.get('/api/persons', (req, res) => {
    // In Postman, select GET and enter http://localhost:3001/api/persons
    res.json(person)
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})