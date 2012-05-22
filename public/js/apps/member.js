define([
    'jquery',
    'eventbox',
    'datatables',
    'mustache'
], function ($, Ebox) {
    var Mustache = window.Mustache;
    var app = {
        memberTable: function (table) {
            $(table).dataTable({
                "oLanguage": { "sUrl": "txt/dataTables.txt"},
                "iDisplayLength": 999,
                "bLengthChange": false
                });
        },
        agendas : function (uri) {
            $.get(uri, function (data) {
                data.agendas.sort(function(x,y) { return y.score-x.score});
                var template = $("#agenda-template").html();
                $("#agendas").html(Mustache.render(template, data));
                for (var i in data.agendas) {
                  var v=data.agendas[i];
                  $("#agenda-score-"+v.id).css('right', (v.score+100-1)/2+'%');
                  $("#agenda-bar-"+v.id).css('right', (v.min+100)/2+'%');
                  $("#agenda-bar-"+v.id).css('width', (v.max-v.min+0.5)/2+'%');
                  $("#agenda-bar-party-"+v.id).css('right', (v.party_min+100)/2+'%');
                  $("#agenda-bar-party-"+v.id).css('width', (v.party_max-v.party_min+1)/2+'%');
                }
            })
         }
    };
    $('#member-nav').addClass('active');
    return app;
});

