var cors = require('cors'),express = require('express');
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var async       = require('async');
var passport    = require('passport'); 


var jwt         = require('jsonwebtoken'); 
var config      = require('./config/main');
//var passport      = require('./config/passport');
var AdminUser   = require('./app/models/adminuser');
var AppUser     = require('./app/models/appuser');
var Vehicle     = require('./app/models/vehicle');
var Log         = require('./app/models/log');
var User        = require('./app/models/user');   
var Officer        = require('./app/models/officer'); 
var Sync        = require('./app/models/sync'); 






var token_expiration = 86000;

// Get Queue Route
var total, limit, offset, returned;

var currentdate = new Date();
var datetime = currentdate.getFullYear() + "-"+("0" +(currentdate.getMonth()+1)).slice(-2) 
+ "-" + ("0" +(currentdate.getDay()+1)).slice(-2) + " " 
+ currentdate.getHours() + ":" 
+ currentdate.getMinutes() + ":" + currentdate.getSeconds();

var port = process.env.PORT || 8080; // used to create, sign, and verify tokens
mongoose.connect(config.database); // connect to database
app.set('mockapisecret', config.secret); // secret variable
app.set('mockapirefreshsecret', config.refresh_secret); // refresh token secret variable

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

app.use(passport.initialize());  
require('./config/passport')(passport); 

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8888');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use(cors());

// basic route
app.get('/', function(req, res) {
    res.send('The Mock API is at http://localhost:' + port + '/api');
});


// start the server ======

app.listen(port);
console.log('Local Mock CWX API Server starts at http://localhost:' + port);


// get an instance of the router for api routes
var apiRoutes = express.Router(); 


// Route to authenticate a user (POST http://localhost:8080/api/oauth/token)
apiRoutes.post('/oauth/token', function(req, res) {
  console.log('Get Aunthentication Token');
  // find the uuid
  AdminUser.findOne({
    initial_password: req.body.initial_password
  }, function(err, user) {
    //console.log(initial_password);
    if (err) {
      console.log(err);
       throw err;
    }
    if (!user) {
      //console.log(res);
      res.status(401).json({ message: 'Invalid User', code: 100000 });
    } else if (user) {
      console.log('GetToken');
        
           //console.log(user.initial_password); 
           //console.log(req.body.initial_password);
          // check if password matches
          if (user.initial_password != req.body.initial_password) {
            res.status(400).json({ success: false, message: 'Authentication failed. Wrong password.' });
          } else {
            //console.log('Creating Token')
            // create a token
            var expiration = token_expiration;
            var token = jwt.sign(user, app.get('mockapisecret'), {
              expiresIn: expiration // expires token
            });
            var refresh_token = user.refresh_token;


            //console.log('My Token Expiration : ' + expiration);
            //console.log('Access Token:' + token);
            //console.log('Refresh Token:' + refresh_token);
            // return the information including token as JSON
            res.status(200).json({
              message: 'Device Is Authorized To Use The App!',
              'access_token': token,
              username: user.username,
              auth_key: user.auth_key,
              token_type: 'bearer',
              expires_in: expiration,
              'refresh_token': refresh_token
            });
          } 
    }

  });
});


// Register new users
apiRoutes.post('/register', function(req, res) {  
  if(!req.body.email || !req.body.password) {
    res.json({ success: false, message: 'Please enter email and password.' });
  } else {
    var newUser = new User({
      email: req.body.email,
      password: req.body.password
    });

    // Attempt to save the user
    newUser.save(function(err) {
      if (err) {
        return res.json({ success: false, message: 'That email address already exists.'});
      }
      res.json({ success: true, message: 'Successfully created new user.' });
    });
  }
});

// Route middleware to verify a token
apiRoutes.use(function(req, res, next) {
  //console.log(req.headers); 
  // check header or url parameters or post parameters for token
  var token = req.headers['authorization'];
 

  // decode token
  if (token) {
    console.log('Inside Token Check');
    // verifies secret and checks exp
    jwt.verify(token, app.get('mockapisecret'), function(err, decoded) {      
      if (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: 'Failed to authenticate token.', code: 10088  });    
      } else {
        // if everything is good, save to request for use in other routes
        console.log('Token Accepted');
        req.decoded = decoded;  
       //console.log(decoded)  ;
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided on API Call.'
    });
    
  }
});


