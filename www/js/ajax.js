function getData(arduinoIp, port, controllerUrl){
	var url = 'http://192.168.0.100/arduino/digital/13';

	$.ajax({
	   type: 'GET',
		url: url,
		async: false,
		jsonpCallback: 'jQuery17107112555727362633_1334050373252',
		contentType: "application/json",
		dataType: 'jsonp',
		success: function(json) {
		   console.log(json.Pin + " " + json.Status);
		   
		   if(json.Status == 0){
		   var url = 'http://192.168.0.100/arduino/digital/13/1';
			$.ajax({
				   type: 'GET',
					url: url,
					async: false,
					jsonpCallback: 'jQuery17107112555727362633_1334050373252',
					contentType: "application/json",
					dataType: 'jsonp',
					success: function(json) {
					   console.log(json.Pin + " " + json.Status);
					   if(json.Status == 0){
					   
					   }
					},
					error: function(e) {
					   console.log(e.message);
					}
			});
		   }
		   else{
			var url = 'http://192.168.0.100/arduino/digital/13/0';
			$.ajax({
				   type: 'GET',
					url: url,
					async: false,
					jsonpCallback: 'jQuery17107112555727362633_1334050373252',
					contentType: "application/json",
					dataType: 'jsonp',
					success: function(json) {
					   console.log(json.Pin + " " + json.Status);
					   if(json.Status == 0){
					   
					   }
					},
					error: function(e) {
					   console.log(e.message);
					}
			});
		   }
		},
		error: function(e) {
		   console.log(e.message);
		}
	});

}
