require.config({
    baseUrl: '../resources/js',
    paths: {
        "jquery": "lib/bootstrap/js/jquery-2.1.4.min",
        "bootstrap": "lib/bootstrap/js/bootstrap.min",
        "domReady" : 'lib/domReady',
        "datatables.net": "lib/dataTables/js/jquery.dataTables.min",
        "DT-bootstrap": "lib/dataTables/js/dataTables.bootstrap.min",
        "jquery-loading": "lib/jqueryLoading/jquery.loading",
        "validate": "lib/jquery.validate.min",
        "jquery-confirm": "lib/confirm/jquery-confirm.min",
        "confirmModal": "lib/confirm/confirm-bootstrap",
        "vue": "lib/vue/vue"
    },
    shim : {
        "bootstrap" : { "deps" :['jquery'] },
        "jquery-dataTable" : { "deps" :['jquery'] },
        "dataTable-bootstrap" : { "deps" :['bootstrap'] },
        "jquery-confirm" : { "deps" :['jquery', 'bootstrap'] },
        "confirmModal" : { "deps" :['jquery'] }
    },
    waitSeconds: 30
});

require(['jquery', 'domReady', 'vue', 'validate',
    'datatables.net', 'DT-bootstrap', 'jquery-loading', 'bootstrap', 'jquery-confirm', 'confirmModal'], function ($,domReady,vue,validate) {
    domReady(function(){
        var app = new vue({
           el: '#app',
           data: {
               userInfo: [],
               userName: '',
               password: '',
               userType: 0,
               describe: '',
               noJoinGroup: [],
               joinedGroup: [],
               isShow: 'none',
               test: [],
               groupIndex: -1
           },
           methods: {
               addNewUser: function(){
                    $("#addUserForm").submit();
               },
               updateUser: function(){
                   $("#updateUserForm").submit();
               },
               upToAdmin: function(index){
                   $('.card-body').loading('toggle');
                   $.ajax({
                       type: 'POST',
                       url: 'upToAdmin',
                       data: {
                           userName: this.userInfo[index].userName
                       },
                       success: function(data){
                           $('.card-body').loading('toggle');
                           app.userInfo = data;
                           $.dialog({
                               title: '提示',
                               content: '操作成功！'
                           });
                       },
                       error: function(){
                           $('.card-body').loading('toggle');
                           $.dialog({
                               title: '提示',
                               content: '操作失败！'
                           });
                       }
                   });
               },
               addNewGroup: function(){
                   $("#addGroupModal").find(".modal-dialog").loading('toggle');
                   $(".loading-overlay").css("z-index", "100002");
                   $("#addGroupForm").submit();
               },
               getGroupInfo: function(index){
                   this.groupIndex = index;
                   this.joinedGroup = [];
                   this.noJoinGroup = [];
                   app.$nextTick(function(){
                       app.isShow = 'block';
                       var deferred1 = $.ajax({
                           type: 'POST',
                           url: 'getJoinedGroup',
                           data: {
                               userId: this.userInfo[index].userId
                           },
                           success: function(data){
                               app.isShow = 'none';
                               app.joinedGroup = data;
                           }
                       });

                       var deferred2 = $.ajax({
                           type: 'POST',
                           url: 'getNoJoinGroup',
                           data: {
                               userId: this.userInfo[index].userId
                           },
                           success: function(data){
                               app.isShow = 'none';
                               app.noJoinGroup = data;
                           }
                       });
                   });
               },
               changeGroup: function(groupName, type){
                   $("#groupManageModal").find(".modal-dialog").loading('toggle');
                   $(".loading-overlay").css("z-index", "100002");
                   if(type == 'joined'){
                       var url = 'deleteUserFromGroup';
                   }else if(type == 'noJoin'){
                       url = 'addUserToGroup';
                   }
                   $.ajax({
                       type: 'POST',
                       url: url,
                       data: {
                           userId: this.userInfo[this.groupIndex].userId,
                           groupName: groupName
                       },
                       success: function(data){
                           app.joinedGroup = data.joinedGroup;
                           app.noJoinGroup = data.noJoinGroup;
                           app.$nextTick(function(){
                               $("#groupManageModal").find(".modal-dialog").loading('toggle');
                           });
                       }
                   });
               }
           },
           mounted: function () {
               $('.card-body').loading('toggle');
               $.get("getAllUsersInfo",function(result){
                   console.log(result);
                   $('.card-body').loading('toggle');
                   app.userInfo = result;
                   app.$nextTick(function(){
                       $('.datatable').DataTable({
                           language: {
                               "sProcessing": "处理中...",
                               "sLengthMenu": "显示 _MENU_ 项结果",
                               "sZeroRecords": "没有匹配结果",
                               "sInfo": "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",
                               "sInfoEmpty": "显示第 0 至 0 项结果，共 0 项",
                               "sInfoFiltered": "(由 _MAX_ 项结果过滤)",
                               "sInfoPostFix": "",
                               "sSearch": "搜索:",
                               "sUrl": "",
                               "sEmptyTable": "表中数据为空",
                               "sLoadingRecords": "载入中...",
                               "sInfoThousands": ",",
                               "oPaginate": {
                                   "sFirst": "首页",
                                   "sPrevious": "上页",
                                   "sNext": "下页",
                                   "sLast": "末页"
                               },
                               "oAria": {
                                   "sSortAscending": ": 以升序排列此列",
                                   "sSortDescending": ": 以降序排列此列"
                               }
                           }
                       });
                   });
               });
               $("#addUserForm").validate({
                   errorElement : 'div',
                   errorClass : 'warning-block',
                   focusInvalid : true,
                   ignore : "",
                   rules : {
                       userName : {
                           required : true,
                           maxlength:30,
                           remote: {
                               url: 'checkUser',
                               type: 'POST',
                               dataType: 'json',
                               data: {
                                   userName: function() {
                                       return $("input[name='userName']").val();
                                   }
                               }
                           }
                       },
                       password : {
                           required : true,
                           minlength : 5
                       },
                       passwordRepeat : {
                           required : true,
                           minlength : 5,
                           equalTo : "#password"
                       },
                       userType : {
                           required : true
                       }
                   },
                   messages : {
                       userName : {
                           required : "用户名称为必填项",
                           maxlength: "最大长度为30个字符",
                           remote: "用户名已被占用"
                       },
                       password : {
                           required : "密码为必填项",
                           minlength : "密码长度不能小于5个字母"
                       },
                       passwordRepeat : {
                           required : "密码为必填项",
                           minlength : "密码长度不能小于5个字母",
                           equalTo: "两次密码输入不一致"
                       },
                       userType : {
                           required : "请选择一种用户类型"
                       }
                   },
                   submitHandler : function(form){
                       $("#addUserModal").find(".modal-dialog").loading('toggle');
                       $(".loading-overlay").css("z-index", "100002");
                       var deferred = $.ajax({
                           type: 'POST',
                           url: 'addNewUser',
                           data : $(form).serialize()
                       });
                       deferred.done(function(data){
                           $("#addUserModal").find(".modal-dialog").loading('toggle');
                           $(form)[0].reset();
                           app.userInfo = data;
                           $("#addUserModal").modal('toggle');
                       })
                   }
               });
               $("#updateUserForm").validate({
                   errorElement : 'div',
                   errorClass : 'warning-block',
                   focusInvalid : true,
                   ignore : "",
                   rules : {
                       oldPassword : {
                           required : true,
                           remote: {
                               url: 'checkPassword',
                               type: 'POST',
                               dataType: 'json',
                               data: {
                                   password: function() {
                                       return $("input[name='oldPassword']").val();
                                   }
                               }
                           }
                       },
                       newPassword : {
                           required : true,
                           minlength : 5
                       },
                       newPasswordRepeat : {
                           required : true,
                           minlength : 5,
                           equalTo : "#newPassword"
                       }
                   },
                   messages : {
                       oldPassword : {
                           required : "密码为必填项",
                           remote: "原密码不正确"
                       },
                       newPassword : {
                           required : "密码为必填项",
                           minlength : "密码长度不能小于5个字母"
                       },
                       newPasswordRepeat : {
                           required : "密码为必填项",
                           minlength : "密码长度不能小于5个字母",
                           equalTo: "两次密码输入不一致"
                       }
                   },
                   submitHandler : function(form){
                       $("#updateUserModal").find(".modal-dialog").loading('toggle');
                       $(".loading-overlay").css("z-index", "100002");
                       var deferred = $.ajax({
                           type: 'POST',
                           url: 'updateUser',
                           data : {
                               password: $("input[name='newPassword']").val()
                           }
                       });
                       deferred.done(function(data){
                           $("#updateUserModal").find(".modal-dialog").loading('toggle');
                           $(form)[0].reset();
                           $("#updateUserModal").modal('toggle');
                           top.window.location.href="../login";
                       });
                       deferred.fail(function(){
                           $("#updateUserModal").modal('toggle');
                           $.alert({
                               title: '提示',
                               content: '修改失败!'
                           });
                       })
                   }
               });
               $("#addGroupForm").validate({
                   errorElement : 'div',
                   errorClass : 'warning-block',
                   focusInvalid : true,
                   ignore : "",
                   rules : {
                       groupName : {
                           required : true,
                           remote: {
                               url: 'checkGroup',
                               type: 'POST',
                               dataType: 'json',
                               data: {
                                   groupName: function() {
                                       return $("input[name='groupName']").val();
                                   }
                               }
                           }
                       }
                   },
                   messages : {
                       groupName : {
                           required : "分组名为必填项",
                           remote: "此名称已被使用"
                       }
                   },
                   submitHandler : function(form){
                       var deferred = $.ajax({
                           type: 'POST',
                           url: 'addNewGroup',
                           data : $(form).serialize()
                       });
                       deferred.done(function(data){
                           $("#addGroupModal").find(".modal-dialog").loading('toggle');
                           $(form)[0].reset();
                           $("#addGroupModal").modal('toggle');
                           $.dialog({
                               title: '提示',
                               content: '添加成功!'
                           });
                       });
                       deferred.fail(function(){
                           $("#addGroupModal").modal('toggle');
                           $.dialog({
                               title: '提示',
                               content: '添加失败!'
                           });
                       })
                   }
               });
           }
        });
    })
});