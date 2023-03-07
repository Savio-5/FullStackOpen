const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const Person = require('./models/personModel')


app.use(cors())
app.use(express.json())
app.use(
    morgan(":method :url :status :res[content-length] - :response-time ms :data")
);

morgan.token("data", (request) => {
    return request.method === "POST" ? JSON.stringify(request.body) : " ";
});

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
    try {
        Person.find({}).then(result => {
            mongoose.connection.close()
            res.json(result)
        })
    } catch (error) {
        console.log(error)
    }
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        res.status(200).json(person)
    } else {
        res.status(404).json({ error: 'person not found' })
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    // res.status(204).end()
    res.status(200).json(persons)
})

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (!body.name) {
        return res.status(404).json({ error: 'name missing' })
    }
    if (!body.number) {
        return res.status(404).json({ error: 'number missing' })
    }
    if (persons.find(person => person.name === body.name)) {
        return res.status(406).json({ error: 'name must be unique' })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    try {
        person.save().then(result => {
            if (result) {
                console.log(`added ${result.name} number ${result.number} to phonebook`)
            }
            Person.find({}).then(allresult => {
                mongoose.connection.close()
                res.status(201).json(allresult)
            })
        })
    } catch (error) {
        res.status(500).json({ error: 'something went wrong' })
    }
})


app.get('/info', (req, res) => {
    try {
        Person.find({}).then(result => {
            const info = `Phonebook has info for ${result.length} people <br><br>
            ${new Date()}`
            res.status(200).send(info)
        })
    } catch (error) {
        res.status(500).json({ error: 'something went wrong' })
    }
})

app.listen(process.env.PORT || 3001, () => {
    console.log(`Server running on port ${process.env.PORT || 3001}`)
})