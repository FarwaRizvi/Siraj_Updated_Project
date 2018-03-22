// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers','ngCordova','restangular','starter.factory','starter.loader','starter.sheet', 'cloudinary' ])
/* //if use wakanda platform
    angular.module('starter', ['ionic', 'starter.controllers','wakanda'])
*/


.run(function($ionicPlatform ,$rootScope ,$location,$ionicModal,$ionicSlideBoxDelegate,$ionicPopup,dataService) {

 // HttpContext.Current.Response.AddHeader("Access-Control-Allow-Origin", "*");
  $rootScope.isUserLoggedIn = JSON.parse(window.localStorage.getItem("cocoProfile1"));

  if($rootScope.isUserLoggedIn){
    console.log("user exist")

    $location.path('/app/hot_deals');


  }


$rootScope.showImg=function(img){
    $rootScope.bigImg=img
}
/*************** zoom function ****************/
   $rootScope.openPhotoSwipe = function(image) {
        var index=0;

        $rootScope.PhotoSwipe=true;
        var pswpElement = document.querySelectorAll('.pswp')[0];
        var items = [];
        items.push({ src:image,w:400,h:300});
        var options = {history:false,focus:false,showAnimationDuration:0,hideAnimationDuration:0};
        var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options,index);
        gallery.init();
    }

/*************** location function ****************/
  $rootScope.goto=function(url){
        $location.path(url)
    }

/*************** active function ****************/

$rootScope.loader = "img/check.png";
  $rootScope.active_icon=false;
  $rootScope.activeselect=function(index){
      if(index==1){$rootScope.active_icon1=! $rootScope.active_icon1;
                  }
      else if (index==2){
          $rootScope.active_icon2=! $rootScope.active_icon2;
              }
      else {$rootScope.active_icon3=! $rootScope.active_icon3;
           }
  }
  $rootScope.likeItem=function(item){
      item.fav=!item.fav;
  }
 /*************** increment-decrement function ****************/
  $rootScope.increment = function(count,index) {
    if (count >= 0) $rootScope.cart[index].count=count+1;
  };
  $rootScope.decrement = function(count,index) {
  if (count >= 1) $rootScope.cart[index].count=count-1;
  };
 /*************** delete function ****************/
 // $rootScope.removeItem = function (index) {
 //   $rootScope.cart.splice(index, 1);
 // };

$rootScope.removeItemWish = function (index) {
   $rootScope.wish.splice(index, 1);
 };

/*************** increment-decrement function ****************/
 $rootScope.value=1;

 $rootScope.increment_val= function() {
   if ($rootScope.value >= 1)
   $rootScope.value++;
 };
 $rootScope.decrement_val = function() {
   if ($rootScope.value > 1)
   $rootScope.value--;
 };


$rootScope.showSecondpage=function(index){
    $rootScope.show_step=index;
}

/*************** groups function ****************/
  $rootScope.groups = [
    { name: 'WESTERN WEAR', id: 1, items: [{ subName: 'SubBubbles1', subId: 'TOPS & TEES' }, { subName: 'SubBubbles2', subId: 'DRESSES & JUMPSUITS' }, { subName: 'SubBubbles2', subId: 'JEANS' }, { subName: 'SubBubbles2', subId: 'SHORTS & SKIRTS' }, { subName: 'SubBubbles2', subId: 'TUNICS' }]},

    { name: 'FOOTWEAR', id: 1, items: [{ subName: 'SubBubbles1', subId: 'Boots' }, { subName: 'SubBubbles2', subId: 'Shoes' }, { subName: 'SubBubbles2', subId: 'Sandals' }, { subName: 'SubBubbles2', subId: 'Indoor footwear' }, { subName: 'SubBubbles2', subId: 'Specific footwear' }]},

    { name: 'LINGERIE ', id: 1, items: [{ subName: 'SubBubbles1', subId: 'long LINGERIEs' }, { subName: 'SubBubbles2', subId: 'short LINGERIEs' }, { subName: 'SubBubbles2', subId: 'upper LINGERIEs' }, { subName: 'SubBubbles2', subId: 'under LINGERIEs' }]},

    { name: 'WATCHES & ACCESSORIES', id: 1, items: [{ subName: 'SubBubbles1', subId: 'Automatic Watches' }, { subName: 'SubBubbles2', subId: 'Chronograph Watches' }, { subName: 'SubBubbles2', subId: 'Couple Watches' }, { subName: 'SubBubbles2', subId: 'Diver Watches' }, { subName: 'SubBubbles2', subId: 'Fashion Watches' }]}
  ];


    /*
   * if given group is the selected group, deselect it
   * else, select the given group
   */
  $rootScope.toggleGroup = function(group) {
    if ($rootScope.isGroupShown(group)) {
      $rootScope.shownGroup = null;
    } else {
      $rootScope.shownGroup = group;
    }
  };
  $rootScope.isGroupShown = function(group) {
    return $rootScope.shownGroup === group;
  };

    /********************* popup forget password **********************/
    $rootScope.forget_password=function (){
        $ionicPopup.show({
        template: 'Enter your email address below.<label class="item item-input" style="  height: 34px; margin-top: 10px;"><input  type="email"  /></label>',
        title: 'Forget Password',
        subTitle: ' ',
        scope: $rootScope,
        buttons: [
        {text: '<b>Send</b>',
        type: 'button-positive'},
        { text: 'Cancel' ,
        type: 'button-positive'},]
        });
    };

  /********************* popup enter-email **********************/
    $rootScope.enter_email=function (){
        $ionicPopup.show({
        template: 'Enter your email address below.<label class="item item-input" style="  height: 34px; margin-top: 10px;"><input  type="email"  /></label>',
        title: 'Your Mail',
        subTitle: ' ',
        scope: $rootScope,
        buttons: [
        {text: '<b>Send</b>',
        type: 'button-positive'},
        { text: 'Cancel' ,
        type: 'button-positive'},]
        });
    };


  /********************* repeat lists **********************/

  dataService.getCategory()
    .then(function (res,err) {
      if(res){

         res[0].img="img/mobiles.png";
          res[1].img="img/vehicles.png";
          res[2].img="img/electronics.png";
          res[3].img="img/bikes.png";
       console.log(res);
          $rootScope.categories = res;



      }else{
        console.log(err);
      }
    });


   //  $rootScope.list_1=[{id:"59e088f2b5c1930012d74908",img:"img/mobiles.png",title:"MOBILES"},
   //                     {id:"2",img:"img/electronics.png",title:"ELECTRONICS",price:"215 $"},
   //                     {id:"3" ,img:"img/vehicles.png",title:"VEHICLES",price:"215 $"},
   //                     {id:"4",img:"img/bikes.png",title:"BIKES",price:"250$"},
   //                     {id:"5",img:"img/fashion.png",title:"FASHION & BEAUTY",price:"250$"},
   //                     {id:"6" ,img:"img/animals.png",title:"ANIMALS",price:"250$"},
   //                     {id:"7",img:"img/furniture.png",title:"FURNITURE",price:"250$"},
   //                   //  {id:"8",img:"img/img4.png",title:"CASUAL WEAR",price:"250$"},
   //                    // {id:"9" ,img:"img/img1.png",title:"CASUAL WEAR",price:"250$"},
   //                    // {id:"10" ,img:"img/img2.png",title:"CASUAL WEAR",price:"250$"}
   //    ]
   //
   //  $rootScope.store_list=[{id:"1",bg:"img/store1.png",logo:"img/store-logo.png"},
   //                         {id:"2",bg:"img/store2.png",logo:"img/store-logo2.png"},
   //                         {id:"3",bg:"img/store1.png",logo:"img/store-logo.png"},
   //                         {id:"4",bg:"img/store2.png",logo:"img/store-logo2.png"},
   //                         {id:"5",bg:"img/store1.png",logo:"img/store-logo.png"},
   //                         {id:"6",bg:"img/store2.png",logo:"img/store-logo2.png"}]
   //
   //  // $rootScope.cart=[{id:"1",bg:"img/img1.png",count:1},
   //  //                  {id:"2",bg:"img/img2.png",count:1},
   //  //                  {id:"3",bg:"img/img3.png",count:1}]
   //
   //
   //  $rootScope.wish=[{id:"1",bg:"img/img1.png"},
   //                   {id:"2",bg:"img/img2.png"},
   //                   {id:"3",bg:"img/img3.png"},
   //                   {id:"4",bg:"img/img4.png"}]
   //
   //
   //  $rootScope.images=[{id:"1",bg:"img/det-head.png"},
   //                   {id:"2",bg:"img/01.png"},
   //                   {id:"3",bg:"img/02.png"},
   //                   {id:"4",bg:"img/03.png"}]
   // // $rootScope.showImg($rootScope.images[0].bg)

/********************* menu-modal **********************/

    $ionicModal.fromTemplateUrl('templates/menumodal.html',function(modal){
  $rootScope.menumodal=modal;
  }, {
    scope: $rootScope,
    animation: 'slide-in-up'
  });

  $rootScope.openmenumodal= function(){
    $rootScope.menumodal.show();
  };

  $rootScope.closemenumodal= function() {
    $rootScope.menumodal.hide();
  };

  $rootScope.signinmodal = function () {
    $rootScope.menumodal.hide();
    window.location.reload(true)

  }

  $rootScope.logoutmenumodal= function() {
    $rootScope.menumodal.hide();
    localStorage.clear();
    window.location.reload(true)
  };

  $rootScope.$on('$destroy', function() {
    $rootScope.menumodal.remove();
  });
  $rootScope.$on('modal.hidden', function() {
    // Execute action
  });

  /********************* sort-modal **********************/
  $ionicModal.fromTemplateUrl('templates/sortmodal.html',function(modal){
  $rootScope.sortmodal=modal;
  }, {
    scope: $rootScope,
    animation: 'slide-in-up'
  });

  $rootScope.opensortmodal= function(){
    $rootScope.sortmodal.show();
    $rootScope.discount = true;
    $rootScope.lowprice = true;
  };

  $rootScope.updateSelection = function(position) {
    
    if (position == 1)
    {
        $rootScope.devList = [
          { text: "Discount", checked: true, id:1 },
          { text: "Low Price", checked: false, id:2 },
          { text: "High Price", checked: false, id:3 },
          { text: "Near By", checked: false, id:4 }
        ];
    }
    else if (position == 2)
    {
        $rootScope.devList = [
          { text: "Discount", checked: false, id:1 },
          { text: "Low Price", checked: true, id:2 },
          { text: "High Price", checked: false, id:3 },
          { text: "Near By", checked: false, id:4 }
        ];
    }
    else if (position == 3)
    {
        $rootScope.devList = [
          { text: "Discount", checked: false, id:1 },
          { text: "Low Price", checked: false, id:2 },
          { text: "High Price", checked: true, id:3 },
          { text: "Near By", checked: false, id:4 }
        ];
    }
    else
    {
        $rootScope.devList = [
          { text: "Discount", checked: false, id:1 },
          { text: "Low Price", checked: false, id:2 },
          { text: "High Price", checked: false, id:3 },
          { text: "Near By", checked: true, id:4 }
        ];
    }
  };
  
  $rootScope.$on('$destroy', function() {
    $rootScope.sortmodal.remove();
  });
  $rootScope.$on('modal.hidden', function() {
    // Execute action
  });

  /********************* search-modal **********************/
    $ionicModal.fromTemplateUrl('templates/searchmodal.html',function(modal){
  $rootScope.searchmodal=modal;
  }, {
    scope: $rootScope,
    animation: 'slide-in-up'
  });

  $rootScope.opensearchmodal= function(){
    $rootScope.searchmodal.show();
  };

  $rootScope.closesearchmodal= function(searching) {
    $rootScope.searchmodal.hide();
    console.log(searching);
    $rootScope.searchText = searching;
  };
  $rootScope.closesearchmodal2= function() {
    $rootScope.searchmodal.hide();
    $rootScope.searchText = '';
  };
  $rootScope.$on('$destroy', function() {
    $rootScope.searchmodal.remove();
  });
  $rootScope.$on('modal.hidden', function() {
    // Execute action
  });

 /********************* complete-modal **********************/

 $ionicModal.fromTemplateUrl('templates/completemodal.html',function(modal){
  $rootScope.completemodal=modal;
  }, {
    scope: $rootScope,
    animation: 'slide-in-up'
  });

  $rootScope.opencompletemodal= function(){
    $rootScope.completemodal.show();
  };

  $rootScope.closecompletemodal= function() {
    $rootScope.completemodal.hide();
  };
  $rootScope.$on('$destroy', function() {
    $rootScope.completemodal.remove();
  });
  $rootScope.$on('modal.hidden', function() {
    // Execute action
  });



  /////change name modal
  $ionicModal.fromTemplateUrl('templates/changeName.html',function(modal){
    $rootScope.changeName=modal;
  }, {
    scope: $rootScope,
    animation: 'slide-in-up'
  });

  $rootScope.openChangeNameModal= function(){
    $rootScope.changeName.show();
  };

  $rootScope.closeChangeNameModal= function(fname, lname) {
    var user = JSON.parse(window.localStorage.getItem("cocoProfile1"));
    console.log(fname);
    console.log(lname);
     dataService.editName({user_firstname:fname,user_lastname:lname,_user_id:user._id})
       .then(function (res) {
         console.log(res);
       })
       .catch(function (err) {
         console.log(err);
       });
         $rootScope.changeName.hide();
    };
  $rootScope.$on('$destroy', function() {
    $rootScope.completemodal.remove();
  });
  $rootScope.$on('modal.hidden', function() {
    // Execute action
  });
  /////end change name modal


    /////change email modal
  $ionicModal.fromTemplateUrl('templates/changeEmail.html',function(modal){
    $rootScope.changeEmail=modal;
  }, {
    scope: $rootScope,
    animation: 'slide-in-up'
  });

  $rootScope.openChangeEmailModal= function(){
    $rootScope.changeEmail.show();
  };

  $rootScope.closeChangeEmailModal= function(email) {
    var user = JSON.parse(window.localStorage.getItem("cocoProfile1"));
    console.log(email);
     dataService.editProfile({user_email:email,_user_id:user._id})
       .then(function (res) {
         console.log(res);
       })
       .catch(function (err) {
         console.log(err);
       });
         $rootScope.changeEmail.hide();
    };
  $rootScope.$on('$destroy', function() {
    $rootScope.completemodal.remove();
  });
  $rootScope.$on('modal.hidden', function() {
    // Execute action
  });
  /////end change email modal

  /////add phone number modal
  $ionicModal.fromTemplateUrl('templates/changePhone.html',function(modal){
    $rootScope.changePhone=modal;


  }, {
    scope: $rootScope,
    animation: 'slide-in-up'
  });

  $rootScope.openChangePhoneModal= function(){
    $rootScope.changePhone.show();
  };

  $rootScope.closeChangePhoneModal= function(number) {
    console.log('+92'+number.toString());
    var user = JSON.parse(window.localStorage.getItem("cocoProfile1"));
    dataService.addPhoneNumber({user_phonenumer:'+92'+number.toString(),_user_id:user._id})
      .then(function (res) {
        console.log(res);
        if(res.success){
          $rootScope.openCodeVerifyModal();
        }
      })
      .catch(function (err) {
        console.log(err);

      });
        $rootScope.changePhone.hide();
      };

  $rootScope.closePhnModal = function () {
    $rootScope.changePhone.hide();

  }
  $rootScope.$on('$destroy', function() {
    $rootScope.completemodal.remove();
  });
  $rootScope.$on('modal.hidden', function() {
    // Execute action
  });




  ///end phone number modal
  $ionicModal.fromTemplateUrl('templates/codeVerify.html',function(modal){
    $rootScope.codeVerify=modal;
  }, {
    scope: $rootScope,
    animation: 'slide-in-up'
  });

  $rootScope.openCodeVerifyModal= function(){
    $rootScope.codeVerify.show();
  };

  $rootScope.closeCodeVerifyModal= function(a,b,c,d) {
    var code=a.toString()+b.toString()+c.toString()+d.toString();
    console.log(code);
    dataService.codeVerify({twilio_token:code,user_phonenumber:"+923318081856"})
      .then(function (res) {
        console.log(res);
      })
      .catch(function (err) {
        console.log(err);
      });
    $rootScope.codeVerify.hide();
  };

  $rootScope.closeModal = function () {
    $rootScope.codeVerify.hide();
  };
  $rootScope.$on('$destroy', function() {
    $rootScope.completemodal.remove();
  });
  $rootScope.$on('modal.hidden', function() {
    // Execute action
  });

  //code verify modal



  //end phone verfiy modal



  $ionicPlatform.ready(function($state) {
     //window.localStorage.setItem("cocoProfile",JSON.stringify(null));
    $rootScope.isUserLoggedIn = JSON.parse(window.localStorage.getItem("cocoProfile1"));



      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);


    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    var onSuccess = function(position) {
      $rootScope.latitude=position.coords.latitude;
      $rootScope.longitude= position.coords.longitude;
      console.log('Latitude: '          + position.coords.latitude          + '\n' +
        'Longitude: '         + position.coords.longitude         + '\n' +
        'Altitude: '          + position.coords.altitude          + '\n' +
        'Accuracy: '          + position.coords.accuracy          + '\n' +
        'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
        'Heading: '           + position.coords.heading           + '\n' +
        'Speed: '             + position.coords.speed             + '\n' +
        'Timestamp: '         + position.timestamp                + '\n');
    };

    // onError Callback receives a PositionError object
    //
    function onError(error) {
      alert('code: '    + error.code    + '\n' +
        'message: ' + error.message + '\n');
    }

    navigator.geolocation.getCurrentPosition(onSuccess, onError);

  });
})

