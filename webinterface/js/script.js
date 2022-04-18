if (!wsHost) {
    var wsHost = "127.0.0.1";
}
var socket = null;
var isopen = false;

var totalProfit = 0;

var session;

var coins = [
    "btc","eth", "usd", "nmr", "fyn", "hac", "sisa", "ship", "stq", "ios", "btca", "data", "gbx",
    "fota", "shift", "neo", "tusd", "neo", "ngc", "bcpt", "noah", "hmq", "xlm", "plbt", "golos",
    "rcn", "fun", "ios", "dsh", "rcn", "rdn", "zsc", "daxt", "1st", "atb", "iht", "xwc", "btx", "bqx",
    "mesh", "bstn", "bat", "qtm", "cat", "emc", "neu", "qlc", "bay", "wmgo", "adt", "pro", "kmd", "dadi",
    "wtc", "appc", "ae", "efl", "swftc", "pkt", "music", "trst", "qrl", "rvt", "zsc", "bnb", "mtl", "brx",
    "kick", "tel", "daxt", "ark", "bft", "smart", "plr", "ert", "nano", "gam", "mna", "qau", "dim", "flp",
    "wiz", "omg", "bcc", "xaur", "snm", "hgt", "neu", "aco", "eng", "act", "banca", "bubo", "xmo", "2give",
    "spk", "mtn", "enj", "tgt", "scl", "cvc", "tnt", "b2x", "sisa", "utt", "eng", "zrx", "ode", "iot", "qsh",
    "emgo", "ico", "up", "hlw", "wabi", "uet", "cl", "eko", "cvt", "mco", "gbyte", "tnt", "amb", "lsk", "zrx",
    "sub", "mtx", "bdg", "ast", "bch", "cl", "zap", "neo", "maid", "mth", "data", "avh", "hmq", "ven", "btca",
    "axp", "cl", "trig", "pivx", "soc", "seth", "rby", "dgb", "vee", "bus", "coss", "dlt", "sys", "air", "slr",
    "eth", "fct", "rads", "snt", "usd", "fuel", "c20", "xmy", "dtb", "dmt", "clout", "zap", "xmg", "sc", "prg",
    "bar", "dat", "gnx", "knc", "icx", "utnp", "bcc", "sys", "etp", "fyp", "ngc", "mtx", "scc", "qsp", "trig",
    "ins", "tks", "net", "bas", "tkr", "dgb", "cvh", "mld", "zec", "snrg", "emc", "vrm", "icos", "zsc", "trig",
    "seq", "yyw", "time", "poe", "smt", "gup", "xvg", "sent", "zap", "xlm", "ae", "ift", "trx", "iot", "xem", "ebet",
    "eet", "gld", "rlc", "bet", "hpc", "lun", "xdn", "pix", "tio", "iota", "erc", "bnt", "gnt", "poa", "xem", "lgd",
    "usd", "yyw", "mth", "wiz", "cnd", "rvr", "bsd", "etc", "btg", "eur", "life", "hand", "emgo", "jpy", "bos", "iota",
    "nxs", "ukg", "ats", "nlg", "adx", "vib", "bcpt", "xtz", "spf", "cpg", "sngls", "xvg", "eos", "hvn", "jnt", "tx", "neo",
    "tix", "eos", "cov", "bft", "veri", "wrc", "trst", "crb", "eos", "sng", "evx", "cnd", "cmt", "lsk", "salt", "stx",
    "ebtcold", "nuls", "vtr", "xcp", "qvt", "ncash", "clam", "ubq", "cfi", "vib", "mna", "dan", "bcd", "ptc", "maid",
    "otn", "powr", "lgd", "xdn", "nct", "cvt", "sent", "mona", "mln", "snt", "voise", "ebtcold", "evn", "via", "qsh",
    "dai", "vibe", "act", "bts", "byc", "spk", "elf", "lrc", "cas", "rpm", "rcn", "cvc", "cld", "aion", "gnt", "mtn", "auto",
    "thc", "veri", "gvt", "cov", "bts", "nxt", "oax", "csno", "ats", "spr", "edo", "req", "agi", "gvt", "synx", "noah", "nebl",
    "swt", "icos", "prg", "odn", "egc", "bcpt", "tnb", "elf", "cas", "ardr", "cmt", "qtum", "cfi", "ada", "avt", "aid", "hand",
    "coval", "wan", "kore", "swt", "lend", "seth", "dash", "sbtc", "amp", "stu", "chat", "bgg", "true", "bstn", "aion", "wings",
    "mna", "trx", "btm", "b2x", "snt", "bez", "brd", "sls", "air", "nebl", "iht", "fota", "cvt", "qtm", "drt", "clr", "qtm", "ios",
    "trac", "chsb", "cgc", "ode", "la", "neo", "xvg", "dim", "pivx", "ada", "agi", "ddf", "rpx", "steem", "drg", "omg", "insur",
    "gto", "wax", "rdn", "mda", "powr", "fun", "ctr", "mda", "rpm", "appc", "rrt", "iot", "atm", "dbix", "ebtcnew", "eet", "utnp",
    "dcn", "frd", "crpt", "bubo", "waves", "powr", "xaur", "plr", "knc", "ltc", "salt", "eur", "ebtcnew", "pot", "ioc", "zec",
    "dgd", "nano", "enrg", "geo", "rep", "rlc", "btg", "bch", "sng", "air", "qtum", "vit", "berry", "gas", "bch", "xuc", "grs", "aio",
    "time", "dice", "cld", "smt", "doge", "tix", "hsr", "cmt", "dash", "ixt", "drpu", "clout", "banca", "hqx", "xzc", "xdn", "ant",
    "bcn", "wpr", "bitb", "pay", "mana", "ctx", "eko", "bptn", "drg", "nav", "oax", "ero", "ncash", "nbt", "adt", "storj", "xem",
    "wan", "zcl", "etp", "skin", "fuel", "adx", "iht", "amb", "data", "chat", "blitz", "xel", "oax", "exn", "dim", "jpy", "nebl",
    "nxt", "drt", "rpx", "xrp", "elf", "atl", "sur", "pink", "mue", "smart", "wrc", "rntb", "wiz", "brd", "ltc", "amm", "ost", "poe",
    "etc", "rrt", "bptn", "storm", "ocn", "day", "gbx", "spk", "tkn", "opt", "cat", "chat", "flp", "lsk", "cure", "gbp", "mana",
    "dai", "cnd", "hvn", "mod", "poly", "dat", "wrc", "tau", "mesh", "dct", "vee", "strat", "dbet", "dgb", "lrc", "mtn", "loc",
    "cann", "gno", "insur", "dcr", "mer", "enj", "link", "nav", "drt", "lnc", "link", "trust", "wabi", "nuls", "nxt", "exp", "bft",
    "taas", "wmgo", "dov", "eko", "bcd", "appc", "poa", "stx", "mco", "ltc", "plu", "ven", "bcpt", "blz", "ncash", "eos", "cat", "amm",
    "swftc", "grmd", "cte", "grs", "btm", "bts", "dnt", "tnb", "dcn", "sbtc", "gbx", "rdn", "ptoy", "doge", "mips", "mco", "unc", "wlk",
    "ppc", "xzc", "rdn", "snc", "bmc", "lat", "pcl", "aion", "ixt", "ignis", "xst", "ppc", "star", "utk", "cte", "bcn", "loc", "dice", "enj",
    "smart", "dmt", "fcn", "maid", "myb", "sbtc", "neu", "wpr", "sig", "rdd", "ukg", "lrc", "art", "ctr", "kmd", "cte", "aby", "nmr", "wtc",
    "kmd", "sc", "iot", "ind", "evx", "arn", "ost", "iot", "bmt", "hsr", "btca", "stq", "nav", "emc2", "prg", "its", "iot", "brd", "via", "betr",
    "aur", "wax", "bez", "iop", "zrc", "bqx", "xtz", "iost", "zec", "veri", "tbt", "sms", "chp", "b2x", "arn", "storm", "cloak", "gup",
    "qtum", "bar", "mtl", "tnt", "swftc", "wabi", "neos", "mana", "edo", "agi", "bmc", "avh", "qsp", "yoyo", "ipl", "qlc", "ion", "bcc",
    "ndc", "icx", "xmo", "xmr", "kbr", "hire", "xvc", "cct", "stq", "up", "edo", "aid", "ech", "sngls", "bnt", "bmt", "dope", "msp", "bmc", "cdt",
    "drpu", "steem", "burst", "aio", "qlc", "crb", "xtz", "stu", "indi", "lsk", "icn", "zil", "btg", "1st", "icos", "xuc", "nct", "bnb", "neo",
    "icx", "vib", "utk", "tnb", "pix", "loc", "dlt", "brk", "crw", "wax", "tel", "ftc", "sys", "zen", "bcn", "ven", "emc", "mld", "vit", "unc", "qsp",
    "cld", "rpx", "ont", "r", "dbet", "xlm", "swift", "dgd", "plu", "yoyow", "via", "blk", "cpg", "yoyo", "nxc", "qrl", "plr", "gxs", "bcy", "sbd",
    "san", "elm", "wlk", "sphr", "btx", "vtc", "dnt", "utk", "mod", "iost", "strat", "fun", "nto", "storm", "wan", "rep", "poly", "qsh", "dai",
    "dov", "berry", "ven", "mesh", "block", "ping", "smt", "wild", "ltc", "xem", "qcn", "atm", "ldc", "pay", "srn", "r", "zil", "part", "atm",
    "idh", "sms", "day", "nano", "ocn", "bmh", "cnx", "btm", "betr", "banca", "amb", "xrp", "bez", "crpt", "rlc", "sng", "bkb", "vit", "aeon",
    "waves", "pkt", "wings", "utt", "avt", "yyw", "qtum", "sent", "aio", "xdnco", "dent", "ebtcnew", "eet", "clout", "bat", "dmd", "aid",
    "ppt", "betr", "dlt", "dcn", "arct", "bgg", "noah", "gno", "trx", "flp", "utnp", "cpy", "vibe", "dyn", "day", "ebst", "bnt", "mne", "xmr",
    "lun", "mco", "xuc", "excl", "ardr", "ada", "bat", "sub", "otx", "ant", "mld", "ycc", "ada", "mtx", "game", "mcap", "amb", "orme", "coss",
    "cdx", "cpy", "xmo", "iota", "omni", "tusd", "ppt", "ship", "meme", "sib", "ark", "ptoy", "ignis", "evx", "ele", "yoyo", "ont", "qwark",
    "etp", "req", "idh", "bstn", "rep", "cnd", "atb", "pivx", "san", "utt", "bptn", "datx", "iota", "fct", "srn", "eos", "ae", "doge", "cvh", "chsb",
    "rlc", "steem", "dsh", "wtc", "ctx", "pcl", "dbet", "ngc", "wlk", "edg", "bat", "gbp", "sur", "gto", "blz", "adx", "xmr", "icn", "taas", "etbs",
    "bar", "bgg", "ast", "poa", "snm", "act", "xrp", "neo", "avh", "cvc", "zrx", "amm", "axp", "rpx", "fuel", "tio", "omg", "req", "stx", "sms", "cas",
    "blz", "snc", "mek", "incnt", "san", "storj", "etc", "dat", "atb", "dadi", "xzc", "waves", "grc", "dash", "bcc", "avt", "cfi", "snc", "ctr",
    "ont", "eos", "sur", "pre", "gto", "vrc", "c20", "cdt", "cdt", "cpay", "arct", "bnb", "zil", "fldc", "flo", "tio", "bubo", "kin", "ok", "strat",
    "icx", "sub", "lend", "xlm", "lmc", "tusd", "gxs", "ost", "gbg", "gnt", "qau", "datx", "unb", "ebtcold", "lbc", "adx", "stu", "bqx", "nct",
    "berry", "nuls", "rcn", "ode", "poll", "ins"
];



