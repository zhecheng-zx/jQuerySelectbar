/**
 * Created by zhangxin on 2018/1/13.
 */
;(function ($,win) {
    if(!$)return;

    var defaults = {
        title: '请选择……',
        database: {
            department:[],
            employees:[]
        },
        values: []
    };
    var Selectbar = function (element,option) {
        this.options = $.extend({},defaults,option);
        this.elem = $(element);
        this.title = options.title;
        this.className = 'selectbar';
        this.selectbarId = '#'+ this.elem.attr('id');
        this.multiple = options.multiple;
        this.val = Selectbar.prototype.val;
    };
    Selectbar.prototype = {
        constructor : Selectbar,
        init:function () {
            this.initSelectDatabaseDom();
            this.initDatabase();
            this.initSelectSelected();
            this.addEvent();
        },
        initDatabase : function () {
            this.select_item(-1);
        },
        select_item: function (first) {
            var _database = this.options.database||[],
                _html = '',
                _selectOption = '',
                _this = this;
                _this.newDatabase = _this.options.database.department.concat(_this.options.database.employees);
            if(_this.newDatabase&&_this.newDatabase.length>0){
                _this.newDatabase.forEach(function (item,index) {
                    if(item.parentId == first){
                        var selectItemDom = _this.selectItemDom(item);
                        _html+=selectItemDom;
                    }
                });
            }
            if(first==-1){
                /*
                * 初始化select
                * */
                if(_database.employees&&_database.employees.length>0){
                    _database.employees.forEach(function (item,index) {
                        var selectOptionDom = _this.selectOptionDom(item);
                        _selectOption+=selectOptionDom;
                    });
                }
                _this.elem.parent().find('select.form-control').empty().append(_selectOption);
            }
            _this.elem.parent().find('.tree-list .tree-content .list').empty().append(_html);
        },
        initSelectSelected:function () {
            var _this = this;
            _this.options.values.forEach(function (item,index) {
                _this.options.database.employees.forEach(function (it,ind) {
                    if(item == it.id){
                        _this.addSelected(item,it.name);
                    }
                });
            });
        },
        addEvent:function () {
            var _this = this,
                selectbar = this.elem.parent();
            selectbar.on("click",function (e) {
                selectbar.find('.vue-selector-input-wrap').show().css({top: selectbar.height()});
                $(document).one("click", function(){
                    if($(this).parents(_this.selectbarId).length<=0){
                        selectbar.find('.vue-selector-input-wrap').hide();
                    }
                });
                e.stopPropagation()
            });
            selectbar.on("click",'.select-item',function () {
                var $this = $(this),
                    item_name = $this.find('.item-name').text();
                    checkbox = $this.find(".item-status input");
                    ids = checkbox.val();
                if($this.find('.item-status').hasClass('departments')){
                    _this.select_item(ids);
                    _this.add_breadcrumb(ids,item_name)
                }else{
                    var arr=selectbar.find('.selector-input-list-wrap .selected-list .selected-item');
                    var flag = true;
                    arr.each(function (index,item) {
                        if( $(this).find('.item-name').attr('_id')==ids){
                            _this.removeSelected(ids);
                            flag =false;
                            return;
                        }
                    });
                    if(flag){
                        _this.addSelected(ids,item_name);
                    }
                }
            });
            selectbar.on("click",".tree-list .tree-nav .old-node",function () {
                var ids = '';
                if($(this).find(".nav-name").text().trim() == '全部'){
                    ids = -1;
                }else{
                    ids = $(this).find('.nav-name').attr('name');
                }
                $(this).removeClass('old-node').nextAll().remove();
                _this.select_item(ids);
            });
            selectbar.on('click','.selected-list>li .remove-item',function () {
                var ids = $(this).prev().attr('_id');
                _this.removeSelected(ids);
            });
            selectbar.on('keyup','.selector-search .search-input',function () {
                var testName = $(this).val();
                if(testName!=''&&testName!=null&&testName!=undefined){
                    var _html = '';
                    var newData = _this.newDatabase.filter(function (item) {
                        return item.name.indexOf(testName)>=0;
                    });
                    if(newData&& newData.length>0){
                        newData.forEach(function (item) {
                            var selectItemDom = _this.selectItemDom(item);
                            _html+=selectItemDom;
                        });
                    }else{
                        _html += '<p>没有找到数据！</p>'
                    }
                    $(this).next('.search-clear').show().one('click',function () {
                        $(this).hide().prev('input').val('');
                        _this.select_item(-1);
                    });
                    _this.elem.parent().find('.tree-list .tree-nav>li').eq(0).nextAll().remove();
                    _this.elem.parent().find('.tree-list .tree-content .list').empty().append(_html);
                }else{
                    _this.select_item(-1);
                }
            });
        },
        add_breadcrumb : function (ids,item_name) {
            var _this = this,
                selectbar = _this.elem.parent(),
                _breadcrumb = '';
            _breadcrumb += '<li class="nav-node"><div class="nav-name" name="'+ids+'"> '+item_name+' </div>';
            _breadcrumb += '<div class="nav-right nav-last">';
            _breadcrumb += '<svg version="1.1" role="presentation" width="8" height="16" viewBox="0 0 8 16" class="octicon">';
            _breadcrumb += '<path d="M7.5 8l-5 5L1 11.5 4.75 8 1 4.5 2.5 3z"></path>';
            _breadcrumb += '</svg>';
            _breadcrumb += '</div></li>';
            selectbar.find('.tree-list .tree-nav .nav-node').addClass("old-node");
            selectbar.find('.tree-list .tree-nav').append(_breadcrumb);
        },
        addSelected:function (ids,item_name) {
            var ids = ids,
                _this = this,
                selectbar = _this.elem.parent(),
                selected_item = "";
            selected_item += '<li><div class="selected-item">';
            selected_item += '<span class="item-name" _id="'+ids+'">'+item_name+'</span>';
            selected_item += '<span class="iconfont icon-cha remove-item"></span>';
            selected_item += '</div></li>';
            if(_this.multiple){
                selectbar.find('.selector-input-list-wrap .selected-list').append(selected_item);
            }else{
                selectbar.find('.selector-input-list-wrap .selected-list').empty().append(selected_item);
            }
            selectbar.find('.item-status input[value='+ids+']').prop('checked',true);
            _this.elem.find('option[value='+ids+']').attr('selected','selected');
            var flag = false;
            flag = _this.options.values.some(function (item) {
                return item === ids;
            });
            if(!flag){
                _this.options.values.push(ids);
            }

            $(".selector-input-list-wrap").find('.search-clear').show().one('click',function () {
                $(this).hide();
                selectbar.find('.selector-input-list-wrap .selected-list .selected-item').each(function (inde,ite) {
                    var idss = $(this).find('.item-name').attr('_id');
                    _this.removeSelected(idss);
                });
            });
            var select_num_ele = selectbar.find('.selected-num .selected--num'),
                select_num = parseInt(select_num_ele.text());
            select_num++;
            select_num_ele.text(select_num);
        },
        removeSelected:function (ids) {
            var ids = ids,
                selectbar=this.elem.parent();
            selectbar.find('.item-status input[value='+ids+']').prop('checked',false);
            selectbar.find('.selector-input-list-wrap .selected-list .selected-item .item-name[_id='+ids+']').parents("li").remove();
            this.elem.find('option[value='+ids+']').removeAttr('selected');
            this.options.values = this.options.values.filter(function (item) {
                return item !=ids;
            });
            var select_num_ele = selectbar.find('.selected-num .selected--num'),
                select_num = parseInt(select_num_ele.text());
            select_num--;
            select_num_ele.text(select_num);
        },
        selectOptionDom:function (database) {
            var _database = database,
                selectOption = '',
                flag = this.options.values.some(function (item) {
                    return item == _database.id;
                });
            if(flag){
                selectOption = '<option value="'+_database.id+'" selected="selected">'+_database.name+'</option>';
            }else{
                selectOption = '<option value="'+_database.id+'">'+_database.name+'</option>';
            }
            return selectOption;
        },
        isChildren:function (ids) {
            var _this = this,
                newArr = _this.options.database.department.concat(_this.options.database.employees);
            return newArr.some(function (item,index) {
                return item.parentId === ids;
            });
        },
        selectItemDom:function (item) {
            var gt = '',
                checkbox= '',
                flag = this.options.values.some(function (items) {
                    return items == item.id;
                });

            if(this.isChildren(item.id)){
                checkbox = '<div class="item-status departments"><div class="status-box"><input class="status" type="checkbox" value="'+item.id+'"></div></div>';
                gt = '<div class="item-group"><svg xmlns="http://www.w3.org/2000/svg" width="6" height="10" viewBox="0 0 6 10"><path fill="none" fill-rule="evenodd" stroke="#C3CBD9" stroke-linecap="round" stroke-linejoin="round" d="M1.322 9.16l4-4.16-4-4.16"></path></svg></div>';
            }else{
                gt = '';
                if(!this.multiple){
                    if(flag){
                        checkbox = '<div class="item-status"><div class="status-box"><input class="status" name="'+this.selectbarId+'" checked="checked" type="radio" value="'+item.id+'"></div></div>';
                    }else{
                        checkbox = '<div class="item-status"><div class="status-box"><input class="status" name="'+this.selectbarId+'" type="radio" value="'+item.id+'"></div></div>';
                    }
                }else{
                    if(flag) {
                        checkbox = '<div class="item-status"><div class="status-box"><input class="status" name="' + this.selectbarId + '" checked="checked" type="checkbox" value="' + item.id + '"></div></div>';
                    }else{
                        checkbox = '<div class="item-status"><div class="status-box"><input class="status" name="' + this.selectbarId + '" type="checkbox" value="' + item.id + '"></div></div>';
                    }
                }
            }
            var _html = '<li class="select-item">'+checkbox+'<div class="item-ell"><span title="'+item.id+'" class="item-name">'+item.name+'</span>'+gt+'</div></li>';
            return _html;
        },
        /**
         * 创建clear 按钮
         * @returns {Element}
         */
        searchClear:function () {
            var  $clear = document.createElement('span');
            $clear.className = 'search-clear';
            $clear.innerHTML = '<i class="iconfont icon-cha"></i>';
            return $clear;
        },
        initSelectDatabaseDom:function () {
            var wrapDom = document.createElement('div');
            var now = new Date().getTime();
            this.elem.hide().wrap(wrapDom).parent().addClass(this.className+" "+ now);
            if(this.multiple) this.elem.attr('multiple','multiple');
            var $selectBar_div = this.elem.parent(),
                $selector_input_list_wrap = $(document.createElement('div')),
                $btn_trigger = $(document.createElement('div')),
                $selectedVal = $(document.createElement('ul')),
                $triggerHtml = '<i class="iconfont icon-plus"></i><span class="trigger-text">'+this.title+'</span>';
            $btn_trigger.addClass('btn-trigger').append($triggerHtml);
            $selectedVal.addClass('selected-list');
            $selector_input_list_wrap.addClass('selector-input-list-wrap').addClass(this.elem.attr('class')).append([$selectedVal,$btn_trigger,this.searchClear()]);
            $selectBar_div.append([$selector_input_list_wrap,this.initSelectPanelWrapDom()]);
            $selectBar_div.find('.selector-search').append(this.searchClear());
        },
        initSelectPanelWrapDom: function () {
            var $vue_selector_input_wrap = document.createElement('div');
            $vue_selector_input_wrap.className = 'vue-selector-input-wrap';
            $vue_selector_input_wrap.appendChild(this.initSelectPanelDom());
            $vue_selector_input_wrap.appendChild(this.initSelectedCountDom());
            return $vue_selector_input_wrap;
        },
        initSelectPanelDom: function () {
            var $selector_panel = document.createElement('div');
            $selector_panel.className = 'selector-panel';
            var search_input = '<div class="selector-search"><span class="search-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><g fill="none" fill-rule="evenodd"><path data-v-501925db="" d="M0 0h16v16H0z"></path> <g transform="translate(1 1)"><circle cx="6" cy="6" r="5" stroke="#C3CBD9" stroke-width="2"></circle> <path fill="#C3CBD9" d="M9 10.414L10.414 9l2.952 2.952a.996.996 0 0 1-.002 1.412.995.995 0 0 1-1.412.002L9 10.414z"></path></g></g></svg></span><input placeholder="搜索" class="search-input" /></div>',
            switch_list_wrapper = '<div class="switch-list-wrapper"><div class="switch-content"><div class="tree-list"><div class="tree-nav-wrap"><ul class="tree-nav"><li class="nav-node"><div class="nav-name"> 全部 </div><div class="nav-right"><svg version="1.1" role="presentation" width="8" height="16" viewBox="0 0 8 16" class="octicon"><path d="M7.5 8l-5 5L1 11.5 4.75 8 1 4.5 2.5 3z"></path></svg></div></li></ul></div><div class="tree-content"><div class="scroll-list"><ul class="list"></ul></div></div></div></div></div>';
            $selector_panel.innerHTML = search_input+switch_list_wrapper;
            return $selector_panel;
        },
        /**
         * @param num
         * @returns {Element}
         */
        initSelectedCountDom : function (num) {
            var $selectedCount = document.createElement('div');
            $selectedCount.className = 'selected-num';
            $selectedCount.innerHTML = '<span class="selected--text">已选</span><span class="selected--num">'+(num ? num : 0)+'</span>';
            return $selectedCount;
        }
    };
    $.fn.selectbar = function (option) {
        return this.each(function () {
            var $this = this,
                plugins = new Selectbar($this,option);
            if(typeof option === 'object'||!option){
               plugins.init();
            }else{
                $.error('参数'+ option +'在jQuery.selectbar中无效！');
            }
        });
    };
})(jQuery,window);
/**
 * 获取select值
 * @param id
 * @returns {Array}
 */
function getSelectVal(id) {
    var i = 0;
    var val = [],
        $dom = $('#'+id);
    if($dom.attr("multiple")=='multiple'){
        $dom.find('option[selected=selected]').each(function (index,item) {
            var _va = $(this).val();
            val.push(_va);
        });
    }else{
        if($dom.val()!=null&&$dom.val()!=""&&$dom.val()!=undefined){
            val.push($dom.val());
        }
    }
    return val;
};