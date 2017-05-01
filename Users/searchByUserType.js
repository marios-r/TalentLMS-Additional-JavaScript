$(function(){
	if($('#tl-users-grid').length==1&&$('#tl-users-grid.gridUsersTable').length==0){
		$('.tl-grid-filtering-wrapper > .dropdown-menu').append('<li class="nav-header">User-Types</li>');
		$.getJSON('acl/list', function (data) {
			$.each( data.data, function(index){
				var usertype;
				index==0?usertype="SuperAdmin":usertype=$(this[0]).find('span').attr('title');
				$('.tl-grid-filtering-wrapper > .dropdown-menu').append('<li><a class="tl-cursor-pointer additionalfilter" >'+usertype+'</a></li>');
			});
		});

		$(document).on('click', '.additionalfilter',function(){
			var gridmode=$('#tl-users-grid.gridUsersTable').length;
			console.log('onclick triggered');
			var searchType=$(this).html();
			var newdata=[];
			$.getJSON('user/list', function (data) {
				$.each( data.data, function( key, val ){
					var type=$(this[2]).attr('title');
					if(type==searchType){
						newdata.push(this);
					}
				});
				createFilteredDataTable(newdata);
				$('#tl-users-mode-switcher').remove();
				$('#tl-users-header-tools').append('<span class="pull-left label label-info tl-filteredby tl-cursor-pointer" style="margin-top: 12px;" onclick="location.reload();"><i class="icon-filter"></i>&nbsp;&nbsp;Filtered "'+searchType+'"<i class="icon-remove"></i></span>');				
			});
		});
	}
});

function createFilteredDataTable(newdata){
	var deferLoading = newdata.length;
	var table = $('#tl-users-grid').DataTable();	
	table.destroy();
	$('#tl-users-grid').DataTable({
		"info":(typeof isMobile==='undefined')?true:!isMobile,
		"lengthChange":false,
		"serverSide":false,
		"orderClasses":false,
		"searchDelay":20,
		"columns":[{"className":"tl-align-left","width":"21%","orderable":true},{"className":"tl-align-left hidden-phone","width":"26%","orderable":true},{"className":"tl-align-left hidden-phone","width":"17%","orderable":true,"searchable":false},{"className":"tl-align-center hidden-phone","width":"13%","orderable":true,"orderSequence":["desc", "asc"],"searchable":false},{"className":"tl-align-center hidden-phone","width":"13%","orderable":true,"orderSequence":["desc", "asc"],"searchable":false},{"className":"tl-align-left hidden-phone","orderable":true,"visible":false},{"className":"tl-align-left hidden-phone","orderable":true,"visible":false},{"className":"tl-align-left hidden-phone","orderable":true,"visible":false},{"className":"tl-align-left hidden-phone","orderable":true,"visible":false},{"className":"tl-align-center","width":"10%","orderable":false,"searchable":false}],
		"order":[[0, 'asc']],
		"deferLoading":deferLoading,
		"data":newdata,
		"dom":'t<"tl-grid-footer"pf<"tl-grid-footer-tools"B>i>',"pagingType":"dropdown",
		"autoWidth":true,
		"stateSave":false,
		"initComplete":function(settings,json){
				if(settings._iRecordsDisplay>0){
					$('<div class="dropdown dropup tl-grid-filtering-wrapper pull-right hide"></div>').insertAfter($('#tl-users-grid').siblings('.tl-grid-footer').find('.dataTables_filter'));
				}
				if(settings._iRecordsDisplay<=3){
					$('#tl-users-grid').siblings('.tl-grid-footer').find('.dataTables_filter').hide();
					$('#tl-users-grid').next('.tl-grid-footer').find('.tl-grid-footer-tools').css('margin-top','-8px');
					$('#tl-users-grid').next('.tl-grid-footer').find('.tl-grid-filtering-wrapper').css('margin-top','-9px');
				}
				else{
					$('#tl-users-grid').siblings('.tl-grid-footer').find('.dataTables_filter label').append('<span class="tl-grid-clear-search btn icon-remove tl-bold-item tl-icon17 hide"></span>');
				}
		},
		"drawCallback":function(settings){
			var infoWrapperId=settings.sTableId+'_info';
			(Math.ceil(settings._iRecordsDisplay/settings._iDisplayLength)<=1)?$('#tl-users-grid').next('.tl-grid-footer').find('.dataTables_paginate').hide():$('#tl-users-grid').next('.tl-grid-footer').find('.dataTables_paginate').show();(settings._iRecordsDisplay==0)?$('#tl-users-grid').next('.tl-grid-footer').find('.tl-grid-footer-tools').hide():$('#tl-users-grid').next('.tl-grid-footer').find('.tl-grid-footer-tools').show();(settings._iRecordsDisplay==0)?$('#'+infoWrapperId).hide():$('#'+infoWrapperId).show();(settings._iRecordsDisplay>10&&settings._iDisplayLength<settings._iRecordsDisplay&&settings._iDisplayLength!=-1&&settings._iDisplayLength<2000)?$('#'+infoWrapperId+' .tl-grid-size-more').show():$('#'+infoWrapperId+' .tl-grid-size-more').hide();(settings._iDisplayLength>10||settings._iDisplayLength==-1||settings._iDisplayLength==2000)?$('#'+infoWrapperId+' .tl-grid-size-less').show():$('#'+infoWrapperId+' .tl-grid-size-less').hide();
			if($('#tl-users-grid tbody').hasClass('gridUsersTableBody')){
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
					"next":myportal.app.translate('next'),"previous":myportal.app.translate('previous')
				}
			}
		},
		"buttons": [{
                extend: 'csv',
				"text":'<i class="icon-download tl-icon20"></i>',
				"titleAttr":myportal.app.translate('save-as-csv'),
                exportOptions: {
                    columns: [ 0, 1, 2, 3, 4 ]
                }
            }]
		});
}