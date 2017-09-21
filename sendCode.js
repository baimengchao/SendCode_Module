/*
    白梦超
    手机获取验证码模块
 */

var sendCode = {
    opt : {
        Element_phone: '.phone',    //手机号码输入框（input），class或id
        GetPass_button: '.button',  //获取验证码按钮，
        time_all: 60,   //每次计时的时间默认60s
        count: 3,   //设置发送多少次之后不再发送，默认3
        ClassOn: 'on', //按钮倒计时的样式（不能点击的样式）
        ClickAfterFunc: function(fn){ //点击获取验证码要执行的ajax
            $.ajax({
                url:'',
                type:'get',
                data: {

                },
                success: function(data){
                    fn(data);
                }
            });
        }
    },
    init : function(_opt){
        var _this = this;
        $.extend(_this.opt,_opt);

        //判断页面是否有弹层提示，没有就添加
        _this.Judgemask();

        //判断是否有loading，没有就添加
        _this.JudgeLoading();

        //设置点击次数
        _this.count = _this.opt.count;

        setTimeout(function(){
            //获取验证码按钮添加事件
            _this.AddClick();
        });
        
    },
    //判断页面是否有弹层提示，没有就添加
    Judgemask: function(){
        if ($('.js_dialog').length === 0){
            var str = '<div class="js_dialog" style="display: none;">'+
                        '<div class="weui-mask"></div>'+
                        '<div class="weui-dialog">'+
                            '<div class="weui-dialog__bd"></div>'+
                            '<div class="weui-dialog__ft">'+
                                '<a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_primary">知道了</a>'+
                            '</div>'+
                        '</div>'+
                    '</div>';
            $('body').append($(str));
        }

        //添加隐藏提示层方法
        $('.js_dialog .weui-dialog__btn_primary').click(function(){
            $('.js_dialog').css('display','none');
        });       
    },
    //判断是否有loading，没有就添加
    JudgeLoading: function(){
        if ($('#loadingToast').length === 0){
            var str = '<div id="loadingToast" style="display:none;">'+
                        '<div class="weui-mask_transparent"></div>'+
                        '<div class="weui-toast">'+
                            '<i class="weui-loading weui-icon_toast"></i>'+
                            '<p class="weui-toast__content" style="color: #fff;">数据加载中</p>'+
                        '</div>'+
                    '</div>';
            $('body').append($(str));
        }
    },
    //监听点击获取验证码按钮
    ListenGetPassClick: function(data){ 
        $('#loadingToast').css('display','none');
        return new Promise(function(resolve,reject){
            if (data.error == 'success' || data.error == 'SUCCESS'){
                resolve();
            }else {
                reject();
            }
        }).then(function(){
            //倒计时方法
            sendCode.CountTime();
        },function(){
            $('.js_dialog .weui-dialog__bd').html('验证码发送失败，请稍后再试');
            $('.js_dialog').css('display','block');
        });             
    },
    //倒计时方法
    CountTime: function(){
        var _this = this;
        var oBtn = $(_this.opt.GetPass_button);
        var seconds = _this.opt.time_all;
        //取消按钮点击事件
        _this.DeleteClick();
        oBtn.addClass(_this.opt.ClassOn);
        _this.count-=1;
        oBtn.html(seconds+'s后重新获取');
        _this.timer = setInterval(function(){
            seconds--;
            oBtn.html(seconds+'s后重新获取');     
            if (seconds === 0){
                clearInterval(_this.timer);
                oBtn.html('重新获取');
                if (_this.count){
                    //获取验证码按钮添加事件
                    _this.AddClick();
                    oBtn.removeClass(_this.opt.ClassOn);
                }else {
                    oBtn.html('验证码已发送');
                }             
            }
        },1000);
    },
    //获取验证码按钮添加事件
    AddClick: function(){
        var _this = this;
        $(_this.opt.GetPass_button).on('click',function(){
            //判断手机号是否合法
            var phone = $(_this.opt.Element_phone).val();
            var reg = /^1\d{10}$/;
            if (phone === ''){
                $('.js_dialog .weui-dialog__bd').html('请填写手机号码');
                $('.js_dialog').css('display','block');
                return ;
            }
            if (!
                reg.test(phone)){
                $('.js_dialog .weui-dialog__bd').html('手机号码不正确，请重新填写');
                $('.js_dialog').css('display','block');
                return ;
            }
            $('#loadingToast').css('display','block');
            _this.opt.ClickAfterFunc(_this.ListenGetPassClick);
        });
    },
    //取消按钮点击事件
    DeleteClick: function(){
        var _this = this;
        $(_this.opt.GetPass_button).off();
    }
};

