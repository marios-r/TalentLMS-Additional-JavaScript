$(function(){
	if($('#tl-users-grid').length==1&&$('#tl-users-grid.gridUsersTable').length==0){ //User-Types filter in Users grid
		$('.tl-grid-filtering-wrapper > .dropdown-menu').append('<li class="nav-header">User-Types</li>');
		$.getJSON('acl/list', function (data) {
			$.each( data.data, function(index){
				var usertype;
				index==0?usertype="SuperAdmin":usertype=$(this[0]).find('span').attr('title');
				$('.tl-grid-filtering-wrapper > .dropdown-menu').append('<li><a class="tl-cursor-pointer additionalfilter" >'+usertype+'</a></li>');
			});
		});

		$(document).on('click', '.additionalfilter',function(){
			var searchType=$(this).html();
			var newdata=[];
			$.getJSON('user/list', function (data) {
				$.each( data.data, function( key, val ){
					var type=$(this[2]).attr('title');
					if(type==searchType){
						newdata.push(this);
					}
				});
				var table = $('#tl-users-grid').DataTable();	
				table.destroy();
				createFilteredDataTable('tl-users-grid',[{"className":"tl-align-left","width":"21%","orderable":true},{"className":"tl-align-left hidden-phone","width":"26%","orderable":true},{"className":"tl-align-left hidden-phone","width":"17%","orderable":true,"searchable":false},{"className":"tl-align-center hidden-phone","width":"13%","orderable":true,"orderSequence":["desc", "asc"],"searchable":false},{"className":"tl-align-center hidden-phone","width":"13%","orderable":true,"orderSequence":["desc", "asc"],"searchable":false},{"className":"tl-align-left hidden-phone","orderable":true,"visible":false},{"className":"tl-align-left hidden-phone","orderable":true,"visible":false},{"className":"tl-align-left hidden-phone","orderable":true,"visible":false},{"className":"tl-align-left hidden-phone","orderable":true,"visible":false},{"className":"tl-align-center","width":"10%","orderable":false,"searchable":false}], 't<"tl-grid-footer"pf<"tl-grid-footer-tools"B>i>', newdata, [[0, 'asc']], 1, false, [ 0, 1, 2, 3, 4 ]);
				$('#tl-users-mode-switcher').remove();
				$('#tl-users-header-tools').append('<span class="pull-left label label-info tl-filteredby tl-cursor-pointer" style="margin-top: 12px;" onclick="location.reload();"><i class="icon-filter"></i>&nbsp;&nbsp;Filtered "'+searchType+'"<i class="icon-remove"></i></span>');				
			});
		});
	}

	if($('#tl-course-users_wrapper').length==1){ //Rolebased filter in Course users grid
		$('<div class="dropdown dropup tl-grid-filtering-wrapper pull-right hide" style="display: block;"><a href="#" class="dropdown-toggle tl-grid-filtering pull-right" data-toggle="dropdown" data-target="#" role="button" title="Filter"><i class="icon-filter"></i></a><ul class="dropdown-menu" role="menu"></ul></div>').insertBefore('.tl-grid-footer-tools');
		$('.tl-grid-filtering-wrapper > .dropdown-menu').append('<li class="nav-header">Rolebased filters</li>');
		$('.tl-grid-filtering-wrapper > .dropdown-menu').append('<li><a class="tl-cursor-pointer additionalfilter" data-mode="trainer">Instructors</a></li>');
		$('.tl-grid-filtering-wrapper > .dropdown-menu').append('<li><a class="tl-cursor-pointer additionalfilter" data-mode="learner">Learners</a></li>');
		$('.tl-grid-filtering-wrapper > .dropdown-menu').append('<li><a class="tl-cursor-pointer additionalfilter" data-mode="learner with instructor privileges" >Learners with instructor privileges</a></li>');
		$('.tl-grid-filtering-wrapper > .dropdown-menu').append('<li><a class="tl-cursor-pointer additionalfilter" data-mode="-" >Users that are not enrolled in the course</a></li>');
		$(document).on('click', '.additionalfilter',function(){
			var searchRole = $(this).data('mode');
			var exporttitle=$(this).html();
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
					}else if($(this[5]).find('a').text()=='Learner'){
						role='learner';
					}else{
						role='-';
					}
					if((searchRole=='learner')&&(role=='learner with instructor privileges')){
						newdata.push($(this));
					}else if(searchRole==role){
						newdata.push($(this));
					}
				});
				var table = $('#tl-course-users').DataTable();	
				table.destroy();
				createFilteredDataTable('tl-course-users', [{"className":"tl-align-left","orderable":true,"searchable":false},{"className":"tl-align-left hidden-phone","width":"40%","orderable":true,"visible":false},{"className":"tl-align-left hidden-phone","orderable":true,"visible":false},{"className":"tl-align-left hidden-phone","orderable":true,"visible":false},{"className":"tl-align-left hidden-phone","orderable":true,"visible":false},{"className":"tl-align-center hidden-phone","width":"20%","orderable":true,"orderSequence":["desc", "asc"],"searchable":false},{"className":"tl-align-center hidden-phone","width":"25%","orderable":true,"orderSequence":["desc", "asc"],"searchable":false},{"className":"tl-align-center","width":"15%","orderable":true,"orderSequence":["desc", "asc"],"searchable":false}],'t<"tl-grid-footer"pf<"tl-grid-footer-tools"B>i>',newdata,[[7, 'desc']], 1, tl_initUsersGrid,[0, 5, 6], exporttitle);
				$('<span class="pull-right label label-info tl-filteredby tl-cursor-pointer" style="margin-top: 12px; margin-bottom:12px; margin-right:12px;" onclick="location.reload();"><i class="icon-filter"></i>&nbsp;&nbsp;Filtered by "'+exporttitle+'"<i class="icon-remove"></i></span>').insertBefore('#tl-course-users_wrapper');
			});
		});
	}
});

