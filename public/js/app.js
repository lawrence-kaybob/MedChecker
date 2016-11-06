/*
* Javascirpt for MedChecker Service
*/


var app = angular.module("appModule", ['ngRoute']);



app.controller('AppController', function ($scope, $auth) {

	var currentUser;

	$scope.toggleAuth = function() {
        if (!firebase.auth().currentUser) {
            // Firebase FB Login Provider로 시작
            // 팝업창 없이 현화면에서 redirect
            var provider = new firebase.auth.FacebookAuthProvider();
            firebase.auth().signInWithRedirect(provider).then(function () {
              
            });
        }
        else {// 로그아웃
        	alert("로그아웃 되었습니다!");
            firebase.auth().signOut();
        }
	};

	$auth.init();
	console.log("app.js Loaded");
	$auth.setScopeOnAuthStateChange($scope);
});