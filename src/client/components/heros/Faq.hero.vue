<template>

    <div id="faqSection">

        <span class="alignCenter bigMarginTop pageTitle">FAQ</span>

        <div class="faqContainer">

            <div class="faqSection">

                <collapse :selected="false">
                    <div slot="collapse-header">
                        What is WebDollar?
                    </div>
                    <div slot="collapse-body">
                        WebDollar is a browser digital currency that can be mined in your browser with a click of a button.
                    </div>
                </collapse>

                <collapse :selected="false">
                    <div slot="collapse-header">
                        What Test Net means?
                    </div>
                    <div slot="collapse-body">
                        Test Net means a fully functional and real network before the official launch, specifically to test and improve the security of the main network, before the official launch.
                    </div>
                </collapse>

                <collapse :selected="false">
                    <div slot="collapse-header">
                        How was it created?
                    </div>
                    <div slot="collapse-body">
                        Using your available CPU power, you are performing operations that validate and secure transactions in the WebDollar network based on blockchain technology. This is called mining. Because you are using your hardware and electricity for mining, you receive WebDollars (WEBD is the abbreviation) in exchange.
                    </div>
                </collapse>

                <collapse :selected="false">
                    <div slot="collapse-header">
                        What can I do with WebDollars?
                    </div>
                    <div slot="collapse-body">
                        The community around the open source WebDollar project is currently building the ecosystem. WebDollar is meant to be used as you use any currency: paying for products online, trading for goods, exchanging for other currencies.  In addition, WebDollar can be used for cross border payments with no currency exchange fees.
                    </div>
                </collapse>

                <collapse :selected="false">
                    <div slot="collapse-header">
                        What’s the value of WebDollar in USD?
                    </div>
                    <div slot="collapse-body">
                        The value is based on demand and supply on the market. WEBD will be available on various exchanges after we launch the Mainnet
                    </div>
                </collapse>

                <collapse :selected="false">
                    <div slot="collapse-header">
                        How can I get WebDollars?
                    </div>
                    <div slot="collapse-body">
                        1. You can mine directly in your browser.
                        2. You can invite others to mine for you (Here is the documentation link).
                        3. Or you can buy from the exchanges.
                    </div>
                </collapse>

                <collapse :selected="false">
                    <div slot="collapse-header">
                        What are the risks of mining WebDollar in browser?
                    </div>
                    <div slot="collapse-body">
                        You will experience latency on your browser, especially if you increase the threads. We recommend using the level 1 thread while you are working on your PC, and increase it when you are away. The battery of your device will drain more quickly.
                    </div>
                </collapse>

                <collapse :selected="false">
                    <div slot="collapse-header">
                        How much WEBD can I earn in 24 hours of mining?
                    </div>
                    <div slot="collapse-body">
                        The amount of WEBD you can mine in 24 hours is solely based on the computational power of your devices. WebDollar uses NiPoPoW, and it is a computation competition.
                    </div>
                </collapse>

            </div>

            <div class="faqSection">

                <collapse :selected="false">
                    <div slot="collapse-header">
                        Why is WebDollar different than other cryptocurrencies?
                    </div>
                    <div slot="collapse-body">
                        WebDollar is the easiest and fastest way to earn cryptocurrencies. You don’t need technical knowledge or dedicated hardware resources. WebDollar wants to make mining available for every laptop user, which is why we implemented algorithms that make mining with special hardware (so called GPU farms), unprofitable. Giving everyone the opportunity to mine and take part in the new world of cryptocurrency.
                    </div>
                </collapse>

                <collapse :selected="false">
                    <div slot="collapse-header">
                        What protocol is using WebDollar?
                    </div>
                    <div slot="collapse-body">
                        WebDollar is a p2p currency that is native to the internet. The WebDollar protocol and blockchain were designed to be light and not require the installation of any additional software or plugins for wallets or mining. A mini-blockchain is downloaded directly in your browser, while your wallet is securely stored and encrypted directly on your computer. Full consensus is achieved in a matter of seconds by using a novel PPoW - Proofs of Proof of Work algorithm to allow light nodes to check the balance validating transactions in seconds. Being native to the internet, WebDollar will enable miners to start their own mining pools with a click of a button. WebDollar will also deploy a semi-anonymous transaction solution to increase the privacy of transactions.
                    </div>
                </collapse>

                <collapse :selected="false">
                    <div slot="collapse-header">
                        How are the wallets secured?
                    </div>
                    <div slot="collapse-body">
                        The wallets are stored directly in your browser. Your browser is the only one that is storing your wallet. NOTE: Like with any coin or token, if you lose your wallet, your WebDollars will be locked for ever. The wallets are also encrypted with AES-192 like in Bitcoin, requiring a 12-word password
                    </div>
                </collapse>

                <collapse :selected="false">
                    <div slot="collapse-header">
                        Where are the wallets stored?
                    </div>
                    <div slot="collapse-body">
                        The Wallets are stored and managed securely by the Browser by using the Indexed DB API. The location where the wallet is stored differs from one Browser to another.
                    </div>
                </collapse>

                <collapse :selected="false">
                    <div slot="collapse-header">
                        Can I use other wallets to store WEBD, for example NanoLedger, etc?
                    </div>
                    <div slot="collapse-body">
                        Yes! Now, you can download your wallet and store on an external device and when it is required to make a Transaction, you can import or sign the transaction with the wallet from the stored device. In time, WebDollar will be also integrated with other ledgers.
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