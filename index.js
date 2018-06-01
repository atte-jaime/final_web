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
MongoClient.connect(`mongodb+srv://cluster0-iirqb.mongodb.net/tienda`, {
        auth: {
            user: 'atte_jaime',
            password: '123porJaimeG$'
        }
    },
    function (err, client) {
        if (err) throw err;

        db = client.db('tienda');

        // Iniciar servidor
        app.listen(process.env.PORT || 1234);
    }
);

app.get('/', (req, res) => {
    var listaRepro = db.collection('listRepro').find();

    listaRepro.toArray((err, result) => {
        //console.log(result[0].cancion[0].nombre);
        res.render('landing', {
            titulo: 'Home',
            lista: result
        });
    });
});

app.get('/products', (req, res) => {

    var prod = db.collection('productos')
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

    if (req.query.genero) {
        prod.filter({
            genero: req.query.genero
        });
    }

    if (req.query.formato) {
        prod.filter({
            formato: req.query.formato
        });
    }

    prod.toArray((err, result) => {
        res.render('products', {
            productos: result
        });
    });
});

app.get('/disco', (req, res) => {
    //console.log(req.query.album)
    var disco = db.collection('productos').find({
        album: req.query.album
    });

    disco.toArray((err, result) => {
        // console.log(result[0])
        res.render('product_view', {
            disc: result[0]
        });
    });

});