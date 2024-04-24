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

// Definieer de basis-URL voor API-verzoeken
const baseUrl = "https://fdnd-agency.directus.app";

// Haal de gegevens van de FDND Agency API op
const fetchData = async () => {
  const allDataAdvertisements = await fetchFromApi("/items/dh_services");
  return allDataAdvertisements;
};
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
  fetchJson(apiUrl + '?fields=*,image.id,image.height,image.width' + 'filter={%22type%22:%aanbod%22}').then((apiData) => {
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

// POST-route voor het liken van een service
app.post("/like", async function (request, response) {
  const initiatiefId = request.body.initiatiefId;
  const likes = request.body.likes;

  console.log("Like verzoek voor service met ID:", initiatiefId);
  console.log("Total likes:", likes);
  
  if (initiatiefId) {
      // Update het aantal likes in de Directus API

      fetchJson(`${apiUrl}/${initiatiefId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ likes: likes })
      }).then((data) => {
          console.log(data);
          console.log("Aantal likes bijgewerkt voor service:", initiatiefId, likes);
      }).catch((error) => {
          console.error("Error patching likes in Directus API:", error);
      });

  
  } else {
    // Laat het weten als de service niet gevonden is.
    console.log("Service niet gevonden voor ID:", initiatiefId);
    response.status(404).send("Service niet gevonden");
  }
});