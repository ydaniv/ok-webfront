define([
    'jquery',
    'eventbox',
    'mustache'
], function ($, Ebox) {
    var Mustache = window.Mustache;
    var app = {
        agendas : function (uri) {
            $.get(uri, function (data) {
                var template = $("#agenda-template").html();
                $("#agendas").html(Mustache.render(template, data));
                for (var i in data.agendas) {
                  var v=data.agendas[i];
                  $("#agenda-score-"+v.id).css('right', (v.score+100)/2+'%');
                  $("#agenda-bar-"+v.id).css('right', (v.min+100)/2+'%');
                  $("#agenda-bar-"+v.id).css('width', (v.max-v.min)/2+'%');
                  $("#agenda-bar-party"+v.id).css('right', (v.party_min+100)/2+'%');
                  $("#agenda-bar-party"+v.id).css('width', (v.party_max-v.party_min)/2+'%');
                }
            })
         }
    };
    return app;
});

