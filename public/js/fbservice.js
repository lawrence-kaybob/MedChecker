// Initialize Firebase
var config = {
	apiKey: "AIzaSyAB_UzKpCnO9eaSUx43Fhr7ph98iRJD1mU",
	authDomain: "medchecker-6669b.firebaseapp.com",
	databaseURL: "https://medchecker-6669b.firebaseio.com",
	storageBucket: "medchecker-6669b.appspot.com",
	messagingSenderId: "890593433485"
};
firebase.initializeApp(config);

var app = angular.module("appModule");

// Individual service for firebase authentication
// Should be included
app.service('$auth', function($route) {
	// 최소한의 정보만 담을 객체
	// firebase 객체를 사용하지 않도록 하기 위함임!
	var currentUser;

	this.getCurrentUser = function (){
		return currentUser;
	};
	// Initailzation Function
	// Called in $scope controller
	this.init = function () {
		firebase.auth().getRedirectResult().then(function (result) {
			var user = result.user;
		}).catch(function (error) { //로그인 실패 시나리오
			var errorCode = error.code;
			var errorMessage = error.message;
			var email = error.email;
			var credential = error.credential;

			// 비정상적인 접근에 대한 로직을 따로 짤 수 있을 것 같음.
			alert("비정상적인 접근입니다.\n다시 로그인해주세요.");
			console.error(error);

/*			// 여기서 서비스하는 errorcode들은
			// 가능성이 적은 문제들로 보통 비정상적인 접근이
			// 일어날때만 날 것 같다.
			if (errorCode === 'auth/account-exists-with-different-credential') {
				alert('이미 가입하셨어여');
			}
			// 그 이외 오류들
			// 정지먹은 사용자들도 여기서 예외처리 넣어주면 될 것 같음
			// Update : Firebase Auth는 API적으로 사용정지 설정을 할 수 없어
			// Firebase DB를 활용하여 사용가능성을 확인해야한다.
			else {

			}*/
		});
	};

	this.setScopeOnAuthStateChange = function ($scope) {
		firebase.auth().onAuthStateChanged(function (user) {
			if (user) {
				// currentUser 객체는 global하게 접근 가능!
				// $('#modal').modal('hide');
				// 현 사용자 정보가 메인 페이지에
				// 적용될 수 있게 스크립트만 짜주면 될 듯

				console.log('State Change Checked');
				currentUser = {
					greetingMessage: "반갑습니다 " + user.displayName + "님",
					displayName : user.displayName,
					email: user.email,
					photoURL: user.photoURL,
					uid : user.uid
				};

				$scope.currentUser = currentUser;
				console.log("currentUser usable");
				$scope.nextState = "로그아웃"
				// angular.element('#loader-wrapper').fadeOut(500);
				// $route.reload();
			}
			else {
				$scope.currentUser = {
					greetingMessage: "로그인 해주세요",
					displayName: null,
					photoURL: "images/profile_placeholder.png",
					email: null,
					uid: null
				}
				$scope.nextState = "로그인"
				//$scope.showModal = true;
				// angular.element('#loader-wrapper').fadeIn(500);
				// angular.element('#img-wrapper').fadeOut(500, function(){
				// angular.element('#socialLogin').fadeIn(500);
				}

				$route.reload();
				// 로그아웃이 됐을 경우의 로직
				// index.html(메인페이지 화면)으로 redirect하게
				// 하면 될 듯
			});

	console.log("Firebase Loaded");
	};
});