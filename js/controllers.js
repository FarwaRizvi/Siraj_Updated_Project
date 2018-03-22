angular.module('starter.controllers', ['ionic.contrib.ui.tinderCards'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $http) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  $scope.user = JSON.parse(window.localStorage.getItem("cocoProfile"));
  console.log($scope.user);

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})


  .controller('RegisterCtrl', function($scope,dataService,$http) 
  {
      $scope.signUp = function (fname,lname,email,password,repass) {
        if(!email){
           dataService.showActionSheet("email is required","no")
        }else if(!password){
           dataService.showActionSheet("password is required","no")
        } else if(password!=repass){
           dataService.showActionSheet("password does not match","no")
        }else{
            console.log(email);
            let body = `FriendlyName=`+email;
            var header = {headers: {'Content-type':'application/x-www-form-urlencoded', 'Authorization':'Basic QUNmMjVhMTI2NjQyMGYzNDYyNGI5MGNhNTkyMGU1MDUzNTphNzE3MDQ2N2Q2YzFjZTQyOWQ2ZDY5N2YwN2ZmZTg5MQ=='}};
            $http.post('https://chat.twilio.com/v2/Services',body, header)
            .then(function(response) {
                  console.log(response.data.sid);
                  dataService.registerUser({firstname:fname,lastname:lname,email:email.toLowerCase(),password:password,sid:response.data.sid})
                  .then(function (res,err) 
                  {
                     if(res)
                     {
                          console.log(res);
                          
                     }
                     else
                     {
                       dataService.showActionSheet("User Not Registered.","no");
                     }
                  });
            }, function(error){
                  dataService.showActionSheet("Oops! Something Went Wrong","no");
            });
        }
      }
  })

