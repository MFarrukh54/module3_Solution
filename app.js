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
          onRemove:'&',
          EmptyValue:'@'
        },
        transclude:true,
        controller: ShoppingListDirectiveController,
    controllerAs: 'list',
    bindToController: true
     };
     return ddo;
 }
 function ShoppingListDirectiveController() {
       var list=this; 
}
 NarrowItDownController.$inject=['MenuSearchService'];
 function NarrowItDownController(MenuSearchService){
     var narrow=this;
     narrow.EmptyValue=false;
     narrow.updateValue=function(){
         narrow.found="";
         narrow.EmptyValue="";
     };
   narrow.found="";
   narrow.searchItem="";
     narrow.getList=function(){
         if(narrow.searchItem!=""){
             var promise=MenuSearchService.getMatchedMenuItems(narrow.searchItem);
                promise.then(function(response){
                if(response.length>0){
                    narrow.found=response;}
                    else{
                        narrow.EmptyValue="Nothing Found.";
                    }
                }).catch(function(error){
                    narrow.EmptyValue="Error while getting the data please try again";
                });
            } 
else {
    narrow.EmptyValue="Nothing Found.";
}
};
    narrow.removeItem=function(index){
        MenuSearchService.removeItem(index);
    }

 }

 MenuSearchService.$inject=['$http','ApiBasePath'];
 function MenuSearchService($http,ApiBasePath){
     var service=this;

     var selecteditems=[];

     service.getMatchedMenuItems=
     function(searchItem){
         selecteditems=[];
         return $http({
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
                    var selectedItem={
                        short_name:obj.menu_items[i].short_name,
                        name:obj.menu_items[i].name,
                        description:obj.menu_items[i].description
                    };
                    selecteditems.push(selectedItem);
                }
                }
                });
                return selecteditems;
             
         }).catch(function(error){
             console.log("Error",error);
         } );
        
        };
    service.removeItem=function(index){
        selecteditems.splice(index,1);
    }
 
 }
})();