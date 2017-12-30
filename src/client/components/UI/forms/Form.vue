<template>
    <form>
        <input name="test" type="text" placeholder="Placeholder">
        <input type="submit" value="Submit">
    </form>
</template>

<script>
    export default {
        name: "theform"
    }
</script>

<style scoped>
    input, textarea, select {
        border: 1px solid #111;
        padding: 0.5em;
        font-size: 15px;
        line-height: 1.2em;
        width: 80%;
        background: #444;
        color: #fff;
        font-family: helvetica, sans-serif;
        background: -webkit-gradient(linear, left top, left bottom, from(#222), to(#444));
        -webkit-appearance: none;
        -webkit-box-shadow: 1px 1px 1px #333;
    }
</style>