.controller('PlaylistsCtrl', function($scope,dataService) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('ChatCtrl', function($scope,$interval,$ionicScrollDelegate,$http, $stateParams,dataService,$rootScope,$ionicLoading)
{
    $ionicLoading.show();
    var t=0;
    var user = JSON.parse(window.localStorage.getItem("cocoProfile1"));
    console.log(user.local.sid);
    console.log($rootScope.selected_User);
    $scope.name = $rootScope.selected_User.firstname+" "+$rootScope.selected_User.lastname;
    var chat_user = $rootScope.selected_User;

    $http.get('https://chat.twilio.com/v2/Services/'+user.local.sid+'/Channels/'+chat_user.sid+'/Messages',{headers: {'Content-type':'application/json', 'Authorization':'Basic QUNmMjVhMTI2NjQyMGYzNDYyNGI5MGNhNTkyMGU1MDUzNTphNzE3MDQ2N2Q2YzFjZTQyOWQ2ZDY5N2YwN2ZmZTg5MQ=='}})
    .then(function(response) {
        console.log(response.data.messages);
        $scope.MessagesData = response.data; 
        if(t==0)
        {
          $ionicScrollDelegate.scrollBottom();
          t=1;
        } 
        $ionicLoading.hide(); 
    }, function(error){
        dataService.showActionSheet("Oops! Something Went Wrong","no");
        $ionicLoading.hide();
    });

    var Timmer = $interval(myTimer, 4000);
    function myTimer() {
        $http.get('https://chat.twilio.com/v2/Services/'+user.local.sid+'/Channels/'+chat_user.sid+'/Messages',{headers: {'Content-type':'application/json', 'Authorization':'Basic QUNmMjVhMTI2NjQyMGYzNDYyNGI5MGNhNTkyMGU1MDUzNTphNzE3MDQ2N2Q2YzFjZTQyOWQ2ZDY5N2YwN2ZmZTg5MQ=='}})
        .then(function(response) {
            var newData = response.data;
            if(newData.messages.length == $scope.MessagesData.messages.length)
            {
                console.log("no timmer");
            }
            else
            {
                console.log("timmer");
              $scope.MessagesData = response.data; 
              t=0;
              if(t==0)
              {
                  $ionicScrollDelegate.scrollBottom();
                  t=1;
              }
            }
        }, function(error){
            console.log(error);
        });
    }
    $scope.$on('$destroy', function() {
          $interval.cancel(Timmer);
    });

    $scope.Submit = function(msg)
    {
        $scope.boolean_msg = false; 
        $scope.boolean_msg2 = false; 
        console.log(msg);
        let body1 = `Body=`+msg+`&From=`+user.local.firstname+" "+user.local.lastname+`&LastUpdatedBy=`+chat_user.sid;
        let body2 = `Body=`+msg+`&From=`+user.local.firstname+" "+user.local.lastname+`&LastUpdatedBy=`+user.local.sid;
        var header = {headers: {'Content-type':'application/x-www-form-urlencoded', 'Authorization':'Basic QUNmMjVhMTI2NjQyMGYzNDYyNGI5MGNhNTkyMGU1MDUzNTphNzE3MDQ2N2Q2YzFjZTQyOWQ2ZDY5N2YwN2ZmZTg5MQ=='}};
        $http.post('https://chat.twilio.com/v2/Services/'+user.local.sid+'/Channels/'+chat_user.sid+'/Messages',body1, header)
        .then(function(response) {
              console.log(response);     
              $scope.boolean_msg = true; 
              $scope.msg='';

              $http.post('https://chat.twilio.com/v2/Services/'+chat_user.sid+'/Channels/'+user.local.sid+'/Messages',body2, header)
              .then(function(response) {
                    console.log(response);
                    $scope.boolean_msg = false;             
                    $scope.boolean_msg2 = true;             
              }, function(error){
                    console.log(error);
                    $scope.boolean_msg = true; 
                    $scope.boolean_msg2 = false; 
              });  

              $http.get('https://chat.twilio.com/v2/Services/'+user.local.sid+'/Channels/'+chat_user.sid+'/Messages',{headers: {'Content-type':'application/json', 'Authorization':'Basic QUNmMjVhMTI2NjQyMGYzNDYyNGI5MGNhNTkyMGU1MDUzNTphNzE3MDQ2N2Q2YzFjZTQyOWQ2ZDY5N2YwN2ZmZTg5MQ=='}})
              .then(function(response) {
                  console.log(response.data);
                  $scope.MessagesData = response.data; 
                  t=0;
                  if(t==0)
                  {
                    $ionicScrollDelegate.scrollBottom();
                    t=1;
                  } 
              }, function(error){
                  console.log(error);
                  dataService.showActionSheet("Oops! Something Went Wrong","no");
              });

        }, function(error){
              console.log(error);
              dataService.showActionSheet("Oops! Something Went Wrong","no");
        });
        
    }
})

.controller('InboxCtrl', function($scope,$http, $stateParams,dataService,$rootScope,$ionicLoading,$ionicPopup,$timeout)
{
    var user = JSON.parse(window.localStorage.getItem("cocoProfile1"));
    console.log(user.local.sid);
    $scope.bool_trash = false;
    var myPopup;

    $scope.OpenMessages = function(thread)
    {
        $rootScope.message_thread = thread;
    }

    $scope.delete= function(thread){
        var myPopup = $ionicPopup.show({
        title: 'Are You Sure?',
        scope: $scope,
        buttons: [
        {text: '<b>YES</b>',
        type: 'button-positive',
        onTap: function() 
        {
            $ionicLoading.show();
            $http.get('https://chat.twilio.com/v2/Services/'+user.local.sid+'/Channels/'+thread+'/Messages' ,{headers: {'Content-type':'application/json', 'Authorization':'Basic QUNmMjVhMTI2NjQyMGYzNDYyNGI5MGNhNTkyMGU1MDUzNTphNzE3MDQ2N2Q2YzFjZTQyOWQ2ZDY5N2YwN2ZmZTg5MQ=='}})
            .then(function(response) {
                    let Message_url = response.data.messages;
                    for(let i=0; i<Message_url.length; i++)
                    {
                        $http.delete(Message_url[i].url ,{headers: {'Content-type':'application/json', 'Authorization':'Basic QUNmMjVhMTI2NjQyMGYzNDYyNGI5MGNhNTkyMGU1MDUzNTphNzE3MDQ2N2Q2YzFjZTQyOWQ2ZDY5N2YwN2ZmZTg5MQ=='}})
                        .then(function(response) {
                              console.log(response);
                        }, function(error){
                              console.log(error);
                              $ionicLoading.hide();
                              dataService.showActionSheet("Oops! Something Went Wrong","no");
                              break;
                        });
                    }
                    LoadInbox();
              }, function(error){
                    console.log(error);
            });
        }},
        { text: 'NO' ,
        type: 'button-positive'}]
        });
    };

    $scope.$on('$ionicView.beforeEnter', function(){
          LoadInbox();
    });
    
    function LoadInbox()
    {
          $ionicLoading.show();
          $http.get('https://chat.twilio.com/v2/Services/'+user.local.sid+'/Channels',{headers: {'Content-type':'application/json', 'Authorization':'Basic QUNmMjVhMTI2NjQyMGYzNDYyNGI5MGNhNTkyMGU1MDUzNTphNzE3MDQ2N2Q2YzFjZTQyOWQ2ZDY5N2YwN2ZmZTg5MQ=='}})
          .then(function(response) {
            console.log(response);
              $scope.Data = response.data;
              $scope.InboxData = {};
              var j='0';
              for(let i=0; i<$scope.Data.channels.length; i++)
              {
                if($scope.Data.channels[i].messages_count == 0)
                {

                }
                else
                {
                    if($scope.Data.channels[i].links.last_message == null)
                    {
              
                    }
                    else
                    {
                        $http.get($scope.Data.channels[i].links.last_message ,{headers: {'Content-type':'application/json', 'Authorization':'Basic QUNmMjVhMTI2NjQyMGYzNDYyNGI5MGNhNTkyMGU1MDUzNTphNzE3MDQ2N2Q2YzFjZTQyOWQ2ZDY5N2YwN2ZmZTg5MQ=='}})
                        .then(function(response) {
                          console.log(response);
                            $scope.InboxData[j] = $scope.Data.channels[i];
                            $scope.InboxData[j].last_message = response.data.body;
                            $scope.InboxData[j].last_message_date = response.data.date_updated;
                            j= j+1;
                        }, function(error){
                            $ionicLoading.hide();
                            dataService.showActionSheet("Oops! Something Went Wrong","no");
                        });
                    }
                }

                if(i==$scope.Data.channels.length-1)
                {
                  $ionicLoading.hide();
                }
              }
              console.log($scope.InboxData);
              $ionicLoading.hide();
          }, function(error){
              dataService.showActionSheet("Oops! Something Went Wrong","no");
          });
    }
})

.controller('MessagesCtrl', function($scope, $interval, $ionicScrollDelegate, $timeout, $http, $stateParams,dataService,$rootScope,$ionicLoading)
{
    $ionicLoading.show();
    var t=0;
    var chat_user;
    var user = JSON.parse(window.localStorage.getItem("cocoProfile1"));
    console.log(user.local.sid);
    console.log($rootScope.message_thread);
    console.log("url-->"+$rootScope.message_thread.links.messages);
    $http.get($rootScope.message_thread.links.messages,{headers: {'Content-type':'application/json', 'Authorization':'Basic QUNmMjVhMTI2NjQyMGYzNDYyNGI5MGNhNTkyMGU1MDUzNTphNzE3MDQ2N2Q2YzFjZTQyOWQ2ZDY5N2YwN2ZmZTg5MQ=='}})
    .then(function(response) {
        console.log(response.data);
        $scope.MessagesData = response.data; 
        chat_user = response.data.messages[0].last_updated_by;
        if(t==0)
        {
          $ionicScrollDelegate.scrollBottom();
          t=1;
        } 
        $ionicLoading.hide();
    }, function(error){
        $ionicLoading.hide();
        dataService.showActionSheet("Oops! Something Went Wrong","no");
    });

    var Timmer = $interval(myTimer, 4000);
    function myTimer() {
        $http.get($rootScope.message_thread.links.messages,{headers: {'Content-type':'application/json', 'Authorization':'Basic QUNmMjVhMTI2NjQyMGYzNDYyNGI5MGNhNTkyMGU1MDUzNTphNzE3MDQ2N2Q2YzFjZTQyOWQ2ZDY5N2YwN2ZmZTg5MQ=='}})
        .then(function(response) {
            var newData = response.data;
            if(newData.messages.length == $scope.MessagesData.messages.length)
            {
              
            }
            else
            {
              $scope.MessagesData = response.data; 
              t=0;
              if(t==0)
              {
                  $ionicScrollDelegate.scrollBottom();
                  t=1;
              }
            }
        }, function(error){
            dataService.showActionSheet("Oops! Something Went Wrong","no");
        });
    }
    $scope.$on('$destroy', function() {
          $interval.cancel(Timmer);
    });

    $scope.Submit = function(msg)
    {
        console.log(msg);
        
        let body1 = `Body=`+msg+`&From=`+user.local.firstname+" "+user.local.lastname+`&LastUpdatedBy=`+chat_user;
        let body2 = `Body=`+msg+`&From=`+user.local.firstname+" "+user.local.lastname+`&LastUpdatedBy=`+user.local.sid;
        var header = {headers: {'Content-type':'application/x-www-form-urlencoded', 'Authorization':'Basic QUNmMjVhMTI2NjQyMGYzNDYyNGI5MGNhNTkyMGU1MDUzNTphNzE3MDQ2N2Q2YzFjZTQyOWQ2ZDY5N2YwN2ZmZTg5MQ=='}};
        $http.post('https://chat.twilio.com/v2/Services/'+user.local.sid+'/Channels/'+chat_user+'/Messages',body1, header)
        .then(function(response) {
              console.log(response);     
              $http.post('https://chat.twilio.com/v2/Services/'+chat_user+'/Channels/'+user.local.sid+'/Messages',body2, header)
              .then(function(response) {
                    console.log(response);             
              }, function(error){
                    dataService.showActionSheet("Oops! Something Went Wrong","no");
              });

              $http.get($rootScope.message_thread.links.messages,{headers: {'Content-type':'application/json', 'Authorization':'Basic QUNmMjVhMTI2NjQyMGYzNDYyNGI5MGNhNTkyMGU1MDUzNTphNzE3MDQ2N2Q2YzFjZTQyOWQ2ZDY5N2YwN2ZmZTg5MQ=='}})
              .then(function(response) {
                  console.log(response.data);
                  $scope.MessagesData = response.data; 
                  $scope.msg='';
                  t=0;
                  if(t==0)
                  {
                    $ionicScrollDelegate.scrollBottom();
                    t=1;
                  } 
              }, function(error){
                  dataService.showActionSheet("Oops! Something Went Wrong","no");
              });

        }, function(error){
              dataService.showActionSheet("Oops! Something Went Wrong","no");
        });
    }

    $scope.expandText = function(){
        var element = document.getElementById("txtnotes");
        element.style.height =  element.scrollHeight + "px";
    }
})

.controller('NearByCtrl', function($scope, $stateParams,dataService,$rootScope,$ionicLoading) {
console.log($rootScope.longitude.toString());
  //$rootScope.latitude.toString()
  var storedProducts = JSON.parse(window.localStorage.getItem("viewedProducts"));
  var recentDate = JSON.parse(window.localStorage.getItem("recentDate"));
  var userrange = JSON.parse(window.localStorage.getItem("userRange"));
  $scope.noProduct=false;

  console.log(recentDate)

  console.log(storedProducts);
  var user = JSON.parse(window.localStorage.getItem("cocoProfile1"));

  $scope.cards=[];
  var viewedProducts = [];
  dataService.nearestProduct({range:userrange,cli_date:recentDate,user_latitude:$rootScope.latitude.toString(),user_longitude:$rootScope.longitude.toString()})
    .then(function (res) {
      console.log(res[0]);
      if(!res[0]){
        console.log("NULL")
        $scope.noProduct=true;
      }

      //  $scope.cards=_.difference(res,storedProducts);
     // console.log(_.difference(res._id,storedProducts));
$scope.cards = res;
// for (var i = 0 ; i < res.length ; i++){
//   for ( var z=0 ; z<storedProducts.length ; z++){
//     if(storedProducts[z]==res[i]._id){
//           $scope.cards.splice(i,1);
//       break;
//     }
//   }
//
//    // $scope.cards.push(res[i])
//
// }


    });




  dataService.getProductsOnHomePage()
    .then(function (res,err) {
      console.log(res);
//      $scope.homeProductsElectronics=res[1];
      $scope.homeProductsVehicles=res[2];
      $scope.homeProductsMobiles=res[3];
      console.log($scope.cards)

      $ionicLoading.hide();
    })
    .catch(function (err) {
      $ionicLoading.hide();
      dataService.showActionSheet("Oops! Something Went Wrong","no");
      console.log(err);
    })



  // $scope.cards = [
  //   { image: 'https://www.alamo.com/alamoData/vehicle/bookingCountries/US/CARS/PCAR.doi.320.high.imageSmallSideProfileNodePath.png/1482432218625.png' },
  //   { image: 'https://hips.hearstapps.com/amv-prod-cad-assets.s3.amazonaws.com/images/15q1/654923/2016-mclaren-p14-supercar-25-cars-worth-waiting-for-feature-car-and-driver-photo-657582-s-original.jpg' }
  // ];

  $scope.cardDestroyed = function(index) {
    console.log(index)
    $scope.cards.splice(index, 1);
  };

  $scope.cardSwiped = function(index) {
    var newCard = // new card data
      console.log("cad")
      $scope.cards.push(newCard);

  };

  $scope.cardSwipedLeft = function(index,pId) {
    console.log('LEFT SWIPE');
  //  $scope.addCard();
   //viewedProducts.push(pId);
    //window.localStorage.setItem("viewedProducts",JSON.stringify(viewedProducts));
    var d= new Date();
    window.localStorage.setItem("recentDate",JSON.stringify(d));

  };
  $scope.cardSwipedRight = function(index,pId) {
    console.log('RIGHT SWIPE');
    dataService.addFavourite({_user_id:user._id,product_id:pId})
      .then(function (res) {
        $ionicLoading.hide();
        console.log("jj")
        console.log(res);

      })
      .catch(function (err) {
        $ionicLoading.hide();
        console.log(err)
      })





    //  $scope.addCard();
   // viewedProducts.push(pId);
    //console.log(viewedProducts)
    //console.log(new Date());

    //window.localStorage.setItem("viewedProducts",JSON.stringify(viewedProducts));
    var d= new Date();
    window.localStorage.setItem("recentDate",JSON.stringify(d));

  };

  $scope.like = function (index) {
    console.log("like")
    $scope.cardSwipedRight(index);
    console.log(index)
 //   $scope.cards.splice(index, 1);

  }

  $scope.nope = function (index) {
    console.log("nope")
    $scope.cardSwipedLeft(index);
    console.log(index)
    //   $scope.cards.splice(index, 1);

  }

  $scope.getDistanceFromLatLonInKm= function (lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1);
    var a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon/2) * Math.sin(dLon/2)
      ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // Distance in km

    if (Math.round(d)==0){
      return "Less Than a "
    }else{
      return Math.round(d);

    }
  }

  function deg2rad(deg) {
    return deg * (Math.PI/180)
  }


})

