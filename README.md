# SkyHub Vue.js

# Online Versions:

1. myskyhub.ddns.net:8080 for Vue.js Frontend
2. myskyhub.ddns.net:4000 for Express Backend with Redis Database

**Gitter** - for communications with the SkyHub contributors:
 
1. https://gitter.im/SkyHub/SkyHubRomania 
2. https://gitter.im/SkyHub/Lobby

## 1 Installation

1. Install Node.js : https://nodejs.org/en/download/
2. gitclone repository https://github.com/ibudisteanu/SkyHub-Frontend-React.js.git . You can also install and clone using **Git Desktop**
3. run in cmd/terminal `npm install`
3. In case there are missing node_modules in the package.json, you need to install the missing node_modules using the command line `npm install missing-node-module-name --save` (in case there are missing modules )

4. Open cmd/Terminal 
    1.    `cd location\clone_repository\`
    
In case you have problems and encounter errors installing SkyHub, please contact us in the Gitter!!    
    
## Build Setup - Running SkyHub locally

**Requires Node.js 7+**

``` bash
# install dependencies
npm install # or yarn

# serve in dev mode, with hot reload at localhost:8080
npm run dev

# build for production
npm run build

# serve in production mode
npm start
```
##### intellij WebStorm

The "src" folder must be set as Resource Root. To do this Settings->Directories where you Set Directories "src" folder as "Resource Root"




# TO DOs

##### Working components


1. Login
2. Register
    2.1. Facebook & Google integration
3. REST
    3.1 Socket.io
        3.2 Cookie Authentication JWT (using tokens)
    3.2 HTTP requests   
5. Header Navigation Menu
6. Server Status Head Bar
7. Forums
    1. Preview Forums
    2. Preview Forum
    3. View Forum
    4. Add Forum 
    5. Vuex Store
8. Topics
    1. Preview Topics
    2. Preview Topic
    3. View Topic
    4. Add Topic
    5. Vuex Store 
9. Replies (part of)
    1. View Reply
    2. View Replies (All Replies)
    3. Add Reply
    4. Vuex Store
10. Attachments
    1. Image/Link Attachments
    2. Meta Scrapper (using Backend). It should scrape the content also on frontend too... to reduce the number of communications and work-load from the Backend
11. Voting
    1. View Vote
12. Notifications
    1. System Notifications (Notifications API)       
        1. Asking Permisions
        2. Vuex Store
        3. Sticky Button for asking permissions
    2. SkyHub Notifications
       

## To DOs

1. Topics   
    Edit Topics
    Delete Topics
2. Replies   
    Edit Replies
    Delete Replies
3. Voting
    Add Voting (Up and Downs)
    Unvote   
4. WebSock (SocketWorker) on the Server Side Rendering as a fetching mechanism instead of using http requests 


### Server Side Rendering component
https://github.com/egoist/vue-no-ssr

## License

CopyRight 2016-2017 by BIT TECHNOLOGIES RO
  htttp://bit-technologies.net
