"use strict";

/* Directives */

var Material = angular.module( "Material", []);



/****************************************************************************
 *
 * A general purpose dialog directive
  *
 ****************************************************************************/


    Material.directive('kModalDialog', function() {

        return {

            restrict: "E",

            scope: { displayDialog: "=displaydialog" },   // Isolate scope (only for template below).

            replace: true, // Replace with the template below

            transclude: true, // we want to insert custom content inside the directive

            link: function(scope, element, attrs) {

                scope.dismissDialog = function() {

                    scope.displayDialog.show = false;
                    k_consoleLog(["dismissDialog", scope])

               };

            },

        template:  "<div class='k-material-modal' ng-show='displayDialog.show'>" +
                        "<div class='k-material-modal-overlay'>" +
                            "<div class='k-material-modal-dialog' ng-style='displayDialog.dialogStyle'>" +
                                "<button class='k-material-dialog-dismiss k-material-fab' ng-click='dismissDialog()'>" +
                                "</button>" +
                                "<div class='k-material-modal-content' ng-transclude>" +
                                "</div>" +
                            "</div>" +
                        "</div>"+
                   "</div>"

        }; // end of return

    }); // end of directive.


