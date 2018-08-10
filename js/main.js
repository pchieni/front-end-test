var base_url = "http://api.smartduka.busaracenterlab.org";
$(document).ready(function() {
	
	$("#Login").on("submit", function (e) {
	    e.preventDefault();
	    
	    var username = $("#username").val();
	    var password = $("#password").val();
	    
	    $.ajax({
			url : base_url + "/oauth/token/",
			type : "POST",
			data : {
				grant_type: 'password',
				username : username,
				password : password,
				client_id: 'qNJ2qahu5XW90r5o40VJYRuC4IOt6URQgZe1yqRe',
		        client_secret: '5lAwZFI4t1l1UUAhw3f6oAjEkjky3nhdMgQlnjIjzoOEzZMc0X9aeXOyfbHSy5D7MzQo61wSTHSeH2mgGAugwoeBlbsnyfKl7p2sMObZWIS6EFlmXUSdADxN41giNgVe',
			},
			// handle a successful response
			success : function(json) {
				$('#post-text').val(''); // remove the value from the input
				console.log(json); // log the returned json to the console
				localStorage.setItem("token", json.access_token);
                // /alert("success"); // another sanity check
				window.location = "home.html";
			},

			// handle a non-successful response
			error : function(xhr, errmsg, err) {
				var obj = JSON.parse(xhr.responseText);
				$('#alert')
						.html(obj.error_description); 
				console.log(xhr.status + ": " + xhr.responseText); 
			}
		});
	});
});

var initializeSelect2 = function(select2Arr){
	for ( var i in select2Arr) {
		// Initialize Components
		var select2Name = select2Arr[i][0];
		var select2Placeholder = select2Arr[i][1];
		
		$("#" + select2Name).select2({
	        placeholder: select2Placeholder,
	        allowClear: true,
	        theme: 'bootstrap'
	    });	
	}
};

var loadLocations = function(){
	var tokenS = localStorage.getItem("token");
	$.ajax({
		url : base_url + '/api/v1/locations/',
		type : 'GET',
		// Authorization: 'Bearer ' + tokenS,
		beforeSend : function(xhr) {
			xhr.setRequestHeader("Authorization", "Bearer " + tokenS)
		},		
		success: function(response) {
			
			var resultTable = $('#loc_listings').DataTable({
                "aoColumnDefs": [{
                    "bSortable": false,
                    "aTargets": [3]
                }],
                "columns": [
                    { data: 'id' },
                    { data: 'name' },
                    { data: 'is_active' },
                    { data: 'loc_order' }                        
                ],
                "destroy": true,
                "dom": 'lrtip',
                "language": {
                    "emptyTable": "No match member found",
                    "infoFiltered": " "
                },
                "order": [[2, "desc"]]
            });
            resultTable.rows.add(response.results).draw();
            dataSet = response.results;
        },
		error : function(jqXHR, textStatus, errorThrown) {
			console.log(textStatus);
		}
	})
}
var loginDetails = function(){
	var tokenS = localStorage.getItem("token");
	$.ajax({
		url : base_url + '/api/v1/users/current-user',
		type : 'GET',
		// Authorization: 'Bearer ' + tokenS,
		beforeSend : function(xhr) {
			xhr.setRequestHeader("Authorization", "Bearer " + tokenS)
		},
		success : function(data) {
			// var obj = JSON.parse(data);
			console.log(data);
			// {"id":70,"email":"pchieni25@gmail.com","first_name":"Patrick","last_name":"Patrick","is_active":true,"is_staff":true,"is_superuser":true,"groups":[],"phone_number":null,"is_trainer":false,"trainer_id":null,"trainees":[],"date_joined":"2018-08-09T09:46:39+03:00","location":13}
					
			var htmlString = "<div class='main_container'>" +
					
							"<div>" + data.first_name + " " + data.last_name + "</div>" +
								"<div> Phone Number " + data.phone_number + "</div>" +
									"<div>" + data.email + "</div>";
			$("#login-details").html(htmlString);
			
		},
		error : function(jqXHR, textStatus, errorThrown) {
			console.log(textStatus);
		}
	})
}

