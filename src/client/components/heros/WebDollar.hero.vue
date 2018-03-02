<template>

    <div id="mainSection" class="fullSection">
        <div class="verticalAlignMiddle alignCenter modifyTop verticalAlignMiddleMobileFix">

            <div id="globe"><canvas width="1045" height="1002"></canvas></div>

        </div>
    </div>

</template>

<script>

    import Countdown from 'vuejs-countdown';

    export default{

        name: "WebDollarHero",

        components: {
            "Countdown":Countdown
        },

        data: ()=>{
            return {
                status: 'Starting...',
                loaded: false,
                maintenance: false,
                mainNet: true
            }
        },

        mounted(){

            if (typeof window === "undefined") return;

            if (process.env.NODE_ENV === 'development')
                WebDollarUserInterface.initializeParams.mining.startAutomatically = false;

            WebDollar.StatusEvents.on("blockchain/status", (data)=>{

                this.status = data.message;

            });

            WebDollar.StatusEvents.emitter.on("blockchain/status", (data)=>{

                if (data.message === "Blockchain Ready to Mine") {

                    this.loaded = true;

                }

            });

        }

    }

    var globe,
        globeCount = 0;


    function createGlobe(){
        var newData = [];
        globeCount++;
        $("#globe canvas").remove();

        globe = new ENCOM.Globe(window.innerWidth, window.innerHeight, { tiles: grid.tiles });

        $("#globe").append(globe.domElement);
        globe.init(start);
    }

    function onWindowResize(){
        globe.camera.aspect = window.innerWidth / window.innerHeight;
        globe.camera.updateProjectionMatrix();
        globe.renderer.setSize(window.innerWidth, window.innerHeight);

    }

    function roundNumber(num){
        return Math.round(num * 100)/100;
    }

    function projectionToLatLng(width, height, x,y){

        return {
            lat: 90 - 180*(y/height),
            lon: 360*(x/width)- 180,
        };

    }

    function animate(){

        if(globe){
            globe.tick();
        }

        lastTickTime = Date.now();

        requestAnimationFrame(animate);
    }

    function start(){
        if(globeCount == 1){ // only do this for the first globe that's created. very messy
            animate();
        }
    }

    $(function() {
        var open = false;

        if(!Detector.webgl)
        {
            Detector.addGetWebGLMessage({parent: document.getElementById("container")});
            return;
        }

        window.addEventListener( 'resize', onWindowResize, false );

        var docHeight = $(document).height();

        /* Webgl stuff */
        createGlobe();

    });

</script>