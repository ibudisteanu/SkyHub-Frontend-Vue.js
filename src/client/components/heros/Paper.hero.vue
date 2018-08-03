<template>

    <div id="papers" class="fullSection">

        <div class="verticalAlignMiddle">

            <span class="pageTitle alignCenter bigMarginBottom">Papers</span>

            <div class="twoColums maxWidthSection specialMarginTop">

                <div>

                    <img class="paperImg" src="public/assets/images/black_paper.svg">
                    <h2>Black Paper</h2>

                    Short presentation of the cocept

                </div>

                <a href="/public/doc/WebDollar-White-Paper.pdf" target="_blank">

                    <img class="paperImg" src="public/assets/images/black_paper1.svg">
                    <h2>White Paper</h2>

                    Scientific presentation of the concept

                </a>

            </div>

        </div>

    </div>
</template>

<script>

    export default{

        name: "BlockchainDistribution",

    }

</script>

<style>

    .specialMarginTop{
        padding: 40px 0;
        text-align: center;
    }

    .paperImg{
        width: 140px;
        margin: 40px 0;
    }

</style>