apiRoutes.get('/dashboard', passport.authenticate('jwt', { session: true }), function(req, res) { 
  console.log(res); 
  res.send('It worked! User id is: ' + req.user._id + '.');
});

// Device Registration Route (POST http://localhost:8080/api/v2/device/registration)
apiRoutes.post('/v2/admin/login', function(req, res) {
 console.log('Admin Login Endpoint');
  // find the uuid
  AdminUser.findOne({
    initial_password: req.body.initial_password
  }, function(err, user) {

    if (err) {
      console.log(err);
       throw err;
    }
    if (!user) {
      console.log(res);
      res.status(401).json({ message: 'Unauthorized User', code: 100001 });
    } else if (user) {
      console.log(user);
      if((req.body.username != user.username)||(req.body.password != user.password)){
        res.status(402).json({ message: 'Invalid Credentials!!!.', code: 10112 });
      }else{
        res.status(200).json({ 
          'x_auth_key' : user,
          'message': 'User is authorized to use the admin panels',
         

        });
      }
    }

  });
});
 
// Insert Vehcile Route 
apiRoutes.post('/v2/admin/vehicle', function(req, res) {
 console.log('Input Vehicle Details');
  // find the uuid
  AdminUser.findOne({
    auth_key: req.headers['x-auth-key']
  }, function(err, user) {

    if (err) {
      console.log(err);
       throw err;
    }

    if (!user) {
      //console.log(res);
      res.status(401).json({ message: 'Unauthorized User Access', code: 100002 });
    } else if (user) {
      
        console.log('Issued By : ' + req.body.issuedby);
        console.log('Company : ' + req.body.company);
        console.log('Plate No. : ' + req.body.plateno);
        console.log('Brand : ' + req.body.brand);

       

          var vehicleinfo = new Vehicle({
            auth_key: req.headers['x-auth-key'],
                     
                plateno: req.body.plateno,
                brand: req.body.brand,
                model: req.body.model,
                year_model: req.body.year_model,
                transmission: req.body.transmission,
                color_engine_fuel: req.body.color_engine_fuel,
                acquisition_date: req.body.acquisition_date,
                company: req.body.company,
                custodian : req.body.custodian,
                department: req.body.department,
                registered_owner: req.body.registered_owner,
                previous_assignee: req.body.previous_assignee,
                remarks: req.body.remarks,
                actual_mileage: req.body.actual_mileage,
                renewal: req.body.renewal,
                
            datecreated: currentdate
        });

          // save the user
        vehicleinfo.save(function(err) {
            if (err) throw err;

            console.log('Vehicle Info Saved Successfully');
                var loginfo = new Log({
                    datetime: datetime,
                    user: req.body.username
                })

                //save log
                loginfo.save(function(err) {
                    if (err) throw err;
                    
                    res.status(200).json({ 
                      'message': 'Vehicle info set successfully.'
                    });
                })
            
        });
        
    }

  });
});

// Get All Officers Route (POST http://localhost:8080/api/v2/device/passcode)
apiRoutes.get('/v2/admin/all/officer', function(req, res) {
    var jsonData=[];
    console.log('Get All Officers Details');

    AdminUser.findOne({
        auth_key: req.headers['x-auth-key']
    }, function(err, user) {

        if (err) {
          console.log(err);
           throw err;
        }

        if (!user) {
          //console.log(res);
          res.status(401).json({ message: 'Unauthorized User Access', code: 100002 });
        } else if (user) {
            console.log(datetime);
            console.log('Vehicle Info Saved Successfully');

            Officer.find({}).cursor()
            .on('data', function(vehicles){                    
                jsonData.push(vehicles);
            })
            .on('error', function(err){
               
            })
            .on('end', function(){
              console.log("Officer Data Retrieved");
              //var vehicleData = { data: jsonData };
              res.status(200).json(jsonData);

              /*
              res.writeHead(200, {'Content-Type': 'application/json'});
                res.write(jsonData);
              res.end();

              /*
              res.status(200).json({
                   
                  'message': 'Queue retrieved successfully',
                  'code': '200010'
              });
              */
            });
                
                   // res.status(200).json({ 
                   //   'message': 'Vehicle info set successfully.',
                   //   'data': user
                   // });
               
           
         
        }

      });
});

