require.config({
    baseUrl: 'resources/js',
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
                groups: [],
                updateGroupName: '',
                updateGroupDescride: '',
                updateGroupId: ''
            },
            methods: {
                deleteOneGroup: function(index){
                    $.confirm({
                        title: '警告!',
                        content: '确认删除此系统？',
                        buttons: {
                            '确认': function(){
                                $.ajax({
                                    type: 'POST',
                                    url: 'authority/deleteOneGroup',
                                    data: app.groups[index],
                                    success: function(data){
                                        app.groups = data;
                                        $.dialog({
                                            title: '提示',
                                            content: '操作成功！'
                                        });
                                    },
                                    error: function(){
                                        $.dialog({
                                            title: '提示',
                                            content: '操作失败！'
                                        });
                                    }
                                })
                            },
                            '取消': function(){}
                        }
                    });
                },
                addNewGroup: function(){
                    $("#addGroupForm").submit();
                },
                showUpdateModal: function(index){
                    this.updateGroupId = this.groups[index].groupId;
                    this.updateGroupName = this.groups[index].groupName;
                    this.updateGroupDescride = this.groups[index].descride;
                    $('#updateGroupModal').modal('show');
                },
                updateGroup: function(){
                    $("#updateGroupForm").submit();
                }
            },
            mounted: function(){
                $.ajax({
                    type: 'POST',
                    url: 'authority/getAllGroups'
                }).done(function(data){
                    app.groups = data;
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

                $("#addGroupForm").validate({
                    errorElement : 'div',
                    errorClass : 'warning-block',
                    focusInvalid : true,
                    ignore : "",
                    rules : {
                        groupName : {
                            required : true,
                            remote: {
                                url: 'authority/checkGroup',
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
                        $("#addGroupModal").find(".modal-dialog").loading('toggle');
                        $(".loading-overlay").css("z-index", "100002");
                        var deferred = $.ajax({
                            type: 'POST',
                            url: 'authority/addNewGroup',
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
                            app.groups = data;
                        });
                        deferred.fail(function(){
                            $("#addGroupModal").find(".modal-dialog").loading('toggle');
                            $("#addGroupModal").modal('toggle');
                            $.dialog({
                                title: '提示',
                                content: '添加失败!'
                            });
                        })
                    }
                });

                $("#updateGroupForm").validate({
                    errorElement : 'div',
                    errorClass : 'warning-block',
                    focusInvalid : true,
                    ignore : "",
                    rules : {
                        groupName : {
                            required : true,
                        }
                    },
                    messages : {
                        groupName : {
                            required : "分组名为必填项",
                            remote: "此名称已被使用"
                        }
                    },
                    submitHandler : function(form){
                        $("#updateGroupModal").find(".modal-dialog").loading('toggle');
                        $(".loading-overlay").css("z-index", "100002");
                        var deferred = $.ajax({
                            type: 'POST',
                            url: 'authority/updateGroup',
                            data : $(form).serialize()
                        });
                        deferred.done(function(data){
                            $("#updateGroupModal").find(".modal-dialog").loading('toggle');
                            $(form)[0].reset();
                            $("#updateGroupModal").modal('toggle');
                            app.groups = data;
                            $.dialog({
                                title: '提示',
                                content: '修改成功!'
                            });
                        });
                        deferred.fail(function(){
                            $("#updateGroupModal").find(".modal-dialog").loading('toggle');
                            $("#updateGroupModal").modal('toggle');
                            $.dialog({
                                title: '提示',
                                content: '修改失败!'
                            });
                        })
                    }
                });
            }
        })
    })
});