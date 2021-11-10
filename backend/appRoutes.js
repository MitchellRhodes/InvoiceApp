const express = require('express');
const pgp = require('pg-promise')();
const Joi = require('joi');

const routes = express.Router();

routes.use(express.json());

const db = pgp({
    database: 'InvoiceApp'
});

module.exports = routes;