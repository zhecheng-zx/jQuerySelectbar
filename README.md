# jQuerySelectbar
jQuery的多级选择框插件
***
>参数 option  类型 Object   
  
    {  
      title:'请选择……',  //选择框的提示语  
      multiple: false,   //是否多选 默认单选  
      database:{  
        department:[],  //部门  
        employees: []   //人员  
      }  
      values:[]  //选中的值
    }
  
>获取select选中的值

    $(dom).selectbar('getSelectVal');

>设置给select赋值
    
    $("#selectbar1").selectbar('setSelectVal',[1001,1002]);
***
LOG: 
=== 
>times:2018-01-15 15:33  

    1、修复多个下拉框在同一个页面时出现串值的问题。  
    2、添加获取值的方法  
    3、添加设置值的方法（只支持初始化设置）

>times:2018-01-16 14:07  

    1、修改样式问题  
    2、修改单选、多选、设置值时，选中项计数问题。
>times:2018-01-16 15:13  

    1、修改单选获取值的问题

author: zx  
email: zhangxin1120289542@163.com
