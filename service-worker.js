
var enableLogs = true;
var cacheName = 'offline';
var version = '0906171213PM';
var cache = cacheName + '-' + version;
var fileList = [
    'index.html',
    'sw-loader.js',
    'https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.7.0/highlight.min.js',
    'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js',
    'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css',
    'https://maxcdn.bootstrapcdn.com/js/ie10-viewport-bug-workaround.js',
    'https://maxcdn.bootstrapcdn.com/css/ie10-viewport-bug-workaround.css',
    'https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css',
    'https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/fonts/fontawesome-webfont.woff2?v=4.6.3',
    'https://fonts.googleapis.com/css?family=Source+Sans+Pro:200,400,200bold,400old',
    'https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlNV_2ngZ8dMf8fLgjYEouxg.woff2',
    'https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGEo0As1BFRXtCDhS66znb_k.woff2',
    'js/docs.min.js',
    'js/main.js',
    'img/profile.jpg',
    'css/main.css'
];

self.addEventListener('install', function(event) {
    event.waitUntil(caches
                        .open(cache)
                        .then(function(cache) {
                            if (enableLogs) console.log('[ServiceWorker] Caching files ' + fileList);
                            cache.addAll(fileList);
                        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(caches.match(event.request)
                        .then(function(response) {
                            if (response) {
                                if (enableLogs) console.log('Fulfilling ' + event.request.url + ' from cache.');
                                return response;
                            } else {
                                if (enableLogs) console.log(event.request.url + ' not found in cache, fetching from network.');
                                return fetch(event.request);
                            }
                        })
    );
});

self.addEventListener('activate', function(event) {
    event.waitUntil(caches.keys()
                        .then(function(keyList) {
                            if (enableLogs) console.log('keyList='+keyList);
                            Promise.all(keyList.map(function(key) {
                                if (key !== cache) {
                                    if (enableLogs) console.log('[ServiceWorker] Removing old cache ', key);
                                    return caches.delete(key);
                                }
                            }));
                        })
    );
});
