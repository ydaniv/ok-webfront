define([
    'jquery',
    'uijet_dir/uijet',
    'eventbox',
    'mustache'
], function ($, uijet, Ebox) {
    var _window = window,
        Mustache = _window.Mustache,
        app;

    app = {
        init    : function (options) {
            uijet.init({
                engine              : function () {
                    return Mustache.to_html(this.template, this.data || this.context, this.options.partials);
                },
                methods_context     : this,
                methods         : {
                    publish     : Ebox.notify,
                    subscribe   : Ebox.listen,
                    unsubscribe : Ebox.unlisten
                },
                TEMPLATES_PATH      : '/views/agenda/',
                TEMPLATES_EXTENSION : 'html',
                widgets             : [{
                    type    : 'Pane',
                    config  : {
                        element     : '#agenda',
                        app_events: {
                            startup : function () {
                                this.wake();
                            }
                        }
                    }
                }, {
                    type    : 'List',
                    config  : {
                        element     : '#members_head',
                        horizontal  : true
                    }
                }, {
                    type    : 'List',
                    config  : {
                        element : '#members',
                        mixins  : ['Scrolled'],
                        adapters: ['jqScroll'],
                        style   : {
                            height : '60%'
                        }
                    }
                }]
            });
        }
    };

    return app;
});