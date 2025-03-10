const express = require('express')
const app = express()

let notes = [
    {
        id: "1",
        content: "HTML is easy",
        important: true
    },
    {
        id: "2",
        content: "Browser can execute only JavaScript",
        important: false
    },
    {
        id: "3",
        content: "GET and POST are the most important methods of HTTP protocol",
        important: true
    }
]
app.use(express.json())
app.use(express.static('dist'))
// Otetaan käyttöön json expressille, jotta voidaan muuttaa json-merkkijono js-olioksi ja toisinpäin.
// Tämä middleware muuttaa json-muotoisen merkkijonon js-olioksi ennen post-tapahtumakäsittelijää.

const requestLogger = (request, response) => {
    console.log('Method:', request.method)
    console.log('Path', request.path)
    console.log('Body', request.body)
    console.log('---')
}

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
    response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
    const id = request.params.id
    const note = notes.find(note => note.id === id)

    if(note){
        response.json(note)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/notes/:id', (request, response) => {
    const id = request.params.id
    notes = notes.filter(note => note.id !== id)

    response.status(204).end()
})

const generateId = () => {
    const maxId = notes.length > 0
    ? Math.max(...notes.map(n => Number(n.id)))
    : 0
    
    return String(maxId + 1)
}

app.put('/api/notes/:id', (request, response) => {
    const id = request.params.id
    const note = notes.find(n => n.id === id)
    const changedNote = request.body

    if(!note) {
        return response.status(404).json({message: 'Note not found'})
    }
    response.send(changedNote)
})

app.post('/api/notes', (request, response) => {
    const body = request.body // middleware on jo muuttanut tässä json-merkkijonon js-olioksi eli note on js-olio.
   
    if(!body.content) {
        return response.status(400).json({error: "content missing"})
    }
    
    const note = {
        id: generateId(),
        content: body.content,
        important: body.important || false
    }

    requestLogger(request)
    notes = notes.concat(note)
    response.json(note) // tämä muuttaa js-olion takaisin json-merkkijonoksi ja lähettää sen näin takaisin asiakkaalle.
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})


// const http = require('http')
// const app = http.createServer((request, response) => {
//   response.writeHead(200, { 'Content-Type': 'application/json' })
//   response.end(JSON.stringify(notes))
// }) // This would be without express