// Get Individual Officers Route 
apiRoutes.get('/v2/admin/individual/officer/:id', function(req, res) {
    var jsonData=[];
    console.log('Get All Officers Details');
    var o_id = req.params.id;

    AdminUser.findOne({
        auth_key: req.headers['x-auth-key']
    }, function(err, user) {

        if (err) {
          console.log(err);
           throw err;
        }

        if (!user) {
          //console.log(res);
          res.status(401).json({ message: 'Unauthorized User Access', code: 100002 });
        } else if (user) {
            console.log(datetime);
            

            Officer.find({_id: o_id}).cursor()
            .on('data', function(officer){        
                console.log('Individual Officer Get Successfully');            
                jsonData.push(officer);
                res.status(200).json(jsonData);
            })
            .on('error', function(err){
                console.log('Error Get Officer')
                 res.status(402).json({ message: 'User Not Exist!!!.', code: 10112 });
            })
                
                   // res.status(200).json({ 
                   //   'message': 'Vehicle info set successfully.',
                   //   'data': user
                   // });
               
           
         
        }

      });
});


// Insert Officer Route
apiRoutes.post('/v2/admin/officer', function(req, res) {
 console.log('Input Officer Details');
  // find the uuid
  AdminUser.findOne({
    auth_key: req.headers['x-auth-key']
  }, function(err, user) {

    if (err) {
      console.log(err);
       throw err;
    }

    if (!user) {
      //console.log(res);
      res.status(401).json({ message: 'Unauthorized User Access', code: 100002 });
    } else if (user) {

                    
            var officerinfo = new Officer({
                
                auth_key: req.headers['x-auth-key'],

                department: req.body.department,
                emp_name1: req.body.emp_name1,
                position1: req.body.position1,
                mobile1: req.body.mobile1,
                email1: req.body.email1,
                emp_name2: req.body.emp_name2,
                position2: req.body.position2,
                mobile2: req.body.mobile2,
                email2: req.body.email2,

                date_created: currentdate
                
            });

            // save the user
            officerinfo.save(function(err) {
                if (err) throw err;

                console.log('Officer Info Saved Successfully');
                var loginfo = new Log({
                    datetime: datetime,
                    user: req.body.username
                })

                //save log
                loginfo.save(function(err) {
                    if (err) throw err;                    
                   
                })

                console.log('App ID: ' + req.body.app_id);

                Sync.findOne({ app_id: req.body.app_id }, function (err, syncstatus){
                    console.log('Sync Status: ' + syncstatus);
                    console.log('Update Status');
                    syncstatus.status += 1;
                    

                    syncstatus.save(function(err) {
                        if (err) throw err;                                           
                    })

                    console.log('Officer Added Successfully');

                    res.status(200).json({
                        'message': 'Officer Added Successfully.'
                    });

                });
                
            });
            
            

    }

  });
});


// Update Officer Route
apiRoutes.put('/v2/admin/officer/:id', function(req, res) {
 console.log('Update Officer Details');
 var o_id = req.params.id;

  // find the uuid
  AdminUser.findOne({
    auth_key: req.headers['x-auth-key']
  }, function(err, user) {

    if (err) {
      console.log(err);
       throw err;
    }

    if (!user) {
      //console.log(res);
      res.status(401).json({ message: 'Unauthorized User Access', code: 100002 });
    } else if (user) {

        console.log('User Details : ' + user)
        console.log('User ID : ' + user._id)
             
                    
            
            Officer.findOne({ _id: o_id }, function (err, officer){    
            
                officer.department = req.body.department,
                officer.emp_name1 =  req.body.emp_name1,
                officer.position1 = req.body.position1,
                officer.mobile1 = req.body.mobile1,
                officer.email1 = req.body.email1,
                officer.emp_name2 = req.body.emp_name2,
                officer.position2 = req.body.position2,
                officer.mobile2 = req.body.mobile2,
                officer.email2 = req.body.email2,

                officer.date_created = currentdate


                // update officer
                officer.save(function(err) {
                    if (err) throw err;

                    console.log('Officer Updated Successfully');
                    var loginfo = new Log({
                        datetime: datetime,
                        user: req.body.username
                    })

                    //save log
                    loginfo.save(function(err) {
                        if (err) throw err;                    
                       
                    })

                    console.log('App ID: ' + req.body.app_id);

                    Sync.findOne({ app_id: 'norman21-cwapp' }, function (err, syncstatus){
                        console.log('Sync Status: ' + syncstatus);
                        console.log('Update Officer Name');
                        syncstatus.status += 1;
                        

                        syncstatus.save(function(err) {
                            if (err) throw err;                                           
                        })

                        console.log('Officer Updated Successfully');

                        res.status(200).json({
                            'message': 'Officer Updated Successfully.'
                        });

                    });
                    
                });
                
            });

            
            
            

    }

  });
});

