const CACHE_NAME = 'v1_cache_basementpwa',
urlsToCache=[
  './',
  'https://fonts.googleapis.com/css?family=Roboto+Condensed:400,400i,700,700i',
  './assets/css/styles.css',
  './script.js'
]

//durante la fase de intalacion, generalmente se almacena en cache los activos estaticos
self.addEventListener('install', e=>{
  e.waitUntil(
    caches.open(CACHE_NAME)
    .then(cache=>{
      return cache.addAll(urlsToCache)
      .then(()=>self.skipWaiting())
    })
    .catch(err=>console.log('Fallo registro de cache',err))
  )
})

//una vez que se instala el SW, se activa y busca los recursos para hacer que funcione sin conexion
self.addEventListener('activate',e=>{
  const cacheWhitelist=[CACHE_NAME]

  e.waitUntil(
    caches.keys()
    .then(cachesNames => {
      cachesNames.map(cacheName =>{
        //eliminamos lo que ya no se nesesita en cache
        if(cacheWhitelist.indexOf(cacheName)===-1){
          return caches.delete(cacheName)
        }
      })
    })
    //le indica al SW activar el cache actual
    .then(()=>self.clients.claim())
  )
})

//Cuando el navegador recupera la url
self.addEventListener('fetch', e=>{
  //Responder ya sea con el objeto en cache o continuar y buscar la url real
  e.respondWith(
    caches.match(e.request)
    .then(res=>{
      if(res){
        //recuperar del cache
        return res
      }
      //recuperar de la peticion a la url
      return fetch(e.request)
    })
  )
})