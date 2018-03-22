/**
 * Created by Siraj on 10/24/2016.
 */
angular.module('starter.factory', [])

.factory('dataService',dataService);
function dataService(Restangular,$ionicActionSheet,$timeout,$state){
  return {
    facebookSignIn:facebookSignIn,
    registerUser : registerUser,
    addProduct: addProduct,
    getProducts : getProducts,
    editProfile : editProfile,
    editName : editName,
    getProductDetail : getProductDetail,
    register: register,
    login : login,
    addBid : addBid,
    deleteProduct:deleteProduct,
    currentDate : currentDate,
    getUserAuctions :getUserAuctions,
    getUserPosts : getUserPosts,
    editProduct:editProduct,
    getCategory: getCategory,
    getUserNotiIds:getUserNotiIds,
    getProductByCategoryId:getProductByCategoryId,
    getProductsOnHomePage:getProductsOnHomePage,
    showActionSheet:showActionSheet,
    addPhoneNumber:addPhoneNumber,
    codeVerify:codeVerify,
    addFavourite:addFavourite,
    nearestProduct:nearestProduct,
    getPaymentToken:getPaymentToken,
    makeTransaction:makeTransaction,
    getUserFavs:getUserFavs,
    getAUser:getAUser,
    removeFavourite:removeFavourite
  };



  function registerUser(data){
    return Restangular.all('/signup').post(data);
  }

  function addProduct(data){
    return Restangular.all('/add-product-ads').post(data);
  }

  function getProducts(skip,limit){
    return Restangular.one('products').one(skip+'/'+limit).get();
   // return Restangular.one('products').get();
  }

  function editProfile(data){
    return Restangular.all('/editProfile').customPOST(data);
  }

  function editName(data){
    return Restangular.all('/change-user-name').customPOST(data);
  }

  function getProductDetail(id) {
    return Restangular.all('get-product-by-id').post(id);

  }

  function register(data) {
    console.log(data);
    return Restangular.all('/register').post(data);
  }

  function  login(data) {
    return Restangular.all('/login').post(data)
  }
  function addBid(productId,userId,bidAmount) {
    return  Restangular.all('addBid').one(productId+'/'+userId).customPOST(bidAmount)
  }

  function deleteProduct(productId) {
    return Restangular.all('delete-product-ads').post(productId);
  }

  function editProduct(data) {
    return Restangular.all('edit-product-ads').post(data);
  }

  function currentDate() {
    return Restangular.one('currentDate').get();
  }

  function getUserPosts(id) {
    return Restangular.all('get-all-product-by-userid').post(id);
  }

  function getUserAuctions(id) {
    return Restangular.one('getUserAuctions').one(id).get();
  }

  function getCategory() {
    return Restangular.all('get-all-product-category').post();

  }

  function getUserNotiIds(id) {
    return Restangular.one('getUserNotiIds').one(id).get();

  }

  function facebookSignIn() {
    return Restangular.one('/connect/facebook').get();

  }

  function getProductByCategoryId(id) {
    return Restangular.all('get-all-product-by-categoryid').post(id);

  }

  function getProductsOnHomePage(){
    return Restangular.all('get-product-on-homepage').post();
    // return Restangular.one('products').get();
  }



  function addPhoneNumber(data){
    return Restangular.all('send-verification-code-to-phone').post(data);
    // return Restangular.one('products').get();
  }

  function codeVerify(data){
    return Restangular.all('confirm-verification-code').post(data);
    // return Restangular.one('products').get();
  }

  function addFavourite(data){
    return Restangular.all('/save-into-favorites').post(data);
    // return Restangular.one('products').get();
  }

  function nearestProduct(data){
    return Restangular.all('/nearest-product').post(data);
    // return Restangular.one('products').get();
  }

  function getPaymentToken(){
    return Restangular.all('/get-new-client-token').post();
    // return Restangular.one('products').get();
  }


  function makeTransaction(data){
    return Restangular.all('/make-transaction-model').post(data);
    // return Restangular.one('products').get();
  }


  function getUserFavs(data){
    return Restangular.all('/get-all-products-from-user-favorites').post(data);
    // return Restangular.one('products').get();
  }

  function getAUser(data){
    return Restangular.all('/get-a-user').post(data);
    // return Restangular.one('products').get();
  }

  function removeFavourite(data){
    return Restangular.all('/remove-from-favorites').post(data);
    // return Restangular.one('products').get();
  }






  function showActionSheet(text,state){
   console.log(text);
    var hideSheet = $ionicActionSheet.show({
      // buttons: [
      //   { text: '<b>Share</b> This' },
      //   { text: 'Move' }
      // ],
      // destructiveText: 'Delete',
       titleText: text
      // cancelText: 'Cancel',
      // cancel: function() {
      //   // add cancel code..
      // },
      // buttonClicked: function(index) {
      //   return true;
      // }
    });

    // For example's sake, hide the sheet after two seconds
    $timeout(function() {
      hideSheet();
      if(state=='no'){

      }else{
        $state.go(state);

      }
    }, 2000);


    // return Restangular.one('products').get();
  }

}
