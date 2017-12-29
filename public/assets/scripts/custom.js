//-----------------------
// Variables
//-----------------------

var screenHeight = window.innerHeight;
var screenWidth = window.innerWidth;

//-----------------------
// Functions
//-----------------------

function changeFullSectionHeight(){
	var fullSection = document.getElementsByClassName('fullSection');
	var fullSectionHeight = screenHeight-70;

	for (var i = 0; i < fullSection.length; i++){
	    fullSection[i].style.height = fullSectionHeight + 'px';
	}

    fullHeightSectionOnMobile(document.getElementById("aboutSection"),768);
}

function showMobileMenu() {
    var x = document.getElementById("menu");
    if (x.className === "topnav") {
        document.getElementById('logoMenu').setAttribute('style', 'float:none !important');
        x.className += " responsive";
    } else {
        x.className = "topnav";
        document.getElementById('logoMenu').setAttribute('style', 'float:left !important');
    }
}

function fullHeightSectionOnMobile(element,maxWidth){

    if(screenWidth<=maxWidth){

        element.firstChild.className += " fullHeight";
        element.setAttribute('style', 'height:auto !important');

    }else{

        element.firstChild.className = element.firstChild.className.replace("fullHeight", "");

    }

}

function closeModal(id){

    document.getElementById("modalBackground").setAttribute('style', 'display:none !important');
    document.getElementById(id).setAttribute('style', 'display:none !important');

}

function showModal(id){

    document.getElementById("modalBackground").setAttribute('style', 'display:block !important');
    document.getElementById(id).setAttribute('style', 'display:block !important');

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
document.body.style.backgroundColor='#000';
fullHeightSectionOnMobile(document.getElementById("aboutSection"),768);