/**
* Created by Alexandru Ionut Budisteanu

    inspired from:

    http://bestjquery.com/tutorial/timeline/demo16/


*/

<template>

    <div id="timelineSection">

        <h1 class='alignCenter bigMarginTop'>Timeline</h1> <br/> <br/>

        <div style="margin-bottom: 60px"> </div>

        <div class="row" id="timeline">
            <div class="col-md-12">
                <div class="main-timeline">
                    <div class="timeline">
                        <div class="timeline-icon"><i class="fa fa-pencil-square-o"></i></div>
                        <span class="year">10 OCT 2017</span>
                        <div class="timeline-content">
                            <h5 class="title">WHITE PAPER DRAFT</h5>
                            <p class="description">
                                An initial white paper was realized to describe the WebDollar protocol
                            </p>
                        </div>
                    </div>
                    <div class="timeline">
                        <div class="timeline-icon"><i class="fa fa-users"></i></div>
                        <span class="year">22 OCT 2017</span>
                        <div class="timeline-content">
                            <h5 class="title">TECH HUB JS HACKHTON</h5>
                            <p class="description">
                                An initial team was formed during the TechHub Bucharest JS HACKHTON to bootstrap and implement the vision behind WebDollar.
                            </p>
                        </div>
                    </div>
                    <div class="timeline">
                        <div class="timeline-icon"><i class="fa fa-connectdevelop"></i></div>
                        <span class="year">1 DEC 2017</span>
                        <div class="timeline-content">
                            <h5 class="title">P2P AND MINI-BLOCKCHAIN</h5>
                            <p class="description">
                                Our community started to develop and finalize P2P connections through Websockets and WebRTC. Implementation of Mini-blockchain
                            </p>
                        </div>
                    </div>
                    <div class="timeline">
                        <div class="timeline-icon"><i class="fa fa-flask"></i></div>
                        <span class="year">31 DEC 2017</span>
                        <div class="timeline-content">
                            <h5 class="title">LAUNCH BETA NET</h5>
                            <p class="description">
                                Developing and launching and consensus Proof of Work blockchain
                            </p>
                        </div>
                    </div>
                    <div class="timeline">
                        <div class="timeline-icon"><i class="fa fa-rocket"></i></div>
                        <span class="year">20 JAN 2018</span>
                        <div class="timeline-content">
                            <h5 class="title">SECURITY + LAUNCH MAIN NET</h5>
                            <p class="description">
                                Proofs of Proof of Work, Improving the Security and launching a Main Net
                            </p>
                        </div>
                    </div>
                    <div class="timeline">
                        <div class="timeline-icon"><i class="fa fa-btc"></i></div>
                        <span class="year">1 MAR 2018</span>
                        <div class="timeline-content">
                            <h5 class="title">ICO - INITIAL COIN OFFERING</h5>
                            <p class="description">
                                We plan to do an ICO - Initial Coin Offering by selling a big chunk of WebDollar genesis reward.
                            </p>
                        </div>
                    </div>
                    <div class="timeline">
                        <div class="timeline-icon"><i class="fa fa-rocket"></i></div>
                        <span class="year">15 MAY 2018</span>
                        <div class="timeline-content">
                            <h5 class="title">SMART CONTRACTS, ANONYMITY, EXCHANGE</h5>
                            <p class="description">
                                Developing a Smart Contracts Platform, anonymity, currency exchange
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>

</template>


<script>


    export default{

        name: 'CommunityHero',

        components: {

        },

        params:{

        }

    }
</script>

