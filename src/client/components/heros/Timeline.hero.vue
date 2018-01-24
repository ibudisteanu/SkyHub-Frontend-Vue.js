/**
* Created by Alexandru Ionut Budisteanu

    inspired from:

    http://bestjquery.com/tutorial/timeline/demo16/


*/

<template>

    <div id="timelineSection" >

        <h1 class='alignCenter'>TIMELINE</h1>
        <h3>Rapid Development of the WebDollar Cryptocurrency</h3>

        <div id="timeline" class="backgroundSection">
        <div class="main-timeline">
                    <div class="timeline">
                        <div class="timeline-icon"><i class="fa fa-file-text2"></i></div>
                        <span class="year">10 OCT 2017</span>
                        <div class="timeline-content">
                            <h5 class="title">WHITE PAPER DRAFT</h5>
                            <p class="description">
                                An initial white paper was realized to describe the WebDollar protocol
                            </p>
                        </div>
                    </div>
                    <div class="timeline">
                        <div class="timeline-icon"><i class="fa fa-trophy"></i></div>
                        <span class="year">22 OCT 2017</span>
                        <div class="timeline-content">
                            <h5 class="title">TECH HUB JS HACKATHON</h5>
                            <p class="description">
                                An initial team was formed during the JSHacks Blockchain Hackaton to bootstrap and implement the vision behind WebDollar
                            </p>
                        </div>
                    </div>
                    <div class="timeline">
                        <div class="timeline-icon"><i class="fa fa-network"></i></div>
                        <span class="year">DEC 2017</span>
                        <div class="timeline-content">
                            <h5 class="title">P2P AND MINI-BLOCKCHAIN</h5>
                            <p class="description">
                                Our community started to develop and finalize P2P connections through Websockets and WebRTC. Implementation of Mini-blockchain
                            </p>
                        </div>
                    </div>
                    <div class="timeline">
                        <div class="timeline-icon"><i class="fa fa-flask"></i></div>
                        <span class="year">IAN 2017</span>
                        <div class="timeline-content">
                            <h5 class="title">LAUNCH TEST NET</h5>
                            <p class="description">
                                Developing and launching and consensus Proof of Work blockchain
                            </p>
                        </div>
                    </div>
                    <div class="timeline timelineUnfinishedMilestones">
                        <div class="timeline-icon unfinishedMilestones"><i class="fa fa-rocket"></i></div>
                        <span class="year">SOON</span>
                        <div class="timeline-content">
                            <h5 class="title">SECURITY + LAUNCH MAIN NET</h5>
                            <p class="description">
                                Proofs of Proof of Work, Improving the Security and launching a Main Net
                            </p>
                        </div>
                    </div>
                    <div class="timeline timelineUnfinishedMilestones">
                        <div class="timeline-icon unfinishedMilestones"><i class="fa fa-pig"></i></div>
                        <span class="year">SOON</span>
                        <div class="timeline-content">
                            <h5 class="title">ICO - INITIAL COIN OFFERING</h5>
                            <p class="description">
                                We plan an ICO by offering WebDollar genesis rewards.
                            </p>
                        </div>
                    </div>
                    <div class="timeline timelineUnfinishedMilestones">
                        <div class="timeline-icon unfinishedMilestones"><i class="fa fa-gift"></i></div>
                        <span class="year">MAY-JUNE 2018</span>
                        <div class="timeline-content">
                            <h5 class="title">SMART CONTRACTS, ANONYMITY, EXCHANGE</h5>
                            <p class="description">
                                Developing a Smart Contracts Platform, Anonymity, Currency Exchange
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