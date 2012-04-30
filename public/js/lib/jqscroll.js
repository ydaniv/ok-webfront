//TODO: respond to clicks on the scrollbar
//TODO: BIDI
//TODO: buttons
(function (root, factory) {
    if ( typeof define === 'function' && define.amd ) {
        define(['jquery'], function ($) {
            return factory($, root);
        });
    } else {
        factory(root.jQuery, root);
    }
}(this, function ($, _window) {
    var document = _window.document,
        defaults = {
            vertical    : true,
            horizontal  : false
        },
        Scroller = function ($element, options) {
            this.$instance = $element;
            this.dragging = false;
            this.hoverring = false;
            this.container_h = 0;
            this.container_w = 0;
            this.options = $.extend(true, {}, defaults, options);
        };
    Scroller.prototype = {
        constructor     : Scroller,
        init            : function () {
            if ( ! this.build() ) {
                this.$instance = null;
                return null;
            }
            this.setStyle();
            this.options.vertical && this.scrollerEvents(false);
            this.options.horizontal && this.scrollerEvents(true);
            this.$instance.data('scroller', {
                instance    : this,
                container   : this.$instance,
                vScroller   : this.$vScroller,
                hScroller   : this.$hScroller
            });
            return this;
        },
        build           : function () {
            this.$content = $(this.$instance[0].firstChild);
            this.container_h = this.options.height || this.$instance.height();
            this.container_w = this.options.width || this.$instance.width();
            this.setContentDims();
            if ( this.options.vertical && this.content_h > this.container_h ) {
                this.$instance.addClass('ui-scroller-container');
                this.$vScroller = $('<div/>', {
                    'class' : 'ui-v-scroller'
                }).appendTo(this.$instance);
                this.$vGrip = $('<span/>', {
                    'class' : 'ui-v-scroller-grip'
                }).appendTo(this.$vScroller);
                this.setGripSize(false);
                return true;
            }
            if ( this.options.horizontal && this.content_w > this.container_w ) {
                this.$instance.addClass('ui-scroller-container');
                this.$hScroller = $('<div/>', {
                    'class' : 'ui-h-scroller'
                }).appendTo(this.$instance);
                this.$hGrip = $('<span/>', {
                    'class' : 'ui-h-scroller-grip'
                }).appendTo(this.$hScroller);
                this.setGripSize(true);
                return true;
            }
            return false;
        },
        setStyle        : function () {
            var position = this.$instance.css('position'), _style = {};
            if ( !~'relative|absolute|fixed'.indexOf(position) ) {
                this.$instance.css('position', 'relative');
            }
            if ( this.options.horizontal ) {
                _style.overflowX = 'hidden';
            }
            if ( this.options.vertical ) {
                _style.overflowY = 'hidden';
            }
            this.$instance.css(_style);
            // make sure the content is positioned absolute
            this.$content.css('position', 'absolute');
        },
        setGripSize     : function (is_horizontal) {
            (is_horizontal ? this.$hGrip : this.$vGrip).css(
                is_horizontal ? 'width' : 'height',
                parseInt((is_horizontal ? this.container_w/this.content_w : this.container_h/this.content_h)*100, 10) + '%');
        },
        scrollerEvents  : function (horizontal) {
            var that = this,
                event_metric = horizontal ? 'pageX' : 'pageY',
                css_attr = horizontal ? 'left' : 'top',
                el_prefix = '$' + (horizontal ? 'h' : 'v'),
                _grip = el_prefix + 'Grip',
                _scroller = el_prefix + 'Scroller',
                dimension = horizontal ? 'width' : 'height',
                grip_size = this[_grip][dimension](),
                scroll_size = +(this[_scroller][dimension]() - grip_size),
                hidden_size = +(horizontal ? this.content_w - this.container_w : this.content_h - this.container_h),
                position = 0,
                drag_start_position = 0,
                old_grip_pos = 0,
                moveGrip = function (e) {
                    var delta = parseInt(e[event_metric] - drag_start_position, 10),
                        current_pos = old_grip_pos + delta;
                    position = current_pos;
                    if ( current_pos < 0 ) { current_pos = 0; }
                    if ( current_pos > scroll_size ) { current_pos = scroll_size; }
                    that[_grip].css(css_attr, current_pos);
                },
                scrollContainer = function (e) {
                    position = parseInt(hidden_size/scroll_size*position, 10);
                    if ( position < 0 ) { position = 0; }
                    if ( position > hidden_size ) { position = hidden_size; }
                    that.position = -position;
                    that.$content.css(css_attr, -position);
                },
                dragHandler = function (e) {
                    that.dragging = true;
                    moveGrip(e);
                    scrollContainer(e);
                },
                mouseLeaveHandler = function () {
                    if ( ! that.dragging ) {
                        that[_scroller].stop(true, true).animate({
                            opacity : 0.3
                        }, 200);
                    } else {
                        that.hoverring = false;
                    }
                },
                mouseUpHandler = function () {
                    that.dragging = false;
                    $(document).unbind('mousemove.scroller');
                    that[_grip] && that[_grip].bind('mouseleave.scroller', mouseLeaveHandler);
                    if ( ! that.hoverring ) {
                        mouseLeaveHandler();
                    }
                },
                mouseDownHandler = function (e) {
                    e.preventDefault();
                    drag_start_position = parseInt(e[event_metric], 10);
                    old_grip_pos = +that[_grip].css(css_attr).slice(0, -2);
                    that[_grip].unbind('mouseleave.scroller');
                    $(document).bind('mousemove.scroller', dragHandler)
                             .bind('mouseup.scroller', mouseUpHandler);
                },
                mouseEnterHandler = function () {
                    that.hoverring = true;
                    that[_scroller].animate({
                        opacity : 1
                    }, 200);
                };
            this[_scroller].bind('mouseenter.scroller', mouseEnterHandler)
                           .bind('mouseleave.scroller', mouseLeaveHandler);
            this[_grip].bind('mousedown.scroller', mouseDownHandler);
            // create a public API for scrolling to a position on the screen
            this.scrollTo = function (_pos) {
                var dummy = {};
                if ( ! this.inView(_pos) ) {
                    dummy[event_metric] = ~~(this.options.horizontal ? _pos[0].offsetLeft/this.content_w*this.container_w : _pos[0].offsetTop/this.content_h*this.container_h);
                    moveGrip(dummy);
                    scrollContainer(dummy);
                }
            };
        },
        setContentDims  : function () {
            var that = this,
                $children = this.$content.children(),
                $last = $children.eq(-1);
            this.content_h = 0;
            this.content_w = 0;
            if ( this.options.vertical && $last.length ) {
                this.content_h = $last[0].offsetTop + $last.outerHeight(true);
                this.content_h += (+this.$content.css('padding-top').slice(0, -2));
//                    (+this.$content.css('padding-bottom').slice(0, -2));
            } else {
                this.content_h = this.$content.outerHeight(true);
            }
            if ( this.options.horizontal ) {
                $children.each(function () {
                    that.content_w += $(this).outerWidth(true);
                });
                this.content_w += (+this.$content.css('padding-left').slice(0, -2));
//                    (+this.$content.css('padding-right').slice(0, -2));
            } else {
                this.content_w = this.$content.outerWidth(true);
            }
        },
        inView          : function (_pos) {
            var current_pos = this.position || 0,
                $el = _pos,
                step = 0,
                is_horizontal = this.options.horizontal;
            if ( $el.jquery && $el.length ) {
                if ( is_horizontal ) {
                    _pos = $el[0].offsetLeft;
                    step = $el.outerWidth(true);
                } else {
                    _pos = $el[0].offsetTop;
                    step = $el.outerHeight(true);
                }
            }
            return _pos > - current_pos &&
                   _pos + step < (is_horizontal ? this.container_w : this.container_h) - current_pos;
        },
        destroy         : function () {
            var reset_pos = {};
            this.$instance.removeData('scroller');
            if ( this.options.horizontal ) {
                reset_pos.left = 'auto';
            }
            if ( this.options.vertical ) {
                reset_pos.top = 'auto';
            }
            this.$content.css(reset_pos);
            for ( var k in this ) {
                if ( k.indexOf('$') === 0 ) {
                    if ( !~'$instance|$content'.indexOf(k) ) {
                        this[k].remove();
                    }
                    this[k] = null;
                }
            }
            return this;
        }
    };
    var methods = {
        init    : function (options) {
            var data = this.data('scroller');
            if ( ! data ) {
                var scroller = new Scroller(this, options);
                if ( ! scroller.init() ) {
                    scroller = null;
                }
            } else {
                methods.destroy.call(this);
                return methods.init.call(this, options);
            }
            return this;
        },
        destroy : function () {
            var data = this.data('scroller');
            if ( data && data.instance ) {
                data.instance.destroy();
            }
            $(document).unbind('.scroller');
            return this;
        },
        option  : function (name, value) {
            var data = this.data('scroller');
            if ( data && data.instance ) {
                data.instance.options[name] = value;
            }
            return this;
        },
        scrollTo: function (_pos) {
            var data = this.data('scroller'), instance;
            if ( data && data.instance ) {
                instance = data.instance;
                if ( _pos.nodeType == 1 ) {
                    _pos = $(_pos);
                }
                instance.scrollTo(_pos);
            }
            return this;
        }
    };
    $.fn.scroller = function (method) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.scroller' );
        }
    };
}));