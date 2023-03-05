const express = require('express')
const app = express()
const PORT = 3001

app.use(express.json())

let persons = [
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
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        res.status(200).json(person)
    } else {
        res.status(404).json({error: 'person not found'})
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    // res.status(204).end()
    res.status(200).json(persons)
})


app.get('/info', (req, res) => {
    const info = `Phonebook has info for ${persons.length} people <br><br>
    ${new Date()}`
    res.status(200).send(info)
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})