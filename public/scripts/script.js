$(document).ready(function(){

	var $list = $('#goals-list')

	var goalTemplate = _.template($('#goalTemplate').html());
	
// get goals from db and render onto page

$.ajax({
	url:'/api/goals',
	type:'GET',
	success: function(data){
		var goals = data;
		console.log(data);

		_.each(goals, function(goal){
			// console.log(goal)
			var newGoal = $(goalTemplate(goal));
			$list.append(newGoal)
		});
	}
});

//add a new goal

$('#post-goal').on('click', function(event){
	var newGoal = {
		goal: $('#goal').val(),
		description: $('#description').val()
	}

	// console.log(newGoal);

	$.ajax({
		url:'/api/goals',
		type: 'POST',
		data: newGoal,
		success: function(data){
			$list.append($(goalTemplate(data)));
		}
	});

	$('#post').modal('hide');
});

//edit a goal

$(document).on('click', '.editButton', function(event){
	goalId = $($(this).closest('.list')).attr('data-id');

	$.ajax({
		url:'/api/goals/' + goalId,
		type:'GET',
		success: function(res) {
			$('#editGoal').val(res.goal);
			$('#editDescription').val(res.description);
		}
	});
});

$('#submitEdit').on('click', function(event){
	var goal = {
		goal: $('#editGoal').val(),
		description: $('#editDescription').val()
	}
	$.ajax({
		url:'/api/goals/' + goalId,
		type:'PUT',
		data: goal,
		success: function(data){
			var newGoal = $(goalTemplate(data));
			$('#goals-list-' + goalId).replaceWith(newGoal)
		}
	});

	$('#edit').modal('hide');
});

//delete a goal

$('#deleteGoal').on('click', function(event){
	$(goalId).remove();

	$.ajax({
		url:'/api/goals/' + goalId,
		type:'DELETE',
		success: function(data){
			$('#goals-list-' + goalId).remove();
		}
	});

	$('#edit').modal('hide');
});

//create a new user

$('#sign-up-form').on('submit', function(e){
	e.preventDefault();
	// var newUser = {
	// 	firstName: $('#firstName').val(),
	// 	lastName: $('#lastName').val(),
	// 	email: $('#email').val(),
	// 	password: $('#password').val(),
	// };

	var password = $('#password').val();

	if ( password.length <= 4){

		alert('Password too short!');
		return('Too short!');
	}

	$.ajax({
		url:'/users',
		type:'POST',
		data: $("#sign-up-form").serialize(),
		success: function(data){
			// alert("SENDING")
			console.log(data);
		},
		error: function(data, status, error) {
		  alert(data.responseText);
		}

	});

	$('#sign-up').modal('hide');
});

// selections with drop down

// $('select')
// 	.change(function(){
// 		var str = "";
// 		$( "select option:selected" ).each(function() {
// 			str += $(this).text() + " ";
// 		});

// 		console.log(str);

// 		// var goal = {
// 		// 	goal: str,
// 		// 	description: 'Start moving more each day and keep a food journal'
// 		// }

// 		// console.log(goal);

// 		$.ajax({
// 			url:'/api/dropdown',
// 			type:'GET',
// 			data: str,
// 			success: function(data){
// 			$list.append($(goalTemplate(str)));
// 			}
// 		});
// 	});

	// .change();

});