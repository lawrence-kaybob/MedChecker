/*
* Javascirpt for MedChecker Service
*/


var app = angular.module("appModule", ['ngRoute']);



app.controller('AppController', function ($scope, $auth) {

    var currentYear;
    var currentMonth;
    var currentDay;
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

    $scope.databaseCheck = function () {
    var d = new Date();
    var n = d.getTime();

        firebase.database().ref(
/*          'status/' + firebase.auth().currentUser.uid +'/' +  2016+ '/' + 11).set({
                '13' : n*/
            'user_info/' + firebase.auth().currentUser.uid + '/').set({
                patientsNo : "1325704",
                pillsInfo : $scope.currentUser.pillsInfo,
                age : $scope.currentUser.age,
                birthday : $scope.currentUser.birthday
            });
    };

	$auth.init();
	console.log("app.js Loaded");
	$auth.setScopeOnAuthStateChange($scope);
});