var marketPair = []
var globalPairs = {}

var markets         = ["hitbtc", "bittrex", "bitfinex", "binance", "okex"];
var showParities    = {};

var systemstatus    = "pause"
var prevSystemStatus = systemstatus

var pairs

// Create Base64 Object
var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}

var SystemStatus = {}
SystemStatus.dataagregator = "ping"
SystemStatus.hitbtc = "ping"
SystemStatus.bittrex = "ping"
SystemStatus.bitfinex = "ping"
SystemStatus.binance = "ping"
SystemStatus.okex = "ping"


$("#playpause").hide() // first time we hide the paly pause button
$("#systemstatus").hide()

connection = new autobahn.Connection({
    url: "ws://" + wsHost + ":8087",
    realm: "dataGateway"
});

connection.onopen = function(event) {
    session = event;

    event.subscribe("profit", onProfit);
    event.subscribe("transactionhistory", onTransactionHistory)
    event.subscribe("updatewallets", onWalletUpdate);
    event.subscribe("setplaystatus", setPlayStatus);
    event.subscribe("setpercent", setPercent);
    event.subscribe("pingpong", setPong);
    event.subscribe("responseFromTransaction", setResponse);
    event.subscribe("getvolumelimit", getVolumeLimit);
    event.subscribe("getlimitprofit", getLimitProfit);
    // get all pairs (for grid)
    event.subscribe("publicpairs", allPairs);
    // 
    event.subscribe("setSubscribedPairs", getSubScribedPairs);

    // subscribe to liveFeed
    event.subscribe("liveFeed", liveFeed);

    // Update total profit in the main coins
    event.subscribe("coinprofit", coinProfit);

    // this will be responsable with making orange transaction for reserved position
    event.subscribe("orangeTransaction", orangeTransaction);

    event.subscribe("greenTransaction", greenTransaction);

    event.subscribe("blueTransaction", blueTransaction);

    event.subscribe("yellowTransaction", yellowTransaction);

    // update proffit on transaction
    event.subscribe("updatefrontendprofit", updateFrontendProfit)

    // event.publish("requestpairs",[]);
    event.publish("allpairs",[]);

    var trId = localStorage.getItem('trId');
    if (trId === null || trId === undefined || trId === '') {
        trId = 0;
    } else {
        trId = parseInt(trId);
    }

    event.publish("calculatedProfit", [trId]);

    function updateFrontendProfit(args){
        if (args.length > 0) {
            var data = args[0];
            console.log("UPDATE PROFIT:", data);
            $("#"+data.SellMarket+data.ID).removeClass("intbg").removeClass("orangebg").addClass("greenbg");
            $("#"+data.BuyMarket+data.ID).removeClass("intbg").removeClass("orangebg").addClass("greenbg");
            $("#profit"+data.ID).html(parseFloat(data.Profit).toFixed(8)  + ' ( ' + data.Pair.substr(0, 3) + ' )');
            $("#percent"+data.ID).html(parseFloat(data.Percent).toFixed(8));
        }
    }

    function orangeTransaction(args){
        if (args.length > 0) {
            var data = args[0];
            console.log("ORANGE DATA:", data);
            $("#"+data.Exchange+data.TrID).removeClass("intbg").removeClass("greenbg").addClass("orangebg");
            $("#profit"+data.TrID).html("");
            $("#percent"+data.TrID).html("");
        }
    }

    function yellowTransaction(args){
        if (args.length > 0) {
            var data = args[0];
            console.log("YELLOW DATA:", data);
            $("#"+data.Market+data.ClientOrderID).removeClass("intbg").removeClass("greenbg").removeClass("orangebg").addClass("yellowbg");
            $("#profit"+data.TrID).html("");
            $("#percent"+data.TrID).html("");
        }
    }

    function greenTransaction(args){
        if (args.length > 0) {
            var data = args[0];
            console.log("GREEN DATA:", data);
            $("#"+data.Exchange+data.TrID).removeClass("intbg").removeClass("orangebg").addClass("greenbg");
            // $("#profit"+data.TrID).html("");
            // $("#percent"+data.TrID).html("");
        }
    }

    function blueTransaction(args){
        if (args.length > 0) {
            var transaction = args[0];
            console.log("BLUE DATA:", transaction);
            $("#profit"+transaction.TrID).parent().addClass("bluebg")
        }
    }

    function coinProfit(args) {
        if (args.length > 0) {
            var coin = args[0].coin;
            var profit = args[0].profit;
            var cssSelector = '#' + coin + '-coinprofit';
            $(cssSelector).html(profit);
            
        }
    }

    function resetCoinProfit() {
        $('#reset-coin-profit').off('click').on('click', function(){
            $('.coin-profit').html(0);
        });
    }

    resetCoinProfit();

    function liveFeed(args){
        if (args.length) {
            //console.log(args[0])
            if (args[0].ask != 0) {
                $("#"+args[0].market+args[0].pair+"ask").html(args[0].ask)
            }
            if (args[0].bid != 0) {
                $("#"+args[0].market+args[0].pair+"bid").html(args[0].bid)
            }
        }
    }

    function getSubScribedPairs(args) {
        if (args.length === 1 && args[0].Market == "frontend") {
            pairs = args[0].Pairs
            for (var i = 0; i < pairs.length; i++) {
                $('#' + pairs[i]).prop('checked', true);
            }
            generatePairs()
        }
    }

    function getVolumeLimit(args) {
        if (args.length == 1) {
            $('#max-volume').val(args[0]);
        } 
    }

    function getLimitProfit(args) {
        if (args.length == 1) {
            $('#limit-profit').val(args[0]);
        }
    }

    function setResponse(args){
        if (args.length>0){
            console.log("Response from transaction:")
            // console.log(args[0])
            var response = args[0]
            
            if (response.ID != 1234567890){
                if (response.Status == true) {
                    $("#" + response.Market + response.ID).removeClass("intbg").addClass("greenbg")
                } else {
                    $("#" + response.Market + response.ID).removeClass("intbg").addClass("redbg")
                }
            } else {
                if (response.Status == true) {
                    $("#myProfit").find(".row").first().find("div[id^='" + response.Market +"']").removeClass("intbg").addClass("greenbg")
                } else {
                    $("#myProfit").find(".row").first().find("div[id^='" + response.Market +"']").removeClass("intbg").addClass("redbg")
                }
            }
        }
    }

    function setPong(args){
        if (args.length>0){
            // console.log(args[0])
            if (args[0].source == "dataagregator") {
                SystemStatus.dataagregator = "pong"
                $("#sint").html("ONLINE")
                $("#sint").removeClass("redtext").addClass("greentext")
                $("#playpause").show()
                $("#systemstatus").show()
                $("#disconnected").hide()
            }
            if (args[0].source == "hitbtc") {
                SystemStatus.hitbtc = "pong"
                $("#shitbtc").html("running")
                $("#shitbtc").removeClass("redtext").addClass("greentext")
            }
            if (args[0].source == "bittrex") {
                SystemStatus.bittrex = "pong"
                $("#sbittrex").html("running")
                $("#sbittrex").removeClass("redtext").addClass("greentext")
            }
            if (args[0].source == "bitfinex") {
                SystemStatus.bitfinex = "pong"
                $("#sbitfinex").html("running")
                $("#sbitfinex").removeClass("redtext").addClass("greentext")
            }
            if (args[0].source == "binance") {
                SystemStatus.binance = "pong"
                $("#sbinance").html("running")
                $("#sbinance").removeClass("redtext").addClass("greentext")
            }
            if (args[0].source == "okex") {
                SystemStatus.okex = "pong"
                $("#sokex").html("running")
                $("#sokex").removeClass("redtext").addClass("greentext")
            }
        }
    }

    function setPercent(args) {
        if (args.length>0) {
            $("#min-percent").val(args[0])
        }
    }

    function allPairs(args){
        if (args.length>0) {
            marketPair = []
            globalPairs = args[0];
            var myKeys = Object.keys(globalPairs)

            for (var i in myKeys) {
                if (globalPairs[myKeys[i]]>1){
                    marketPair.push(myKeys[i])
                }
            }
            generateMarkets()
        }
        event.publish("requestSubscribedPairs", ["frontend"]);
    }

    function setPlayStatus(args) {
        if (args.length>0) {
            if (args[0] == "pause") {
                $("#playpause").attr("status", "pause")
                $("#playpause").html("Play")
                $("#playpause").removeClass("btn-primary").addClass("btn-danger")
                $("#systemstatus").removeClass("greentext").addClass("redtext")
                $("#systemstatus").html("PAUSED")
                systemstatus = "pause"
                prevSystemStatus = systemstatus
            } else {
                $("#playpause").attr("status", "play")
                $("#playpause").html("Pause")
                $("#playpause").removeClass("btn-danger").addClass("btn-primary")
                $("#systemstatus").removeClass("redtext").addClass("greentext")
                $("#systemstatus").html("PLAYING")
                systemstatus = "play"
                prevSystemStatus = systemstatus
            }
        }
    }

    function onWalletUpdate(args) {
        //console.log(args)
        if (args.length>0) {
            var wallet = args[0]

            // console.log(wallet)

            var exchange = wallet.exchange

            for (var i in wallet.values) {
                var amount   = wallet.values[i].available
                var reserved = wallet.values[i].reserved
                var currency = wallet.values[i].currency.toLowerCase()
                if (currency == "usdt") currency = "usd";
                if (isNaN(amount)) {
                    amount = 0;
                }
                if (isNaN(reserved)) {
                    reserved = 0;
                }

                if (parseFloat(amount) == 0){
                    $("#"+exchange+currency+"-r").removeClass("redbg")
                    $("#"+exchange+currency).html(0)
                } else {
                    $("#"+exchange+currency+"-r").addClass("redbg")
                    $("#"+exchange+currency).html(amount)
                }

                if (parseFloat(reserved) == 0){
                    $("#"+exchange+currency+"-r").removeClass("redbg")
                    $("#"+exchange+currency+"-r").html(0)
                } else {
                    $("#"+exchange+currency+"-r").addClass("redbg")
                    $("#"+exchange+currency+"-r").html(reserved)
                }
            }

            for (var i in wallet.values) {
                // console.log("Wallet: ", wallet.values[i])
                currency = wallet.values[i].currency.toLowerCase()
                if (currency == "usdt") currency = "usd";
                total = 0
                markets.forEach(function(m){
                    amountValue = $("#" + m + currency).html()
                    reservedValue = $("#" + m + currency + "-r").html()
                    if (isNaN(amountValue)) {
                        amountValue = 0;
                    } else {
                        amountValue = parseFloat(amountValue);
                    }
                    if (isNaN(reservedValue)) {
                        reservedValue = 0;
                    } else {
                        reservedValue = parseFloat(reservedValue);
                    }
                    total += amountValue + reservedValue;
                })

                if (total == 0) {
                    $("#row" + currency).hide()
                } else {
                    $("#row" + currency).show()
                }

                $( "#total" + currency ).html(total)
            }
        }
    }


    function genrateInsertObject(profitObject) {
        var insertObject = "";

        // console.log(profitObject)

        insertObject += '<div class="row">';
        insertObject += '    <div class="col-md-1">' + profitObject.Symbol + '</div>';
        insertObject += '    <div class="col-md-1">' + (moment(profitObject.TrID).format("DD-MM HH:mm:ss")) + '</div>';
        insertObject += '    <div class="col-md-1">' + profitObject.TrID + '</div>';
        insertObject += '    <div class="col-md-1">' + profitObject.Amount + '</div>';
        insertObject += '    <div class="col-md-6">';
        insertObject += '        <div class="row">';
        insertObject += '            <div class="col-md-6">';
        insertObject += '                <div class="row">';
        insertObject += '                    <div class="col-md-6">' + profitObject.BuyMarket + '</div>';
        insertObject += '                    <div class="col-md-6">' + profitObject.SellMarket + '</div>';
        insertObject += '                </div>';
        insertObject += '           </div>';
        insertObject += '            <div class="col-md-6">';
        insertObject += '                <div class="row">';
        insertObject += '                    <div class="col-md-6" id="' + profitObject.BuyMarket + profitObject.TrID + '">' + profitObject.BuyRate + '</div>';
        insertObject += '                    <div class="col-md-6" id="' + profitObject.SellMarket + profitObject.TrID + '">' + profitObject.SellRate + '</div>';
        insertObject += '                </div>';
        insertObject += '           </div>';
        insertObject += '        </div>';
        insertObject += '    </div>';
        insertObject += '    <div class="col-md-1" id="profit' + profitObject.TrID + '">' + parseFloat(profitObject.Profit).toFixed(8)  + ' ( ' + profitObject.Symbol.substr(0, 3) + ' ) </div>';
        insertObject += '    <div class="col-md-1" id="percent' + profitObject.TrID + '">' + parseFloat(profitObject.Percent).toFixed(4) + '% </div>';
        insertObject += '</div>';

        return insertObject;
    }

    function setStyle(profitObject){
        var foundReserved = false
        if (profitObject.SellStatus == 1) {
            $("#" + profitObject.SellMarket + profitObject.TrID).removeClass("intbg").addClass("greenbg")
        }

        if (profitObject.SellStatus == 2) {
            $("#" + profitObject.SellMarket + profitObject.TrID).removeClass("intbg").addClass("redbg")
        }

        if (profitObject.SellStatus == 3) {
            $("#" + profitObject.SellMarket + profitObject.TrID).removeClass("intbg").addClass("orangebg")
            foundReserved = true
        }

        if (profitObject.SellStatus == 4) {
            $("#" + profitObject.SellMarket + profitObject.TrID).removeClass("intbg").addClass("bluebg")
        }

        if (profitObject.SellStatus == 5) {
            $("#" + profitObject.SellMarket + profitObject.TrID).removeClass("intbg").addClass("yellowbg")
            foundReserved = true
        }

        if (profitObject.BuyStatus == 1) {
            $("#" + profitObject.BuyMarket + profitObject.TrID).removeClass("intbg").addClass("greenbg")
        }

        if (profitObject.BuyStatus == 2) {
            $("#" + profitObject.BuyMarket + profitObject.TrID).removeClass("intbg").addClass("redbg")
        }

        if (profitObject.BuyStatus == 3) {
            $("#" + profitObject.BuyMarket + profitObject.TrID).removeClass("intbg").addClass("orangebg")
            foundReserved = true
        }

        if (profitObject.BuyStatus == 4) {
            $("#" + profitObject.BuyMarket + profitObject.TrID).removeClass("intbg").addClass("bluebg")
        }

        if (profitObject.BuyStatus == 5) {
            //console.log("********&&&&&&&&&&&&&***************")
            $("#" + profitObject.BuyMarket + profitObject.TrID).removeClass("intbg").addClass("yellowbg")
            foundReserved = true
        }

        if (foundReserved) {
            $("#profit"+profitObject.TrID).html("");
            $("#percent"+profitObject.TrID).html("");

        }
    }

    function onProfit(args) {
        var profitObject = args[0]
        console.log(profitObject)
        var insertObject = genrateInsertObject(profitObject);
        //console.log(insertObject)
        $("#myProfit").prepend(insertObject);
        console.log("Nr of profit transactions: ", $("#myProfit").find(".row").length)
        setStyle(profitObject);
    }

    function onTransactionHistory(args) {
        var profitObject = args[0]
        var insertObject = genrateInsertObject(profitObject);
        //console.log(insertObject)
        $("#myProfit").append(insertObject);
        //console.log("Nr of history transactions: ", $("#myProfit").find(".row").length)
        setStyle(profitObject);
    }

    event.subscribe("frontend", onevent);

    function onevent(args) {
        //console.log(args[0])
        if( Object.prototype.toString.call( args ) === '[object Array]' ) {
            if( args.length && typeof args[0] === 'object' ) {
                var marketData = args[0];

                // console.log(marketData)
                // console.log(marketData.OpType)

                switch (marketData.OpType) {
                    case "newTrade":
                        //console.log("NEW TRADE")
                        var trType = ""
                        if (marketData.TransactionType == "buy") trType = "ask"
                            else trType = "bid"
                        marketData.TransactionType = trType
                        addData(marketData)
                        break;
                    case "orderBookModify":
                        addData(marketData)
                        break;
                    case "orderBookRemove":
                        //console.log("REMOVE ORDER");
                        remData(marketData);
                        break;
                }
                //console.log(marketData)
            }
        }
    }

    session.publish("pinging", []) // ws call to see if dataagregator is online
    session.publish("refreshwallets", []) // ws call to refresh wallets
    session.publish("getplaystatus", []) // ws call to get dataagregator play status
    session.publish("getpercent", []) // ws call to get the percent of the proffit allready seted
    session.publish("transactionhistory", [])

    session.publish("getvolumelimit", []);
    // Set the max volume on data aggregator
    $('#set-limit').off('click').on('click', function() {
        var vl = parseFloat($('#max-volume').val());
        if (vl < 0.01) {
            $('#max-volume').addClass('input-error');
        } else {
            $('#max-volume').removeClass('input-error');
            session.publish("setvolumelimit", [vl]);
        }
    });

    session.publish("getlimitprofit", []);
    // Set the loss limit profit for cancel request
    $('#set-profit').off('click').on('click', function(){
        var val = parseFloat($('#limit-profit').val());
        if (val > 5) {
            $('#limit-profit').addClass('input-error');
        } else {
            $('#limit-profit').removeClass('input-error');
            session.publish("setlimitprofit", [val]);
        }
    });

    var myInterval = setInterval(pinging, 5000) // verify onece at 5 sec if the sistem is still running
    
    function pinging() {
        if (SystemStatus.dataagregator == "ping") {
            $("#sint").html("OFFLINE")
            $("#sint").removeClass("greentext").addClass("redtext")
            $("#disconnected").show()
            $("#systemstatus").hide()
            $("#playpause").hide()
        } else {
            $("#sint").html("ONLINE")
            $("#sint").removeClass("redtext").addClass("greentext")
            $("#disconnected").hide()
            $("#systemstatus").show()
            $("#playpause").show()
        }

        if (SystemStatus.hitbtc == "ping") {
            $("#shitbtc").html("stopped")
            $("#shitbtc").removeClass("greentext").addClass("redtext")
        }
        if (SystemStatus.bittrex == "ping") {
            $("#sbittrex").html("stopped")
            $("#sbittrex").removeClass("greentext").addClass("redtext")
        }
        if (SystemStatus.bitfinex == "ping") {
            $("#sbitfinex").html("stopped")
            $("#sbitfinex").removeClass("greentext").addClass("redtext")
        }
        if (SystemStatus.binance == "ping") {
            $("#sbinance").html("stopped")
            $("#sbinance").removeClass("greentext").addClass("redtext")
        }
        if (SystemStatus.okex == "ping") {
            $("#sokex").html("stopped")
            $("#sokex").removeClass("greentext").addClass("redtext")
        }

        SystemStatus.dataagregator = "ping"
        SystemStatus.hitbtc = "ping"
        SystemStatus.bittrex = "ping"
        SystemStatus.bitfinex = "ping"
        SystemStatus.binance = "ping"
        SystemStatus.okex = "ping"

        session.publish("pinging", [])
    }
    
}

