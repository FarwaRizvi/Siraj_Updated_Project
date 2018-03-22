/**
 * Created by Siraj on 15-Oct-17.
 */
angular.module('starter.loader',[])
    .constant('Loading',Loading);


function Loading($scope, $ionicLoading) {
    return{
        show:show,
        hide:hide
    };

    function show() {
        $ionicLoading.show({
            template: 'Loading...',
            duration: 3000
        }).then(function(){
            console.log("The loading indicator is now displayed");
        });
    }

    function hide() {
        $ionicLoading.hide().then(function(){
            console.log("The loading indicator is now hidden");
        });
    }


}


    // .controller('LoadingCtrl', function($scope, $ionicLoading) {
    //     $scope.show = function() {
    //         $ionicLoading.show({
    //             template: 'Loading...',
    //             duration: 3000
    //         }).then(function(){
    //             console.log("The loading indicator is now displayed");
    //         });
    //     };
    //     $scope.hide = function(){
    //         $ionicLoading.hide().then(function(){
    //             console.log("The loading indicator is now hidden");
    //         });
    //     };
    // });