<!doctype html>

<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>Transactions</title>
        <meta name="description" content="Transactions">
        <meta name="author" content="Midas">

        <link rel="stylesheet" href="css/style.css?v=1.0">
        <link href="css/bootstrap.css" rel="stylesheet">
        <link href="css/open-iconic.min.css" rel="stylesheet">
        <link href="css/open-iconic-bootstrap.css" rel="stylesheet">

        <!--[if lt IE 9]>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7.3/html5shiv.js"></script>
        <![endif]-->
    </head>

    <body class="padding20px">

        <div class="row">
            <div class="col-md-12 custom-bg custom-border-bottom  custom-border-top">
                <h5>System integrity - <span class="redtext" id="sint">OFFLINE</span></h5>
            </div>
        </div>
        <div class="row custom-bg custom-border-bottom">
            <div class="col-md-1">
                <h5>Markets</h5>
            </div>
            <div class="col-md-11" id="pairscontainer">
            </div>
        </div>
        <div class="row">
            <div class="col-md-3">
                <div class="row">
                    <h5>DataAgregator status: <span class="redtext" id="systemstatus">PAUSED</span><span id="disconnected" class="redtext">DISCONNECTED</span></h5>
                </div>
                <div class="row">
                    <button class="btn btn-danger" id="playpause" status="pause" onclick="playpause()">Play</button>
                </div>
            </div>
            <div class="col-md-3">
                <h5>Exchanges status</h5>
                <div class="row">
                    <div class="col-md-6 exchange">HitBTC</div>
                    <div class="col-md-6"><span class="redtext" id="shitbtc">stopped</span></div>
                </div>
                <div class="row">
                    <div class="col-md-6 exchange">Bittrex</div>
                    <div class="col-md-6"><span class="redtext" id="sbittrex">stopped</span></div>
                </div>
                <div class="row">
                    <div class="col-md-6 exchange">Bitfinex</div>
                    <div class="col-md-6"><span class="redtext" id="sbitfinex">stopped</span></div>
                </div>
                <div class="row">
                    <div class="col-md-6 exchange">Binance</div>
                    <div class="col-md-6"><span class="redtext" id="sbinance">stopped</span></div>
                </div>
                <div class="row">
                    <div class="col-md-6 exchange">OKex</div>
                    <div class="col-md-6"><span class="redtext" id="sokex">stopped</span></div>
                </div>
                <div class="row">&nbsp;</div>
            </div>
            <div class="col-md-6">

                <div class="row">
                    <div class="col-md-12">
                        <h5>Accept only the transactions with profit greater than:</h5>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-2">
                        <input type="number" class="form-control" value="1" id="min-percent"/>
                    </div>
                    <div class="col-md-2">
                        <button class="btn btn-primary" id="set-percent" onclick="changeValue()">Set percent</button>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-12">
                        <h5>Volume LIMIT per transaction in BTC (minimun accepted value is 0.01)</h5>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-2">
                        <input type="number" class="form-control" id="max-volume"/>
                    </div>
                    <div class="col-md-2">
                        <button class="btn btn-primary" id="set-limit">Set limit</button>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-12">
                        <h5>Loss profit limit on cancel request (max value is 0.5)</h5>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-2">
                        <input type="number" class="form-control" id="limit-profit"/>
                    </div>
                    <div class="col-md-2">
                        <button class="btn btn-primary" id="set-profit">Set profit</button>
                    </div>
                </div>

                <div class="row">&nbsp;</div>
            </div>
        </div>
        <div class="row custom-border-top">&nbsp;</div>
        

        <div class="row">
            <div class="col-md-12 custom-bg custom-border-bottom  custom-border-top">
                <div class="row">
                    <div class="col-md-1">
                        <h4>Wallets</h4>
                    </div>
                    <div class="col-md-11">
                        <button class="btn btn-primary" id="playpause" status="pause" onclick="refreshWallets()" style="margin-top:5px"><span class="oi oi-reload"></span> Refresh wallets</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="row" id="walletheader">
        </div>

        <div class="row">
            <div class="col-md-12 custom-bg custom-border-bottom  custom-border-top">
                    
            </div>
        </div>

        <div class="row" id="pairsvalue">
        </div>

        <div class="row">
            <div class="col-md-12 custom-bg custom-border-bottom  custom-border-top">
                    
            </div>
        </div>

        <div class="row">
            <div class="col-md-3">
                <table class="table table-bordered table-condensed table-responsive table-hover coinprofit-table"> 
                    <caption><span id="caption-coin-profit">Total profits for primary coins</span> <button type="button" id="reset-coin-profit" class="btn btn-sm btn-primary">Reset</button></caption> 
                    <thead>
                        <tr>
                            <th>BTC</th> 
                            <th>ETH</th> 
                            <th>USD</th>
                        </tr> 
                    </thead> 
                    <tbody>
                        <tr>
                            <td class="coin-profit" id="btc-coinprofit">0</td> 
                            <td class="coin-profit" id="eth-coinprofit">0</td> 
                            <td class="coin-profit" id="usd-coinprofit">0</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="row">
            <div class="col-md-2">
                <input type="number" class="form-control" id="input-profit"/>
            </div>
            <div class="col-md-2">
                <button class="btn btn-primary" id="calculate-profit">Calculate</button>
            </div>
        </div>

        <div class="row">
            <div class="col-md-12">
                <h4>Profitable transactions</h4>
            </div>
        </div>

        <div class="row">
            <div class="col-md-1 custom-bg">Symbol</div>
            <div class="col-md-1 custom-bg">Date</div>
            <div class="col-md-1 custom-bg">Transaction Id</div>
            <div class="col-md-1 custom-bg">Volume</div>
            <div class="col-md-6 custom-bg">
                <div class="row">
                    <div class="col-md-6">
                        <div class="row">
                            <div class="col-md-6">Buy Market</div>
                            <div class="col-md-6">Sell Market</div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="row">
                            <div class="col-md-6">Buy Price</div>
                            <div class="col-md-6">Sell Price</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-1 custom-bg">Profit</div>
            <div class="col-md-1 custom-bg">Profit Percent</div>
        </div>

        <div class="row">
            <div class="col-md-12" id="myProfit">
                
            </div>
        </div>

        <br /><hr /><br />

                
                       
        <div class="row">
            <div class="col-md-12" id="defaultContainer">
            </div>
        </div>

        <!--<button onclick="clickfunction()" class="btn btn-danger">WTF ???</button>-->

        <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
        <!-- Include all compiled plugins (below), or include individual files as needed -->
        <script src="js/bootstrap.min.js"></script>
        <script src="js/autobahn.min.js"></script>
        <script src="js/popper.js"></script>
        <script src="js/moment.js"></script>
        <script type="text/javaScript">
            var wsHost = "<?php echo $_SERVER['SERVER_HOST']; ?>";
        </script>
        <script>
            if (!Date.now) Date.now = function() { return new Date().getTime(); }
            var script = document.createElement('script');
            script.src = "js/script.js?v" + Date.now();
            document.head.appendChild(script);
        </script>
    </body>
</html>