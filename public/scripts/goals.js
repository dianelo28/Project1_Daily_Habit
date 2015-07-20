$(document).ready(function(){

var $list = $('#goals-list')
var goalTemplate = _.template($('#goalTemplate').html());

//get all goals

//call to get all goals
$.ajax({
	url:'/api/goals',
	type:'GET',
	success: function(data){
		var goals = data;
		console.log(data);

		_.each(goals, function(goal){
			console.log(goal)
			var newGoal = $(goalTemplate(goal));
			$list.append(newGoal)
		});
	}
});

//create new goal

$('#post-goal').on('click', function(event){
	var newGoal = {
		goal: $('#goal').val(),
		description: $('#description').val()
	}

	$.ajax({
		url:'/api/goals',
		type: 'POST',
		data: newGoal,
		success: function(data){
			var $newGoal = $(goalTemplate(data));
			$list.append(newGoal);
		}
	});

	$('#post').modal('hide');
});