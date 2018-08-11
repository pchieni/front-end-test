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

var loginStatus =  function(){

	var tokenS = localStorage.getItem("token");
	//alert(tokenS);
	if(tokenS==""){
		
		window.location = "index.html";
	}
}

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
                "pageLength": 5,
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

var loadCategories = function(){
		
	var tokenS = localStorage.getItem("token");
	$.ajax({
		url : base_url + '/api/v1/categories/',
		type : 'GET',
		// Authorization: 'Bearer ' + tokenS,
		beforeSend : function(xhr) {
			xhr.setRequestHeader("Authorization", "Bearer " + tokenS)
		},		
		success: function(response) {
			var data = response["results"];
			var htmlString = "";
			for(var i in data){
				htmlString += "<option value='" + data[i]["id"] + "'>" + data[i]["name"] + "</option>";
			}
			$("#categories").html(htmlString);
			//console.log(response["results"]);
        },
		error : function(jqXHR, textStatus, errorThrown) {
			console.log(textStatus);
		}
	})
}

$("#categories").change(
		function() {		
			loadVideos($(this).val());
		});

var loadVideos = function(id){
	
	$("#music_listings").html("<thead>" +
							"<th>ID</th>" +
 							"<th>Name</th>" +
							"<th>File Path</th>" +
							"<th>Description</th>" +
							"<th>Category Name</th>" +
							"<th>Is Active</th>" +
						"</thead>");
	var url = "";
	if(id==0){
		 url = base_url + '/api/v1/videos/';
	}else{
		 url = base_url + '/api/v1/videos/?category_id=' + id;
	}
	
	var tokenS = localStorage.getItem("token");
	$.ajax({
		url : url,
		type : 'GET',
		// Authorization: 'Bearer ' + tokenS,
		beforeSend : function(xhr) {
			xhr.setRequestHeader("Authorization", "Bearer " + tokenS)
		},		
		success: function(response) {
			
			var resultTable = $('#music_listings').DataTable({
                "aoColumnDefs": [{
                    "bSortable": false,
                    "aTargets": [3]
                }],
                "pageLength": 5,
                "columns": [
                    { data: 'id' },
                    { data: 'name' },
                    { data: 'file_path' },
                    { data: 'description' } ,
                    { data: 'category_name' },
                    { data: 'is_active' } 
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
            
            //resultTable.ajax.reload();
        },
		error : function(jqXHR, textStatus, errorThrown) {
			console.log(textStatus);
		}
	})
}

var logout = function(){
	localStorage.setItem("token", '');
	window.location = "index.html";
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
									"<div>" + data.email + "</div>" + 
									"<div><a href='javascript:void(0)' onclick='logout();'>Logout</a></div>";
			$("#login-details").html(htmlString);
			
		},
		error : function(jqXHR, textStatus, errorThrown) {
			console.log(textStatus);
		}
	})
}

