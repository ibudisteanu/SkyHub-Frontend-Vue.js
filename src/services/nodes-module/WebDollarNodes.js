/*
 TUTORIAL BASED on http://stackoverflow.com/questions/34298133/angular-2-cookies
 */


 class WebDollarNodes {

    constructor(){

        NodeWebDollar.NodeServer.startServer();
        NodeWebDollar.NodeClientsService.startService();

    }

    test(){
        console.log("########################");
        console.log(NodeWebDollar.NodeServer);
        console.log(NodeWebDollar.NodeClientsService);
    }

}


var WebDollarNodesInstance = new WebDollarNodes();
export default WebDollarNodesInstance;