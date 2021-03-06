const path = require('path')
const express = require('express')
const hbs = require('hbs')

const geoCode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('/', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Julio Cesar',
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Julio Cesar',
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        message: 'This is a helpful message',
        title: 'Help',
        name: 'Julio Cesar'
    })
})

app.get('/weather', (req, res) => {
    if(!req.query.address) {
        return res.send({
            error: 'You must provide an address!'
        })
    }

    geoCode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if(error) {
            return res.send({ error })
        }
        
        forecast(latitude, longitude, (error, forecast) => {
            
            if(error) {
                return res.send(error)
            }
            
            res.send({
                forecast,
                location: location,
                address: req.query.address
            })

        })
    })

})

app.get('/products', (req, res) => {
    console.log(req.query)
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404!',
        name: 'Julio Cesar',
        error: 'Help Article Not Found!'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404!',
        name: 'Julio Cesar',
        error: '404! Page Not Found.'
    })
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => console.log(`Server running on port ${PORT}!`))