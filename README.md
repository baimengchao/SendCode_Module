## SendCode_Module
  移动端发送手机验证码封装模块
  
##功能配置及启用

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
    }
    
    sendCode.init(opt);
