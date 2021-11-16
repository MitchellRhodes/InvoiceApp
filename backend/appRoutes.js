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
    const users = await db.manyOrNone(`SELECT * FROM users`);

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

    // const validation = validateNewUser(req.body);

    // if (validation.error) {
    //     return res.status(400).send(validation.error.details[0].message)
    // }

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



//VALIDATIONS========================================================

function validateNewUser(user) {

    const schema = Joi.object({
        email: Joi.string().min(1).required()
    });
};

function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(1).required(),
        email: Joi.string().min(1).required(),
        nickname: Joi.string().max(50),
        stance: Joi.string().max(10),
        age: Joi.number().integer().min(3).max(100),
        location: Joi.string().max(250)
    });

    return schema.validate(user);
};


module.exports = routes;