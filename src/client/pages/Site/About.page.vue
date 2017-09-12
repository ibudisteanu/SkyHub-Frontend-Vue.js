/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/24/2017.
 * (C) BIT TECHNOLOGIES
 */


<template>

    <Layout>
        <div class="row" slot="layout-content" style="text-align: center">

            <div class="row" style="background-color: #5cd7ff">
                <h1><strong>About SkyHub</strong></h1>
                <p>
                    <strong>
                        SkyHub is a Forum Social Network that connects people in small communities and empowers users to change the world together!
                    </strong>
                </p>
            </div>

            <div class="row" style="background-color: white">

                <div class="col-lg-6 col-md-push-1">
                    <h2><strong>Contact SkyHub</strong></h2>
                    <ContactForm />
                </div>
                <div class="col-lg-5 col-md-push-1">
                    <h2><strong>Office Location</strong></h2> <br/>
                    <p class="lead">
                        <strong>SkyHub</strong><br> <br/>
                        BIT TECHNOLOGIES RO<br>
                        Bucharest<br>
                        Regie, Inginer Nicolae Teodorescu 40<br>
                        Romania, European Union<br>
                        Phone: <strong>+4 0770813203</strong><br>
                    </p>
                </div>
            </div>

            <div class="map_container">
                <div id="mapCanvas" >
                    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDcq4aUHrd-QNwu7yZqYU5-N1jc5AFXubQ"></script>
                </div>
            </div>


            <div class="row" >
                <h3>Other start-ups created by BIT TECHNOLOGIES</h3>
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
            "Layout": Layout,
            "ContactForm":ContactForm
        },


        /*
                SEO
         */

        title: 'About SkyHub Social Network',
        description: 'SkyHub is a disruptive new kind of social network that allows the people to connect and change the world together',


        mounted(){
            if (this.$isServer) return false;

            let map;

            $(window).resize(function () {
                let h = $(window).height(),
                    offsetTop = 105; // Calculate the top offset

                $('#mapCanvas').css('height', 500);
            }).resize();

            function googleMapsInitialize() {
                let location = new google.maps.LatLng(44.446956, 26.054788);
                let myOptions = {
                    zoom: 5,
                    center: new google.maps.LatLng(44.446956, 26.054788),
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };

                map = new google.maps.Map(document.getElementById("mapCanvas"),
                    myOptions);

                let contentString =
                    '<div id="content">'+
                        '<div id="siteNotice">'+
                        '</div>'+
                        '<h3 id="firstHeading" class="firstHeading" style="margin-top:0; text-align:center"><img src="/public/SkyHub-logo-square.png" alt="SkyHub Social Network" title="SkyHub"></h3>'+
                        '<div id="bodyContent">'+
                            '<p><b><?=WEBSITE_NAME?></b> is developed by <a href="http://bit-technologies.net/">BIT TECHNOLOGIES</a></b></p>'+
                            '<p><b><?=WEBSITE_NAME?></b> is based in <b>Ramnicu Valcea, Romania</b></p>'+
                            '<p>Regie, Inginer Nicolae Teodorescu 40, ROMANIA' +
                        '</p>'+
                    '</div>';

                let infowindow = new google.maps.InfoWindow({
                    content: contentString
                });

                let marker = new google.maps.Marker({
                    position: location,
                    map: map,
                    title: 'SkyHub'
                });
                marker.addListener('click', function() {
                    infowindow.open(map, marker);
                });

                infowindow.open(map, marker);

            }

            let center;
            function calculateCenter() {
                center = map.getCenter();
            }

            /*
            google.maps.event.addDomListener(map, 'idle', function() {
                calculateCenter();
            });
            google.maps.event.addDomListener(window, 'resize', function() {
                map.setPosition(location);
                //map.setCenter(center);
            });*/

            google.maps.event.addDomListener(window, "load", googleMapsInitialize);

        },

    }
</script>