$(function(){
	if($('#tl-group-courses').length==1){
		$('<div class="tl-header-tools"><ul class="nav nav-pills pull-right hidden-phone"><li class="dropdown"><a class="dropdown-toggle" href="#" data-toggle="dropdown" role="button">Mass actions&nbsp;<b class="caret"></b></a><ul class="dropdown-menu" role="menu" style="right: 0px; left: auto;"><li role="presentation"><a class="massaction" href="javascript:void(0);" tabindex="-1" role="menuitem" data-mode="Add to group">Add all courses to group</a></li><li role="presentation"><a class="massaction" href="javascript:void(0);" tabindex="-1" role="menuitem" data-mode="Remove from group">Remove all courses from group</a></li></ul></li></ul></div>').insertBefore('#tl-group-courses_wrapper');
		$(document).on('click', '.massaction',function(){
			var action=$(this).data('mode');
			console.log(action);
			$('#tl-loading-pane').show();
			$groupurl=$('.nav.nav-tabs>li:first-child>a').attr('href');
			var groupid=$groupurl.substring($groupurl.lastIndexOf('/id:')+4,$groupurl.length);
			var url="group/listcourse/id:"+groupid;
			$.ajax({
				dataType: "json",
				url: url,
				success: function (data) {
					var length=data.data.length;
					$.each( data.data, function( index ){
						var operation=$(this[3]).attr('title');
						if(operation==action){
							var dataurl=$(this[3]).data().url;
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