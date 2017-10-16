require.config({
    baseUrl: 'resources/js',
    paths: {
        "jquery": "lib/bootstrap/js/jquery-2.1.4.min",
        "bootstrap": "lib/bootstrap/js/bootstrap.min",
        "domReady" : 'lib/domReady',
        "vue": "lib/vue/vue"
    },
    shim : {
        "bootstrap" : { "deps" :['jquery'] }
    },
    waitSeconds: 30
});

require(['jquery', 'domReady', 'vue'], function ($,domReady,vue) {
    domReady(function(){
        var app = new vue({
           el: '#app',
           data: {

           },
           methods: {

           }
        });
    })
});