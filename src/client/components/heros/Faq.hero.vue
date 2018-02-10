<template>

    <div id="faqSection">

        <h1 class="alignCenter bigMarginTop">FAQ</h1>

        <div class="faqContainer">

            <div class="faqSection">

                <collapse :selected="false">
                    <div slot="collapse-header">
                        What is WebDollar?
                    </div>
                    <div slot="collapse-body">
                        WebDollar is a cryptocurrency that can be mined with a click of a button in your browser.
                    </div>
                </collapse>

                <collapse :selected="false">
                    <div slot="collapse-header">
                        How was it created?
                    </div>
                    <div slot="collapse-body">
                        Using your available CPU power, you are  doing operations that validates and secures the transactions in the WebDollar network based on blockchain technology, this is called mining. Because you are using your hardware and electricity for mining,  you receive WebDollars (WEBD is the abbreviation) in exchange.
                    </div>
                </collapse>

                <collapse :selected="false">
                    <div slot="collapse-header">
                        What can I do with WebDollars?
                    </div>
                    <div slot="collapse-body">
                        The community around the opensource WebDollar project is currently building the ecosystem. WebDollar is aiming to be used as you are using any currency: paying for products online, trading goods, exchange for other currencies.
                    </div>
                </collapse>

                <collapse :selected="false">
                    <div slot="collapse-header">
                        What’s the value of WebDollar in USD?
                    </div>
                    <div slot="collapse-body">
                        The value is based on demand and supply on the market. WebDollars will be available on different exchanges after we launch of the Mainnet
                    </div>
                </collapse>

                <collapse :selected="false">
                    <div slot="collapse-header">
                        How can I get WebDollars?
                    </div>
                    <div slot="collapse-body">
                        1. You can mine directly in your browser.
                        2. You can invite others to mine for you (Here you have the documentation link).
                        3. Or you can buy from the exchanges.
                    </div>
                </collapse>

                <collapse :selected="false">
                    <div slot="collapse-header">
                        What are the risks of mining WebDollar in browser?
                    </div>
                    <div slot="collapse-body">
                        You will experience latency on your browser, especially if you increase the threads. We recommend using the level 1 thread while you are working on your PC, and increase it when you are away.
                        The battery of your device will drain faster.
                    </div>
                </collapse>

                <collapse :selected="false">
                    <div slot="collapse-header">
                        How much WEBD can I earn in 24 hours of mining?
                    </div>
                    <div slot="collapse-body">
                        # ToBeDiscussed more details
                    </div>
                </collapse>

            </div>

            <div class="faqSection">

                <collapse :selected="false">
                    <div slot="collapse-header">
                        Why is WebDollar different than other cryptocurrencies?
                    </div>
                    <div slot="collapse-body">
                        Is the easiest and fastest way to earn cryptocurrencies, you don’t need technical knowledge or dedicated hardware resources. WebDollar wants to make mining available for every laptop user, that’s why we implemented algorithms that makes mining with special hardware (so called GPU farms) unprofitable. Letting everybody to join this activity will increase significantly the worldwide adoption.
                    </div>
                </collapse>

                <collapse :selected="false">
                    <div slot="collapse-header">
                        What protocol is using WebDollar?
                    </div>
                    <div slot="collapse-body">
                        WebDollar is a p2p currency that is native to the internet significantly increasing the worldwide adoption in order to receive and send payments online. WebDollar protocol and blockchain was designed to be light and it doesn't require to install any additional software or plugin for wallet or mining. A mini-blockchain is downloaded directly in your browser, while your wallet is securely stored and encrypted directly on your computer. Full consensus is achieved in just a matter of seconds by using a novel PPoW - Proofs of Proof of Work algorithm to allow light nodes to check the balance validating transactions in seconds. Being native to the internet, WebDollar will enable miners to start their own mining pools with a click of a button. WebDollar will deploy also a semi-anonymous transactions solution to increase the privacy of transactions.
                    </div>
                </collapse>

                <collapse :selected="false">
                    <div slot="collapse-header">
                        How are the wallets secured?
                    </div>
                    <div slot="collapse-body">
                        #TBD
                    </div>
                </collapse>

                <collapse :selected="false">
                    <div slot="collapse-header">
                        Where are the wallets stored?
                    </div>
                    <div slot="collapse-body">
                        The Wallets are stored and managed securely only by the Browser by using the Indexed DB API. The location where the wallet is stored is different from one Browser to another.
                    </div>
                </collapse>

                <collapse :selected="false">
                    <div slot="collapse-header">
                        Can I use other wallets to store WEBD, for example Jaxx, NanoLedger, etc?
                    </div>
                    <div slot="collapse-body">
                        #TBD
                    </div>
                </collapse>

                <collapse :selected="false">
                    <div slot="collapse-header">
                        Does WebDollar supports smartcontracts?
                    </div>
                    <div slot="collapse-body">
                        Yes, in the near future WebDollar will incorporate a native smart contract system.
                    </div>
                </collapse>

                <collapse :selected="false">
                    <div slot="collapse-header">
                        Can I import an existing wallet in the browser?
                    </div>
                    <div slot="collapse-body">
                        Yes, the wallet is AES192B encrypted. You will be able to import and export your wallet from one browser to another one. The wallet is managed by the Browser not by WebDollar Protocol.
                    </div>
                </collapse>
            </div>

        </div>

    </div>
</template>

<script>

    import Collapse from './../../../../node_modules/vue-collapse'

    export default {
        name: "YourComponent",
        components: {
            Collapse
        }
    }
</script>