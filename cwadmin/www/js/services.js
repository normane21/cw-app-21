angular.module('starter.services', [])


.service('APIService', function($q, $http, apiUrl) {
    return {

        // Get Token
        getToken: function () {
           
            var deferred = $q.defer(),
                promise = deferred.promise;
              
                $http({
                    url: apiUrl +  '/api/oauth/token',
                    method: 'post',
                    data:{
                        'initial_password': 'lgcapi21'
                    }
                    
                })
                 .then(function (response) {
                    //alert('Success On API Service ' + JSON.stringify(response));
                    if (response.status === 200) {
                        deferred.resolve(response.data);
                    } else {
                        deferred.reject(response.data);
                    }
                }, function (error) {
                    alert('Error On API Service ' + JSON.stringify(error));
                    deferred.reject(error);
                });
                
                
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            };
            return promise;
        },

       

        // Login
        login: function (token, username, password) {
           
            var deferred = $q.defer(),
                promise = deferred.promise;

                //device_id = 'AAA12345678ab';

                $http({
                    url: apiUrl +  '/api/v2/admin/login',
                    method: "post",
                    headers: {                          
                        'Authorization': token
                    },
                    data:{
                        'initial_password': 'lgcapi21',
                        'username': username,
                        'password': password
                    }
                    
                })
                 .then(function (response) {
                    //alert('Success On API Service ' + JSON.stringify(response));
                    if (response.status === 200) {
                        deferred.resolve(response.data);
                    } else {
                        deferred.reject(response.data);
                    }
                }, function (error) {
                    //alert('Error On API Service ' + JSON.stringify(error));
                    deferred.reject(error);
                });
                
                
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            };
            return promise;
        },

        
        
        // Get All Officers
        getallofficers: function (token, auth_key) {
           
            var deferred = $q.defer(),
                promise = deferred.promise;

                //device_id = 'AAA12345678ab';

                $http({
                    url: apiUrl +  '/api/v2/admin/all/officer',
                    method: "get",
                    headers: {                          
                        'Authorization': token,
                        'x-auth-key': auth_key
                      }
                    
                })
                 .then(function (response) {
                    //alert('Success On API Service ' + JSON.stringify(response));
                    if (response.status === 200) {
                        deferred.resolve(response.data);
                    } else {
                        deferred.reject(response.data);
                    }
                }, function (error) {
                    //alert('Error On API Service ' + JSON.stringify(error));
                    deferred.reject(error);
                });
                
                
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            };
            return promise;
        },


    }

    
})


.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
