/**
 * Created by zhangxin on 2018/1/13.
 */
(function ($) {
    'use strict';

    $.selectbar = function (element, options) {
        if(!(this instanceof $.selectbar)){
            return new $.selectbar(element, option);
        }
        var self = this;
        self.$container = $(element);
        self.$container.data('selectbar', self);
        self.init=function () {
            self.options = $.extend({},$.selectbar.defaultOptions,options);
            self.elem = element;
            self.selectbarId = '#'+ self.elem.attr('id');
            self.className = 'selectbar';
            self.initSelectDatabaseDom();
            self.initDatabase();
            self.initSelectSelected();
            self.addEvent();
        },
            self.initDatabase = function () {
                self.select_item(-1);
            };
        self.select_item= function (first) {
            var  _html = '';

            self.options.database.department.forEach(function (item,index) {
                if(item.parentId == first){
                    var selectItemDom = self.selectItemDom(item,true);
                    _html+=selectItemDom;
                }
            });

            self.options.database.employees.forEach(function (item,index) {
                if(item.parentId == first){
                    var selectItemDom = self.selectItemDom(item,false);
                    _html+=selectItemDom;
                }
            });


            self.elem.parent().find('.tree-list .tree-content .list').empty().append(_html);
        };
        self.initSelectSelected=function () {
            var _selectOption="";
            /*
             * 初始化select
             * */
            if(self.options.database.employees&&self.options.database.employees.length>0){
                self.options.database.employees.forEach(function (item,index) {
                    var selectOptionDom = self.selectOptionDom(item);
                    _selectOption+=selectOptionDom;
                });
            }
            self.elem.parent().find('select.form-control').empty().append(_selectOption);
            self.elem.parent().find('.selector-input-list-wrap .selected-list').empty();


            self.options.values.forEach(function (item,index) {
                self.options.database.employees.forEach(function (it,ind) {
                    if(item == it.id){
                        self.addSelected(item,it.name);
                    }
                });
            });
        };
        self.addEvent=function () {
            var selectbar = self.elem.parent();
            selectbar.on("click",function (e) {
                selectbar.find('.vue-selector-input-wrap').show().css({top: selectbar.height()});
                $(document).one("click", function(){
                    if($(this).parents(self.selectbarId).length<=0){
                        selectbar.find('.vue-selector-input-wrap').hide();
                    }
                });
                e.stopPropagation()
            });
            selectbar.on("click",'.select-item',function () {
                var $this = $(this),
                    item_name = $this.find('.item-name').text(),
                    checkbox = $this.find(".item-status input"),
                    ids = checkbox.val();
                if($this.find('.item-status').hasClass('departments')){
                    self.select_item(ids);
                    self.add_breadcrumb(ids,item_name)
                }else{
                    var arr=selectbar.find('.selector-input-list-wrap .selected-list .selected-item');
                    var flag = true;
                    arr.each(function (index,item) {
                        if( $(this).find('.item-name').attr('_id')==ids){
                            self.removeSelected(ids);
                            flag =false;
                            return;
                        }
                    });
                    if(flag){
                        self.addSelected(ids,item_name);
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
                self.select_item(ids);
            });
            selectbar.on('click','.selected-list>li .remove-item',function () {
                var ids = $(this).prev().attr('_id');
                self.removeSelected(ids);
            });
            selectbar.on('keyup','.selector-search .search-input',function () {
                var kwd = $(this).val();
                if(kwd!=''&&kwd!=null&&kwd!=undefined){
                    var _html = '';

                    var newdepartment = self.options.database.department.filter(function (item) {
                        return item.name.indexOf(kwd)>=0;
                    });
                    newdepartment.forEach(function (item,index) {
                        var selectItemDom = self.selectItemDom(item,true);
                        _html+=selectItemDom;
                    });

                    var newemployees = self.options.database.employees.filter(function (item) {
                        return item.name.indexOf(kwd)>=0;
                    });
                    newemployees.forEach(function (item,index) {
                        var selectItemDom = self.selectItemDom(item,false);
                        _html+=selectItemDom;
                    });
                    if(_html==""){
                        _html += '<p>没有找到数据！</p>'
                    }
                    $(this).next('.search-clear').show().one('click',function () {
                        $(this).hide().prev('input').val('');
                        self.select_item(-1);
                    });
                    self.elem.parent().find('.tree-list .tree-nav>li').eq(0).nextAll().remove();
                    self.elem.parent().find('.tree-list .tree-content .list').empty().append(_html);
                }else{
                    self.select_item(-1);
                }
            });
        };
        self.add_breadcrumb = function (ids,item_name) {
            var selectbar = self.elem.parent(),
                _breadcrumb = '';
            _breadcrumb += '<li class="nav-node"><div class="nav-name" name="'+ids+'"> '+item_name+' </div>';
            _breadcrumb += '<div class="nav-right nav-last">';
            _breadcrumb += '<svg version="1.1" role="presentation" width="8" height="16" viewBox="0 0 8 16" class="octicon">';
            _breadcrumb += '<path d="M7.5 8l-5 5L1 11.5 4.75 8 1 4.5 2.5 3z"></path>';
            _breadcrumb += '</svg>';
            _breadcrumb += '</div></li>';
            selectbar.find('.tree-list .tree-nav .nav-node').addClass("old-node");
            selectbar.find('.tree-list .tree-nav').append(_breadcrumb);
        };
        self.addSelected=function (ids,item_name) {
            var ids = ids,
                selectbar = self.elem.parent(),
                selected_item = "";
            selected_item += '<li><div class="selected-item">';
            selected_item += '<span class="item-name" _id="'+ids+'">'+item_name+'</span>';
            selected_item += '<span class="iconfont icon-cha remove-item"></span>';
            selected_item += '</div></li>';
            var select_num_ele = selectbar.find('.selected-num .selected--num'),
                select_num = parseInt(select_num_ele.text());

            var flag = false;
            flag = self.options.values.some(function (item) {
                return item === ids;
            });

            if(self.options.multiple){
                selectbar.find('.selector-input-list-wrap .selected-list').append(selected_item);
                self.elem.find('option[value='+ids+']').attr('selected','selected');
                select_num++;
                if(!flag){
                    self.options.values.push(ids);
                }
            }else{
                selectbar.find('.selector-input-list-wrap .selected-list').empty().append(selected_item);
                self.elem.find('option').removeAttr('selected');
                self.elem.find('option[value='+ids+']').attr('selected','selected');
                select_num = 1;
                self.options.values = [];
                self.options.values.push(ids);
            }
            selectbar.find('.item-status input[value='+ids+']').prop('checked',true);

            selectbar.find(".selector-input-list-wrap").find('.search-clear').show().one('click',function () {
                $(this).hide();
                selectbar.find('.selector-input-list-wrap .selected-list .selected-item').each(function (inde,ite) {
                    var id = $(this).find('.item-name').attr('_id');
                    self.removeSelected(id);
                });
            });
            select_num_ele.text(select_num);
        };
        self.removeSelected=function (id) {
            var selectbar=self.elem.parent();
            selectbar.find('.item-status input[value='+id+']').prop('checked',false);
            selectbar.find('.selector-input-list-wrap .selected-list .selected-item .item-name[_id='+id+']').parents("li").remove();
            self.elem.find('option[value='+id+']').removeAttr('selected');
            self.options.values = self.options.values.filter(function (item) {
                return item !=id;
            });
            var select_num_ele = selectbar.find('.selected-num .selected--num'),
                select_num = parseInt(select_num_ele.text());
            select_num--;
            select_num_ele.text(select_num);
        };
        self.selectOptionDom=function (database) {
            var _database = database,
                selectOption = '',
                flag = self.options.values.some(function (item) {
                    return item == _database.id;
                });
            if(flag){
                selectOption = '<option value="'+_database.id+'" selected="selected">'+_database.name+'</option>';
            }else{
                selectOption = '<option value="'+_database.id+'">'+_database.name+'</option>';
            }
            return selectOption;
        };

        self.selectItemDom=function (item,isDepartment) {
            var gt = '',
                checkbox= '',
                flag = self.options.values.some(function (items) {
                    return items == item.id;
                });
            if(isDepartment){
                checkbox = '<div class="item-status departments"><div class="status-box"><input class="status" type="checkbox" value="'+item.id+'"></div></div>';
                gt = '<div class="item-group"><svg xmlns="http://www.w3.org/2000/svg" width="6" height="10" viewBox="0 0 6 10"><path fill="none" fill-rule="evenodd" stroke="#C3CBD9" stroke-linecap="round" stroke-linejoin="round" d="M1.322 9.16l4-4.16-4-4.16"></path></svg></div>';
            }else{
                gt = '';
                if(!self.options.multiple){
                    if(flag){
                        checkbox = '<div class="item-status"><div class="status-box"><input class="status" name="'+self.selectbarId+'" checked="checked" type="radio" value="'+item.id+'"></div></div>';
                    }else{
                        checkbox = '<div class="item-status"><div class="status-box"><input class="status" name="'+self.selectbarId+'" type="radio" value="'+item.id+'"></div></div>';
                    }
                }else{
                    if(flag) {
                        checkbox = '<div class="item-status"><div class="status-box"><input class="status" name="' + self.selectbarId + '" checked="checked" type="checkbox" value="' + item.id + '"></div></div>';
                    }else{
                        checkbox = '<div class="item-status"><div class="status-box"><input class="status" name="' + self.selectbarId + '" type="checkbox" value="' + item.id + '"></div></div>';
                    }
                }
            }
            var _html = '<li class="select-item">'+checkbox+'<div class="item-ell"><span title="'+item.id+'" class="item-name">'+item.name+'</span>'+gt+'</div></li>';
            return _html;
        };
        /**
         * 创建clear 按钮
         * @returns {Element}
         */
        self.searchClear=function () {
            var  $clear = document.createElement('span');
            $clear.className = 'search-clear';
            $clear.innerHTML = '<i class="iconfont icon-cha"></i>';
            return $clear;
        };
        self.initSelectDatabaseDom=function () {
            var wrapDom = document.createElement('div');
            var now = new Date().getTime();
            self.elem.hide().wrap(wrapDom).parent().addClass(self.className+" "+ now);
            if(self.options.multiple) self.elem.attr('multiple','multiple');
            var $selectBar_div = self.elem.parent(),
                $selector_input_list_wrap = $(document.createElement('div')),
                $btn_trigger = $(document.createElement('div')),
                $selectedVal = $(document.createElement('ul')),
                $triggerHtml = '<i class="iconfont icon-plus"></i><span class="trigger-text">'+self.options.title+'</span>';
            $btn_trigger.addClass('btn-trigger').append($triggerHtml);
            $selectedVal.addClass('selected-list');
            $selector_input_list_wrap.addClass('selector-input-list-wrap').addClass(self.elem.attr('class')).append([$selectedVal,$btn_trigger,self.searchClear()]);
            $selectBar_div.append([$selector_input_list_wrap,self.initSelectPanelWrapDom()]);
            $selectBar_div.find('.selector-search').append(self.searchClear());
        };
        self.initSelectPanelWrapDom= function () {
            var $vue_selector_input_wrap = document.createElement('div');
            $vue_selector_input_wrap.className = 'vue-selector-input-wrap';
            $vue_selector_input_wrap.appendChild(self.initSelectPanelDom());
            $vue_selector_input_wrap.appendChild(self.initSelectedCountDom());
            return $vue_selector_input_wrap;
        };
        self.initSelectPanelDom= function () {
            var $selector_panel = document.createElement('div');
            $selector_panel.className = 'selector-panel';
            var search_input = '<div class="selector-search"><span class="search-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><g fill="none" fill-rule="evenodd"><path data-v-501925db="" d="M0 0h16v16H0z"></path> <g transform="translate(1 1)"><circle cx="6" cy="6" r="5" stroke="#C3CBD9" stroke-width="2"></circle> <path fill="#C3CBD9" d="M9 10.414L10.414 9l2.952 2.952a.996.996 0 0 1-.002 1.412.995.995 0 0 1-1.412.002L9 10.414z"></path></g></g></svg></span><input placeholder="搜索" class="search-input" /></div>',
                switch_list_wrapper = '<div class="switch-list-wrapper"><div class="switch-content"><div class="tree-list"><div class="tree-nav-wrap"><ul class="tree-nav"><li class="nav-node"><div class="nav-name"> 全部 </div><div class="nav-right"><svg version="1.1" role="presentation" width="8" height="16" viewBox="0 0 8 16" class="octicon"><path d="M7.5 8l-5 5L1 11.5 4.75 8 1 4.5 2.5 3z"></path></svg></div></li></ul></div><div class="tree-content"><div class="scroll-list"><ul class="list"></ul></div></div></div></div></div>';
            $selector_panel.innerHTML = search_input+switch_list_wrapper;
            return $selector_panel;
        };
        /**
         * @param num
         * @returns {Element}
         */
        self.initSelectedCountDom = function (num) {
            var $selectedCount = document.createElement('div');
            $selectedCount.className = 'selected-num';
            $selectedCount.innerHTML = '<span class="selected--text">已选</span><span class="selected--num">'+(num ? num : 0)+'</span>';
            return $selectedCount;
        };
        self.getSelectVal=function(){
            var result = [];
            $(self.elem).find('option[selected=selected]').each(function (index,item) {
                result.push($(this).val());
            });
            return result;
        };
        self.getSelectName=function(){
            var result = [];
            $(self.elem).find('option[selected=selected]').each(function (index,item) {
                result.push($(this).text());
            });
            return result;
        };
        self.setSelectVal=function(opts){
            var selectValues = [];
            if(!(opts instanceof Array)){
                selectValues.push(opts);
            }else{
                selectValues=opts;
            }
            self.options.values=selectValues;
            self.elem.parent().find('.selected-num .selected--num').text(0);
            self.initSelectSelected();
            return self;
        };

        self.callMethod = function (method, options) {
            switch (method) {
                case 'getSelectVal':
                    return self.getSelectVal();
                case 'getSelectName':
                    return self.getSelectName();
                case 'setSelectVal':
                    return self.setSelectVal(options);
                case 'destroy':
                    self.$container.empty();
                    self.$container.removeData('selectbar');
                    break;
                default :
                    throw new Error('[selectbar] method "' + method + '" does not exist');
            }

            return self.$container;
        };
        self.init();
        return self;
    };

    $.selectbar.defaultOptions = {
        title: '请选择……',
        database: {
            department:[],
            employees:[]
        },
        values: []
    };
    $.fn.selectbar = function () {
        var self = this,
            args = Array.prototype.slice.call(arguments);
        if(typeof args === undefined || args.length == 0){
            var $instance = $(self).data('selectbar');
            if (!$instance) {
                throw new Error('[selectbar] the element is not instantiated');
            } else {
                return $instance;
            }
        }
        if (typeof args[0] === 'string') {
            var $instance = $(self).data('selectbar');
            if (!$instance) {
                throw new Error('[selectbar] the element is not instantiated');
            } else {
                return $instance.callMethod(args[0], args[1]);
            }
        } else {
            return new $.selectbar(this, args[0]);
        }
    };
})(jQuery);
