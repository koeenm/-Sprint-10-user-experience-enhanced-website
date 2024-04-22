import express from 'express'
import fetchJson from './helpers/fetch-json.js'

const app = express()
app.set('view engine', 'ejs')
app.set('views', './views')
app.set('port', process.env.PORT || 8000)
app.use(express.static('public'))
// hierdoor word de data makkelijker opgehaaldd
app.use(express.urlencoded({extended: true}))

const apiUrl = 'https://fdnd-agency.directus.app/items/dh_services'
const relatedUrl = await fetchJson(apiUrl)

// => betekend hetzelfde als function
app.get('/', (request, response) => {
    response.render('index')
})

app.get('/detail/:id', function(request, response) {
  fetchJson(apiUrl + '/' + request.params.id).then((initiatiefDetail) => {
    response.render('paginas/detail', {
      initiatief: initiatiefDetail.data,
      relatedContent: relatedUrl.data
    })
    console.log(initiatiefDetail)
  })
})

app.get('/vraag', function (request, response) {
  fetchJson(apiUrl + '?fields=*,image.id,image.height,image.width&filter={%22type%22:%22vraag%22}').then((apiData) => {
    response.render('paginas/vraag', {
        initiatiefVraag: apiData.data
      })
      console.log(apiData.data[0].image.id)
    })
  })

app.get('/aanbod', function (request, response) {
  fetchJson(apiUrl + '?fields=*,image.id,image.height,image.width&filter={%22type%22:%aanbod%22}').then((apiData) => {
    response.render('paginas/aanbod', {
      initiatiefAanbod: apiData.data
    })
    console.log(apiData)
  })
})

app.get('/aanmelden', function(request,response) {
    response.render('paginas/aanmelden')
})

app.get('/faq', function(request, response) {
  response.render('paginas/faq')
})

app.get('/over-ons', function(request, response) {
  response.render('paginas/over-ons')
})

app.get('/contact', function(request, response) {
  response.render('paginas/contact')
})

app.listen(app.get('port'), function () {
  console.log(`Application started on http://localhost:${app.get('port')}`)
})

// like functie

// een post route voor article
//check of de id al in de array staat en tel er 1 bij op, of maak een nieuw object
// stuur de gebruiker door naar het betreffende artikel


// dit is een array van objects waarin de id en like# zit, eg. [{ id: 'bliep', likes: 42}]
let likes = []