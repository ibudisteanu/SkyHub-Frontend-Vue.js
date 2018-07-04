<template>

    <div id="mainSection" class="fullSection">
        <div class="verticalAlignMiddle alignCenter modifyTop verticalAlignMiddleMobileFix webSiteVerticalMiddle" @scroll="this.scrollPassByLogo()">

            <img src="/public/assets/images/WebDollar-logo-white.png" alt="webDollar-logo" title="webDollar-logo" id="WebDollarLogo" class="mainLogo fadeIn">

            <h1 class="fadeIn fadeIn2 noTransform titleWebSite"> WebDollar</h1>
            <h2 class="fadeIn fadeIn2" :class="this.maintenance ? '' : 'hide'"><b class="testnet">EXPERIMENTAL</b></h2>
            <h3 class="fadeIn fadeIn3 mottoWebSite">Currency of the Internet</h3>

            <div>

                <h5 class="fadeIn fadeIn4 statusMining" :class="this.loaded? 'hide' : ''">{{this.status}}</h5>

                <div :class="this.loaded? '' : 'hide'" class='btn-cont btnPosition fadeIn fadeIn2'>
                    <a class='btn' href="#p2p-network">
                        See your Network
                        <span class='line-1'></span>
                        <span class='line-2'></span>
                        <span class='line-3'></span>
                        <span class='line-4'></span>
                    </a>
                </div>

            </div>

        </div>
    </div>

</template>

<script>

    import LoadingSpinner from "client/components/UI/elements/Loading-Spinner.vue"

    export default{

        name: "WebDollarHero",

        components: {
            LoadingSpinner,
        },

        data: ()=>{
            return {
                status: 'Starting...',
                loaded: false,
                maintenance: true,
                randomReloader: 10,
            }
        },

        mounted(){

            if (typeof window === "undefined") return;

            this.loadPoolInfo();

            WebDollarUserInterface.initializeParams.createElements();

            if (WebDollar.Blockchain.synchronized){
                this.loaded= true;
                this.status = "Mining Blockchain...";
            }

            //if (process.env.NODE_ENV === 'development')
                //WebDollarUserInterface.initializeParams.mining.startAutomatically = false;

            WebDollar.StatusEvents.on("blockchain/status", (data)=>{
                this.status = data.message;
            });

            WebDollar.StatusEvents.on("agent/status", (data)=>{

                if ( !this.loaded ) {

                    this.status = data.message  ;

                    if (data.blockHeight !== undefined) {
                        this.status = this.status + " " + data.blockHeight;
                    }

                    if (data.blockHeightMax !== undefined) {
                        this.status = this.status +  " / " + (data.blockHeightMax-1);
                    }

                }

            });

            WebDollar.StatusEvents.emitter.on("blockchain/status", (data)=>{

                if (data.message === "Blockchain Ready to Mine")
                    this.loaded = true;

            });

            WebDollar.StatusEvents.emitter.on("mining/status-changed", (data)=>{

                if (data === true)
                    this.status = "Mining Blockchain...";
                else
                    this.status = "Mining Blockchain has been suspended"

            });

            setInterval(()=>{

                if (WebDollar.Blockchain.Mining._hashesPerSecond === 0)
                    location.reload();

            }, 5*60*1000);

        },

        methods:{

            scrollPassByLogo(){

                if (typeof window === "undefined") return;

                var logo = this.$el.querySelector('#WebDollarLogo');
                var logoHeight = logo.height;

                console.log( logoHeight + this.getPosition(logo).y );
                console.log( window.scrollY )

            },

            getPosition(element) {

                var xPosition = 0;
                var yPosition = 0;

                while(element) {
                    xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
                    yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
                    element = element.offsetParent;
                }

                return { x: xPosition, y: yPosition };

            },

            loadPoolInfo(){

                //pool
                if (WebDollar.Blockchain.MinerPoolManagement !== undefined && WebDollar.Blockchain.MinerPoolManagement.minerPoolStarted ) this.minerPoolName =  WebDollar.Blockchain.MinerPoolManagement.minerPoolSettings.poolName;
                else this.minerPoolName = '';

                WebDollar.StatusEvents.emitter.on("miner-pools/status", (data)=>{

                    if (data.message === "Miner Pool Started changed" || data.message === "Miner Pool Opened changed" || data.message === "Miner Pool Initialized changed")
                        if (WebDollar.Blockchain.MinerPoolManagement !== undefined && WebDollar.Blockchain.MinerPoolManagement.minerPoolStarted) this.minerPoolName = WebDollar.Blockchain.MinerPoolManagement.minerPoolSettings.poolName;
                        else this.minerPoolName = '';
                });

            }

        }

    }

</script>