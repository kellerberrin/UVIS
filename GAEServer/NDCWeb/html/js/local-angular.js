/*
*
* k_DrugSearchModule.controller("k_DrugSearchCtrl", k_DrugSearchCtrl );
*
*
*/

    function k_DrugSearchCtrl($scope, $materialToast) {
                

        $scope.view = {};
        $scope.model = {};

        $scope.view.searchtype = new k_DropDown($("#k-searchtype-dropdown")); 
                
        $scope.model.search  =  { text: ""
                                , type : "name" 
                                , typelist : [ "name", "active", "ndc"] 
                                , textpromptlist : ["name","active","ndc"]  };

        $scope.model.search.prompt = $scope.model.search.textpromptlist[0];

                
        $scope.performSearch = function() {

            $scope.model.search.text = k_postAngularSearch($scope.model.search.text, $scope.model.search.type);

        }

        $scope.updateType = function() {

            $scope.model.search.type = $scope.model.search.typelist[$scope.view.searchtype.getIndex()]; 

        }
 
        $scope.openToast = function($event) {

            var hideToast = $materialToast({ template: "<material-toast>Hello!</material-toast>", duration: 3000 });

        }


    }

