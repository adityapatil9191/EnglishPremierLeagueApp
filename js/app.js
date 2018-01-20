var myapp = angular.module('eplapp',['ngRoute']);
myapp.controller('appCtrl',['$scope','$http','$rootScope',function($scope,$http,$rootScope){
	$http.get('epl.json')
	.then(function(res){
		$scope.dataReceived = res.data;
		//console.log($scope.dataReceived);
		 $scope.roundsplayed = [];

   		 angular.forEach($scope.dataReceived.rounds, function(value, key) {
        $scope.roundsplayed.push(value);
    });

  	 
   		
  	$scope.groupmatchesplayed = [];
	for(i=0;i<$scope.roundsplayed.length;i++){
		$scope.groupmatchesplayed.push($scope.roundsplayed[i].matches);

	}	

	
	$scope.individualmatches = [];
		for(i=0;i<$scope.groupmatchesplayed.length;i++){
		for(j=0;j<10;j++){
			$scope.individualmatches.push($scope.groupmatchesplayed[i][j]);
		
			}

	}

	$rootScope.globalarrayMatches = $scope.individualmatches;//contains an array of matches objects

	//console.log($rootScope.globalarrayMatches);
	
	

});

}]);


myapp.controller('matchCtrl',['$scope','$http','$rootScope','$routeParams',function($scope,$http,$rootScope,$routeParams){
		$rootScope.loadData = function(hashKey){
		$scope.individualmatches = $rootScope.globalarrayMatches;
		$rootScope.oneMatch = {};
		for(i=0;i<$scope.individualmatches.length;i++){
			if($scope.individualmatches[i].$$hashKey == hashKey){
				$rootScope.oneMatch = $scope.individualmatches[i];
			}
		}

		console.log($scope.oneMatch);
		
		

		}
}]);

myapp.controller('statsCtrl',['$scope','$http','$rootScope','$routeParams',function($scope,$http,$rootScope,$routeParams){
		$scope.onStatsLoad = function(){
			$scope.individualmatches = $rootScope.globalarrayMatches;
			$scope.team1names = [];
			$scope.team2names= [];
			$scope.team1scores = [];
			$scope.team2scores = [];
			$scope.distinctteams = [];

			for(i=0;i<$scope.individualmatches.length;i++){

				$scope.team1names.push($scope.individualmatches[i].team1.name);
				$scope.team2names.push($scope.individualmatches[i].team2.name);
				$scope.team1scores.push($scope.individualmatches[i].score1);
				$scope.team2scores.push($scope.individualmatches[i].score2);
			}

			//function to find the list of all the teams in the array

			var finddistinct = function(anyarray){
				var uniquearray = [];
				for(i=0;i<anyarray.length;i++){
					flag = 0;
					for(j=0;j<uniquearray.length;j++){
						if(anyarray[i] == uniquearray [j]){
							flag = 1;
							break;
						}
					
				}
					if(flag == 0){
						uniquearray.push(anyarray[i]);
					}
			}

			return uniquearray;
			}

			$scope.allteams = finddistinct($scope.team1names);
					
			$scope.winningteams =[];
			$scope.loosingteams =[];
			$scope.drawnteams = [];

			for(i=0;i<$scope.individualmatches.length;i++){
				if($scope.individualmatches[i].score1>$scope.individualmatches[i].score2){
					$scope.winningteams.push($scope.individualmatches[i].team1.name);
					$scope.loosingteams.push($scope.individualmatches[i].team2.name);

				}else if($scope.individualmatches[i].score1<$scope.individualmatches[i].score2){
					$scope.winningteams.push($scope.individualmatches[i].team2.name);
					$scope.loosingteams.push($scope.individualmatches[i].team1.name);
				}else if($scope.individualmatches[i].score1 == $scope.individualmatches[i].score2){
					$scope.drawnteams.push($scope.individualmatches[i].team1.name);
					$scope.drawnteams.push($scope.individualmatches[i].team2.name);
				}
				
			}

			//console.log($scope.winningteams);
			//console.log($scope.loosingteams);
			//console.log($scope.drawnteams);

			//allteams is the array containing list of distinct teams
			//winningteeams contains the list of those teams which won all the matches
			//loosingteams is an array containing the names of all the teams who lost the matches
			//drawnteams is an array containing the names of all the teams whose mathces were drawn

			//calculating a JSON of teams based on won,lost,played etc.
			$scope.statsarray = [];
			for(i=0;i<$scope.allteams.length;i++){
				var countwon = 0;
				var countlost = 0;
				var countdrawn = 0;
				var matchobj = {};
				var goalsscored = 0;

				for(j=0;j<$scope.winningteams.length;j++){
					if($scope.allteams[i] == $scope.winningteams[j]){
						countwon++;
					}
				}
				
				for(k=0;k<$scope.loosingteams.length;k++){
					if($scope.allteams[i] == $scope.loosingteams[k]){
						countlost++;
					}

				}

				for(l=0;l<$scope.drawnteams.length;l++){
					if($scope.allteams[i] == $scope.drawnteams[l]){
						countdrawn++;
					}
				}



				for(m=0;m<$scope.individualmatches.length;m++){
					if($scope.individualmatches[m].team1.name == $scope.allteams[i]){
						goalsscored = goalsscored + $scope.individualmatches[m].score1;
					}else if($scope.individualmatches[m].team2.name == $scope.allteams[i]){
						goalsscored = goalsscored + $scope.individualmatches[m].score2;
					}

				}








				matchobj = {
					teamname : $scope.allteams[i],
					matchesplayed : (countwon + countdrawn + countlost),
					matcheswon : countwon,
					matcheslost : countlost,
					matchesdrawn : countdrawn,
					totalgoalsscored : goalsscored
				}

				$scope.statsarray.push(matchobj);


			}


			console.log($scope.statsarray);






}



}]);