connection.open();

function remData(md) {
    //console.log(md)
    var tmpId = md.Market + md.Pairs.replace("_", "").replace("-", "").toLowerCase() + md.TransactionType + md.Rate.toString();
    $("#" + tmpId).remove()
}


$('.panel').on('hidden.bs.collapse', function (e) {
    var myParity = e.target.id.substr(8, 6);
    console.log("hide pannel: ", myParity)
    for (i in markets) {
        $("#"+markets[i]+myParity+"ask").empty();
        $("#"+markets[i]+myParity+"bid").empty();
    }
    eval('showParities.' + myParity + ' = false');
})

$('.panel').on('show.bs.collapse', function (e) {
    var myParity = e.target.id.substr(8, 6);
    console.log("show pannel: ", myParity)
    eval('showParities.' + myParity + ' = true');
})

function changeValue(){
    var myVal = $("#min-percent").val()
    console.log(myVal)
    session.publish("setpercent", [parseFloat(myVal)])
}

function playpause(){
    if ($("#playpause").attr("status") == "pause") {
        $("#playpause").attr("status", "play")
        $("#playpause").html("Pause")
        $("#playpause").removeClass("btn-danger").addClass("btn-primary")
        $("#systemstatus").removeClass("redtext").addClass("greentext")
        $("#systemstatus").html("PLAYING")
        systemstatus = "play"
        prevSystemStatus = systemstatus
    } else {
        $("#playpause").attr("status", "pause")
        $("#playpause").html("Play")
        $("#playpause").removeClass("btn-primary").addClass("btn-danger")
        $("#systemstatus").removeClass("greentext").addClass("redtext")
        $("#systemstatus").html("PAUSED")
        systemstatus = "pause"
        prevSystemStatus = systemstatus
    }
    session.publish("playpause", [systemstatus])
}