.controller('SignInCtrl', function($scope,dataService,$ionicLoading,$state) {


$scope.facebookSignIn = function () {
  console.log("fb");
  dataService.facebookSignIn()
}


$scope.login = function (email,password) 
{
  $ionicLoading.show();
  dataService.login({email:email.toLowerCase(),password:password})
      .then(function (res,err) {
        if(res.success){

          window.localStorage.setItem("cocoProfile1",JSON.stringify(res.data));
          console.log(res.data);
          window.location.reload(true)
          $ionicLoading.hide();
          $state.go('app.hot_deals');

        }else{
          $ionicLoading.hide();
          console.log(err)
        }
      })
      .catch(function (err) {
          $ionicLoading.hide();
          dataService.showActionSheet("Oops! Something Went Wrong","no");
          console.log(err);
      });
}
})


  .controller('FilterListCtrl', function($scope,$filter,dataService,$stateParams,$ionicLoading,Loading, $rootScope) {

    $scope.Search = false;

    $scope.ShowSearch = function() 
    {
        $scope.Search = true;
    }

    // $scope.HideSearch = function() 
    // {
    //     $scope.Search = false;
    //     console.log($scope.searchText);
    //     $scope.searchText = '';
    //     console.log($scope.searchText);
    // }

    $rootScope.closesortmodal= function() {
    //console.log($rootScope.devList);
    $rootScope.sortmodal.hide();
    $scope.filterList = $filter('orderBy')($scope.filterList, '-product_price');
    };

    $rootScope.devList = [
      { text: "Discount", checked: true, id:1 },
      { text: "Low Price", checked: false, id:2 },
      { text: "High Price", checked: false, id:3 },
      { text: "Near By", checked: false, id:4 }
    ];
    $rootScope.filterBy = 'price';

    /////distance
    function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
      var R = 6371; // Radius of the earth in km
      var dLat = deg2rad(lat2-lat1);  // deg2rad below
      var dLon = deg2rad(lon2-lon1);
      var a =
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
          Math.sin(dLon/2) * Math.sin(dLon/2)
        ;
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      var d = R * c; // Distance in km
      return d;
    }

    function deg2rad(deg) {
      return deg * (Math.PI/180)
    }

    ///////distance end

    var skip = 0;
    var limit =10;
    $scope.loadCheck=true;
      console.log($stateParams.id);
    $scope.filterList=[];
    $ionicLoading.show()

    dataService.getProductByCategoryId({_product_category_id:$stateParams.id,_starting:0,_ending:10})
        .then(function (res,err) {
          if(res){
            console.log(res)
            $scope.filterList=res;
            getDistanceFromLatLonInKm()
           $ionicLoading.hide();
          }else{
            console.log(err);
          }
        })
        .catch(function (err) {
          dataService.showActionSheet("Oops! Something Went Wrong","no");
          console.log(err);
        });

    $scope.doRefresh = function() {

      console.log($rootScope.devList);
      dataService.getProductByCategoryId({_product_category_id:$stateParams.id,_starting:0,_ending:10})
          .then(function (res,err) {
            if(res){
              console.log(res);
              $scope.filterList=res;
              $scope.$broadcast('scroll.refreshComplete');
            }else{
              console.log(err);
            }
          })
          .catch(function (err) {
            dataService.showActionSheet("Oops! Something Went Wrong","no");
            console.log(err);
          });

      // $http.get('/new-items')
      //     .success(function(newItems) {
      //       $scope.items = newItems;
      //     })
      //     .finally(function() {
      //       // Stop the ion-refresher from spinning
      //       $scope.$broadcast('scroll.refreshComplete');
      //     });
    };



    $scope.loadMore = function () {
      console.log("jje")
      dataService.getProductByCategoryId({_product_category_id:$stateParams.id,_starting:skip,_ending:limit})
          .then(function (res,err) {
            if(res){
              if(!res[0]){
                $scope.loadCheck= false;
                $scope.$broadcast('scroll.infiniteScrollComplete');

              }else{
                console.log(res[0])
                $scope.filterList=res;
                $scope.$broadcast('scroll.infiniteScrollComplete');
              }

            }else{
              console.log(err);
            }
          })
      skip=limit;
      limit = limit+10;
    }

  })

  .controller('ProductDetailCtrl', function($scope,$http,dataService,$stateParams,$ionicLoading,$state,$rootScope) {
    $ionicLoading.show();
    $scope.product;
    $scope.images1;
    $scope.seller;
    var user = JSON.parse(window.localStorage.getItem("cocoProfile1"));
    var channel_user;

    dataService.getProductDetail({_product_id:$stateParams.id})
        .then(function (res,err) {
          if(res){
            $scope.product=res;
            $scope.images1 = res.imagesPath;
            $rootScope.bigImg = res.imagesPath[0];
            console.log($scope.images1);
            console.log(res);
            dataService.getAUser({user_id:res._user_id})
              .then(function (res) {
                console.log(res)
                $scope.seller=res;
                channel_user = res;
                $rootScope.selected_User = res.local;
              })
            $ionicLoading.hide();

          }else{
            console.log(err);
          }
        })
        .catch(function (err) {
          $ionicLoading.hide();
          dataService.showActionSheet("Oops! Something Went Wrong","no");
          console.log(err);
        });

    $scope.chat = function () 
    {
            $state.go("app.chat");
            console.log(user.local);
            console.log(channel_user.local.sid);
             
             let body = `UniqueName=`+channel_user.local.sid+`&FriendlyName=`+channel_user.local.firstname+" "+channel_user.local.lastname;
             var header = {headers: {'Content-type':'application/x-www-form-urlencoded', 'Authorization':'Basic QUNmMjVhMTI2NjQyMGYzNDYyNGI5MGNhNTkyMGU1MDUzNTphNzE3MDQ2N2Q2YzFjZTQyOWQ2ZDY5N2YwN2ZmZTg5MQ=='}};
             $http.post('https://chat.twilio.com/v2/Services/'+user.local.sid+'/Channels',body, header)
             .then(function(response) {
                  console.log(response);            
                  console.log("Channel 1 Added");

                  let Member1 = `Identity=`+channel_user.local.firstname+" "+channel_user.local.lastname;
                  $http.post('https://chat.twilio.com/v2/Services/'+user.local.sid+'/Channels/'+response.data.sid+'/Members',Member1,header)
                  .then(function(response) {
                          console.log(response);            
                          console.log("Member1 Added");
                  }, function(error){
                         console.log(error);
                  });

                  let Member2 = `Identity=`+user.local.firstname+" "+user.local.lastname;
                  $http.post('https://chat.twilio.com/v2/Services/'+user.local.sid+'/Channels/'+response.data.sid+'/Members',Member2,header)
                  .then(function(response) {
                          console.log(response);            
                          console.log("Member2 Added");
                  }, function(error){
                         console.log(error);
                  });

             }, function(error){
                   console.log(error);
             });

             let body2 = `UniqueName=`+user.local.sid+`&FriendlyName=`+user.local.firstname+" "+user.local.lastname;
             $http.post('https://chat.twilio.com/v2/Services/'+channel_user.local.sid+'/Channels',body2, header)
             .then(function(response) {
                  console.log(response);
                  console.log("Channel 2 Added");

                  let Member3 = `Identity=`+channel_user.local.firstname+" "+channel_user.local.lastname;
                  $http.post('https://chat.twilio.com/v2/Services/'+channel_user.local.sid+'/Channels/'+response.data.sid+'/Members',Member3,header)
                  .then(function(response) {
                          console.log(response);            
                          console.log("Member1 Added");
                  }, function(error){
                         console.log(error);
                  });

                  let Member4 = `Identity=`+user.local.firstname+" "+user.local.lastname;
                  $http.post('https://chat.twilio.com/v2/Services/'+channel_user.local.sid+'/Channels/'+response.data.sid+'/Members',Member4,header)
                  .then(function(response) {
                          console.log(response);            
                          console.log("Member2 Added");
                  }, function(error){
                         console.log(error);
                  });
             }, function(error){
                   console.log(error);
             });
      //goto('/app/chat')
    }

    $scope.addFavourite = function () {
      $ionicLoading.show();
      console.log($scope.product._id);
      console.log(user._id);
      dataService.addFavourite({_user_id:user._id,product_id:$scope.product._id})
        .then(function (res) {
          $ionicLoading.hide();
          console.log("jj")
          console.log(res);

        })
        .catch(function (err) {
          $ionicLoading.hide();
          console.log(err)
        })

    };

    $scope.checkout = function () {
      $state.go("app.payment")
    }

  })


  .controller('ProfileCtrl', function($scope,dataService,$ionicLoading) {
    $scope.user = JSON.parse(window.localStorage.getItem("cocoProfile1"));
    console.log($scope.user.local);
  })

  .controller('HotDealsCtrl', function($scope,$rootScope,dataService,$ionicLoading,$ionicScrollDelegate) {
    $ionicLoading.show();
    $scope.homeProductsBikes;
    $scope.homeProductsElectronics;
    $scope.homeProductsVehicles;
    $scope.homeProductsMobiles;
    $scope.homePage;
    dataService.getProductsOnHomePage()
        .then(function (res,err) {
          console.log(res);
          $scope.homePage=res;
          for (var i=0; i < $scope.homePage.length; i++) 
          {
              for (var j=0; j < $rootScope.categories.length; j++) 
              {
                  if($scope.homePage[i]._id==$rootScope.categories[j]._id)
                  {
                    $scope.homePage[i].categoryname = $rootScope.categories[j].product_category_name;
                    break;
                  }
                  else
                  {
                    if(j==$rootScope.categories.length-1)
                    {
                      $scope.homePage[i].categoryname = "Not Defined";
                    }
                  }
              }
          }
          console.log($scope.homePage);
          $scope.homeProductsBikes=res[0];
          $scope.homeProductsElectronics=res[1];
          $scope.homeProductsVehicles=res[2];
          $scope.homeProductsMobiles=res[3];
          $ionicLoading.hide();

        })
      .catch(function (err) {
        $ionicLoading.hide();
        dataService.showActionSheet("Oops! Something Went Wrong","no");
        console.log(err);
      })


    $scope.doRefresh = function () {

      dataService.getProductsOnHomePage()
        .then(function (res,err) {
          console.log(res);
          $scope.homeProductsBikes=res[0];
          $scope.homeProductsElectronics=res[1];
          $scope.homeProductsVehicles=res[2];
          $scope.homeProductsMobiles=res[3];
          $scope.$broadcast('scroll.refreshComplete');



        })
        .catch(function (err) {
          $ionicLoading.hide();
          dataService.showActionSheet("Oops! Something Went Wrong","no");
          console.log(err);
        })




    }

  })

