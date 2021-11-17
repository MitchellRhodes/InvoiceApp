const express = require('express');
const cors = require('cors');

const app = express();

const database = require('./backend/database')
database.initialize();

const port = 8080;

app.use(cors());

const invoiceAppRoutes = require('./backend/appRoutes');
app.use('/', invoiceAppRoutes)


app.use((req, res, next) => {
    const error = new Error('Not Found')

    error.status = 404

    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
});


app.listen(port, () =>
    console.log(`server is running on ${port}`)
);