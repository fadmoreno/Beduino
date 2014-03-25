// ControllerBoard functionality
var board = (function () {

	var dashboard = $('#control-board'),getContollerId
		controllerNameText = $('#controller-name'),
		controllerPathText = $('#controller-path'),
		controlNameToAdd = $('#controller-name'),
		controlPathToAdd = $('#controller-path'),
		addControllerButton = $('#add-controller-board'),
		saveButton = $('#save-controller'),
		scaleUpButton = $('#scale-up'),
		scaleDownButton = $('#scale-down'),
		panelMenuButton = $('#button-panel'),
		moveMsg = $('#move-msg'),
		editControllerButton = $('#edit-controller-page');
		
	var editMode;
	var controllerObjetId;
	
	var privateInit = function(){
			editMode = false;
			dashboard.height($(window).height()-77+'px');
			/*
			dbShell = window.openDatabase("controllers", 2, "SimpleNotes", 1000000);
			dbShell.transaction(setupTable,dbErrorHandler,getEntries);	
			*/
		};
	
	var htmlToAddByControllerType = function(controllerType, controlName, controlPath){
			
			switch(controllerType){
				case "Button":
					controlHtml = '<a id="content-' + controlName + '" data-path="' + controlPath + '" class="ui-btn ui-btn-inline ui-icon-power ui-btn-icon-left ui-shadow ui-corner-all arduino-action edit-enable">'+controlName+'</a>';
					$('#control-board').append(controlHtml);
					break;
				case "Flip switch":
					controlHtml = '<div id="content-'+controlName + '" class="controller-content arduino-action" data-path="'+ controlPath +'"> <select id="flip-' + controlName + '" name="flip-'+ controlName +'" data-role="slider"><option value="off">Off</option><option value="on">On</option></select><div class="text-center">'+controlName+'</div></div>';
					$('#control-board').append(controlHtml);
					$('#flip-' + controlName).slider();
					$('#content-' + controlName).addClass('edit-enable');
					break;
				default:
					controlHtml = "<div>No control</div>";
			}	
		};
	
	var addNewController = function(){
	
		var controllerType = $('input:radio[name=radio-choice-v-6]:checked').parent().find('.input-desc').html(),
			controlName = controlNameToAdd.val(),
			controlPath = controlPathToAdd.val();
			
		htmlToAddByControllerType(controllerType, controlName, controlPath);
		
		$('#content-'+controlName).pep({
			useCSSTranslation: false,
			constrainTo: 'parent'
		}) ;
		showElement(saveButton);
		showElement(scaleUpButton);
		showElement(scaleDownButton);
		panelMenuButton.addClass('ui-state-disabled');
		showElement(moveMsg);
		
	};
	
	var editController = function(controllerToEdit, newControlName, newControlPath){
			var controllerToEdit = $('#control-board').find('.edit-enable');
			controllerToEdit.attr('id','content-'+newControlName);
			controllerToEdit.attr('data-path', newControlPath);
			var titleController = $('#control-board').find('.edit-enable .text-center');
			if(titleController != null){	//esto es para cambiar el titulo si es un flip switch
				titleController.html(newControlName);
			}
			if(controllerToEdit[0].tagName == "A"){ // si es un boton (etiqueta anchor en realidad)
				controllerToEdit.html(newControlName);
			}
			controllerToEdit.removeClass('edit-enable');
			controllerToEdit.addClass('controller-editing');
		};
	
	var inputValidation = function (inputVal,type){
		var result = true;
		switch(type){
			case "empty":
				if(inputVal == ""){
					result = false;
				}
			break;
			case "nameExist":
				$('#control-board > a, #control-board > div').each(function(){
					if($(this).attr('id') == "content-"+inputVal){
						result = false;
					}
				});
			break;
			default:
				result = true;
			}
		return result;
	};
	
	var emptyInputMsg = function(inputsArray){
			inputsArray.forEach(function($this){
				if($this.val() == ""){
					$this.addClass('empty').attr('placeholder','This field is required ');
				}
			});
		};
	
	var inputNameExistMsg = function(controlNameToAdd){
			controlNameToAdd.addClass('empty').val("").attr('placeholder','This name already exist');
		};
	
	var scaleController = function(controlName,type){
		var oldScale = $('#content-' + controlName).css('transform');
		var newScale;
		if(oldScale	 == "none"){
			if(type == "up"){
				newScale = 1.1;
			}
			else{
				newScale = 0.9;
			}
		}
		else{
			oldScale = oldScale.split(","); 
			oldScale = oldScale[0].split("\(");
			if(type == "up"){
				newScale = parseFloat(oldScale[1])+0.1;
			}
			else{
				newScale = parseFloat(oldScale[1])-0.1;
			}
		}
		$('#content-'+controlName).css('transform', 'scale('+newScale+')');
	};
	
	var emptyAddControllerInputs = function(){
		controlNameToAdd.val("");
		controlPathToAdd.val("");
	};
	
	var safeNewController = function(controlSettings){
			emptyAddControllerInputs();		
			hideElement(scaleUpButton);
			hideElement(scaleDownButton);
			panelMenuButton.removeClass('ui-state-disabled');
			$('#content-' + controlSettings.name).removeClass('edit-enable');
			hideElement(moveMsg);
					
			$.pep.toggleAll(false);
			/*
			// Safe new added controller data
			saveController(controlSettings,function() {
			console.log('guardado exitoso');
			});
			*/		
	};
	
	var safeEdition = function(){
			$('#control-board > a, #control-board > div').each(function(){	
				var contName = $(this).attr('id');
				if(contName != undefined || contName != null){
					contName = contName.split("-");
					if(contName[0] == "content"){
						if($(this).hasClass('controller-editing')){
							var controllerId = getContollerId($(this).attr('id'),function(result) {
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
		};
	
	var showElement = function(element){
		element.addClass('show-controller').removeClass('hide-controller');
	};
	
	var hideElement = function(element){
		element.removeClass('show-controller').addClass('hide-controller');
	};
		
	var prepareControllersToBeEdit = function(){
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
	};
	return{
	
		init: privateInit,
		
		buttonActions : function(){
			addControllerButton.on('click',function(event){
				event.preventDefault();
				controlName = controlNameToAdd.val(),
				controlPath = controlPathToAdd.val();
				if (inputValidation(controlName,"empty") == true && inputValidation(controlPath,"empty") == true){
					var nameExist = inputValidation(controlName,"nameExist");
					if(nameExist == true){
						location.hash = "main-page";
						
						if(editMode == false){
							addNewController();
						}
						else{
							var controllerToEdit = dashboard.find('.edit-enable');
							editController(controllerToEdit, controlName, controlPath);
						}
					}
					else{	// Algun nombre ya existe
						inputNameExistMsg(controlNameToAdd);
					}
				}
				else{	//Algun input vacio
					var inputsArray = [controlNameToAdd,controlPathToAdd];
					emptyInputMsg(inputsArray);
				}
			});
			
			dashboard.on('click','#scale-up',function(event){
				event.preventDefault();
				controlName = controlNameToAdd.val();
				scaleController(controlName,"up");
			});
			
			dashboard.on('click','#scale-down',function(event){
				event.preventDefault();
				controlName = controlNameToAdd.val();
				scaleController(controlName,"down");
			});
			
			saveButton.on('click',function(event){
				event.preventDefault();
				hideElement(saveButton);
				if(editMode == false){
					var controlSettings = {
						type: $('input:radio[name=radio-choice-v-6]:checked').val(), 
						name: controlNameToAdd.val(),
						path: controlPathToAdd.val(),
						css: $('#content-'+controlNameToAdd.val()).attr('style'),
						id: ""
					};
					safeNewController(controlSettings);	
				}
				else{
					editMode = false;
					panelMenuButton.removeClass('ui-state-disabled');
					$('.open-delete-popup').remove();
					safeEdition();
					
				}
			});
			
			//Borro el borde rojo(indicando requerido) cuando selecciono el campo
			controllerNameText.focusin(function() {
				controllerNameText.removeClass('empty');
			});
			
			controllerPathText.focusin(function() {
				controllerPathText.removeClass('empty');
			});
			
			dashboard.on('click','.arduino-action',function(event){
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
			
			editControllerButton.on('click',function(event){
				editMode = true;
				event.preventDefault();
				location.hash = "main-page";
				panelMenuButton.addClass('ui-state-disabled');
				showElement(saveButton);
				$( "#menu-panel" ).panel( "close" );
				
				prepareControllersToBeEdit();
			});
			
			
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
				
			});
			
			//Delete controller (boton delete)
			$('#delete-controller-button').click(function(event){
				event.preventDefault();
				$('#'+controllerObjetId).next().remove();
				$('#'+controllerObjetId).remove();
				$('#deleteDialog').popup( "close" );
				
				getContollerIdandDelete(controllerObjetId,function() {
					console.log('delete success');
				});
				
			});
			
			//Delete controller (boton cancel)
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
		},
	};
	
})();

$(function() {
	board.init();
	board.buttonActions();
});
