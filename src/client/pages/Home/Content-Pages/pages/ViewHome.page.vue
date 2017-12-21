/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/25/2017.
 * (C) BIT TECHNOLOGIES
 */

<template>

    <div>

        <WebDollarHero />
        <WhitePaperHero />
        <WhatIsWebDollarHero />
        <NetworkMapHero />
        <MiningHero />
        <TimelineHero />
        <WalletHero />

        <TeamHero />
        <CommunityHero />
<!--        <FooterHeaderCover /> -->

    </div>

</template>


<script>

    import HeaderHero from 'client/components/Template/Template-components/Heros/Header.hero.component.vue';
    import WebDollarHero from 'client/components/Template/Template-components/Heros/WebDollar.hero.component.vue';
    import WhitePaperHero from 'client/components/Template/Template-components/Heros/WhitePaper.hero.component.vue';
    import WalletHero from 'client/components/Template/Template-components/Heros/Wallet.hero.component.vue';
    import WhatIsWebDollarHero from 'client/components/Template/Template-components/Heros/WhatIsWebDollar.hero.component.vue';
    import FooterHero from 'client/components/Template/Template-components/Heros/Footer.hero.component.vue';
    import TeamHero from 'client/components/Template/Template-components/Heros/Team.hero.component.vue';
    import TimelineHero from 'client/components/Template/Template-components/Heros/Timeline.hero.component.vue';

    import MiningHero from 'client/components/Template/Template-components/Heros/mining/Mining.hero.component.vue';
    import NetworkMapHero from 'client/components/Template/Template-components/Heros/mining/NetworkMap.hero.component.vue';
    import CommunityHero from 'client/components/Template/Template-components/Heros/Community.hero.component.vue';

    export default{

        name: "ViewHome",

        components: {
            'HeaderHero': HeaderHero,
            'WebDollarHero': WebDollarHero,
            'WhitePaperHero': WhitePaperHero,
            'WalletHero': WalletHero,
            'WhatIsWebDollarHero': WhatIsWebDollarHero,
            'FooterHero': FooterHero,
            'TeamHero': TeamHero,
            'TimelineHero': TimelineHero,

            'MiningHero': MiningHero,
            'NetworkMapHero': NetworkMapHero,
            'CommunityHero': CommunityHero,
        },


    }
</script>