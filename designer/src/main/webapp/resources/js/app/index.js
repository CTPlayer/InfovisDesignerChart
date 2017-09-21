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
               userName: '',
               passWord: ''
               // currentView: 'login'
           },
           methods: {
               login: function(){
                   $.ajax({
                       type: "POST",
                       url: "login",
                       data:{
                           userName: this.userName,
                           password: this.passWord
                       },
                       async: false,
                       success: function(data) {
                           alert(JSON.stringify(data));
                           // console.log(data);
                       }
                   });
               }
               // changeView: function(){
               //      if(this.currentView == 'login'){
               //          this.currentView = 'register';
               //      }else if(this.currentView == 'register'){
               //          this.currentView = 'login';
               //      }
               // }
           }
        });
    })
});