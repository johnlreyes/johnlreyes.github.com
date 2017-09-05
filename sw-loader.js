if ('serviceWorker' in navigator) {
    //console.log('Service Worker supported');
    navigator.serviceWorker
        .register('service-worker.js', {scope: ' '})
        .then(function() {
            //console.log('Service Worker Registered');
        })
        .catch(function(err) {
            //console.error('Problem registering service worker: ' + err);
        });
} else {
    //console.log('Service Worker not supported');
}
