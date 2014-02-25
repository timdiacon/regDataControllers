$(document).ready(init);

var currentCompanyName;
var resultsPerPage = 10;
var currentPage = 1;

function init(){
	console.log("App Init");
	setupListeners();
}

function setupListeners(){
	$("#searchCompany").submit(function( event ) {
		currentCompanyName = $('#company').val();
		getCompanies(currentCompanyName);
		event.preventDefault();
	});
}

function getCompanies(company){
	// clear pagination if it exists
	$(".pagination").remove();

	$.getJSON( "http://localhost:3300/api/records/" + company + "/" + 0, function(data) {
		displaySearchResults(data);
		addPagination();
	});
}

function updatePage(){
	$.getJSON( "http://localhost:3300/api/records/" + currentCompanyName + "/" + (currentPage * resultsPerPage), function(data) {
		displaySearchResults(data);
	});
}

function displaySearchResults(data){
	var html = '<thead><tr><th>Organisation Name</th><th>Address Line 1</th><th>Country</th></tr></thead><tbody>';

	extractAddress(data[0]);

	$.each(data, function(index, value){
		html += '<tr data-toggle="modal" data-target=".bs-example-modal-lg"><td>'+value.Organisation_name+'</td>';
		html += '<td>'+value.Organisation_address_line_1+'</td>';
		html += '<td>'+value.Organisation_country+'</td>';
		html += '<td class="hidden">'+(extractAddress(value) + value.Nature_of_Work_description)+'</td></tr>';
	});

	html += '</tbody>';

	$("#results").html(html);
	setupTableListeners();
}

function setupTableListeners(){
	$("#results tbody tr").click(function(){
		$('#myLargeModalLabel').text($(this).find("td:first").text());
		$('.modal-body').html($(this).find(".hidden").html());
	});
}

function addPagination(){	
	$.getJSON( "http://localhost:3300/api/recordcount/" + currentCompanyName, function(count) {
		if(count > resultsPerPage){
			var numPages = Math.floor(count/resultsPerPage);
			var html = '<ul class="pagination"><li><a href="#">&laquo;</a></li>';
			for (var i=0; i <numPages; i++) {
				html += '<li><a class="number" href="#">'+(i+1)+'</a></li>'
			};
			html += '<li><a href="#">&raquo;</a></li></ul>';
			$(".main").append(html);

			// add events
			$(".pagination li a.number").click(function(e) {
				currentPage = $(this).parent().index();
				updatePage();
				updatePagination();
			});
			$(".pagination li a:last").click(function(e){
				currentPage++;
				updatePage();
				updatePagination();
			});
			$(".pagination li a:first").click(function(e){
				currentPage--;
				updatePage();
				updatePagination();
			});

			updatePagination();
		}
	});
}

function updatePagination(){
	$('.pagination li').removeClass('active');
	$('.pagination li:nth-child('+(currentPage+1)+')').addClass('active');
}

/********** UTILS **********/

function extractAddress(record){
	var address = '<p><h4>Organisation Address</h4>';
	if(record.Organisation_address_line_1 != undefined) address += (record.Organisation_address_line_1 + '<br>');
	if(record.Organisation_address_line_2 != undefined) address += (record.Organisation_address_line_2 + '<br>');
	if(record.Organisation_address_line_3 != undefined) address += (record.Organisation_address_line_3 + '<br>');
	if(record.Organisation_address_line_4 != undefined) address += (record.Organisation_address_line_4 + '<br>');
	if(record.Organisation_address_line_5 != undefined) address += (record.Organisation_address_line_5 + '<br>');
	if(record.Organisation_postcode != undefined) address += (record.Organisation_postcode + '<br>');
	if(record.Organisation_country != undefined) address += (record.Organisation_country + '</p><hr>');
	return address;
}