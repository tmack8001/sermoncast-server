angular.module('sermoncast')
    .controller('SermonController', ['$scope', 'Sermons', function ($scope, Sermons) {
        $scope.sermons = Sermons.query();

        // TODO: need to figure out how to create a new Sermon fully since API requires various conditions to be met
        $scope.save = function () {
            if (!$scope.newSermon || $scope.newSermon.length < 1) return;
            var sermon = new Sermons({ title: $scope.newSermon, completed: false });

            sermon.$save(function () {
                $scope.sermons.push(sermon);
                $scope.newSermon = ''; // clear textbox
            });
        }
    }])

    .controller('SermonDetailCtrl', ['$scope', '$routeParams', 'Sermons', '$location', function ($scope, $routeParams, Sermons, $location) {
        $scope.sermon = Sermons.get({id: $routeParams.id});
        $scope.editing = false;

        $scope.update = function(){
            var sermon = $scope.sermon;

            sermon.series = sermon.series._id;
            sermon.church = sermon.church._id;
            sermon.speakers = sermon.speakers.map.call(elems, function(obj) {
                return obj._id;
            });

            Sermons.update({id: sermon._id}, sermon);
            $scope.editing = false;
        };

        $scope.edit = function() {
            $scope.editing = angular.copy($scope.sermon);
        };

        $scope.remove = function() {
            var sermon = $scope.sermon;
            Sermons.remove({id: sermon._id}, function(){
                $location.url('/sermons');
            });
        };

        $scope.cancel = function() {
            $scope.sermon = angular.copy($scope.editing);
            $scope.editing = false;
        };
    }]);