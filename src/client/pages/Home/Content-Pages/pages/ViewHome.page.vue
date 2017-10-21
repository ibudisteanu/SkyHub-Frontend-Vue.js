/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/25/2017.
 * (C) BIT TECHNOLOGIES
 */

<template>

    <div>

        <WebDollarHeaderCover />
        <WhitePaperHeaderCover />
        <WhatIsWebDollar />
        <WalletHeaderCover />
        <MiningHeaderCover />
        <FooterHeaderCover />

    </div>

</template>


<script>

    import HeaderCover from 'client/components/Template/Template-components/Header/Cover/HeaderCover.component.vue';
    import WebDollarHeaderCover from 'client/components/Template/Template-components/Header/Cover/WebDollarHeaderCover.component.vue';
    import WhitePaperHeaderCover from 'client/components/Template/Template-components/Header/Cover/WhitePaperHeaderCover.component.vue';
    import WalletHeaderCover from 'client/components/Template/Template-components/Header/Cover/WalletHeaderCover.component.vue';
    import WhatIsWebDollar from 'client/components/Template/Template-components/Header/Cover/WhatIsWebDollarCover.component.vue';
    import FooterHeaderCover from 'client/components/Template/Template-components/Header/Cover/FooterHeaderCover.component.vue';
    import MiningHeaderCover from 'client/components/Template/Template-components/Header/Cover/MiningHeaderCover.component.vue';

    export default{

        name: "ViewHome",

        components: {
            'HeaderCover': HeaderCover,
            'WebDollarHeaderCover': WebDollarHeaderCover,
            'WhitePaperHeaderCover': WhitePaperHeaderCover,
            'WalletHeaderCover': WalletHeaderCover,
            'WhatIsWebDollar': WhatIsWebDollar,
            'FooterHeaderCover': FooterHeaderCover,
            'MiningHeaderCover': MiningHeaderCover,
        },


    }
</script>