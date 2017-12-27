//-----------------------
// Variables
//-----------------------

var screenHeight = window.innerHeight;
var screenWidth = window.innerWidth;
var walletOpened = false;
var miningOpened = false;

//-----------------------
// Functions
//-----------------------

function changeFullSectionHeight(){
	var fullSection = document.getElementsByClassName('fullSection');
	var fullSectionHeight = screenHeight-70;

	for (var i = 0; i < fullSection.length; i++){
	    fullSection[i].style.height = fullSectionHeight + 'px';
	}
}


//-----------------------
// Screen size
//-----------------------

var addEvent = function(object, type, callback) {
    if (object == null || typeof(object) == 'undefined') return;
    if (object.addEventListener) {
        object.addEventListener(type, callback, false);
    } else if (object.attachEvent) {
        object.attachEvent("on" + type, callback);
    } else {
        object["on"+type] = callback;
    }
};

addEvent(window, "resize", function(event) {

  	screenHeight = window.innerHeight;
	screenWidth = window.innerWidth;

	changeFullSectionHeight();

}); 

//-----------------------
// Int Script
//-----------------------

changeFullSectionHeight();