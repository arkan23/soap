/**
 * Created by arkan_000 on 23.01.2017.
 */

const Deferred = function () {
    let defer = {};

    defer.promise = new Promise((resolve, reject) => {
        defer.resolve = resolve;
        defer.reject = reject;
    });

    return defer;
};

const soap = require('strong-soap').soap;

const url = 'http://10.0.11.4/BDUPP/ws/Salex?wsdl';
const args = {};
const options = {};
let defer = new Deferred(); // создается новый deferred - чистый промис

function getArticles() {
    soap.createClient(url, options, function(err, client){
        client.GetArticles(args, function(err, result, envelope){
            if (!err) {
                defer.resolve(JSON.stringify(result));
            } else {
                defer.reject(err);
            }
        });


    });

    return defer.promise; // возвращается промис, на который подписываемся и который в подписку вернет articles или err
}

function getManufacturingOrders() {
    soap.createClient(url, options, function(err, client){

        client.GetManufacturingOrders(args, function(err, result, envelope){
            if (!err) {
                defer.resolve(JSON.stringify(result));
            } else {
                defer.reject(err);
            }
        });

    });

    return defer.promise;
}

function setSerializationResult(gtin,total,rejected,data,stage,line) {
    let args={
        GTIN: gtin,
        Total: total,
        Rejected: rejected,
        Data: data,
        Stage: stage,
        Line: line
    };
    soap.createClient(url, options, function(err, client){

        client.SetSerializationResult(args, function(err, result, envelope){
            if (!err) {
                defer.resolve(JSON.stringify(result));
            } else {
                defer.reject(err);
            }
        });

    });

    return defer.promise;
}


module.exports = {
    getArticles: getArticles,
    getManufacturingOrders: getManufacturingOrders,
    setSerializationResult: setSerializationResult
};


/*
Использование
3 функции, первые 2 получают json данные из 1с, последняя отправляет в 1с, параметры функции: GTIN,общ кол-во упаковок, кол-во отказов, дата, (два добавленных параметра: stage,line)


soap.getArticles().then(function(articles) {
    res.end(articles);
}, function(err) {
    res.end(err);
});

soap.getManufacturingOrders().then(function(orders) {
    res.end(orders);
}, function(err) {
    res.send(err);
});

soap.setSerializationResult(2335346,10,1,'2017-01-01').then(function(result) {

    res.end(result);
}, function(err) {
    res.send(err);
});


*/