<style>
    .main-timeline{
        overflow: hidden;
        position: relative;
    }
    .main-timeline .timeline{
        width: 50%;
        float: left;
        z-index: 1;
        position: relative;
    }
    .main-timeline .timeline:before,
    .main-timeline .timeline:after{
        content: "";
        display: block;
        clear: both;
    }
    .main-timeline .timeline:before{
        content: "";
        width: 40px;
        height: 90%;
        background: #727cb6;
        position: absolute;
        top: 40%;
        right: -20px;
    }
    .main-timeline .timeline:last-child:before{ height: 0; }
    .main-timeline .timeline-icon{
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: #727cb6;
        overflow: hidden;
        text-align: center;
        position: absolute;
        top: 0;
        right: -40px;
        z-index: 3;
    }
    .main-timeline .timeline-icon:before{
        content: "";
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: #fff;
        border: 2px solid #727cb6;
        box-shadow: 0 0 0 4px #a5afe4;
        margin: auto;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
    }
    .main-timeline .timeline-icon i{
        font-size: 35px;
        color: #303a3b;
        line-height: 80px;
        z-index: 1;
        position: relative;
    }
    .main-timeline .year{
        display: block;
        padding: 0 60px 0 -20px;
        color: #ffc12c;
        text-align: right;
        border-bottom: 2px solid #545454;
        z-index: 2;
        position: relative;
        font-size: 20px;
    }
    .main-timeline .year:before{
        content: "";
        display: block;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: #727cb6;
        border: 5px solid #fff;
        box-shadow: 0 0 0 4px #727cb6;
        margin: auto;
        position: absolute;
        bottom: -15px;
        left: 4px;
    }
    .main-timeline .year:after{
        content: "";
        border-left: 10px solid #9cc0e4;
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
        position: absolute;
        bottom: -11px;
        left: 50px;
        display: none;
    }
    .main-timeline .timeline-content{
        padding: 18px 60px 18px 40px;
        text-align: right;
        position: relative;
        z-index: 1;
    }
    .main-timeline .timeline-content:before,
    .main-timeline .timeline-content:after{
        content: "";
        width: 80px;
        height: 150px;
        border-radius: 50%;
        background: #201f20;
        position: absolute;
        top: 0;
        right: 15px;
        z-index: -1;
    }
    .main-timeline .timeline-content:after{
        left: auto;
        right: -95px;
    }
    .main-timeline .timeline:last-child .timeline-content:before,
    .main-timeline .timeline:last-child .timeline-content:after{
        width: 0;
        height: 0;
    }
    .main-timeline .title{
        font-size: 22px;
        font-weight: bold;
        color: #727cb6;
        margin-top: 0;
    }
    .main-timeline .description{
        font-size: 15px;
        color: #b3b3b3;
        line-height: 25px;
    }
    .main-timeline .timeline:nth-child(2){ margin-top: 140px; }
    .main-timeline .timeline:nth-child(even){ margin-bottom: 80px; }
    .main-timeline .timeline:nth-child(odd){ margin: -110px 0 0 0; }
    .main-timeline .timeline:first-child,
    .main-timeline .timeline:last-child:nth-child(even){
        margin: 0 !important;
    }
    .main-timeline .timeline:nth-child(2n):before,
    .main-timeline .timeline:nth-child(2n) .timeline-icon{
        right: auto;
        left: -20px;
    }
    .main-timeline .timeline:nth-child(2n) .timeline-icon{ left: -40px }
    .main-timeline .timeline:nth-child(2n) .year{
        padding: 0 30px 0 0;
        text-align: left;
    }
    .main-timeline .timeline:nth-child(2n) .year:before{
        left: auto;
        right: 3px;
    }
    .main-timeline .timeline:nth-child(2n) .year:after{
        border-left: none;
        border-right: 10px solid #303a3b;
        right: 50px;
    }
    .main-timeline .timeline:nth-child(2n) .timeline-content{
        padding: 18px 40px 18px 60px;
        text-align: left;
    }
    .main-timeline .timeline:nth-child(2n) .timeline-content:before{ left: -95px; }
    .main-timeline .timeline:nth-child(2n) .timeline-content:after{ left: 15px; }
    .main-timeline .timeline:nth-child(2n):before,
    .main-timeline .timeline:nth-child(2n) .timeline-icon{ background: #e77e21; }
    .main-timeline .timeline:nth-child(2n) .timeline-icon:before{
        border-color: #e77e21;
        box-shadow: 0 0 0 4px #f1a563;
    }
    .main-timeline .timeline:nth-child(2n) .year:before{
        background: #e77e21;
        box-shadow: 0 0 0 4px #e77e21;
    }
    .main-timeline .timeline:nth-child(2n) .title{ color: #e77e21; }
    .main-timeline .timeline:nth-child(3n):before,
    .main-timeline .timeline:nth-child(3n) .timeline-icon{ background: #008b8b; }
    .main-timeline .timeline:nth-child(3n) .timeline-icon:before{
        border-color: #008b8b;
        box-shadow: 0 0 0 4px #50b5b4;
    }
    .main-timeline .timeline:nth-child(3n) .year:before{
        background: #008b8b;
        box-shadow: 0 0 0 4px #008b8b;
    }
    .main-timeline .timeline:nth-child(3n) .title{ color: #008b8b; }
    .main-timeline .timeline:nth-child(4n):before,
    .main-timeline .timeline:nth-child(4n) .timeline-icon{
        background: #ed687c;
    }
    .main-timeline .timeline:nth-child(4n) .timeline-icon:before{
        border-color: #ed687c;
        box-shadow: 0 0 0 4px #f798a8;
    }
    .main-timeline .timeline:nth-child(4n) .year:before{
        background: #ed687c;
        box-shadow: 0 0 0 4px #ed687c;
    }
    .main-timeline .timeline:nth-child(4n) .title{ color: #ed687c; }
    @media only screen and (max-width: 990px){
        .main-timeline .timeline{ width: 90%; }
        .main-timeline .timeline:nth-child(even),
        .main-timeline .timeline:nth-child(odd){
            margin: 0;
        }
        .main-timeline .timeline:before,
        .main-timeline .timeline:nth-child(2n):before{
            width: 30px;
            height: 100%;
            left: 25px;
        }
        .main-timeline .timeline-icon,
        .main-timeline .timeline:nth-child(2n) .timeline-icon{
            left: 0;
        }
        .main-timeline .year,
        .main-timeline .timeline:nth-child(2n) .year{
            text-align: left;
            padding: 0 30px 0 100px;
        }
        .main-timeline .year:before,
        .main-timeline .timeline:nth-child(2n) .year:before{
            left: auto;
            right: 4px;
        }
        .main-timeline .year:after{
            left: auto;
            right: 50px;
            border-right: 10px solid #303a3b;
            border-left: none;
        }
        .main-timeline .timeline-content,
        .main-timeline .timeline:nth-child(2n) .timeline-content{
            text-align: left;
            padding: 18px 40px 18px 100px;
        }
        .main-timeline .timeline-content:before,
        .main-timeline .timeline-content:after{
            width: 0;
            height: 0;
        }
    }
</style>