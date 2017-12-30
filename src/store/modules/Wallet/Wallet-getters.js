export default{

    // items that should be currently displayed.
    // this Array may not be fully fetched.
    getWalletAddresses (state, getters) {
        return Object.keys(state.walletAddresses).map(function(key){return state.walletAddresses[key]});
    },


    getPrivateKey : (state => (wallet)=>{

        return Object.keys(state.walletAddresses).map(
            (key)=>{
                if (key === wallet || state.walletAddresses[key]===wallet || state.walletAddresses[key].address === wallet)
                    return state.walletAddresses[key]
            });

        return null;
    }),

}