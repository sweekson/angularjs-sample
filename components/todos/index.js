/* global angular */

var todos = angular.module('todos', ['ngRoute']);

todos.config(function ($routeProvider) {
  $routeProvider.when('/todos', {
    templateUrl: 'components/todos/index.html',
    controller: 'TodosCtrl',
    resolve: {
      todolist: (todos) => todos.init()
    }
  })
  .when('/todos/create', {
    templateUrl: 'components/todos/create.html',
    controller: 'TodosCreateCtrl'
  })
  .when('/todos/:id', {
    templateUrl: 'components/todos/detail.html',
    controller: 'TodosDetailCtrl',
    resolve: {
      todolist: (todos) => todos.init()
    }
  })
  .when('/todos/:id/edit', {
    templateUrl: 'components/todos/edit.html',
    controller: 'TodosEditCtrl',
    resolve: {
      todolist: (todos) => todos.init()
    }
  })
  .otherwise('/todos');
});

todos.service('todos', function ($q, $timeout) {
  this.data = [];
  this.loaded = false;

  this.init = function () {
    return !this.loaded && this.query().then(() => {
      this.loaded = true;
    });
  }

  this.query = function () {
    let defer = $q.defer();

    $timeout(() => {
      this.data = [{
        id: 1,
        title: 'delectus aut autem',
        notes: 'laboriosam mollitia et enim quasi adipisci quia provident illum',
        done: false,
        starred: true
      }, {
        id: 2,
        title: 'fugiat veniam minus',
        notes: 'illo expedita consequatur quia in',
        done: true,
        starred: false
      }];

      defer.resolve(this.data);
    }, 1000);

    return defer.promise;
  };

  this.create = function (data) {
    let defer = $q.defer();

    $timeout(() => {
      Object.assign(data, { done: false, id: this.data.length + 1 });
      this.data.push(data);
      defer.resolve(this.data);
    }, 1000);

    return defer.promise;
  };

  this.update = function (data) {
    let target = this.get(data.id);
    let defer = $q.defer();

    if (!target) {
      defer.reject('Data not exists!');
    }
    else {
      $timeout(() => {
        Object.assign(target, data);
        defer.resolve(target);
      }, 1000);
    }

    return defer.promise;
  };

  this.get = function (id) {
    return this.data.find(v => v.id === Number(id))
  };
})

todos.controller('TodosCtrl', function ($scope, todos) {
  $scope.todos = todos;
});

todos.controller('TodosCreateCtrl', function ($scope, $location, todos) {
  $scope.todos = todos;
  $scope.starred = false;

  $scope.create = function () {
    todos.create({
      title: $scope.title,
      notes: $scope.notes,
      starred: $scope.starred
    })
    .then(() => $location.path('#!/'));
  };
});

todos.controller('TodosDetailCtrl', function ($scope, $route, todos) {
  $scope.todo = todos.get($route.current.params.id);
});

todos.controller('TodosEditCtrl', function ($scope, $route, $location, todos) {
  $scope.todo = todos.get($route.current.params.id);
  $scope.edit = Object.assign({}, $scope.todo);
  $scope.save = function () {
    todos.update({
      id: $scope.todo.id,
      title: $scope.edit.title,
      notes: $scope.edit.notes,
      starred: $scope.edit.starred
    })
    .then(() => $location.path('#!/'));
  };
});