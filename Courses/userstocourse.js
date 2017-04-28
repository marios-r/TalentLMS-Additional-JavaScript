$(function(){
	if($('#tl-course-users_wrapper').length==1){
		//	add the dropdown in the navigation bar over the course-users table
		$('.nav.nav-tabs').append('<li class="dropdown pull-right hidden-phone"><a class="dropdown-toggle" data-toggle="dropdown" href="#" style="margin: 0px;">Mass actions&nbsp;<b class="caret"></b></a><ul class="dropdown-menu"><li><a class="massaction" data-toggle="tab" href="#" data-mode="add">Enroll all users in course</a></li><li><a class="massaction" data-toggle="tab" href="#" data-mode="remove">Unenroll all users from course</a></li></ul></li>');		
		//	add onclick listener
		$(document).on('click', '.massaction',function(){
			var action=$(this).data('mode'); //the selected action
			$('#tl-loading-pane').show();
			$courseurl=$('.nav.nav-tabs>li:first-child>a').attr('href');
			var courseid=$courseurl.substring($courseurl.lastIndexOf('/id:')+4,$courseurl.length);
			var url="course/listuser/id:"+courseid;
			$.ajax({
				dataType: "json",
				url: url,
				success: function (data) {
					var deferreds = [];
					$.each( data.data, function( index ){
						if((action=='remove'&&$(this[7]).hasClass('icon-minus'))||(action=='add'&&$(this[7]).hasClass('icon-plus'))){ 
							var dataurl=$(this[7]).data().url;
							deferreds.push(
								$.ajax({
									dataType: "json",
									url:dataurl
								})
							);
						}
					});
					if(deferreds.length==0){
						console.log("No users will be affected by this action");
						$('#tl-loading-pane').hide();
					}else{
						console.log(deferreds.length+" users will be affected by this action");
						$( document ).ajaxStop(function() {
							location.reload();
						});
						$.when.apply(null, deferreds);
					}
				}
			});
		});
	}
});