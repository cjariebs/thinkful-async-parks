'use strict';

const _stateCodes = [];

function getParks(maxResults=10) {
    const url = `https://api.nps.gov/api/v1/parks/`;
    const params = formatParams(maxResults);
    const uri = url + params;
    
    console.log(uri);
    return fetch(uri)
	.then(response => {
	    if (response.ok) {
		return response.json();
	    }
	    throw new Error(response.statusText);
	});
}

function formatParams(maxResults=10) {
    let paramString = `?limit=${encodeURIComponent(maxResults)}&`;
    for (let i=0; i < _stateCodes.length; i++) {
	paramString += `stateCode=${encodeURIComponent(_stateCodes[i])}&`;
    }
    return paramString;
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

function addStateCode(state) {
    _stateCodes.push(state);
    updateStateList();
}

function handleInputs() {
    handleSearchForm();
    handleAddStateButton();
}

function handleSearchForm() {
    $('form').submit(event => {
	event.preventDefault();

	const ele = $('input[name="state"]');
	if (ele.val() != "") {
	    addStateCode(ele.val());
	    ele.val('');
	    return;
	}

	const maxResults = $('input[name="maxResults"]').val();
	if (!maxResults) maxResults = 10;

	getParks(maxResults)
	.then(result => {
	    updateSearchResults(result);
	});
    });
}

function handleAddStateButton() {
    $('button[name="addState"]').click(event => {
	console.log("addState");
	const ele = $('input[name="state"]');
	addStateCode(ele.val());
	ele.val('');
    });
}

function updateStateList() {
    const ele = $('.stateList');
    ele.html('');
    for (let i=0; i < _stateCodes.length; i++) {
	ele.append(`<li>${_stateCodes[i]}</li>`);
    }
}

$(handleInputs());
