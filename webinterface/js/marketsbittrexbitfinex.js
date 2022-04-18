var wsHost = "127.0.0.1";
var socket = null;
var isopen = false;
var totalProfit = 0;
var session;
var orderBy = "";
var hideZero = false;
var playing = true;
var showUSD = false;
var showBTC = false;

connection = new autobahn.Connection({
    url: "ws://" + wsHost + ":8087",
    realm: "dataGateway"
});

connection.onopen = function(event) {
    var row = "";
    session = event;

    event.subscribe("commonpairsbittrexbitfinex", commonPairs);

    function compareVolHitbtc(a,b) {
        if (a.fmVol < b.fmVol)
          return 1;
        if (a.fmVol > b.fmVol)
          return -1;
        return 0;
    }

    function compareVolBittrex(a,b) {
        if (a.smVol < b.smVol)
          return 1;
        if (a.smVol > b.smVol)
          return -1;
        return 0;
    }

    function compareProfit(a,b) {
        if (a.lost < b.lost)
          return 1;
        if (a.lost > b.lost)
          return -1;
        return 0;
    }

    function commonPairs(args){
        if (args.length>0 && playing){
            $("#container").empty();

            if (orderBy == "hitbtc") {
                args.sort(compareVolHitbtc);
            } else if (orderBy == "bittrex") {
                args.sort(compareVolBittrex);
            } else if (orderBy == "profit") {
                args.sort(compareProfit);
            }

            for (var i in args) {
                row = "";
                if ((args[i].pair.indexOf("usd") != -1) && showUSD)
                row += '<div class="row" id="xyz' + i + '" style="background-color: #89ABCD;">';
                else if ((args[i].pair.indexOf("btc") != -1) && showBTC)
                row += '<div class="row" id="xyz' + i + '" style="background-color: #ABCDEF;">';
                else row += '<div class="row" id="xyz' + i + '">';
                row += '    <div class="col-md-1">' + args[i].pair + '</div>';
                row += '    <div class="col-md-4">';
                row += '        <div class="row">';
                row += '            <div class="col-md-4" style="font-size: 12px;">' + args[i].fmAsk + '</div>';
                row += '            <div class="col-md-4" style="font-size: 12px;">' + args[i].fmBid + '</div>';
                row += '            <div class="col-md-4" style="font-size: 12px;">' + args[i].fmVol.toFixed(5) + '</div>';
                row += '        </div>';
                row += '    </div>';
                row += '    <div class="col-md-4">';
                row += '        <div class="row">';
                row += '            <div class="col-md-4" style="font-size: 12px;">' + args[i].smAsk + '</div>';
                row += '            <div class="col-md-4" style="font-size: 12px;">' + args[i].smBid + '</div>';
                row += '            <div class="col-md-4" style="font-size: 12px;">' + args[i].smVol.toFixed(5) + '</div>';
                row += '        </div>';
                row += '    </div>';
                row += '    <div class="col-md-1" style="font-size: 12px;">' + args[i].lost.toFixed(3) + ' %</div>';
                row += '    <div class="col-md-2" style="font-size: 12px; text-align: right;">' + args[i].transfercost.toFixed(3) + ' %</div>';
                row += '</div>';

                if (hideZero) {
                    if (args[i].lost != 0) {
                        $("#container").append(row);
                    }
                } else {
                    $("#container").append(row);
                }
            }
        }
    }

    $('#volume-hitbtc').off('click').on('click', function(){
        $('.order').removeClass('btn-primary');
        $('#volume-hitbtc').addClass('btn-primary');
        orderBy = "hitbtc";
    });

    $('#volume-bittrex').off('click').on('click', function(){
        $('.order').removeClass('btn-primary');
        $('#volume-bittrex').addClass('btn-primary');
        orderBy = "bittrex";
    });

    $('#profit').off('click').on('click', function(){
        $('.order').removeClass('btn-primary');
        $('#profit').addClass('btn-primary');
        orderBy = "profit";
    });

    $('#hideZero').off('click').on('click', function(){
        if ($('#hideZero').is(":checked")) {
            hideZero = true 
        } else {
            hideZero = false
        }
    });


    $('#playpause').off('click').on('click', function(){
        if (playing) {
            playing = false;
            $(this).find('span').removeClass("oi-media-pause").addClass("oi-media-play");
            $(this).find('font').html("Pause");
        } else {
            playing = true;
            $(this).find('span').removeClass("oi-media-play").addClass("oi-media-pause");
            $(this).find('font').html("Playing");
        }
    })

    event.publish("frontendrequest",[])

    //var myInterval = setInterval(function(){if (playing) event.publish("frontendrequest",[])}, 5000)

}

connection.open();

function markusdt(){
    if ($('#markusdt').is(":checked")) {
        showUSD = true 
    } else {
        showUSD = false
    }
}

function markbtc(){
    if ($('#markbtc').is(":checked")) {
        showBTC = true 
    } else {
        showBTC = false
    }
}