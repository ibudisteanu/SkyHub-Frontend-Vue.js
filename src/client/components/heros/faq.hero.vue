<template>

    <div id="faqSection">

        <h1 class="alignCenter bigMarginTop">FAQ</h1>

        <collapse :selected="false">
            <div slot="collapse-header">
                1. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla mollis nisi quis quam luctus, ut.
            </div>
            <div slot="collapse-body">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </div>
        </collapse>

        <collapse :selected="false">
            <div slot="collapse-header">
                2. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer eu felis mauris. Duis est turpis.
            </div>
            <div slot="collapse-body">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </div>
        </collapse>

        <collapse :selected="false">
            <div slot="collapse-header">
                3. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce diam orci, viverra eget velit in.
            </div>
            <div slot="collapse-body">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </div>
        </collapse>

        <collapse :selected="false">
            <div slot="collapse-header">
                4. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum tincidunt vel dui in consequat. Etiam.
            </div>
            <div slot="collapse-body">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </div>
        </collapse>

        <collapse :selected="false">
            <div slot="collapse-header">
                5. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi ante augue, tincidunt et nunc vitae.
            </div>
            <div slot="collapse-body">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </div>
        </collapse>

        <collapse :selected="false">
            <div slot="collapse-header">
                6. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed feugiat consequat tincidunt. Integer vulputate erat.
            </div>
            <div slot="collapse-body">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </div>
        </collapse>

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