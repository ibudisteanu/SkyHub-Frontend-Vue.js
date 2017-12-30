export default class Wallet {

    constructor( data) {

        if (typeof data === "undefined") data = {};

        this.address = data.address || data.publicAddress|| '';
        this.publicKey = data.publicKey || '';
        this.privateKey = data.privateKey || '';
        this.amount = data.amount || 0.0;


        this.id = data.id||this.address||this.publicKey||'';
    }

}
