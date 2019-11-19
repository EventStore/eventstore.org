// Load responsive compare table CSS if JS enabled
document.getElementsByTagName("head")[0].insertAdjacentHTML(
"beforeend",
"<link rel=\"stylesheet\" href=\"responsive-compare-table.css\" />");

// Resize column headers on mobile
var mediaQuery = window.matchMedia('(min-width: 640px)');
mediaQuery.addListener(mobileTable);
function mobileTable(mediaQuery) {    
if (mediaQuery.matches) {
document.querySelector("#pricing-table thead th:not(:first-of-type").colSpan = 2;
document.querySelector("#pricing-table thead th:first-of-type").colSpan = 1;
} else {
var colHeaders = document.querySelectorAll("#pricing-table thead th")
for (var i = 0; i < colHeaders.length; i++) {
colHeaders[i].colSpan = 3;
};
}
}
mobileTable(mediaQuery);

// Select level to view
var currentDefaults = document.querySelectorAll('#pricing-table .default');
var buttons = document.querySelectorAll('#pricing-table li.btn');
function selectLevel(level) {
for (var i = 0; i < currentDefaults.length; i++) {
currentDefaults[i].classList.remove('default')
};
for (var i = 0; i < buttons.length; i++) {
buttons[i].classList.remove('active')
};
var newActives = level + "-level-btn"; 
document.getElementById(newActives).classList.add('active');
var newDefaults = level + "-level";
newDefaults = document.querySelectorAll('#pricing-table .' + newDefaults);
for (var i = 0; i < newDefaults.length; i++) {
newDefaults[i].classList.add('default')
};
currentDefaults = document.querySelectorAll('#pricing-table .default');
};