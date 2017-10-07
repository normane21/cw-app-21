angular.module('app.services', [])


.service('APIService', function($q, $http, apiUrl, $rootScope) {
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
        getallofficers: function (token) {
           
            var deferred = $q.defer(),
                promise = deferred.promise;

                //device_id = 'AAA12345678ab';

                $http({
                    url: apiUrl +  '/api/v2/admin/all/officer',
                    method: "get",
                    headers: {                          
                        'Authorization': token,
                        'x-auth-key': 'lausgroup21'
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
        getsync: function (token) {
           
            var deferred = $q.defer(),
                promise = deferred.promise;

                //device_id = 'AAA12345678ab';

                $http({
                    url: apiUrl +  '/api/v2/admin/sync',
                    method: "get",
                    headers: {                          
                        'Authorization': token,
                        'x-auth-key': 'lausgroup21'
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

        showlisting: function(){
            //alert('Update Listing')
                $rootScope.itemsList = [];

                //$window.location.reload();   
                //$scope.itemsList.push({"name":"big screen TV", "room":"Basement"});
                //$scope.itemsList.push({"name":"Xbox One", "room":"Basement"});
                //$scope.itemsList.push({"name":"Ice Maker", "room":"Kitchen"});
                //$scope.itemsList.push({"name":"China Cabinet", "room":"Dining Room"});

                //aert('directory')
                document.addEventListener('deviceready', function() {
                  var db = window.sqlitePlugin.openDatabase({name: 'cw1.db', key: 'lgc21normanlausgroup', location: 'default'});

                 
                  db.transaction(function(tx) {
                    tx.executeSql('SELECT * FROM Officers ORDER BY level ASC', [], function(tx, rs) {

                       // alert
                       // $scope.itemsList = DATA_CONFIG.employees;
                       //alert(rs.rows.length)
                        if(rs.rows.length >0){

                            for(var i=0; i<rs.rows.length; i++){
                                $rootScope.itemsList.push(rs.rows.item(i));                    
                            } 
                            
                        }

                        //alert(JSON.stringify($scope.itemsList));
                        //alert('Record count (expected to be 2): ' + JSON.stringify(rs.rows.items);
                        //alert('Record length: ' + JSON.stringify(rs.rows.length));
                    }, function(tx, error) {
                      //alert('SELECT error: ' + error.message);
                    });
                  });
                    
                });
        }

    }

    
})

.factory('BlankFactory', [function(){

}])

.service('BlankService', [function(){

}]);