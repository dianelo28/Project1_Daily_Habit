$(document).ready(function(){

var $list = $('#goals-list')

var goalTemplate = _.template($('#goalTemplate').html());
	
//get currently logged in user

$.get('api/users/current', function(user){
	console.log(user);

	//iterate through user's goals
	_.each(user.goals, function(goal,index){
		console.log(goal);

	$list.append($(goalTemplate(goal)));

	});
});
	
//add a new goal for current user

$('#post-goal').on('click', function(event){
	var newGoal = {
		goal: $('#goal').val(),
		description: $('#description').val()
	}

	console.log(newGoal);

	$.ajax({
		url:'/api/users/current/goals',
		type: 'POST',
		data: newGoal,
		success: function(data){
			var $newGoal = $(goalTemplate(data));
			$list.append(newGoal);
		}
	});

	$('#post').modal('hide');
});
});