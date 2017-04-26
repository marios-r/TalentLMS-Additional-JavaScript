$(function(){
	if($('#tl-course-users_wrapper').length==1){
		$('<div class="dropdown dropup tl-grid-filtering-wrapper pull-right hide" style="display: block;"><a href="#" class="dropdown-toggle tl-grid-filtering pull-right" data-toggle="dropdown" data-target="#" role="button" title="Filter"><i class="icon-filter"></i></a><ul class="dropdown-menu" role="menu"></ul></div>').insertBefore('.tl-grid-footer-tools');
		$('.tl-grid-filtering-wrapper > .dropdown-menu').append('<li class="nav-header">Rolebased filters</li>');
		$('.tl-grid-filtering-wrapper > .dropdown-menu').append('<li><a class="tl-cursor-pointer additionalfilter" data-mode="trainer">Instructors</a></li>');
		$('.tl-grid-filtering-wrapper > .dropdown-menu').append('<li><a class="tl-cursor-pointer additionalfilter" data-mode="learner">Learners</a></li>');
		$('.tl-grid-filtering-wrapper > .dropdown-menu').append('<li><a class="tl-cursor-pointer additionalfilter" data-mode="learner with instructor privileges" >Learners with instructor privileges</a></li>');
		$courseurl=$('.nav.nav-tabs>li:first-child>a').attr('href');
		var courseid=$courseurl.substring($courseurl.lastIndexOf('/id:')+4,$courseurl.length);
		var newdata=[];
		var url='course/listuser/id:'+courseid;
		$.getJSON(url,function(data){newdata=data.data});
		$(document).on('click', '.additionalfilter',function(){
			var searchRole = $(this).data('mode');
			$courseurl=$('.nav.nav-tabs>li:first-child>a').attr('href');
			var courseid=$courseurl.substring($courseurl.lastIndexOf('/id:')+4,$courseurl.length);
			var url='course/listuser/id:'+courseid;
			var newdata=[];
			$.getJSON(url, function (data) {
				$.each( data.data, function( key, val ){
					if($(this[5]).find('a').data('role')!=undefined){
						role=$(this[5]).find('a').data('role');
						if(role=='learner'){
							role='learner with instructor privileges';
						}
					}else{
						role='learner';
					}
					console.log(role);
					if(searchRole=='learner'&&(role=='learner'||role=='learner with instuctor privileges'))
						newdata.push($(this));
					else if(searchRole==role){
						newdata.push($(this));
					}
				});
				var table = $('#tl-course-users').DataTable();	
				table.destroy();
				$('#tl-course-users').DataTable( {
					data: newdata,
					"scrollY":        "450px",
					"scrollCollapse": true,
					"paging":         false,
					"dom": '<"top"i>rt<"tl-grid-footer"flp><"clear">',
					columns:[{"title": "User","className":"tl-align-left","orderable":true,"searchable":false},{"title": "","className":"tl-align-left hidden-phone","width":"40%","orderable":true,"visible":false},{"title": "","className":"tl-align-left hidden-phone","orderable":true,"visible":false},{"title": "","className":"tl-align-left hidden-phone","orderable":true,"visible":false},{"title": "","className":"tl-align-left hidden-phone","orderable":true,"visible":false},{"title": "Role","className":"tl-align-center hidden-phone","width":"20%","orderable":true,"orderSequence":["desc", "asc"],"searchable":false},{"title": "Completion date","className":"tl-align-center hidden-phone","width":"25%","orderable":true,"orderSequence":["desc", "asc"],"searchable":false},{"title": "Operations","className":"tl-align-center","width":"15%","orderable":true,"orderSequence":["desc", "asc"],"searchable":false}],
					"initComplete": tl_initUsersGrid
				});
				$('<span class="pull-right label label-info tl-filteredby tl-cursor-pointer" style="margin-top: 12px; margin-bottom:12px; margin-right:12px;" onclick="location.reload();"><i class="icon-filter"></i>&nbsp;&nbsp;Filtered by User-Type "'+searchRole.charAt(0).toUpperCase() + searchRole.slice(1)+'"<i class="icon-remove"></i></span>').insertBefore('#tl-course-users_wrapper');
			});
		});
	}
});
