require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(express.static('dist'))
app.use(express.json())
app.use(cors())

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

app.get('/info', (req, res) => {
Person.find({}).then(persons => {
    const date = new Date();
    const numberOfPersons = persons.length;

    const infoHtml = `
    <p>Phonebook has info for ${numberOfPersons} people</p> 
    <p>${date}</p>
    `;

    res.send(infoHtml);
})
.catch(error => {
    console.error(error);
    res.status(500).send({ error: 'An error occurred while fetching data' });
});
  });

app.get( '/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
    .then(person => {
        if (person) {
            response.json(person)
        } else {
            response.status(404).end()
        }
    })
    .catch(error => next(error))
    //this is without mongodb and using only the json that is at the end
    /* const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    } */
})

app.delete( '/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
    .then(() => {
        response.status(204).end()
    })
    .catch(error => next(error))
    /* const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end() */
})

const generateId = () => {
    let id = Math.floor(Math.random() * 10000)
    return id
}

app.post( '/api/persons', (request, response, next) => {
    const body = request.body

    const person = new Person ({
        name: body.name,
        number: body.number,
        id: generateId()
    })

    person.save()
    .then(personSaved => {
        response.json(personSaved)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person =  {
        name: body.name,
        number: body.number,
        }

    Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => response.json(updatedPerson))
    .catch(error => next(error))
})
/* const existingPerson = persons.find(person => person.name === body.name)
if(existingPerson){
    return response.status(400).json({
        error: 'name already exist'
    })
} */

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    if(error.name === 'CastError'){
        return response.status(400).send({ error: 'malformatted id' })
    } else if(error.name === 'ValidationError'){
        return response.status(400).send({ error: error.message })
    }
    next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})