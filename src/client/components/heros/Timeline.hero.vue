
<template>

    <div id="timelineSection" >

        <span class='alignCenter pageTitle'>TIMELINE</span>
        <h3>Fast Development of WEBD Cryptocurrency</h3>

        <div id="timeline" class="backgroundSection">
        <div class="main-timeline">
                    <div class="timeline">
                        <div class="timeline-icon"><icon icon="document" :width="'48px'" :height="'48px'" /></div>
                        <span class="year">10 OCT 2017</span>
                        <div class="timeline-content">
                            <h5 class="title">WHITE PAPER DRAFT</h5>
                            <p class="description">
                                An initial white paper was realized to describe the WebDollar protocol
                            </p>
                        </div>
                    </div>
                    <div class="timeline">
                        <div class="timeline-icon"><icon icon="trophy" :width="'48px'" :height="'48px'" /></div>
                        <span class="year">22 OCT 2017</span>
                        <div class="timeline-content">
                            <h5 class="title">TECH HUB JS HACKATHON</h5>
                            <p class="description">
                                An initial team was formed during the JSHacks Blockchain Hackaton to bootstrap and implement the vision behind WebDollar
                            </p>
                        </div>
                    </div>
                    <div class="timeline">
                        <div class="timeline-icon"><icon icon="network" :width="'48px'" :height="'48px'" /></div>
                        <span class="year">DEC 2017</span>
                        <div class="timeline-content">
                            <h5 class="title">P2P AND MINI-BLOCKCHAIN</h5>
                            <p class="description">
                                Our community started to develop and finalize P2P connections through Websockets and WebRTC. Implementation of Mini-blockchain
                            </p>
                        </div>
                    </div>
                    <div class="timeline">
                        <div class="timeline-icon"><icon icon="flask" :width="'48px'" :height="'48px'" /></div>
                        <span class="year">IAN 2018</span>
                        <div class="timeline-content">
                            <h5 class="title">LAUNCH TEST NET</h5>
                            <p class="description">
                                Developing and launching and consensus Proof of Work blockchain
                            </p>
                        </div>
                    </div>
                    <div class="timeline timelineUnfinishedMilestones">
                        <div class="timeline-icon unfinishedMilestones"><icon icon="rocket" :width="'48px'" :height="'48px'" /></div>
                        <span class="year">TBA</span>
                        <div class="timeline-content">
                            <h5 class="title">SECURITY + LAUNCH MAIN NET</h5>
                            <p class="description">
                                Non-Interactive Proofs of Proof-of-Work, Improving the Security and launching a Main Net
                            </p>
                        </div>
                    </div>
                    <div class="timeline timelineUnfinishedMilestones">
                        <div class="timeline-icon unfinishedMilestones"><icon icon="gift" :width="'48px'" :height="'48px'" /></div>
                        <span class="year">JUNE-JULY 2018</span>
                        <div class="timeline-content">
                            <h5 class="title">SMART CONTRACTS, ANONYMITY, EXCHANGE</h5>
                            <p class="description">
                                Developing a Smart Contracts Platform, Anonymity, Currency Exchange, multisign with fingerprint / faceID
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>

</template>


<script>

    import Icon from "client/components/UI/elements/icon.vue";

    export default{

        name: 'CommunityHero',

        components: {
            Icon,
        },

        params:{

        }

    }
</script>