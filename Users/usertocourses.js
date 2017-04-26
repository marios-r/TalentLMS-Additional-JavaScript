$(function(){
	if($('#tl-list-user-courses_wrapper').length==1){
		$('<div class="tl-header-tools"><ul class="nav nav-pills pull-right hidden-phone"><li class="dropdown"><a class="dropdown-toggle" href="#" data-toggle="dropdown" role="button">Mass actions&nbsp;<b class="caret"></b></a><ul class="dropdown-menu" role="menu" style="right: 0px; left: auto;"><li role="presentation"><a class="massaction" href="javascript:void(0);" tabindex="-1" role="menuitem" data-mode="Enroll">Enroll user to all courses</a></li><li role="presentation"><a class="massaction" href="javascript:void(0);" tabindex="-1" role="menuitem" data-mode="Unenroll">Unenroll user from all courses</a></li></ul></li></ul></div>').insertBefore('#tl-list-user-courses_wrapper');
		$(document).on('click', '.massaction',function(){
			var action=$(this).data('mode');
			console.log(action);
			$('#tl-loading-pane').show();
			$userurl=$('.nav.nav-tabs>li:first-child>a').attr('href');
			var userid=$userurl.substring($userurl.lastIndexOf('/id:')+4,$userurl.length);
			var url="user/listcourse/id:"+userid;
			$.ajax({
				dataType: "json",
				url: url,
				success: function (data) {
					var length=data.data.length;
					$.each( data.data, function( index ){
						var operation=$(this[6]).attr('title');
						if(operation==action){
							var dataurl=$(this[6]).data().url;
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