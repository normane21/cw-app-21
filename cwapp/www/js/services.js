angular.module('app.services', [])


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
        }

    }

    
})

.factory('BlankFactory', [function(){

}])

.service('BlankService', [function(){

}]);