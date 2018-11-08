(function(){
'use strict'

 angular.module('NarrowItDownApp',[])
 .controller('NarrowItDownController',NarrowItDownController)
 .service('MenuSearchService',MenuSearchService)
 .directive('foundItems',FoundItems)
 .constant('ApiBasePath',' https://davids-restaurant.herokuapp.com/');

 function FoundItems(){
     var ddo={
        templateUrl:'list.html',
        scope:{
          items:'<',
          onRemove:'&'
        },
        controller: ShoppingListDirectiveController,
    controllerAs: 'list',
    bindToController: true
     };
     return ddo;
 }
 function ShoppingListDirectiveController() {
    var list = this;
  
    list.cookiesInList = function () {
      for (var i = 0; i < list.items.length; i++) {
        var name = list.items[i].name;
        if (name.toLowerCase().indexOf("cookie") !== -1) {
          return true;
        }
      }
  
      return false;
    };
  }
 NarrowItDownController.$inject=['MenuSearchService'];
 function NarrowItDownController(MenuSearchService){
     var narrow=this;
// var promise=MenuSearchService.getMatchedMenuItems(narrow);
        narrow.searchItem="";
     narrow.getList=function(){
        MenuSearchService.getMatchedMenuItems(narrow.searchItem);
    narrow.found=MenuSearchService.getListItem();
    narrow.removeItem=function(index){
        MenuSearchService.removeItem(index);
    }
}
 }

 MenuSearchService.$inject=['$http','ApiBasePath'];
 function MenuSearchService($http,ApiBasePath){
     var service=this;

     var selecteditems=[];

     service.getMatchedMenuItems=
     function(searchItem){
         console.log(searchItem);
         var response=$http({
           method:'get',
           url: (ApiBasePath+'/menu_items.json')
         })
         .then(function(result){
            var data=result.data;
           var arry= angular.fromJson(data);
            angular.forEach(arry, function (value, key, obj) {
                for (var i = 0; i < obj.menu_items.length; i++) {
               
                var value=(obj.menu_items[i].description);
              
                if(value.indexOf(searchItem)!==-1){
                    var sname=obj.menu_items[i].short_name;
                    var name=obj.menu_items[i].name;    
                    var selectedItem={
                        short_name:sname,
                        name:name
                    };
                    console.log(selectedItem
                        );
                    selecteditems.push(selectedItem);
                }
                }
                });
                return selecteditems;
             
         }).catch(function(error){
             console.log("Error",error);
         } );
    service.getListItem=function(){
        return selecteditems;
    }
    service.removeItem=function(index){
        selecteditems.splice(index,1);
    }
 }
 }
})();