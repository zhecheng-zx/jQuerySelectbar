# jQuerySelectbar
jQuery的多级选择框插件
***
  参数 option  类型 Object   
  
    {  
      title:'请选择……',  //选择框的提示语  
      multiple: false,   //是否多选 默认单选  
      database:{  
        department:[],  //部门  
        employees: []   //人员  
      }  
      values:[]  //选中的值
    }
  
  获取select选中的值

    $(dom).selectbar('getSelectVal');

  设置给select赋值
    
    $("#selectbar1").selectbar('setSelectVal',[1001,1002]);
    

author: zx  
email: zhangxin1120289542@163.com