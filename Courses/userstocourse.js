$(function(){
	if($('#tl-course-users_wrapper').length==1){
		var remove,add;
		/* 
			Variables remove, add are used only to make the script language independent.
			Worst case scenario: 
			$('.icon-grid.tl-toggle-user.icon-minus').length==0 
			or $('.icon-grid.tl-toggle-user.icon-plus').length==0 
			in the loaded page 
		*/
		$('.icon-grid.tl-toggle-user.icon-minus').length==0 ? remove='undefined' : remove=$('.icon-grid.tl-toggle-user.icon-minus').attr('title');
		$('.icon-grid.tl-toggle-user.icon-plus').length==0 ? add='undefined' : add=$('.icon-grid.tl-toggle-user.icon-plus').attr('title');
		//	add the dropdown in the navigation bar over the course-users table
		$('.nav.nav-tabs').append('<li class="dropdown pull-right hidden-phone"><a class="dropdown-toggle" data-toggle="dropdown" href="#" style="margin: 0px;">Mass actions&nbsp;<b class="caret"></b></a><ul class="dropdown-menu"><li><a class="massaction" data-toggle="tab" href="#" data-mode="'+add+'">Enroll all users in course</a></li><li><a class="massaction" data-toggle="tab" href="#" data-mode="'+remove+'">Unenroll all users from course</a></li></ul></li>');		
		//	add onclick listener
		$(document).on('click', '.massaction',function(){
			var action=$(this).data('mode'); //the selected action
			var noaction; //the action that was not selected
			action==add ? noaction=remove : noaction=add;
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
						var operation=$(this[7]).attr('title');
						if(operation==action||operation!=noaction){ //if the action is 'undefined' it will allways be !=operation. However we still find the match by testing if noaction is !=operation 
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