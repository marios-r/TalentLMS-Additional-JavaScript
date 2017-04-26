$(function(){
	if($('#tl-course-users_wrapper').length==1){
		$('<div class="tl-header-tools"><ul class="nav nav-pills pull-right hidden-phone"><li class="dropdown"><a class="dropdown-toggle" href="#" data-toggle="dropdown" role="button">Mass actions&nbsp;<b class="caret"></b></a><ul class="dropdown-menu" role="menu" style="right: 0px; left: auto;"><li role="presentation"><a class="massaction" href="javascript:void(0);" tabindex="-1" role="menuitem" data-mode="Add user">Add all users to course</a></li><li role="presentation"><a class="massaction" href="javascript:void(0);" tabindex="-1" role="menuitem" data-mode="Remove user">Remove all users from course</a></li></ul></li></ul></div>').insertBefore('#tl-course-users_wrapper');
		$(document).on('click', '.massaction',function(){
			var action=$(this).data('mode');
			console.log(action);
			$('#tl-loading-pane').show();
			$courseurl=$('.nav.nav-tabs>li:first-child>a').attr('href');
			var courseid=$courseurl.substring($courseurl.lastIndexOf('/id:')+4,$courseurl.length);
			var url="course/listuser/id:"+courseid;
			$.ajax({
				dataType: "json",
				url: url,
				success: function (data) {
					var length=data.data.length;
					$.each( data.data, function( index ){
						var operation=$(this[7]).attr('title');
						if(operation==action){
							var dataurl=$(this[7]).data().url;
							$.ajax({
								dataType: "json",
								url:dataurl
								})
							.done(function(){ 
								if(index==length-1||$.active==0){
									$('#tl-loading-pane').hide();
									location.reload();
								}
							});
						}
						if($.active==0){
							location.reload();
						}
					});
				}
			});
		});
	}
});