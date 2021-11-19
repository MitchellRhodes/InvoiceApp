const { response } = require('express');
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

//Get clients of specific user
routes.get('/clients/:id', async (req, res) => {
    const clients = await db.manyOrNone(`SELECT * FROM clients WHERE clients.user_id=$(id)`, {
        id: +req.params.id
    });

    if (!clients) {
        return res.status(404).send('No clients found')
    }

    res.status(200).json(clients);
});

//POST ROUTES============================================================

routes.post('/users', async (req, res) => {

    const validation = validateUser(req.body);

    if (validation.error) {
        return res.status(400).send(validation.error.details[0].message)
    }

    await db.none(`INSERT INTO users(email) VALUES($(email))`, {
        email: req.body.email
    })

    const newUser = await db.one(`SELECT * FROM users WHERE email=$(email)`, {
        email: req.body.email
    });

    res.status(201).json(newUser);
});

routes.post('/clients/:id', async (req, res) => {

    const validation = validateClient(req.body);

    if (validation.error) {
        return res.status(400).send(validation.error.details[0].message)
    }

    await db.none(`INSERT INTO clients(
        user_id,first_name,last_name,company_name,email,phone_number)
        VALUES($(user_id), $(first_name),$(last_name),$(company_name),
        $(email),$(phone_number))`, {
        user_id: +req.params.id,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        company_name: req.body.company_name,
        email: req.body.email,
        phone_number: req.body.phone_number
    })

    const newClient = await db.manyOrNone(`SELECT * FROM clients WHERE user_id=$(id)`, {
        id: +req.params.id
    })

    res.status(201).json(newClient);
})

//PUT ROUTES=========================================================

routes.put('/users/:id', async (req, res) => {

    const user = await db.oneOrNone(`SELECT * FROM users WHERE users.id = $(id)`, {
        id: +req.params.id
    });

    if (!user) {
        return res.status(404).send('User ID was not found.')
    }

    const validation = validateUserUpdate(req.body);

    if (validation.error) {
        return res.status(400).send(validation.error.details[0].message);
    }

    await db.oneOrNone(`UPDATE users
    SET
    first_name = $(first_name),
    last_name = $(last_name),
    email = $(email),
    phone_number = $(phone_number),
    company_name = $(company_name)
    WHERE id = $(id)`, {
        id: +req.params.id,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        phone_number: req.body.phone_number,
        company_name: req.body.company_name
    })

    const updatedUser = await db.oneOrNone(`SELECT * FROM users WHERE users.id = $(id)`, {
        id: +req.params.id
    })

    res.status(200).json(updatedUser);

});



//DELETE ROUTES=======================================================

routes.delete('/users/:id', async (req, res) => {

    const user = await db.oneOrNone(`SELECT * FROM users WHERE users.id = $(id)`, {
        id: +req.params.id
    })

    if (!user) {
        return res.status(404).send('User ID was not found')
    }

    const deleteUser = await db.none(`DELETE FROM users WHERE users.id = $(id)`, {
        id: +req.params.id
    })

    res.status(204).json(deleteUser);
});

//VALIDATIONS========================================================

function validateUser(user) {
    const schema = Joi.object({

        //fix phone number later
        first_name: Joi.string().min(1),
        last_name: Joi.string().min(1),
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
        phone_number: Joi.string().min(1),
        company_name: Joi.string().min(1)
    });

    return schema.validate(user);
};

function validateUserUpdate(user) {
    const schema = Joi.object({
        first_name: Joi.string().allow('', null),
        last_name: Joi.string().allow('', null),
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
        phone_number: Joi.string().allow('', null),
        company_name: Joi.string().allow('', null)
    });

    return schema.validate(user);
};


function validateClient(client) {
    const schema = Joi.object({
        first_name: Joi.string().min(1).required(),
        last_name: Joi.string().min(1).required(),
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
        phone_number: Joi.string().min(1).required(),
        company_name: Joi.string().allow('', null)
    });

    return schema.validate(client);
};
module.exports = routes;