export default{

    // items that should be currently displayed.
    // this Array may not be fully fetched.
    getWallets (state, getters) {
        return Object.keys(state.walletAddresses).map(function(key){return state.walletAddresses[key]});
    },


    getPrivateKey : (state => (wallet)=>{

        if (typeof wallet=== 'object'){
            return userId;
            //not working...
            // if (userId !== null && userId instanceof User) return userId;
            // else return null;
        }

        if ((typeof userId === 'string')&&(typeof state.users[userId] !== 'undefined'))
            return state.users[userId];

        return null;
    }),

}