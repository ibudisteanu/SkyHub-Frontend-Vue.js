/*
 TUTORIAL BASED on http://stackoverflow.com/questions/34298133/angular-2-cookies
 */


 class WebDollarNodes {

    constructor(){

        WebDollar.Node.NodeClientsService.startService();

    }

    test(){
        console.log(WebDollar.Node.NodeClientsService);
    }

}


var WebDollarNodesInstance = new WebDollarNodes();
export default WebDollarNodesInstance;