
$.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    return results[1] || 0;
}

var u = $.urlParam('u');
var p = $.urlParam('p');

var config = {
    apiKey: "AIzaSyDVE-ksWr7Qxh18EaAuyMSeslo6SO8iBwk",
    authDomain: "home-office-strip.firebaseapp.com",
    databaseURL: "https://home-office-strip.firebaseio.com",
    projectId: "home-office-strip",
    storageBucket: "home-office-strip.appspot.com",
    messagingSenderId: "252635280677",
    appId: "1:252635280677:web:bb4bde536bc50447bad6cc"
};

//initialize your firebase
firebase.initializeApp(config);

var email = u+"@gmail.com";
var password = p;

firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
});

var database = firebase.database();

//create a variable to hold our orders list from firebase
var firebaseStats = database.ref();
// console.log(firebaseStats);

function submitStats(a) {

    var firebaseStats = database.ref().update({
        stats: a
    });

};

firebaseStats.on('value',function(o){
    var stats = o.val();
    var camURL = stats.camURL;
    var color = "#444444";
    stats = stats.stats;
    
    $('.image-cam').css("background-image", "url("+camURL+")");

    var statsNameClass, statsName;
    switch(stats){
        case 0:
            color = "#444444";
            statsNameClass = "off";
            statsName = "Desligado";
            break;

        case 1:
            color = "#f00";
            statsNameClass = "meeting";
            statsName = "Em Reunião";
            break;

        case 2:
            color = "#ffe500";
            statsNameClass = "busy";
            statsName = "Ocupado";
            break;

        case 3:
            color = "#1100ff";
            statsNameClass = "available";
            statsName = "Disponível";
            break;

        default:
    }
    // $('#actualStats').html(statsHtml);
    // updateNeon(statsName);
    $('.buttons-box a.btn-action').removeClass('active');
    if(stats>0){
        $('.buttons-box a.btn-'+statsNameClass).addClass('active');
    }
    $('#logo b').removeClass().addClass(statsNameClass);
    updateNeon(statsName);
});

function updateNeon(text){
    text = text.replace(/\s/g, '');
    var textSize = text.length;
    var caracterRange = textSize/5;
    var actualPoint = 0, eachPart = caracterRange;
    for(var i = 0 ; i < 5 ; i++){
        var part = text.substring(actualPoint, eachPart);
        // console.log(caracterRange);
        // console.log(part);
        actualPoint = eachPart;
        eachPart += caracterRange;
        $('#c'+(i+1)).html(part);
    }
}

$(document).ready(function(){
    $.get('https://brapi.ga/api/quote/CVCB3,PETR3,ALZR11,HGLG11,BCFF11,AAPL34,WEGE3',
      function(data){
          var stocks = data.results;
        // console.log(data.results);
        $('#stocks-area').empty();
        for(var s in stocks){
            var stock = stocks[s];

            var ticker = stock.symbol;
            var desc = stock.longName;
            var price = stock.regularMarketPrice;
            var percentage = stock.twoHundredDayAverageChangePercent.toFixed(2);
            var situation;
            if (percentage < 0){
                situation = 'losing';
            }else if (percentage > 0){
                situation = 'winning';
            }
            // console.log(stock,ticker, desc, price);

            $('#stocks-area').append(`
                <span class="stock">
                    <b class="left ticker">${ticker}</b>
                    <b class="right price">${price}</b>
                    <b class="left desc">${desc}</b>
                    <b class="right percentage ${situation}">${percentage}</b>
                </span>
            `);
        }
    })

    $.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=brl&ids=bitcoin,ethereum',
      function(cryptos){
        // console.log(data.results);
        $('#cryptos-area').empty();
        for(var c in cryptos){
            var crypto = cryptos[c];

            var ticker = crypto.symbol;
            var desc = crypto.name;
            var price = crypto.current_price;
            var percentage = crypto.price_change_percentage_24h.toFixed(2);
            if (percentage < 0){
                situation = 'losing';
            }else if (percentage > 0){
                situation = 'winning';
            }

            $('#cryptos-area').append(`
                <span class="stock">
                    <b class="left ticker">${ticker}</b>
                    <b class="right price">${price}</b>
                    <b class="left desc">${desc}</b>
                    <b class="right percentage ${situation}">${percentage}</b>
                </span>
            `);
        }
    })
})

  