function createFilteredDataTable(tableId,columns,dom,newdata,defaultOrder,showFooter,drawCallback, exportcolumns, exporttitle){
	var pageLength=10;
	var maxRecordsPerPage=2000;
	var thresholdToHideSearch=3;
	$('#'+tableId).DataTable({
		"info":(typeof isMobile==='undefined')?true:!isMobile,
		"lengthChange":false,
		"orderClasses":false,
		"searchDelay":20,
		"columns":columns,
		"order":defaultOrder,
		"data":newdata,
		"dom":dom,
		"pagingType":"dropdown",
		"autoWidth":true,
		"stateSave":false,
		"initComplete":function(settings,json){
			if(newdata.length>0){
				$('<div class="dropdown dropup tl-grid-filtering-wrapper pull-right hide"></div>').insertAfter($('#'+tableId).siblings('.tl-grid-footer').find('.dataTables_filter'));
			}
			if(newdata.length<=thresholdToHideSearch){
				$('#'+tableId).siblings('.tl-grid-footer').find('.dataTables_filter').hide();
				$('#'+tableId).next('.tl-grid-footer').find('.tl-grid-footer-tools').css('margin-top','-8px');
				$('#'+tableId).next('.tl-grid-footer').find('.tl-grid-filtering-wrapper').css('margin-top','-9px');
			}else{
				$('#'+tableId).siblings('.tl-grid-footer').find('.dataTables_filter label').append('<span class="tl-grid-clear-search btn icon-remove tl-bold-item tl-icon17 hide"></span>');
			}
			if(tableId=='tl-invoices-grid'||tableId=='tl-list-language-overrides'||tableId=='tl-branch-reports-course-learners'||tableId=='tl-group-reports-course-learners'){
				$('<a id="tl-cancel-export-modal" class="none-decoration pull-right hide" href="javascript:void(0);" style="margin: 10px 8px 0px 3px;" title="'+myportal.app.translate('cancel')+'"><i class="icon-remove tl-icon20"></i></a><div id="tl-loading-export-modal" class="pull-right hide"><img src="/pages/images/loading-small.gif" alt="'+myportal.app.translate('creating-export')+'" title="'+myportal.app.translate('creating-export')+'"/></div>').insertAfter($('#'+tableId).siblings('.tl-grid-footer').find('.tl-grid-footer-tools'));
			}
			if(showFooter==0){
				$('#'+tableId).css('margin-bottom','3px').next('.tl-grid-footer').hide();
			}
			$('#'+tableId).css('width','100%');
		},
		"drawCallback":function(settings){
			$('#tl-loading-pane').hide();
			var api = this.api();
			var pagerows= api.rows( {page:'current'} ).count();
			if(drawCallback!=false){
				drawCallback();
			}
			if(showFooter!=0){
				var infoWrapperId=settings.sTableId+'_info';
				(Math.ceil(newdata.length/pagerows)<=1)?$('#'+tableId).next('.tl-grid-footer').find('.dataTables_paginate').hide():$('#'+tableId).next('.tl-grid-footer').find('.dataTables_paginate').show();(newdata.length==0)?$('#'+tableId).next('.tl-grid-footer').find('.tl-grid-footer-tools').hide():$('#'+tableId).next('.tl-grid-footer').find('.tl-grid-footer-tools').show();(newdata.length==0)?$('#'+infoWrapperId).hide():$('#'+infoWrapperId).show();(newdata.length>pageLength&&pagerows<newdata.length&&pagerows!=-1&&pagerows<maxRecordsPerPage)?$('#'+infoWrapperId+' .tl-grid-size-more').show():$('#'+infoWrapperId+' .tl-grid-size-more').hide();
				(pagerows>pageLength||pagerows==-1||pagerows==maxRecordsPerPage)?$('#'+infoWrapperId+' .tl-grid-size-less').show():$('#'+infoWrapperId+' .tl-grid-size-less').hide();
			}
			if((tableId=='tl-users-grid'&&$('#tl-users-grid tbody').hasClass('gridUsersTableBody'))||(tableId=='grid_course_catalog'&&$('#grid_course_catalog tbody').hasClass('gridCourseCatalog'))||(tableId=='grid_marketplace'&&$('#grid_marketplace tbody').hasClass('gridMarketplace'))){
				$('#'+infoWrapperId+' .tl-grid-size-less, '+'#'+infoWrapperId+' .tl-grid-size-more').hide();
			}
		},
		"language":{
			"info":myportal.app.translate('grid-start-end-total')+' <a class="tl-grid-size-less" title="'+myportal.app.translate('grid-less-results')+'"></a><a class="tl-grid-size-more" title="'+myportal.app.translate('grid-more-results')+'"></a>',
			"search":"",
			"infoEmpty":"",
			"infoFiltered":"",
			"zeroRecords":"-",
			"thousands":".",
			"paginate":{"next":"","previous":""},
			"aria":{"sortAscending":"",
				"sortDescending":"",
				"paginate":{
					"next":myportal.app.translate('next'),
					"previous":myportal.app.translate('previous')
				}
			}
		},
		"buttons": [{
			extend: 'csv',
			title: exporttitle,
			"text":'<i class="icon-download tl-icon20"></i>',
			"titleAttr":myportal.app.translate('save-as-csv'),
			exportOptions: {
				columns: exportcolumns
			}
		}]
	}); //end of datatable init
}