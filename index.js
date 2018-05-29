const MongoClient = require('mongodb').MongoClient,
    express = require('express'),
    engines = require('consolidate');

var app = express(),
    db;

app.engine('hbs', engines.handlebars);

app.set('views', './views');
app.set('view engine', 'hbs');
app.use(express.static('public'));

// Conectarse a Base de Datos
MongoClient.connect('mongodb://localhost:27017', function (err, client) {
    if (err) throw err;

    db = client.db('productos');

    // Iniciar servidor
    app.listen(1234);
});

app.get('/products', (req, res) => {

    var prod = db.collection('datos')
        .find();

    if (req.query.min) {
        prod.filter({
            precio: {
                $gte: req.query.min,
                $lt: req.query.max
            }
        });
    }

    if (req.query.puntaje) {
        prod.filter({
            puntaje: {
                $lt: req.query.puntaje
            }
        });
    }


    if (req.query.genero)
        prod.filter({
            genero: req.query.genero
        });

    if (req.query.formato)
        prod.filter({
            formato: req.query.formato
        });



    prod.toArray((err, result) => {
        res.render('products', {
            productos: result
        });
    })
});

app.get('/disco', (req, res) => {
    //console.log(req.query.album)
    var disco = db.collection('datos').find({
        album: req.query.album
    });

    disco.toArray((err, result) => {
        console.log(result[0])
        res.render('product_view', {
            disc: result[0]
        });
    });

});