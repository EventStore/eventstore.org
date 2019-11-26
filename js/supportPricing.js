// Load responsive compare table CSS if JS enabled
var element = document.createElement("link");
element.setAttribute("rel", "stylesheet");
element.setAttribute("type", "text/css");
element.setAttribute("href", "/css/responsive-compare-table.css");
document.getElementsByTagName("head")[0].appendChild(element);

// Resize column headers on mobile
var mediaQuery = window.matchMedia('(min-width: 640px)');
mediaQuery.addListener(mobileTable);
function mobileTable(mediaQuery) {    
if (mediaQuery.matches) {
document.querySelector("#pricing-table thead th:not(:first-of-type)").colSpan = 2;
document.querySelector("#pricing-table thead th:first-of-type").colSpan = 1;
} else {
var colHeaders = document.querySelectorAll("#pricing-table thead th");
for (var i = 0; i < colHeaders.length; i++) {
colHeaders[i].colSpan = 3;
}
}
}
mobileTable(mediaQuery);

// Select level to view
var currentDefaults = document.querySelectorAll('#pricing-table .default');
var buttons = document.querySelectorAll('#pricing-table li.btn');
function selectLevel(level) {
for (var i = 0; i < currentDefaults.length; i++) {
currentDefaults[i].classList.remove('default');
}
for (var i = 0; i < buttons.length; i++) {
buttons[i].classList.remove('active');
}
var newActives = level + "-level-btn"; 
document.getElementById(newActives).classList.add('active');
var newDefaults = level + "-level";
newDefaults = document.querySelectorAll('#pricing-table .' + newDefaults);
for (var i = 0; i < newDefaults.length; i++) {
newDefaults[i].classList.add('default');
}
currentDefaults = document.querySelectorAll('#pricing-table .default');
}

// Change currency
var json;
var obj;
async function getPricing() {
const response = await fetch('/js/pricing.json');
json = await response.json();
obj = json;
}
getPricing();
var currency = "GBP";
function changeCurrency(currency) {
document.getElementById('from-price').innerHTML = obj.currencies[currency].symbol + obj.currencies[currency].prices.preproduction;
document.getElementById('prePrice').innerHTML = obj.currencies[currency].symbol + obj.currencies[currency].prices.preproduction;
document.getElementById('prodPrice1').innerHTML = obj.currencies[currency].symbol + obj.currencies[currency].prices.productionnextday;
document.getElementById('prodPrice2').innerHTML = obj.currencies[currency].symbol + obj.currencies[currency].prices.productionsameday;
document.getElementById('entPrice1').innerHTML = obj.currencies[currency].symbol + obj.currencies[currency].prices.enterprise8hour;
document.getElementById('entPrice2').innerHTML = obj.currencies[currency].symbol + obj.currencies[currency].prices.enterprise2hour;
document.getElementById('suppAvail1').innerHTML = obj.currencies[currency].supportdays.preproduction;
document.getElementById('pricing-footnotes').innerHTML = obj.currencies[currency].footnotes;
var perClusterPrices = document.querySelectorAll('#pricing-table .clusterPrice');
for (var i = 0; i < perClusterPrices.length; i++) {
perClusterPrices[i].innerHTML = "+" + obj.currencies[currency].symbol + obj.currencies[currency].prices.percluster + " per cluster";
}}