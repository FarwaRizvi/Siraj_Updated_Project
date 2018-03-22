/**
 * Created by Siraj on 10/24/2016.
 */
angular.module('starter.sheet', [])

  .factory('actionSheet',actionSheet);
function actionSheet(){
  return {
   show:show
  };


  function show(data){
   console.log(data)
  }


}
