require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))


app.use(morgan((tokens, req, res) => {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens['response-time'](req, res), 'ms',
        req.method === 'POST' ? JSON.stringify(req.body) : '',
    ].join(' ');
}));


app.get('/', (request, response) => {
    response.send('dist/index.html')
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
    response.json(persons)
    })
})

app.get('/info', (request, response) => {
    const date = new Date;
    const numberOfPersons = persons.length;

    const infoHtml = `
    <p>Phonebook has info for ${numberOfPersons} people</p> 
    <p> ${date}</p>
    `

    response.send(infoHtml)
})

app.get( '/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
    //this is without mongodb and using only the json that is at the end
    /* const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    } */
})

app.delete( '/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const generateId = () => {
    id = Math.floor(Math.random() * 10000)
    return id
}

app.post( '/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number missing'
        })
    }

    /* const existingPerson = persons.find(person => person.name === body.name)
    if(existingPerson){
        return response.status(400).json({
            error: 'name already exist'
        })
    } */

    const person = new Person ({
        name: body.name,
        number: body.number,
        id: generateId()
    })

    person.save().then(personSaved => {
        response.json(personSaved)
    })
})


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

/* let persons = [
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
 */