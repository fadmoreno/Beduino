function setupTable(tx){
    console.log("before execute sql...");
    tx.executeSql("CREATE TABLE IF NOT EXISTS controllers(id INTEGER PRIMARY KEY,type,name,path,css,updated)");
    console.log("after execute sql...");
}   

//I handle getting entries from the db
function getEntries() {
    dbShell.transaction(function(tx) {
        tx.executeSql("select id, type, name, path, css, updated from controllers order by updated desc",[],renderEntries,dbErrorHandler);
    }, dbErrorHandler);
}
/*
function getContollerId(controllerName){
	var name =  controllerName.split("-");
	console.log(name);
	dbShell.transaction(function(tx) {
        tx.executeSql("select id from controllers where name="+name[1],[],deleteController);
    }, dbErrorHandler);
	//console.log(tx);
}
*/

function getContollerIdandDelete(controllerName, cb) {
   var name =  controllerName.split("-");
	console.log(name);
    dbShell.transaction(function(tx) {
			 tx.executeSql("select id from controllers where name=?",[name[1]],deleteController);
			console.log("bbb");
    }, dbErrorHandler,cb);
}

function deleteController(tx,results){
	for(var i=0; i<results.rows.length; i++) {
		console.log('DDDD '+i);
		console.log("ID!!: "+results.rows.item(i).id); 
		tx.executeSql('DELETE FROM controllers WHERE id = ?', [results.rows.item(i).id], function(){console.log('deleted');}, function(){console.log('error deleting controller');});
	}
	
	
	
}

function renderEntries(tx,results){
    console.log("render entries");
    if (results.rows.length == 0) {
	 console.log('You currently do not have any controllers');  
    } else {
       
       for(var i=0; i<results.rows.length; i++) {
		console.log('DDDD '+i);
		console.log('JAJA11');
		console.log("type: "+results.rows.item(i).type+" name: "+ results.rows.item(i).name+" path: "+ results.rows.item(i).path+" css: "+ results.rows.item(i).css);    	

		switch(results.rows.item(i).type)
		{
		case "button":
		  controlHtml = '<a id="content-' + results.rows.item(i).name + '" data-path="' + results.rows.item(i).path + '" class="ui-btn ui-btn-inline ui-icon-power ui-btn-icon-left ui-shadow ui-corner-all arduino-action" style="'+ results.rows.item(i).css +'">' + results.rows.item(i).name + '</a>';
		  $('#control-board').append(controlHtml);
		  break;
		case "flip-swicht":
		  controlHtml = '<div id="content-'+ results.rows.item(i).name + '" class="controller-content arduino-action" data-path="'+$('#controller-path').val()+'"> <select id="flip-' + results.rows.item(i).name + '" name="flip-'+ results.rows.item(i).name +'" data-role="slider" style="'+ results.rows.item(i).css +'"><option value="off">Off</option><option value="on">On</option></select><div class="text-center">'+ results.rows.item(i).name +'</div></div>';
		  $('#control-board').append(controlHtml);
		  $('#flip-' + results.rows.item(i).name).slider();
		  $('#content-' + results.rows.item(i).name).attr('style',results.rows.item(i).css);
		  
		  break;
		default:
		  controlHtml = "<div>No control</div>";
		}
       }
    }
}

function saveController(controller, cb) {
    //Sometimes you may want to jot down something quickly....
    if(controller.name == "") controller.name = "[No name]";
    dbShell.transaction(function(tx) {
        if(controller.id == ""){
			tx.executeSql("insert into controllers(type,name,path,css,updated) values(?,?,?,?,?)",[controller.type,controller.name,controller.path,controller.css, new Date()]);
			console.log("bbb");
		}
        else {
			tx.executeSql("update controllers set type=?, name=?, path=?, css=?, updated=? where id=?",[controller.type,controller.name,controller.path,controller.css, new Date(), controller.id]);
			console.log("ccc "+ controller.id);
		}
    }, dbErrorHandler,cb);
}

function getContollerId(controllerName, cb) {
   var name =  controllerName.split("-");
	console.log(name);
    dbShell.transaction(function(tx) {
			 tx.executeSql("select * from controllers where name=?",[name[1]],updateController);
			console.log("upted controller!!!");
    }, dbErrorHandler,cb);
}

function updateController(tx,results){
	for(var i=0; i<results.rows.length; i++) {
		console.log('aOOOO!! '+i);
		console.log("ID!!: "+results.rows.item(i).id); 
		
		tx.executeSql("update controllers set type=?, name=?, path=?, css=?, updated=? where id=?",[results.rows.item(i).type,results.rows.item(i).name,results.rows.item(i).path,results.rows.item(i).css, new Date(), results.rows.item(i).id]);
			console.log("DSASASSSSOJOTA!!!! "+ controller.id);
	}
}

function dbErrorHandler(err){
    alert("DB Error: "+err.message + "\nCode="+err.code);
}