const express = require('express');
const pgp = require('pg-promise')();
const Joi = require('joi');

const routes = express.Router();

routes.use(express.json());

const db = pgp({
    database: 'InvoiceApp'
});

//GET ROUTES==========================================================

//Get List of all users
routes.get('/users', async (req, res) => {
    const users = await db.many(`SELECT * FROM users`);

    res.status(200).json(users);
})

//get specific user with email
routes.get('/users/:email', async (req, res) => {
    const user = await db.oneOrNone(`SELECT * FROM users WHERE users.email= $(email)`, {
        email: req.params.email
    });

    if (!user) {
        return res.status(404).send('User not found')
    }

    res.status(200).json(user);
});


//POST ROUTES============================================================

routes.post('/users', async (req, res) => {

    await db.none(`INSERT INTO users(email) VALUES($(email))`, {
        email: req.body.email
    })

    const newUser = await db.one(`SELECT email FROM users WHERE email=$(email)`, {
        email: req.body.email
    });

    res.status(201).json(newUser);
});


//PUT ROUTES=========================================================


//DELETE ROUTES=======================================================

module.exports = routes;