function refreshWallets(){
    session.publish("refreshwallets", [])
}

function generateWallets(){
    var coin = ""
    var output = ""
    var market = ""
    for (var i in coins) {
        coin = coins[i];
        output = "";


        output += '<div class="row" id="row' + coin + '">';
        output += '    <div class="col-md-1 custom-bg custom-border-bottom" custom-bg>';
        output += '        <strong>' + coin.toUpperCase() + '</strong>';
        output += '    </div>';

        for (var j in markets) {
            market = markets[j]

            output += '    <div class="col-md-1" align="right">';
            output += '        <div class="row">';
            output += '            <div class="col-md-3">Av: </div>';
            output += '            <div class="col-md-9 truncate" id="' + market + coin + '">0</div>';
            output += '        </div>';
            output += '        <div class="row">';
            output += '            <div class="col-md-3">Res: </div>';
            output += '            <div class="col-md-9 truncate" id="' + market + coin + '-r">0</div>';
            output += '        </div>';
            output += '    </div>';

        }

        output += '<div class="col-md-1 custom-bg totals" align="right" id="total' + coin + '">0</div>';
        output += '</div>';
        
        $(output).insertAfter("#walletheader")

        $("#row" + coin).hide()
    
    }
}

function generatePairs(){
    var pair = ""
    var output = ""
    var market = ""
    for (var i in pairs) {
        pair = pairs[i];
        output = "";


        output += '<div class="row" id="row' + pair + '">';
        output += '    <div class="col-md-1 custom-bg custom-border-bottom" custom-bg>';
        output += '        <strong>' + pair.toUpperCase() + '</strong>';
        output += '    </div>';

        for (var j in markets) {
            market = markets[j]

            output += '    <div class="col-md-1" align="right">';
            output += '        <div class="row">';
            output += '            <div class="col-md-3">Ask: </div>';
            output += '            <div class="col-md-9 truncate" id="' + market + pair + 'ask">0</div>';
            output += '        </div>';
            output += '        <div class="row">';
            output += '            <div class="col-md-3">Bid: </div>';
            output += '            <div class="col-md-9 truncate" id="' + market + pair + 'bid">0</div>';
            output += '        </div>';
            output += '    </div>';

        }

        output += '</div>';
        
        $(output).insertAfter("#pairsvalue")

        // $("#row" + pair).hide()
    
    }
}


