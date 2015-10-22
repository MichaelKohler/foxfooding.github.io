function sendPushUrl(data) {
  var url = data.url;

  var getUuid = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      var r = window.crypto.getRandomValues(new Uint32Array(1))[0] % 16,
          v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  };

  var sendEndpoint = function(endpoint) {
    $.ajax({
      method: 'POST',
      url: url,
      data: {
        uuid: uuid,
        endpoint: endpoint
      }
    });
  };

  var uuid = localStorage.getItem('uuid') || getUuid();

  var req = navigator.push.register();

  req.onsuccess = function(e) {
    var endpoint = req.result;
    sendEndpoint(endpoint);
  };

  req.onerror = function(e) {
    console.error("Error getting a new endpoint: " + JSON.stringify(e));
  };

  navigator.mozSetMessageHandler('push', function(e) {
    console.log('My endpoint is ' + e.pushEndpoint);
    console.log('My new version is ' +  e.version);
  });

  navigator.mozSetMessageHandler('push-register', function(e) {
    var req = navigator.push.register();
    req.onsuccess = function(e) {
      var endpoint = req.result;
      console.log("New endpoint: " + endpoint );
      sendEndpoint(endpoint);
    }

    req.onerror = function(e) {
      console.error("Error getting a new endpoint: " + JSON.stringify(e));
    }
  });
}

if (navigator.push) {
  $.ajax({
    url: 'push-server.json',
    success: sendPushUrl,
    dataType: 'json'
  });
}