.controller('MyAdsCtrl', function($scope,dataService,$ionicLoading,$ionicPopup) {
  var user = JSON.parse(window.localStorage.getItem("cocoProfile1"));


  $ionicLoading.show();



dataService.getUserPosts({_user_id:user._id})
    .then(function (res,err) {
      $scope.myAds=res;
      $ionicLoading.hide();
      console.log(res);
    })
  $scope.removeItem = function (index,id) {

    $ionicPopup.show({
      title:"Are you sure you want to delete ?",
      buttons:[
        {
          text: 'Yes', onTap : function (e) {
          console.log(index);
          $ionicLoading.show();
          dataService.deleteProduct({product_id:id})
            .then(function (res,err) {
              if(res){
                console.log(res)
                $scope.myAds.splice(index, 1);
                dataService.showActionSheet(res.message,'no');
                $ionicLoading.hide();


              }
            });

        }
        }, {
          text: 'Cancel', onTap : function (e) {
            return true;

          }
        }

      ]
    });



  };


})


.controller('ProductEditCtrl', function($scope,dataService,$ionicLoading,$stateParams,$rootScope,actionSheet, $ionicPopup,cloudinary,$q, $cordovaFileTransfer, $cordovaCamera ) {
  $ionicLoading.show();
  $scope.title;
  $scope.price;
  $scope.detail;
  $scope.selectedCategory;
  $scope.productId;
  $scope.url;





  dataService.getProductDetail({_product_id:$stateParams.id})
      .then(function (res,err) {
        if(res){
         console.log(res.imagesPath[0]);
          $ionicLoading.hide();
          $scope.url = res.imagesPath;
       //  $scope.bigImg = res.imagesPath[0];
          $scope.title=res.product_name;
          $scope.price=parseInt(res.product_price);
$scope.productId=res._id;
          $scope.detail = res.product_details;
          $scope.selectedCategory = "Mobile";




        }else{
          console.log(err);
        }
      });

$scope.delPic = function (index) {

  $ionicPopup.show({
    title:"Are you sure you want to delete ?",
    buttons:[
      {
        text: 'Yes', onTap : function (e) {
        console.log(index);
        $scope.url.splice(index, 1);

      }
      }, {
        text: 'Cancel', onTap : function (e) {
          return true;

        }
      }

    ]
  });



}

//   $scope.update = function (title,price,detail,selectedCategory) {
//     //product_longitude
//     //product_latitude
//     //_user_id
//     //
// $ionicLoading.show();
//
//     console.log(selectedCategory);
//
//
//
//     dataService.editProduct({product_id:$scope.productId,product_name:title,product_price:price,product_details:detail ,_product_category_id:selectedCategory._id})
//       .then(function (res,err) {
//         if(res){
//           console.log(res);
//           $ionicLoading.hide();
//           dataService.showActionSheet(res.message,'app.cart');
//
//
//         }else{
//           console.log(err);
//         }
//       })
//   }

  var cl = cloudinary.Cloudinary.new();
  cl.config( "cloud_name", "coco-ecomerce");
  cl.config( "api_key", "432377725498231");
  cl.config( "upload_preset", "yx6qsmsm");

  var imagesSelected=[];
  //dataService.editProduct(product_name,product_details,product_price)
  $scope.images1=[];
  var k=0;
  $scope.choosePhoto = function () {


    window.imagePicker.getPictures(
      function (results) {
        // uploadImage(results);

        for (var i = 0; i < results.length; i++) {
          //   //  $scope.images1.push(results[i]);
          //   // $scope.imagesFT.push(results[i]);
          imagesSelected.push(results[i]);
          $scope.images1.push(results[i]);
          //   uploadImage(results[i]);
        }

        //    console.log(imagesURL);
        if (!$scope.$$phase) {
          $scope.$apply();
        }
      }, function (error) {
        console.log(error);
      }
    );
  }


  $scope.takePhoto = function () {
    var options = {
      quality: 40,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 300,
      targetHeight: 300,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: true
    };

    $cordovaCamera.getPicture(options).then(function (imageData) {
      $scope.imgURI = "data:image/jpeg;base64," + imageData;
      $scope.singleImage = imageData;
      $scope.imgdata=imageData;
      $scope.images1.push(imageData);
      imagesSelected.push(imageData);

      console.log(imageData)
    }, function (err) {
      // An error occured. Show a message to the user
    });
  }

  function uploadImage(imageURI) {
    console.log('start upload image.');
    var deferred = $q.defer();

    uploadFile();

    function uploadFile() {

      //  $ionicLoading.show({template : 'Uploading image...'});
      // Add the Cloudinary "upload preset" name to the headers
      var uploadOptions = {
        params : { 'upload_preset': cl.config().upload_preset}
      };
      $cordovaFileTransfer
      // Your Cloudinary URL will go here
        .upload("https://api.cloudinary.com/v1_1/" + cl.config().cloud_name + "/upload", imageURI, uploadOptions)

        .then(function(result) {
          // Let the user know the upload is completed
          var r = JSON.parse(result.response);
          console.log(result);
          // console.log(result.response.url);
          //  imagesURL.push(r.url);

          //  $ionicLoading.show({template : 'Done.', duration: 1000});
          var response = JSON.parse(decodeURIComponent(result.response));
          var url = r.url;
          console.log(url.substring(0,53));
          console.log( url.substring(65,url.length));
          var lessUrl =  url.substring(0,53) + "q_40/" + url.substring(65,url.length);
          console.log(lessUrl);
          deferred.resolve($scope.url.push(lessUrl));
          k++;
          if(imagesSelected.length==k){
           // console.log(imagesURL)
            dataService.editProduct({product_id:$scope.productId,product_name:title,product_price:price,product_details:detail ,_product_category_id:selectedCategory._id,product_longitude:$rootScope.longitude,product_latitude:$rootScope.latitude,image_url:$scope.url})
              .then(function (res,err) {
                if(res){
                  console.log(res);
                  $ionicLoading.hide();
                  dataService.showActionSheet(res.message,'app.cart');



                }else{
                  console.log(err);
                }
              })
              .catch(function (err) {
                console.log(err)
                if(err.status==420){
                  $rootScope.openChangePhoneModal();
                }
              })
          }

        }, function(err) {
          // Uh oh!
          console.log(err);
          //  $ionicLoading.show({template : 'Failed.', duration: 3000});
          deferred.reject(err);
        }, function (progress) {

        });
    }
    // console.log(imagesURL);
    return deferred.promise;
  };

  $scope.update = function (title1,price1,detail1,selectedCategory1) {
    $ionicLoading.show();
    title = title1;
    price = price1;
    detail = detail1;
    selectedCategory=selectedCategory1;

    if(imagesSelected[0]){
      console.log(imagesSelected[0])
      console.log("image hai")
      for (var i = 0; i < imagesSelected.length; i++) {
        //  $scope.images1.push(results[i]);
        // $scope.imagesFT.push(results[i]);
        //$scope.images1.push({item:"data:image/jpeg;base64," + results[i]});
        uploadImage(imagesSelected[i]);
      }

    }else{
      console.log("image nahi hai")

      dataService.editProduct({product_name:title,product_price:price,product_details:detail ,_product_category_id:selectedCategory._id,product_longitude:$rootScope.longitude,product_latitude:$rootScope.latitude,image_url:$scope.url})
        .then(function (res,err) {
          if(res){
            console.log(res);
            $ionicLoading.hide();
            dataService.showActionSheet(res.message,'app.cart');



          }else{
            console.log(err);
          }
        })
        .catch(function (err) {
          console.log(err)
          if(err.status==420){
            $rootScope.openChangePhoneModal();
          }
        })

    }








  };





})


    .controller('PostAdCtrl123', function($scope,$cordovaCamera,dataService,$rootScope,$state,cloudinary) {
      var user = JSON.parse(window.localStorage.getItem("cocoProfile1"));

      var files ;
      var cl = cloudinary.Cloudinary.new();
      cl.config( "cloud_name", "coco-ecomerce");
       cl.config( "api_key", "432377725498231");
      cl.config( "upload_preset", "yx6qsmsm");



      $scope.uploadFiles = function (x) {
        console.log("jje")
        files = x;
        console.log(files);
      };




      $scope.images1=[];
      $scope.imagesFT=[];
console.log(user);
    $scope.takePhoto = function () {
      var options = {
        quality: 75,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 300,
        targetHeight: 300,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false
      };

      $cordovaCamera.getPicture(options).then(function (imageData) {
        $scope.imgURI = "data:image/jpeg;base64," + imageData;
        $scope.singleImage = imageData;
        $scope.imgdata=imageData;
        $scope.images1.push({item:"data:image/jpeg;base64," + imageData});
        console.log(imageData)
      }, function (err) {
        // An error occured. Show a message to the user
      });
    }

    $scope.choosePhoto = function () {
      // var options = {
      //   quality: 75,
      //   destinationType: Camera.DestinationType.DATA_URL,
      //   sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      //   allowEdit: true,
      //   encodingType: Camera.EncodingType.JPEG,
      //   targetWidth: 300,
      //   targetHeight: 300,
      //   popoverOptions: CameraPopoverOptions,
      //   saveToPhotoAlbum: false
      // };
      //
      // $cordovaCamera.getPicture(options).then(function (imageData) {
      //
      //   $scope.imgURI = "data:image/jpeg;base64," + imageData;
      // }, function (err) {
      //   // An error occured. Show a message to the user
      // });
      $scope.images1 = [];
      window.imagePicker.getPictures(
        function(results) {
          for (var i = 0; i < results.length; i++) {
          //  $scope.images1.push(results[i]);
            $scope.imagesFT.push(results[i]);
            $scope.images1.push({item:"data:image/jpeg;base64," + results[i]});

          }
          if(!$scope.$$phase) {
            $scope.$apply();
          }
        }, function (error) {
          console.log(error);
        }
      );
      console.log("hi")
      console.log($scope.images1)
    };






   // $scope.categories=$rootScope.list_1;
    //console.log($scope.categories[0].id)

      $scope.post1 = function (titel,price,detail,selectedCategory) {
        console.log(files);
        var getPicUrl = function () {
          var deferred = Q.defer();
          var upload;
          var clFiles = files;
          if (!clFiles) return;
          angular.forEach(files, function (file) {
            if (file && !file.$error) {
              file.upload = Upload.upload({
                url: "https://api.cloudinary.com/v1_1/" + cl.config().cloud_name + "/upload",
                data: {

                  upload_preset: cl.config().upload_preset,
                  tags: 'myphotoalbum',
                  context: 'photo=' + "test",
                  file: file
                }
              }).progress(function (e) {
                file.progress = Math.round((e.loaded * 100.0) / e.total);
                file.status = "Uploading... " + file.progress + "%";
              }).success(function (data, status, headers, config) {
                $rootScope.photos = $rootScope.photos || [];
                data.context = {custom: {photo: vm.title}};
                file.result = data;
                $rootScope.photos.push(data);
                urlArray.push(data.url);
                deferred.resolve(data.url);

                if (urlArray.length == clFiles.length) {
                  console.log(urlArray)
                }
              }).error(function (data, status, headers, config) {
                file.result = data;
              });
            }
          });




          return deferred.promise;


        };


        getPicUrl()
          .then(function (pictureURL) {
            console.log(pictureURL)
          })

      };

$scope.post = function (title,price,detail,selectedCategory) {
  //product_longitude
  //product_latitude
  //_user_id
  //
 // var check=true;
  var win = function (r) {
    console.log("Code = " + r.responseCode);
    console.log("Response = " + r.response);
    console.log("Sent = " + r.bytesSent);
   // if(check){
     // check=false;
       // console.log(r.response.data[0]._id);
      //console.log(r.response[0].data._id);
     // console.log(r.response.data._id);
      //console.log(r.response[0].data[0]._id);





  };

  var fail = function (error) {
    alert("An error has occurred: Code = " + error.code);
    console.log("upload error source " + error.source);
    console.log("upload error target " + error.target);
  }

  var options = new FileUploadOptions();
  options.fileKey = "file";
  options.fileName = "image.jpeg";
  // options.fileName = $scope.singleImage.substr($scope.singleImage.lastIndexOf('/') + 1);
  options.mimeType = "image/jpeg" ;
  options.chunkedMode = false;
  options.params = { // Whatever you populate options.params with, will be available in req.body at the server-side.
  product_name:title,
    product_price:price,
    product_details:detail ,
    _product_category_id:selectedCategory._id,
    product_longitude:$rootScope.longitude,
    product_latitude:$rootScope.latitude,
    _user_id:user._id
  };
//fileURL.substr(fileURL.lastIndexOf('/') + 1);
  // var params = {};
  // params.value1 = "test";
  // params.value2 = "param";
  //
  // options.params = params;

 // var params = {};
  // params.product_name = title;
  // params.product_price = price;
  // params.product_details = detail;
  // params._product_category_id = selectedCategory;
  // params._user_id = user._id;
  // params.product_longitude = $rootScope.longitude;
  // params.product_latitude = $rootScope.latitude;

  // params.value2 = price;

 // options.params = params;
console.log($scope.singleImage);
  var ft = new FileTransfer();
  ft.upload($scope.imagesFT[0], encodeURI("https://coco-ecomerce-server.herokuapp.com/add-product-ads"), win,fail,options);
  options.params = { // Whatever you populate options.params with, will be available in req.body at the server-side.
    product_id:"59ecace41524080012e32d3b"
  };
  console.log(options.params);
  for (var i=1 ; i<$scope.imagesFT.length ; i++){
    console.log(i);
    ft.upload($scope.imagesFT[i], encodeURI("https://coco-ecomerce-server.herokuapp.com/insert-other-image"),win,fail,options)

  }


  // .then(function (res) {
    //   console.log(res);
    //   if(res.success){
    //     options.params = { // Whatever you populate options.params with, will be available in req.body at the server-side.
    //      product_id:res._id
    //     };
    //     for (var i=1 ; i<$scope.imagesFT.length ; i++){
    //       ft.upload($scope.imagesFT[i], encodeURI("https://coco-ecomerce-server.herokuapp.com/insert-other-image"), win, fail, options)
    //
    //     }
    //
    //   }
    // })
    // .catch(function (err) {
    //
    // })

console.log(user._id);





  // dataService.addProduct({product_name:title,product_price:price,product_details:detail ,_product_category_id:selectedCategory._id,product_longitude:$rootScope.longitude,product_latitude:$rootScope.latitude,_user_id:user._id})
  //   .then(function (res,err) {
  //     if(res){
  //       console.log(res);
  //       dataService.showActionSheet(res.message,'app.hot_deals');
  //
  //
  //
  //     }else{
  //       console.log(err);
  //     }
  //   })
  //   .catch(function (err) {
  //     console.log(err)
  //     if(err.status==420){
  //       $rootScope.openChangePhoneModal();
  //     }
  //   })
}

  })

    .controller('PostAdCtrl', function($scope,$q, $ionicLoading, $cordovaFileTransfer,cloudinary, $cordovaCamera , dataService , $rootScope) {
      var cl = cloudinary.Cloudinary.new();
      cl.config( "cloud_name", "coco-ecomerce");
      cl.config( "api_key", "432377725498231");
      cl.config( "upload_preset", "yx6qsmsm");
var imagesURL = [];
      $scope.images1 = [];
      var user = JSON.parse(window.localStorage.getItem("cocoProfile1"));
      var title;
       var price;
      var detail ;
      var selectedCategory;
      $scope.post = function (title1,price1,detail1,selectedCategory1) {
        if(!title1){
          dataService.showActionSheet("Title field is required","no");
        } else if (!price1){
          dataService.showActionSheet("Price field is required","no");
        } else if (!detail1){
          dataService.showActionSheet("Detail field is required","no");
        } else if (!selectedCategory1){
          dataService.showActionSheet("Category field is required","no");
        }else {

          $ionicLoading.show();
          title = title1;
          price = price1;
          detail = detail1;
          selectedCategory=selectedCategory1;

          if(imagesSelected[0]){
            console.log(imagesSelected[0])
            console.log("image hai")
            for (var i = 0; i < imagesSelected.length; i++) {
              //  $scope.images1.push(results[i]);
              // $scope.imagesFT.push(results[i]);
              //$scope.images1.push({item:"data:image/jpeg;base64," + results[i]});
              uploadImage(imagesSelected[i]);
            }

          }else{
            console.log("image nahi hai")

            dataService.addProduct({product_name:title,product_price:price,product_details:detail ,_product_category_id:selectedCategory._id,product_longitude:$rootScope.longitude,product_latitude:$rootScope.latitude,_user_id:user._id ,image_url:"templates/imageNotAvailable.jpg"})
              .then(function (res,err) {
                if(res){
                  console.log(res);
                  $ionicLoading.hide();
                  dataService.showActionSheet(res.message,'app.hot_deals');



                }else{
                  console.log(err);
                }
              })
              .catch(function (err) {
                console.log(err)
                if(err.status==420){
                  $rootScope.openChangePhoneModal();
                }
              })

          }

        }










      };



var imagesSelected=[];
       $scope.choosePhoto = function () {


         window.imagePicker.getPictures(
           function (results) {
             // uploadImage(results);

              for (var i = 0; i < results.length; i++) {
             //   //  $scope.images1.push(results[i]);
             //   // $scope.imagesFT.push(results[i]);
                imagesSelected.push(results[i]);
             $scope.images1.push({item:results[i]});
             //   uploadImage(results[i]);
              }

         //    console.log(imagesURL);
             if (!$scope.$$phase) {
               $scope.$apply();
             }
           }, function (error) {
             console.log(error);
           }
         );
       }


      $scope.takePhoto = function () {
        var options = {
          quality: 40,
          destinationType: Camera.DestinationType.FILE_URI,
          sourceType: Camera.PictureSourceType.CAMERA,
          allowEdit: true,
          encodingType: Camera.EncodingType.JPEG,
          targetWidth: 300,
          targetHeight: 300,
          popoverOptions: CameraPopoverOptions,
          saveToPhotoAlbum: true
        };

        $cordovaCamera.getPicture(options).then(function (imageData) {
          $scope.imgURI = "data:image/jpeg;base64," + imageData;
          $scope.singleImage = imageData;
          $scope.imgdata=imageData;
          $scope.images1.push({item:imageData});
          imagesSelected.push(imageData);

          console.log(imageData)
        }, function (err) {
          // An error occured. Show a message to the user
        });
      }




      var k=0;

      function uploadImage(imageURI) {
        console.log('start upload image.');
        var deferred = $q.defer();

        uploadFile();

        function uploadFile() {

        //  $ionicLoading.show({template : 'Uploading image...'});
          // Add the Cloudinary "upload preset" name to the headers
          var uploadOptions = {
            params : { 'upload_preset': cl.config().upload_preset}
          };
          $cordovaFileTransfer
          // Your Cloudinary URL will go here
            .upload("https://api.cloudinary.com/v1_1/" + cl.config().cloud_name + "/upload", imageURI, uploadOptions)

            .then(function(result) {
              // Let the user know the upload is completed
              var r = JSON.parse(result.response);
              console.log(result);
             // console.log(result.response.url);
            //  imagesURL.push(r.url);

            //  $ionicLoading.show({template : 'Done.', duration: 1000});
              var response = JSON.parse(decodeURIComponent(result.response));
var url = r.url;
              console.log(url.substring(0,53));
             console.log( url.substring(65,url.length));
              var lessUrl =  url.substring(0,53) + "q_40/" + url.substring(65,url.length);
              console.log(lessUrl);
              deferred.resolve(imagesURL.push(lessUrl));
              k++;
              if(imagesSelected.length==k){
                console.log(imagesURL)
                dataService.addProduct({product_name:title,product_price:price,product_details:detail ,_product_category_id:selectedCategory._id,product_longitude:$rootScope.longitude,product_latitude:$rootScope.latitude,_user_id:user._id ,image_url:imagesURL})
                  .then(function (res,err) {
                    if(res){
                      console.log(res);
                      $ionicLoading.hide();
                      dataService.showActionSheet(res.message,'app.hot_deals');



                    }else{
                      console.log(err);
                    }
                  })
                  .catch(function (err) {
                    console.log(err)
                    if(err.status==420){
                      $rootScope.openChangePhoneModal();
                    }
                  })
              }

            }, function(err) {
              // Uh oh!
              console.log(err);
            //  $ionicLoading.show({template : 'Failed.', duration: 3000});
              deferred.reject(err);
            }, function (progress) {

            });
        }
      // console.log(imagesURL);
        return deferred.promise;
      }




    })

     .controller('PaymentInfoCtrl', function($scope) {
$scope.pay  = function () {
  var submitButton = document.querySelector('#submit-button');

  braintree.dropin.create({
    authorization: 'CLIENT_AUTHORIZATION',
    container: '#dropin-container'
  }, function (err, dropinInstance) {
    console.log("braintree")
    if (err) {
      // Handle any errors that might've occurred when creating Drop-in
      console.error(err);
      return;
    }
    submitButton.addEventListener('click', function () {
      console.log("button")
      dropinInstance.requestPaymentMethod(function (err, payload) {
        if (err) {
          // Handle errors in requesting payment method
        }

        // Send payload.nonce to your server
      });
    });
  });




}



     })

     .controller('FeatureAdCtrl', function($scope,dataService) {


     })

     .controller('BraintreeCtrl', function($scope,dataService) {
       var token;
       dataService.getPaymentToken()
         .then(function (res) {
           console.log(res);
           token = res;
           var submitButton = document.querySelector('#submit-button');

           braintree.dropin.create({
             authorization: token.clientToken,
             container: '#dropin-container'
           }, function (err, dropinInstance) {
             console.log("braintree")
             if (err) {
               // Handle any errors that might've occurred when creating Drop-in
               console.error(err);
               return;
             }
             submitButton.addEventListener('click', function () {
               console.log("button")
               dropinInstance.requestPaymentMethod(function (err, payload) {
                 if (err) {
                   // Handle errors in requesting payment method
                 }
                 console.log(payload)
                 dataService.makeTransaction({payment_method_nonce:payload.nonce, amount:'300'})
                   .then(function (res) {
                     console.log(res)
                   })
                 // Send payload.nonce to your server
               });
             });
           });
         })
         .catch(function (err) {
           console.log(err)
         })









     })

     .controller('FavouriteCtrl', function($scope,dataService,$ionicLoading,$ionicPopup) {
       var user = JSON.parse(window.localStorage.getItem("cocoProfile1"));
$ionicLoading.show();
       $scope.myFav;
       dataService.getUserFavs({_user_id:user._id})
         .then(function (res) {
           console.log(res);
           $scope.myFav = res.result;
           $ionicLoading.hide();


         })
         .catch(function (err) {
           console.log(err)
           $ionicLoading.hide();

         })

       $scope.removeItem = function (index,id) {

         $ionicPopup.show({
           title:"Are you sure you want to remove from fav ?",
           buttons:[
             {
               text: 'Yes', onTap : function (e) {
               console.log(index);
               $ionicLoading.show();
               dataService.removeFavourite({_user_id:user._id,product_id:id})
                 .then(function (res,err) {
                   if(res){
                     console.log(res)
                     $scope.myFav.splice(index, 1);
                     dataService.showActionSheet(res.message,'no');
                     $ionicLoading.hide();


                   }
                 });

             }
             }, {
               text: 'Cancel', onTap : function (e) {
                 return true;

               }
             }

           ]
         });



       };


     })

     .controller('SettingsCtrl', function($scope) {
      // window.localStorage.setItem("userRange",JSON.stringify($scope.range));
       var userrange = JSON.parse(window.localStorage.getItem("userRange"));
       $scope.range=userrange;
       $scope.rangeslide = function (range) {
         console.log(range)
         window.localStorage.setItem("userRange",JSON.stringify(range));

       }
     })



.controller(function($scope, $rootScope,$ionicActionSheet, $timeout) {




  $rootScope.show = function(text) {
    console.log(text);

    // Show the action sheet
    var hideSheet = $ionicActionSheet.show({
      buttons: [
        { text: '<b>Share</b> This' },
        { text: 'Move' }
      ],
      destructiveText: 'Delete',
      titleText: text,
      cancelText: 'Cancel',
      cancel: function() {
        // add cancel code..
      },
      buttonClicked: function(index) {
        return true;
      }
    });

    // For example's sake, hide the sheet after two seconds
    $timeout(function() {
      hideSheet();
    }, 2000);

  };

});


  // .controller('PlaylistsCtrl', function($scope) {
  //
  // })
