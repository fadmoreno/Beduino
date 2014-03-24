var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
	/*
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
		*/
		//alert('ok');
		
    }
};
// Header Menu functionality

var board = (function () {
	var dashboard = $('#control-board'),
		controllerNameText = $('#controller-name'),
		controllerPathText = $('#controller-path'),
		controlNameToAdd = $('#controller-name').val();
	var privateInit = function(){
		dashboard.height($(window).height()-77+'px');
		dbShell = window.openDatabase("controllers", 2, "SimpleNotes", 1000000);
		dbShell.transaction(setupTable,dbErrorHandler,getEntries);	
	}
	return{
		init: privateInit,
	};
})();

$(function() {
	board.init();

});
$(document).ready(function(){
	$('#control-board').height($(window).height()-77+'px');
	/*
	dbShell = window.openDatabase("controllers", 2, "SimpleNotes", 1000000);
	console.log('basede datos creda');
    console.log("db was opened");
    dbShell.transaction(setupTable,dbErrorHandler,getEntries);
    console.log("ran setup");
	*/
	
	var controlNameToAdd;
	var controllerNameText = $('#controller-name');
	var controllerPathText = $('#controller-path');
	
	$('#add-controller-board').on('click',function(event){
		event.preventDefault();
		if (inputValidate(controllerNameText.val(),"empty") == true && inputValidate(controllerPathText.val(),"empty") == true){	
			var nameExist = inputValidate(controllerNameText,"nameExist");
			if(nameExist == true){
				location.hash = "main-page";
				var controlToAdd = $('input:radio[name=radio-choice-v-6]:checked').parent().find('.input-desc').html();
				controlNameToAdd = $('#controller-name').val();
				if(editMode == false){
					
					switch(controlToAdd){
					case "Button":
						controlHtml = '<a id="content-' + controlNameToAdd + '" data-path="' + $('#controller-path').val() + '" class="ui-btn ui-btn-inline ui-icon-power ui-btn-icon-left ui-shadow ui-corner-all arduino-action edit-enable">'+controlNameToAdd+'</a>';
						$('#control-board').append(controlHtml);
					break;
					case "Flip switch":
						controlHtml = '<div id="content-'+controlNameToAdd + '" class="controller-content arduino-action" data-path="'+$('#controller-path').val()+'"> <select id="flip-' + controlNameToAdd + '" name="flip-'+ controlNameToAdd +'" data-role="slider"><option value="off">Off</option><option value="on">On</option></select><div class="text-center">'+controlNameToAdd+'</div></div>';
						$('#control-board').append(controlHtml);
						$('#flip-' + controlNameToAdd).slider();
						$('#content-' + controlNameToAdd).addClass('edit-enable');
					break;
					default:
					  controlHtml = "<div>No control</div>";
					}
					$('#content-'+controlNameToAdd).pep({
						useCSSTranslation: false,
						constrainTo: 'parent'
					}) 
					$('#save-controller').addClass('show-controller').removeClass('hide-controller');
					$('#scale-up').addClass('show-controller').removeClass('hide-controller');
					$('#scale-down').addClass('show-controller').removeClass('hide-controller');
					$('#button-panel').addClass('ui-state-disabled');
					$('#move-msg').addClass('show-controller').removeClass('hide-controller');
				}
				else{ //edit mode
					var editObjet = $('#control-board').find('.edit-enable');
					editObjet.attr('id','content-'+controlNameToAdd);
					editObjet.attr('data-path', $('#controller-path').val());
					var titleController = $('#control-board').find('.edit-enable .text-center');
					if(titleController != null){	//esto es para cambiar el titulo si es un flip switch
						titleController.html(controlNameToAdd);
					}
					if(editObjet[0].tagName == "A"){ // si es un boton (etiqueta anchor en realidad)
						editObjet.html(controlNameToAdd);
					}
					editObjet.removeClass('edit-enable');
					editObjet.addClass('controller-editing');
				}
			}
			else{	
				controllerNameText.addClass('empty').val("").attr('placeholder','This name already exist');
			}
		}
		else{
			if(controllerNameText.val() == ""){
				controllerNameText.addClass('empty').attr('placeholder','This field is required ');
			}
			if(controllerPathText.val() == ""){
				controllerPathText.addClass('empty').attr('placeholder','This field is required');
			}
		}
	});
	
	//Borro el borde rojo(indicando requerido) cuando selecciono el campo
	controllerNameText.focusin(function() {
		controllerNameText.removeClass('empty');
	});
	
	controllerPathText.focusin(function() {
		controllerPathText.removeClass('empty');
	});
	
	$('#save-controller').on('click',function(event){
		event.preventDefault();
		if(editMode == false){
			var controlSettings = {
				type: $('input:radio[name=radio-choice-v-6]:checked').val(), 
				name: $('#controller-name').val(),
				path: $('#controller-path').val(),
				css: $('#content-'+controlNameToAdd).attr('style'),
				id: ""
			};
			$.pep.toggleAll(false);
			$('#save-controller').removeClass('show-controller').addClass('hide-controller');
			$('#scale-up').removeClass('show-controller').addClass('hide-controller');
			$('#scale-down').removeClass('show-controller').addClass('hide-controller');
			$('#controller-name').val("");
			$('#controller-path').val("");
			$('#button-panel').removeClass('ui-state-disabled');
			$('#content-' + controlNameToAdd).removeClass('edit-enable');
			$('#move-msg').removeClass('show-controller').addClass('hide-controller');
			/*
			// Safe new added controller data
			saveController(controlSettings,function() {
				console.log('guardado exitoso');
			});
			*/
		}
		else{	// edit mode
			editMode = false;
			$('#save-controller').removeClass('show-controller').addClass('hide-controller');
			$('#button-panel').removeClass('ui-state-disabled');
			$('.open-delete-popup').remove();
			
			
			
			$('#control-board > a, #control-board > div').each(function(){	
				var contName = $(this).attr('id');
			
				if(contName != undefined || contName != null){
					contName = contName.split("-");
					if(contName[0] == "content"){
						if($(this).hasClass('controller-editing')){
							var controllerId = getContollerId($(this).attr('id'),function(result) {
								console.log('ID success');
								var controlSettings = {
									type: $('input:radio[name=radio-choice-v-6]:checked').val(), 
									name: $('#controller-name').val(),
									path: $('#controller-path').val(),
									css: $('#content-'+controlNameToAdd).attr('style'),
									id: controllerId
								};
							});
							$(this).removeClass('controller-editing');
						}
						
						$(this).removeAttr('data-rel').removeAttr('data-rel').removeAttr('data-rel').removeAttr('href');
						$(this).removeClass('edit-enable');
						$(this).next().remove();
					}
				}
			});
			
		}
		
		
		
	});
	
	$('#control-board').on('click','#scale-up',function(event){
		event.preventDefault();
		var oldScale = $('#content-'+controlNameToAdd).css('transform');
		
		if(oldScale	 == "none"){
			newScale = 1.1;
		}
		else{
			oldScale = oldScale.split(","); 
			oldScale = oldScale[0].split("\(");
			newScale = parseFloat(oldScale[1])+0.1;
		}
		$('#content-'+controlNameToAdd).css('transform', 'scale('+newScale+')')
	});
	
	$('#control-board').on('click','#scale-down',function(event){
		event.preventDefault();
		var oldScale = $('#content-'+controlNameToAdd).css('transform');
		if(oldScale	 == "none"){
			newScale = 1.1;
		}
		else{
			oldScale = oldScale.split(","); 
			oldScale = oldScale[0].split("\(");
			newScale = parseFloat(oldScale[1])-0.1;
		}
		$('#content-'+controlNameToAdd).css('transform', 'scale('+newScale+')')
	});
	
	var editMode = false;
	
	$('#control-board').on('click','.arduino-action',function(event){
		if(editMode == false){
			getData("","","");
		}
		else{
			event.preventDefault();
			
			var popupMenuEdit = $('#popupMenuEdit');
			popupMenuEdit.popup( "open");
			if($(this)[0].tagName != "DIV"){
				$('#open-delete-popup').attr('data-cont-delete',$(this).attr('id'));
				$(this).addClass('edit-enable');
			}
			else{
				$('#open-delete-popup').attr('data-cont-delete',$(this).prev().attr('id'));
				$(this).prev().addClass('edit-enable');
			}
		}
	});
	
	$('#edit-controller-page').on('click',function(event){
		editMode = true;
		event.preventDefault();
		location.hash = "main-page";
		$('#button-panel').addClass('ui-state-disabled');
		$('#save-controller').addClass('show-controller').removeClass('hide-controller');
		$( "#menu-panel" ).panel( "close" );
		
		$('#control-board > a, #control-board > div').each(function(){		
			var contName = $(this).attr('id');
			contName = contName.split("-");
			if(contName[0] == "content"){
				$(this).attr({
					'data-rel': "popup",
					'data-transition': "pop",
					'href': "#popupMenuEdit"
				});
				var contCss = $(this).attr('style');
				var contWidth = $(this).width();
				var contHeight= $(this).height();
				var supDiv= '<div class="arduino-action" style="' + contCss + 'display:block;width:'+contWidth+'px;height:'+contHeight+'px;"></div>';
				$(supDiv).insertAfter($(this));
			}
		});
		
	});
	
	var controllerObjetId;
	//Boton delete del menu de edicion
	$('#open-delete-popup').click(function(event){
		event.preventDefault();
		var popupMenuEdit = $('#popupMenuEdit')
		popupMenuEdit.popup( "close");
		popupMenuEdit.popup({
			afterclose: function( event, ui ) {
				$( "#deleteDialog" ).popup( "open");
			}
		});
		controllerObjetId = $(this).attr('data-cont-delete');
		console.log('ASDAS');
	});
	
	//Delete controller
	$('#delete-controller-button').click(function(event){
		event.preventDefault();
		$('#'+controllerObjetId).remove();
		$('#deleteDialog').popup( "close" );
		
		getContollerIdandDelete(controllerObjetId,function() {
			console.log('delete success');
        });
		
	});
	
	//Delete controller
	$('#delete-cancel-button').click(function(event){
		event.preventDefault();
		$('#deleteDialog').popup( "close" );
		$('#control-board').find('.edit-enable').removeClass('edit-enable');
		
	});
	
	//boton cerrar menu edicion
	$('#close-button-menu-edit').click(function(event){
		$('#popupMenuEdit').popup({
			afterclose: function( event, ui ) {
				$( "#deleteDialog" ).popup( "close");
			}
		});
		$('#control-board').find('.edit-enable').removeClass('edit-enable');
	});
	
	
	$('#open-edit-page').on('click',function(event){
		//editMode = true;
		event.preventDefault();
		location.hash = "#output-path-page";
		var editObjetName = $('#control-board').find('.edit-enable').attr('id');
		editObjetName = editObjetName.split("-");
		var editObjetPath = $('#control-board').find('.edit-enable').attr('data-path');
		
		$('#controller-name').val(editObjetName[1]);
		$('#controller-path').val(editObjetPath);
	});
	function inputValidate(inputVal,type){
		var result = true;
		switch(type){
			case "empty":
				if(inputVal != ""){result = true;}else{result = false;}
			break;
			case "nameExist":
				$('#control-board > a, #control-board > div').each(function(){
					if($(this).attr('id') == "content-"+inputVal.val()){
						result = false;
					}
				});
			break;
			default:
				result = true;
			}
		return result;
	}
});

