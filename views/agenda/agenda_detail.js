$(".percentile").each(function () {
    var id = 1; //TODO: make it work maybe using .attr
    var percentile = this.attr("value");
    set_percentile('selected_party_'+id, precentile);
    $('#party-highlight-'+id).click(function(){
        $('.party-'+id).toggleClass('highlight');
        $('#party-highlight-'+id).toggleClass('highlight');
        return false;
    });
});
