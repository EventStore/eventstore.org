function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split('&');

  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');

    if (pair[0] === variable) {
      return decodeURIComponent(pair[1].replace(/\+/g, '%20'));
    }
  }
}

function displaySearchResults(results, pageIndex) {
  var searchResults = document.getElementById('search-results');

  if (results.length) { 
    var appendString = '';

    for (var i = 0; i < results.length; i++) {
      var item = store[results[i].ref];
      appendString += '<li><a href="' + item.url + '"><h3>' + item.section + ' | ' + item.title + '</h3></a>';
      appendString += '<p>' + item.content.substring(0, 150) + '...</p></li>';
    }

    searchResults.innerHTML = appendString;
  } else {
    searchResults.innerHTML = '<li>No results found</li>';
  }
}

function search() {
	console.log("searching");
	var searchTerm = getQueryVariable('query');
	console.log("Search term: ", searchTerm);
	if(searchTerm) {
		document.getElementById('search-box').setAttribute("value", searchTerm);
		var pageIndex = window.store;
		console.log("Lunr", lunr);

		var index = lunr(function () {
		    this.field('title', {boost: 10});
		    this.field('section');
		    this.field('content');
		    this.ref('key');
		});

		console.log("creating page index", pageIndex);
		for(var key in pageIndex) {
			index.add(pageIndex[key]);
		}

		var result = index.search(searchTerm);
		console.log("Results ", result);
		displaySearchResults(result, pageIndex);
	}
}

search();
