<template>

    <div id="browserError" class="verticalAlignMiddle">

        <h3>Ops! You can't mine on multiple tabs</h3>

        <h4>Please make sure you are not mining WEBD in other browser's tab.</h4>

        <img src="/public/assets/images/darkBrowser.png" alt="webDollar-browser" title="webDollar-browser" class="browserPng">

    </div>

</template>

<script>

    export default{

        name: 'multiTabs',

        data: () => {
            return {

            }
        }

    }

</script>

<style>

    #browserError h3{
        font-size: 30px;
        color: #c54444;
        line-height: 35px;
        text-align: center;
        text-transform: uppercase;
        width: 90%!important;
        margin: 0 auto;
        margin-bottom: 10px;
    }

    #browserError h4{
        text-align: center;
        color: #fec02c;
        font-size: 18px;
        width: 90%!important;
        margin: 0 auto;
        margin-bottom: 20px;
    }

    #browserError{
        position: absolute;
    }

    .browserPng{
        margin: 0 auto;
        display: block;
        max-width: 90%;
    }

</style>