//Update Sync Status Route 
apiRoutes.post('/v2/admin/sync', function(req, res) {
 console.log('Update Sync Status Details');
  // find the uuid
  AdminUser.findOne({
    auth_key: req.headers['x-auth-key']
  }, function(err, user) {

    if (err) {
      console.log(err);
       throw err;
    }

    if (!user) {
        res.status(401).json({ message: 'Unauthorized User Access', code: 100002 });
    } else if (user) {

       
           
            Sync.findOne({ app_id: req.body.app_id }, function (err, syncstatus){
                console.log('Sync Status: ' + syncstatus.status);
                console.log('Sync Status Updated');
                syncstatus.status += 1;
                console.log('Updated Status : ' + syncstatus.status)

                syncstatus.save(function(err) {
                    if (err) throw err;                                           
                })

                res.status(200).json({
                    'message': 'Sync Status Updated Successfully.'
                });

            });
            
         

    }

  });
});


// Get Vehcile Route (POST http://localhost:8080/api/v2/device/passcode)
apiRoutes.get('/v2/admin/vehicle', function(req, res) {
    var jsonData=[];
 console.log('Get Vehicle Details');
  // find the uuid
  AdminUser.findOne({
    auth_key: req.headers['x-auth-key']
  }, function(err, user) {

    if (err) {
      console.log(err);
       throw err;
    }

    if (!user) {
      //console.log(res);
      res.status(401).json({ message: 'Unauthorized User Access', code: 100002 });
    } else if (user) {
        console.log(datetime);
        console.log('Vehicle Info Saved Successfully');

        Vehicle.find({ auth_key: req.headers['x-auth-key'] }).cursor()
        .on('data', function(vehicles){                    
            jsonData.push(vehicles);
        })
        .on('error', function(err){
          
        })
        .on('end', function(){
          console.log("Vehicle Data Retrieved");
          //var vehicleData = { data: jsonData };
          res.status(200).json(jsonData);

          /*
          res.writeHead(200, {'Content-Type': 'application/json'});
            res.write(jsonData);
          res.end();

          /*
          res.status(200).json({
               
              'message': 'Queue retrieved successfully',
              'code': '200010'
          });
          */
        });
            
           // res.status(200).json({ 
           //   'message': 'Vehicle info set successfully.',
           //   'data': user
           // });
       
       
     
    }

  });
});

// Get Individual Vehicle Info
apiRoutes.get('/v2/admin/vehicle/:plateno', function(req, res) {
  console.log('<----- Get Individual Vehicle ----->');
  var jsonData=[];
  AdminUser.findOne({
    auth_key: req.headers['x-auth-key']
  }, function(err, user) {

    if (err) {
      console.log(err);
       throw err;
    }

    if (!user) {
      //console.log(res);
      res.status(401).json({ message: 'Unauthorized User Access', code: 100002 });
    } else if (user) {
        //console.log(datetime);
        //console.log('Vehicle Info Saved Successfully');

        Vehicle.find({ plateno: req.params.plateno }).cursor()
        .on('data', function(vehicles){                    
            jsonData.push(vehicles);
        })
        .on('error', function(err){
          
        })
        .on('end', function(){
          console.log("Individual Vehicle Data Retrieved");
          //var vehicleData = { data: jsonData };
          res.status(200).json(jsonData);

          /*
          res.writeHead(200, {'Content-Type': 'application/json'});
            res.write(jsonData);
          res.end();

          /*
          res.status(200).json({
               
              'message': 'Queue retrieved successfully',
              'code': '200010'
          });
          */
        });
            
           // res.status(200).json({ 
           //   'message': 'Vehicle info set successfully.',
           //   'data': user
           // });
       
       
     
    }

  });
});

// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);