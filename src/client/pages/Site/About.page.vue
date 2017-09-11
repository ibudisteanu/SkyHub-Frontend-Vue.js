/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/24/2017.
 * (C) BIT TECHNOLOGIES
 */


<template>

    <Layout>
        <div slot="layout-content" style="text-align: center">

            <div>
                <h1>About SkyHub</h1>
                <p>
                    SkyHub is a Forum Social Network that connects people in small communities and empowers users to change the world together!
                </p>
            </div>

            <div style="background-color: lightblue; text-align: center">
                <h2>Contact SkyHub</h2>

                <ContactForm />

            </div>

            <div style="background-color: #1dc5a3; text-align: center" >
                <h2>Location of SkyHub</h2>
                <h3>SkyHub is a startup operated by BIT TECHNOLOGIES RO</h3>
            </div>


            <div>
                <h4>Other start-ups created by BIT TECHNOLOGIES</h4>
                <h5>AUTONOMIX</h5>
                <h5>VisionBot</h5>
                <h4>Other start-ups in partnership with BIT TECHNOLOGIES</h4>
                <h5>SaveEnergy - smart Sockets</h5>
            </div>


        </div>
    </Layout>

</template>

<script>

    import Layout from 'client/components/Template/Layout/Layout.vue'
    import ContactForm from './Contact/Contact.form.vue'

    export default {

        name: 'About',

        components: {
            Layout,
            ContactForm:'ContactForm'
        },


        /*
                SEO
         */

        title: 'About SkyHub Social Network',
        description: 'SkyHub is a disruptive new kind of social network that allows the people to connect and change the world together',

    }
</script>