function generateMarkets() {
    var pair = ""
    var output = ""
    var index = 1

    output = '<div class="row">'

    $("#pairscontainer").empty()

    for (var i in marketPair) {
        pair = marketPair[i]

        // console.log("pair: ", pair)
        
        if (index == 12) {
            output += '</div><div class="row">'
            index  = 1
        }

        output += '<div class="col-md-1">';
        output += '<div class="form-check">';
        output += '<input type="checkbox" class="form-check-input" id="' + pair + '" onclick="modifyPair(\'' + pair + '\')">'
        output += '<label class="form-check-label" style="font-size:12px" for="' + pair + '">&nbsp; ' + pair + '(' + globalPairs[pair] + ')</label>'
        output += '</div>'
        output += '</div>'

        index++

    }

    output += '</div>'

    $("#pairscontainer").append(output);

}

function generateWalletHeader(){
    var market = "";
    $("#walletheader").append('<div class="col-md-1"><strong>Coin</strong></div>')
    for (var i in markets) {
        market = markets[i]
        $("#walletheader").append('<div class="col-md-1 custom-bg custom-border-bottom" align="center">' + market.toUpperCase() + '</div>');
    }
    $("#walletheader").append('<div class="col-md-1 custom-bg custom-border-bottom" align="center"><strong>TOTAL</strong></div>')
}

function modifyPair(pair){
    // console.log(pair)
    var nrOfChecked = 0
    var response = {}

    for (var i in marketPair) {
        if ($("#"+ marketPair[i]).is(":checked")) {
            //console.log("ok")
            nrOfChecked ++
        }
    }

    response.pair = pair
    //send info to data agregator
    if ($("#"+ pair).is(":checked")){
        response.opType = "subscribe"
    } else {
        response.opType = "unsubscribe"
    }

    session.publish("changepair", [response])

}

function calculateProfit() {
    $('#calculate-profit').off('click').on('click', function(){
        var trId = parseInt($('#input-profit').val());
        localStorage.setItem('trId', trId);
        session.publish("calculatedProfit", [trId]);
    });
}

function setLocalProfit() {
    $('#input-profit').val(localStorage.getItem('trId'));
}

setLocalProfit();
calculateProfit();

generateWalletHeader()
generateWallets()
//generatePairs()
//generateMarkets()

