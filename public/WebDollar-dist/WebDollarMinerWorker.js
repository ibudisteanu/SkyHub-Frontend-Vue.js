var i = 0;

function timedCount() {

    i += 1 ;

    setTimeout("timedCount()",1);

}

function sendData(){
    postMessage(i);
    i=0;
}

timedCount();
setInterval("sendData()",500);