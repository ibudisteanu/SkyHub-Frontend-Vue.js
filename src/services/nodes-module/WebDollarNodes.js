/*
 TUTORIAL BASED on http://stackoverflow.com/questions/34298133/angular-2-cookies
 */


 class WebDollarNodes {

    constructor(){

        global.window.NodeWebDollar.NodeServer.startServer();
        global.window.NodeWebDollar.NodeClientsService.startService();

    }

    test(){
        console.log("########################");
        console.log(global.window.NodeWebDollar.NodeServer);
        console.log(global.window.NodeWebDollar.NodeClientsService);
    }

}


var WebDollarNodesInstance = new WebDollarNodes();
export default WebDollarNodesInstance;