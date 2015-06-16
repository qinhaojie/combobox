(function ($) {

    //默认配置
    var config = {
        'activeClass': 'pn-click',
        'hoverClass': 'pn-hover',
        'disableClass': 'u-pn-disable',
        'textHolder': '.pn-on i',
        'toggle': '.pn-on',
        'item': '.pn-more p',
        'itemHolder': '.pn-more',
        'disabled':false,
        'visibleNumber':6,
        'itemTemplate': '<p data-value="{{value}}">{{text}}</p>',
        'warpTemplate': '<div class=\"u-pn fl\">' +
        '<span class=\"pn-on\">' +
        '<i></i><em class="ico-login i-pn-jt"></em></span>' +
        '<div class=\"pn-more\" style="display: none;"></div></div>'
    };

    var Combobox = function (element, options) {

        //jquery元素 dom为<select>
        this.el = $(element);

        this.options = $.extend({}, config, options);

        //生成的代替下拉框的dom结构
        this.target = null;

        //是否禁用下拉框
        this.disabled = false;

        this.init();
    };

    Combobox.prototype.init = function () {
        //默认隐藏原始下拉框
        this.el.hide();

        this.target = $(this.options.warpTemplate);

        this.el.after(this.target);

        //下拉框选项
        var initData = [];
        //初始选中文字
        var initText = $("option:selected", this.el).text();
        this.setText(initText);

        //获取最初元素的选项信息
        $("option", this.el).each(function () {
            initData.push({
                'value': $(this).val(),
                'text': $(this).text()
            });
        });
        this.setItems(initData);

        this.initEvent();

        //设置初始禁用状态
        this.disable(this.options.disabled);



    };


    /**
     * 初始化事件
     */
    Combobox.prototype.initEvent = function(){

        //触发元素上绑定的初始化事件
        this.el.trigger('init.combobox', [this.target, this]);

        //给生成的dom绑定事件
        this.target
            .on('click', this.options.item,
            $.proxy(this.itemClick, this))
            .on('click', this.options.toggle,
            $.proxy(this.toggle, this));

        //绑定元素的change事件，使之改变的时候将下拉框的信息改变
        this.el.on('change', $.proxy(function (e) {
            var text = $('option:selected', this.el).text();
            this.setText(text);
            this.target.data('value', this.el.val());
        }, this));
        //点击页面关闭当前处于展开状态的下拉框
        $(document).on('click', function () {
            var combobox = $('body').data('combobox-opened');
            if (combobox) {
                combobox.close();
            }
        });
    };

    /**
     * 切换显示状态
     * @returns {boolean}
     */
    Combobox.prototype.toggle = function () {

        //如果处于禁用状态则返回
        if (this.disabled) {
            return false;
        }

        if ($(this.options.itemHolder, this.target).is(':visible')) {
            this.close();
        } else {
            this.show();
        }
        return false;
    };

    /**
     * 关闭下拉框
     * @returns {boolean}
     */
    Combobox.prototype.close = function () {
        if (this.disabled) {
            return false;
        }

        var opts = this.options;
        var itemHolder = $(opts.itemHolder, this.target);

        $('body').data('combobox-opened', null);
        this.target.removeClass(opts.activeClass);
        itemHolder.hide();
        this.el.trigger('close.combobox', [this.target, this]);
        return true;
    };

    /**
     * 显示下拉框
     * @returns {boolean}
     */
    Combobox.prototype.show = function () {
        if (this.disabled) {
            return false;
        }
        var opts = this.options;
        var itemHolder = $(opts.itemHolder, this.target);

        // 先尝试关闭已展开的下拉框
        var current = $('body').data('combobox-opened');
        if (current) {
            current.close();
        }
        $('body').data('combobox-opened', this);
        this.target.addClass(opts.activeClass);
        itemHolder.show();
        this.el.trigger('show.combobox', [this.target, this]);
        return true;
    };

    /**
     * 下拉框选项点击事件
     * @param event
     * @returns {boolean}
     */
    Combobox.prototype.itemClick = function (event) {
        var item = $(event.target);
        var text = item.text();
        var value = item.data('value');
        var opts = this.options;
        
        this.el
            .val(value)
            .trigger('change', [this.target, this]);

        this.close();
        return false;

    };

    /**
     * 根据data渲染选项
     * @param data e.g. [{value:1,text:1},{value:2,text:2}]
     */
    Combobox.prototype.setItems = function (data) {
        var items = '';
        var options = '';

        var len = data.length;
        var i = 0;
        var itemTemplate = this.options.itemTemplate;

        while (i < len) {

            items += itemTemplate.replace('{{value}}', data[i]['value']).replace('{{text}}', data[i]['text']);

            options += '<option value="' + data[i]['value'] + '">' + data[i]['text'] + '</option>';
            i++;
        }
        this.target.find(this.options.itemHolder).html(items);
        this.el
            .html(options)
            .trigger('set.combobox', [this.target, this]);

        //重新渲染选项后设置下拉框显示文字
        var text = this.el.find('option:selected').html();
        this.setText(text);
        //重新设置下拉框value
        this.target.data('value', this.el.val());

        this.updateHeight();
    };

    /**
     * 根据配置的可见选项数量改变下拉内容的高度，在重新渲染选项后调用
     */
    Combobox.prototype.updateHeight = function(){
        var itemHolder = $(this.options.itemHolder,this.target);
        var item = $(this.options.item,this.target);
        var num = this.options.visibleNumber;
        var perHeight = item.height();
        if(num <= item.length){
            itemHolder.height(num * perHeight);
        }else{
            itemHolder.height(item.length * perHeight);
        }

    };

    /**
     * 设置下拉框显示文字
     * @param text
     */
    Combobox.prototype.setText = function (text) {
        $(this.options.textHolder, this.target).text(text);
    };

    /**
     * 是否禁用下拉框
     * @param disabled
     */
    Combobox.prototype.disable = function (disabled) {
        this.disabled = disabled;
        if (disabled) {
            this.target.addClass(this.options.disableClass);
        } else {
            this.target.removeClass(this.options.disableClass);
        }
    };

    $.fn.combobox = function (options) {

        var args = Array.prototype.slice.call(arguments, 1);

        return this.each(function (index, el) {
            var $this = $(this);
            var instance = $(this).data('combobox');
            if (!instance) {
                $this.data('combobox', new Combobox(this, options || {}));
            } else {

                instance[options].apply(instance, args);
            }
        });
    }
})(jQuery);