$(function(){
	if($('#tl-users-grid').length==1){
		$('.tl-grid-filtering-wrapper > .dropdown-menu').append('<li class="nav-header">User-Types</li>');
		$.getJSON('acl/list', function (data) {
			$.each( data.data, function( key, val ){
				var usertype=$(this)[0].substring($(this)[0].indexOf("<span title")+13,$(this)[0].indexOf("'>"));
				$('.tl-grid-filtering-wrapper > .dropdown-menu').append('<li><a class="tl-cursor-pointer additionalfilter" >'+usertype+'</a></li>');
			});
		});

		$(document).on('click', '.additionalfilter',function(){
			console.log('onclick triggered');
			var searchType=$(this).html();
			var newdata=[];
			$.getJSON('user/list', function (data) {
				$.each( data.data, function( key, val ){
					var type=$(this)[2].substring(13,$(this)[2].indexOf("'>"))
					if(type.toLowerCase().indexOf(searchType.toString().toLowerCase())>-1){
						newdata.push($(this));
					}
				});
				var table = $('#tl-users-grid').DataTable();	
				table.destroy();
				$('#tl-users-grid').DataTable( {
				data: newdata,
				"scrollY":        "400px",
				"scrollCollapse": true,
				"paging":false,
				"dom": '<"top"i>rt<"tl-grid-footer"flp><"clear">',
				columns: [{"title": "User","className":"tl-align-left","width":"21%","orderable":true},{"title": "Email","className":"tl-align-left hidden-phone","width":"26%","orderable":true},{"title": "User type","className":"tl-align-left hidden-phone","width":"17%","orderable":true,"searchable":false},{"title": "Registration","className":"tl-align-center hidden-phone","width":"13%","orderable":true,"orderSequence":["desc", "asc"],"searchable":false},{"title": "Last login","className":"tl-align-center hidden-phone","width":"13%","orderable":true,"orderSequence":["desc", "asc"],"searchable":false},{"title": "","className":"tl-align-left hidden-phone","orderable":true,"visible":false},{"title": "","className":"tl-align-left hidden-phone","orderable":true,"visible":false},{"title": "","className":"tl-align-left hidden-phone","orderable":true,"visible":false},{"title": "","className":"tl-align-left hidden-phone","orderable":true,"visible":false},{"title": "Operations","className":"tl-align-center","width":"10%","orderable":false,"searchable":false}],
				 "initComplete": function( settings, json ) {
						$('#tl-users-header-tools').prepend('<span class="pull-left label label-info tl-filteredby tl-cursor-pointer" style="margin-top: 12px;" onclick="location.reload();"><i class="icon-filter"></i>&nbsp;&nbsp;Filtered by User-Type "'+searchType+'"<i class="icon-remove"></i></span>');
					}
				});
			});
		});
	}
});