.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {

    $ionicConfigProvider.navBar.alignTitle('center');
    $ionicConfigProvider.backButton.text('').previousTitleText('');


  $stateProvider

  .state('login', {
    url: "/login",
        templateUrl: "templates/login.html"
  })

  .state('register', {
    url: "/register",
        templateUrl: "templates/register.html",
    controller:'RegisterCtrl'
  })

  .state('signin', {
    url: "/signin",
        templateUrl: "templates/signin.html",
    controller:'SignInCtrl'
  })

  .state('welcome_page', {
    url: "/welcome_page",
        templateUrl: "templates/welcome_page.html"
  })

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })



  .state('app.hot_deals', {
    url: "/hot_deals",
    views: {
      'menuContent': {
        templateUrl: "templates/hot_deals.html",
          controller:"HotDealsCtrl"
      }
    }
  })
    .state('app.categories', {
      url: "/categories",
      views: {
        'menuContent': {
          templateUrl: "templates/categories.html"
        }
      }
    })

  .state('app.details', {
      url: "/details/:id",
      views: {
        'menuContent': {
          templateUrl: "templates/details.html",
            controller:'ProductDetailCtrl'
        }
      }
    })

  .state('app.cart', {
      url: "/cart",
      views: {
        'menuContent': {
          templateUrl: "templates/cart.html",
            controller:"MyAdsCtrl"
        }
      }
    })

    .state('app.favourites', {
      url: "/favourites",
      views: {
        'menuContent': {
          templateUrl: "templates/favourites.html",
          controller : 'FavouriteCtrl'
        }
      }
    })

    .state('app.settings', {
      url: "/settings",
      views: {
        'menuContent': {
          templateUrl: "templates/settings.html",
          controller: 'SettingsCtrl'
        }
      }
    })

  .state('app.wish_list', {
      url: "/post_ad",
      views: {
        'menuContent': {
          templateUrl: "templates/wish_list.html",
          controller:'PostAdCtrl'
        }
      }
    })

  .state('app.payment', {
      url: "/payment",
      views: {
        'menuContent': {
          templateUrl: "templates/payment.html",
          controller: 'PaymentInfoCtrl'
        }
      }
    })

  .state('app.store', {
      url: "/store",
      views: {
        'menuContent': {
          templateUrl: "templates/store.html"
        }
      }
    })

  .state('app.profile', {
      url: "/profile",
      views: {
        'menuContent': {
          templateUrl: "templates/profile.html",
            controller:"ProfileCtrl"
        }
      }
    })

  .state('app.filter_list', {
      url: "/filter_list/:id",
      views: {
        'menuContent': {
          templateUrl: "templates/filter_list.html",
          controller:'FilterListCtrl'
        }
      }
    })


    ///MY ROUTERS

      .state('app.productEdit', {
          url: "/productEdit/:id",
          views: {
              'menuContent': {
                  templateUrl: "templates/productEdit.html",
                  controller: 'ProductEditCtrl'
              }
          }
      })

    .state('app.pay', {
      url: "/pay",
      views: {
        'menuContent': {
          templateUrl: "templates/pay.html",

        }
      }
    })


    .state('app.braintree', {
      url: "/braintree",
      views: {
        'menuContent': {
          templateUrl: "templates/braintreePayment.html",
          controller:'BraintreeCtrl'

        }
      }
    })

    .state('app.nearby', {
      url: "/near_by",
      views: {
        'menuContent': {
          templateUrl: "templates/nearby.html",
          controller: 'NearByCtrl'
        }
      }
    })


    .state('app.featureAd', {
      url: "/featureAd/:id",
      views: {
        'menuContent': {
          templateUrl: "templates/featureAd.html",
          controller:'FeatureAdCtrl'
        }
      }
    })

    .state('app.chat', {
      url: "/chat",
      views: {
        'menuContent': {
          templateUrl: "templates/chat.html",
          controller: 'ChatCtrl'
        }
      }
    })

    .state('app.inbox', {
      url: "/inbox",
      views: {
        'menuContent': {
          templateUrl: "templates/inbox.html",
          controller: 'InboxCtrl'
        }
      }
    })

    .state('app.messages', {
      url: "/messages",
      views: {
        'menuContent': {
          templateUrl: "templates/messages.html",
          controller: 'MessagesCtrl'
        }
      }
    })

  // .state('app.single', {
  //   url: "/playlists/:playlistId",
  //   views: {
  //     'menuContent': {
  //       templateUrl: "templates/playlist.html",
  //       controller: 'PlaylistCtrl'
  //     }
  //   }
  // });
  // if none of the above states are matched, use this as the fallback
    //window.localStorage.setItem("cocoProfile",JSON.stringify(null));
//    var user = JSON.parse(window.localStorage.getItem("cocoProfile"));
// console.log("user is " + user);
//     if(user==null){
         $urlRouterProvider.otherwise('/login');
//
//     }else{
//         $urlRouterProvider.otherwise('/hot_deals');
//     }
//

//  var isUserLoggedIn = JSON.parse(window.localStorage.getItem("cocoProfile1"));



})


  .directive("moveNextOnMaxlength", function() {
    return {
      restrict: "A",
      link: function($scope, element) {
        element.on("input", function(e) {
          if(element.val().length == element.attr("maxlength")) {
            var $nextElement = element.next();
            if($nextElement.length) {
              $nextElement[0].focus();
            }else{
              console.log("maxlengthelse")
            }
          }
        });
      }
    }
    })

.config(function (RestangularProvider) {

 // var url = "http://localhost:3000";
   var url =  "https://coco-ecomerce-server.herokuapp.com/";
  //var baseUrl = url + '/api';
 // RestangularProvider.setJsonp(true);
  ///RestangularProvider.setDefaultRequestParams('jsonp', {callback: 'JSON_CALLBACK'});
  RestangularProvider.setBaseUrl(url);

});
