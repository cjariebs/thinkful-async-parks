'use strict';

function getParks(state, maxResults=10) {
    let uri = `https://api.nps.gov/api/v1/parks/`;
    
    uri = uri + `?stateCode=${state}&limit=${maxResults-1}`;
    console.log(uri);

    return fetch(uri)
	.then(response => {
	    if (response.ok) {
		return response.json();
	    }
	    throw new Error(response.statusText);
	});
}

function updateSearchResults(resultJson) {
    const results = resultJson['data'];
    console.log(results);

    const ele = $('.results');
    ele.html('');
    
    for (let i=0; i < results.length; i++) {
	let result = results[i];
	ele.append(`
	<li>
	   <heading><a href="${result.url}">${result.fullName}</a></heading>
	   <p>${result.description}</p>
	</li>`
	);
    }
}

function handleSearchForm() {
    $('form').submit(event => {
	event.preventDefault();

	const state = $('input[name="state"]').val();
	const maxResults = $('input[name="maxResults"]').val();

	getParks(state, maxResults)
	.then(result => {
	    updateSearchResults(result);
	});
    });
}

$(handleSearchForm());
