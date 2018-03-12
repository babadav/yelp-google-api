 console.log("script.js");


var yelpApi = (function(){
	var shared ={};

	function populateYelp(yelpResults) {
		var businesses = yelpResults.businesses;
		console.log(businesses);
		processYelpResults(businesses);
	};
	
	function setupListeners(e){
		$('form').on('submit',function(e){
			e.preventDefault();
			var input1 = $('.input-1').val()
			var input2 = $('.input-2').val()
			var yelpUrlPath = `http://138.197.2.173:5560/{ "term": "${input1}", "location": "${input2}" }`
			$.ajax({
				url: yelpUrlPath 
			})
			.done(function(data) {
				let businesses = JSON.parse(data);
				console.log("processYelpResults: ", businesses, data)

				var markers = [];
		
				for (var i = 0; i < businesses.length; i++) {
					var business = businesses[i];
					// console.log("processing business:", business)
		
					var infoHTML = "";
		
					infoHTML += '<p style="max-width: 320px; font-size: 2rem; text-align: center; margin-bottom: 15%;">' + business.name + '</p>';
		
					infoHTML += '<p style="max-width: 320px; font-size: 1.5rem; margin-bottom: 2%;"> ' + business.price + '</p>';
		
					infoHTML += '<p style="max-width: 320px; font-size: 1.5rem; margin-bottom: 2%;">' + ' rating :    ' + business.rating + '</p>';
		
					infoHTML += '<p style="max-width: 320px; font-size: 1.5rem; margin-bottom: 2%;">' + 'Address :    ' + business.location.address1 + '</p>';
		
					infoHTML += '<p style="max-width: 320px; font-size: 1.5rem; margin-bottom: 2%;">' + 'Number Of Reviews :    ' + business.review_count + '</p>';
		
					// infoHTML += '<p style="max-width: 320px; font-size: 1.5rem; margin-bottom: 2%;">' + 'Click here to see reviews: ' + business.url + '</p>';
		
					if (business.coordinates) {
		
						var marker = {
							lat:	business.coordinates.latitude,
							lng: business.coordinates.longitude, 
							infoHTML: infoHTML
						}
						markers.push(marker);
		
						// GoogleModule.createMarker(business.coordinates.latitude, business.coordinates.longitude, infoHTML)
						// console.log(geoData);
					} else{ console.log('none')};
		
				}
				GoogleModule.createMarkers(markers);
				
			});

			

		});
	};
// (populateYelp)

	function processYelpResults(businesses) {

		console.log("processYelpResults: ", businesses)

		var markers = [];

		for (var i = 0; i < businesses.length; i++) {
			var business = businesses[i];
			// console.log("processing business:", business)

			var infoHTML = "";

			infoHTML += '<p style="font-size: 2rem; text-align: center; margin-bottom: 15%;">' + business.name + '</p>';

			infoHTML += '<p style="font-size: 1.5rem; margin-bottom: 2%;"> ' + business.price + '</p>';

			infoHTML += '<p style="font-size: 1.5rem; margin-bottom: 2%;">' + ' rating :    ' + business.rating + '</p>';

			infoHTML += '<p style="font-size: 1.5rem; margin-bottom: 2%;">' + 'Address :    ' + business.location.address1 + '</p>';

			infoHTML += '<p style="font-size: 1.5rem; margin-bottom: 2%;">' + 'Number Of Reviews :    ' + business.review_count + '</p>';

			infoHTML += '<p style="font-size: 1.5rem; margin-bottom: 2%;">' + 'Click here to see reviews: ' + business.url + '</p>';

			if (business.coordinates) {

				var marker = {
					lat:	business.coordinates.latitude,
					lng: business.coordinates.longitude, 
					infoHTML: infoHTML
				}

				markers.push(marker);

                // GoogleModule.createMarker(business.coordinates.latitude, business.coordinates.longitude, infoHTML)
                // console.log(geoData);
            } else{ console.log('none');

        }

	}

	GoogleModule.createMarkers(markers);

		
}
	
	function init(){
		setupListeners();
	};

	shared.init = init;

	return shared;
}());

yelpApi.init();


var GoogleModule = (function(){
    var shared = {};

     var activeInfoWindow; 
     var allMarkers = [];

     function createMarkers(newMarkers){

		deleteMarkers();
     	var bounds = new google.maps.LatLngBounds();

     	for (var i = 0; i < newMarkers.length; i++) {
     		var m = newMarkers[i];
     		var marker = createMarker(m.lat, m.lng, m.infoHTML);
     	

        var newBounds = bounds.extend(marker.getPosition());

        map.fitBounds(newBounds);
        map.setCenter(bounds.getCenter());


        }

     }

    function createMarker(latitude,longitude,infoHTML){
    		console.log("my geo data is " + latitude + " "+ longitude);

    	var latLng = {lat: latitude, lng: longitude}

    	var marker= new google.maps.Marker({
          position: latLng,
          // animation: google.maps.Animation.DROP,
          map: map
        });

        var infowindow = new google.maps.InfoWindow({
          content: infoHTML
        });

      



        marker.addListener('click', function(e){

        	if (activeInfoWindow) {
				
				activeInfoWindow.close();
			}

		  	infowindow.open(map, marker);
		
		  
		  	activeInfoWindow = infowindow;
          
        });

        allMarkers.push(marker);

        return marker;
      
      }

    function init() {
       
        var nyLatLng = {lat:40.711801, lng:-74.013120};
        map = new google.maps.Map(document.getElementById('map'), {
          center: nyLatLng,
          zoom: 4
        });

        createMarker(nyLatLng.lat , nyLatLng.lng);
    };
        function deleteMarkers() {
       
        for (var i = 0; i < allMarkers.length; i++) {
            allMarkers[i].setMap(null);
        }
        allMarkers = [];
    };

    shared = {
        init: init,
        createMarker: createMarker,
        createMarkers: createMarkers
    };

    return shared



}());

function clearInputFields(){
	document.querySelector('.input-1').addEventListener('click',function(){
		document.querySelector('.input-1').value = ''
	});

	document.querySelector('.input-2').addEventListener('click',function(){
		document.querySelector('.input-2').value = ''
	});
}

clearInputFields();
