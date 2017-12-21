/**
* Created by BIT TECHNOLOGIES on 5/28/2017.
*/

<template>

    <SimpleHero url="/" cover="https://z.cash/theme/images/network-nodes.png" coverColor="f8f8f8" height="300px">

        <div slot="hero-content" style="text-align: center">

            <h1 class='fg-white' style="display: inline; font-size: 40px; font-weight: bold; text-transform: none; color: #W12428c; text-align: center; margin-bottom: 10px; padding-left: 0.5em; padding-right: 0.5em; ">Contact us!</h1>
            <br/> <br/> <br/>

            <div class="col-lg-8 col-lg-offset-2">
                <div class="ibox float-e-margins">
                    <div class="ibox-title">
                        <h5><strong>Contact Form </strong> Web Dollar</h5>
                    </div>
                    <div class="ibox-content">
                        <div class="row">
                            <div class="col-sm-7 b-r">
                                <form role="form">
                                    <div class="form-group"><label style="text-align: left">Email</label> <input placeholder="Enter email" class="form-control" type="email"></div>
                                    <div class="form-group"><label style="text-align: left">Message</label> <textarea rows="4" cols="50" placeholder="Text" class="form-control"></textarea></div>
                                    <div>
                                        <button class="btn btn-sm btn-primary pull-right m-t-n-xs" type="submit"><strong>Send Email</strong></button>
                                    </div>
                                </form>
                            </div>
                            <div class="col-sm-5">
                                <p class="text-center">
                                    <a href=""><i class="fa fa-envelope-open big-icon"></i></a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </div>

    </SimpleHero>

</template>


<script>

    import SimpleHero from './styles/Simple.hero.component.vue';

    export default{

        name: 'FooterHero',

        components: {
            'SimpleHero': SimpleHero,
        },

        params:{

        }

    }
</script>