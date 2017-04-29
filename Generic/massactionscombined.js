$(function(){
	if($('#tl-course-users_wrapper').length==1||$('#tl-branch-courses').length==1||$('#tl-branch-users_wrapper').length==1||$('#tl-group-courses').length==1||$('#tl-list-user-branches_wrapper').length==1||$('#tl-list-user-courses_wrapper').length==1||$('#tl-list-user-groups_wrapper').length==1){
		var selectedTab=$( ".nav-tabs>li" ).index( $('.nav-tabs>li.active') );
		var column, add, remove, endpoint, messageadd, messageremove, messageaddredundant, messageremoveredundant;
		if($('#tl-course-users_wrapper').length==1){
			column = 7;
			add="Enroll all users in course";
			remove="Unenroll all users from course";
			endpoint="course/listuser/";
			messageadd="Enrolled #1 user#2 to the course.";
			messageremove="Unenrolled #1 user#2 from the course.";
			messageaddredundant="All users are already endolled in the course.";
			messageremoveredundant="There are no users enrolled in the course.";
		}
		else if($('#tl-branch-courses').length==1){
			column = 3;
			add="Add all courses to branch";
			remove="Remove all courses from branch";
			endpoint="branch/listcourse/";
			messageadd="Added #1 course#2 to the branch.";
			messageremove="Removed #1 course#2 from the branch.";
			messageaddredundant="All courses are already in this branch.";
			messageremoveredundant="There are no courses in this branch.";
		}
		else if($('#tl-branch-users_wrapper').length==1){
			column = 6;
			add="Add all users to branch";
			remove="Remove all users from branch";
			endpoint="branch/listuser/";
			messageadd="Added #1 user#2 to the branch.";
			messageremove="Removed #1 user#2 from the branch.";
			messageaddredundant="All users are already members of the branch.";
			messageremoveredundant="This branch has no members.";
		}
		else if($('#tl-group-courses').length==1){
			column = 3;
			add="Add all courses to group";
			remove="Remove all courses from group";
			endpoint="group/listcourse/";
			messageadd="Added #1 course#2 to the group.";
			messageremove="Removed #1 course#2 from the group.";
			messageaddredundant="All courses are already in this group.";
			messageremoveredundant="There are no courses in this group.";
		}
		else if($('#tl-list-user-branches_wrapper').length==1){
			column = 1;
			add="Add user to all branches";
			remove="Remove user from all branches";
			endpoint="user/listbranch/";
			messageadd="Added user to #1 branch#2.";
			messageremove="Removed user from #1 branch#2.";
			messageaddredundant="This user is already a member of all branches.";
			messageremoveredundant="There is no branch this user is a member of.";
		}
		else if($('#tl-list-user-courses_wrapper').length==1){
			column = 6;
			add="Enroll user in all courses";
			remove="Unenroll user from all courses";
			endpoint="user/listcourse/";
			messageadd="Added user to #1 course#2.";
			messageremove="Removed user from #1 course#2.";
			messageaddredundant="This user is already enrolled in all courses.";
			messageremoveredundant="There is no course this user is enrolled to.";
		}
		else if($('#tl-list-user-groups_wrapper').length==1){
			column = 2;
			add="Add user to all groups";
			remove="Remove user from all groups";
			endpoint="user/listgroup/";	
			messageadd="Added user to #1 group#2.";
			messageremove="Removed user from #1 group#2.";
			messageaddredundant="This user is already a member in all groups.";
			messageremoveredundant="There are no group this user is a member of.";
		}
		//	add the dropdown in the navigation bar over the datatable
		$('.nav.nav-tabs').append('<li class="dropdown pull-right hidden-phone"><a class="dropdown-toggle" data-toggle="dropdown" href="#" style="margin: 0px;">Mass actions&nbsp;<b class="caret"></b></a><ul class="dropdown-menu"><li><a class="massaction" data-toggle="tab" href="#" data-mode="add">'+add+'</a></li><li><a class="massaction" data-toggle="tab" href="#" data-mode="remove">'+remove+'</a></li></ul></li>');		
		//	add onclick listener
		$(document).on('click', '.massaction',function(){
			if($('#tl-mass-action-message').length==1){ //if a completion alert is showing
				$('#tl-mass-action-message').remove();
			}
			var action=$(this).data('mode'); //the selected action
			var message; //message for the completion alert
			if(action=='remove')
				message=messageremove;
			else
				message=messageadd;
			$('#tl-loading-pane').show();
			$infourl=$('.nav.nav-tabs>li:first-child>a').attr('href');
			var id=$infourl.substring($infourl.lastIndexOf('/id:')+4,$infourl.length);
			url=endpoint+"id:"+id;
			$.ajax({
				dataType: "json",
				url: url,
				success: function (data) {
					var deferreds = [];
					$.each( data.data, function( index ){
						if((action=='remove'&&$(this[column]).hasClass('icon-minus'))||(action=='add'&&$(this[column]).hasClass('icon-plus'))){ 
							var dataurl=$(this[column]).data().url;
							deferreds.push(
								$.ajax({
									dataType: "json",
									url:dataurl
								})
							);
						}
					});
					//  add completion alert
					$('.container>.row>.span12').prepend('<div class="alert fade hide in out" id="tl-mass-action-message"><a class="close" data-dismiss="alert" href="#">×</a><div class="padded">astgqaweraeragsrgasga</div></div>');
					if(deferreds.length==0){
						if(action=='remove')
							message=messageremoveredundant;
						else
							message=messageaddredundant;
						$('#tl-mass-action-message').addClass('alert-info');
						$('#tl-mass-action-message>.padded').html(message);
						$('#tl-mass-action-message').show();
						console.log("No records will be affected by this action");
						$('#tl-loading-pane').hide();
					}else{
						console.log(deferreds.length+" records will be affected by this action");
						$( document ).ajaxStop(function() {
							console.log(message);
							console.log(deferreds.length);
							if(deferreds.length==1)
								message=message.replace('#1',"1").replace('#2','');
							else if(message.indexOf('branch#2')>=0)
								message=message.replace('#1',deferreds.length.toString()).replace('#2','es');
							else
								message=message.replace('#1',deferreds.length.toString()).replace('#2','s');
							$( document ).unbind('ajaxStop');
							var table=$('.dataTable').DataTable();
							table.ajax.reload();
							$('#tl-mass-action-message').addClass('alert-success');
							$('#tl-mass-action-message>.padded').html(message);
							$('#tl-mass-action-message').show();
							$('.nav-tabs>li.active').removeClass('active');
							$( ".nav-tabs>li" )[selectedTab].className+='active';
						});
						$.when.apply(null, deferreds);
					}
				}
			});
		});
	}
});