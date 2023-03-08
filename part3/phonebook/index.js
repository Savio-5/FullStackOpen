const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/personModel')


app.use(cors())
app.use(express.json())
app.use(
    morgan(":method :url :status :res[content-length] - :response-time ms :data")
);

morgan.token("data", (request) => {
    return request.method === "POST" ? JSON.stringify(request.body) : " ";
});


app.get('/api/persons', (req, res, next) => {
    try {
        Person.find({}).then(result => {
            res.status(200).json(result)
        })
    } catch (error) {
        next(error)
    }
})

app.get('/api/persons/:id', (req, res, next) => {
    const _id = req.params.id

    try {
        Person.findById({ _id }).then(result => {
            res.status(200).json(result)
        })
    } catch (error) {
        next(error)
    }
})

app.delete('/api/persons/:id', (req, res, next) => {
    const id = req.params.id

    try {
        Person.findByIdAndDelete(id).then(result => {
            res.status(204).end()
        })
    } catch (error) {
        next(error)
    }
})

app.post('/api/persons', (req, res, next) => {
    const body = req.body

    if (!body.name) {
        return res.status(404).json({ error: 'name missing' })
    }
    if (!body.number) {
        return res.status(404).json({ error: 'number missing' })
    }
    // if (persons.find(person => person.name === body.name)) {
    //     return res.status(406).json({ error: 'name must be unique' })
    // }
    Person.exists({ name: body.name })
        .then(result => {
            if (!result) {
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
                            res.status(201).json(allresult)
                        })
                    })
                } catch (error) {
                    next(error)
                }
            } else {
                res.status(406).json({ error: 'name must be unique' })
            }
        }
    )
})

app.put("/api/persons/:id", (req, res, next) => {
    const { name, number } = req.body
    const id = req.params.id

    try {
        Person.findByIdAndUpdate(
            id,
            { name, number }
        )
            .then((updatedPerson) => {
                res.status(202).json(updatedPerson);
            })
    } catch (error) {
        next(error)
    }
});


app.get('/info', (req, res, next) => {
    try {
        Person.find({}).then(result => {
            const info = `Phonebook has info for ${result.length} people <br><br>
            ${new Date()}`
            res.status(200).send(info)
        })
    } catch (error) {
        next(error)
    }
})

app.use((req, res) => {
    res.status(404).json({ error: 'unknown endpoint' })
})

app.use((error, req, res, next) => {
    console.error(error)
    if (error.name === 'CastError') {
        res.status(400).send({ error: 'malformatted id' })
    } else {
        res.status(500).send({ error: 'something went wrong' })
    }
    next(error)
})

app.listen(process.env.PORT || 3001, () => {
    console.log(`Server running on port ${process.env.PORT || 3001}`)
})