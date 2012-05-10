define([
    'jquery',
    'eventbox',
    'mustache'
], function ($, Ebox) {
    var Mustache = window.Mustache;
    var app = {
        agendas : function (uri) {
            $.get(uri, function (data) {
                var i;
                var template = $("#agenda-template").html();
                $("#agendas").html(Mustache.render(template, data));
            })
         }
    };
    return app;
});

