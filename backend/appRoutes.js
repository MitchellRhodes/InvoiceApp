// const { response } = require('express');
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

//get list of all invoices(FOR DEV PURPOSES)
routes.get('/invoices', async (req, res) => {
    const invoices = await db.manyOrNone(`SELECT * FROM invoices`);

    res.status(200).json(invoices);
})

//get ALL items(FOR DEV PURPOSES)
routes.get('/items', async (req, res) => {
    const items = await db.manyOrNone(`SELECT * FROM items`);

    res.status(200).json(items);
})


//GET ALL invoice items (FOR DEV PURPOSES)
routes.get('/invoice-items', async (req, res) => {
    const invoiceItems = await db.manyOrNone(`SELECT * FROM invoice_items`);

    res.status(200).json(invoiceItems);
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

//GET specific clients UNPAID invoice information 
routes.get('/invoices/:id', async (req, res) => {

    const invoices = await db.manyOrNone(`SELECT id, client_id, total, to_char(date_created, 'DD/MM/YYYY HH24:MI:SS') as date_created, completed FROM invoices
    WHERE client_id = $(id)`, {
        id: +req.params.id
    });

    if (!invoices) {
        return res.status(404).send('No invoices were found for this Client.')
    }

    return res.status(200).json(invoices);
})


//GET specific clients invoice items
routes.get('/invoice-items/:id', async (req, res) => {

    const invoiceItems = await db.manyOrNone(`SELECT ii.item_id, ii.quantity, it.item, it.rate FROM invoice_items ii
    INNER JOIN items it on ii.item_id = it.id
    WHERE invoice_id = $(id)`, {
        id: +req.params.id
    });

    if (!invoiceItems) {
        return res.status(404).send('No items were found for this invoice.')
    }

    return res.status(200).json(invoiceItems);
})

//POST ROUTES============================================================

//New User
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

//New Client
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


//post new item
routes.post('/items', async (req, res) => {

    const validation = validateItem(req.body);

    if (validation.error) {
        return res.status(400).send(validation.error.details[0].message)
    }

    await db.none(`INSERT INTO items(item,rate)
        VALUES($(item),$(rate))`, {
        item: req.body.item,
        rate: req.body.rate
    })

    const newItem = await db.oneOrNone(`SELECT * FROM items WHERE items.item = $(item) AND items.rate = $(rate) ORDER BY items.id DESC LIMIT 1`, {
        item: req.body.item,
        rate: req.body.rate
    })

    return res.status(201).json(newItem);
})


//New Invoice for specific client and a specific date
routes.post('/invoices/:id', async (req, res) => {

    const validation = validateInvoice(req.body);

    if (validation.error) {
        return res.status(400).send(validation.error.details[0].message)
    }

    await db.none(`INSERT INTO invoices(
        client_id,date_created,total,completed)
        VALUES(
            $(client_id),$(date_created),$(total),$(completed)
        )`, {
        client_id: +req.params.id,
        date_created: req.body.date_created,
        total: req.body.total,
        completed: false
    })


    const newInvoice = await db.oneOrNone(`SELECT * FROM invoices WHERE invoices.client_id = $(id) AND invoices.date_created = $(date_created)`, {
        id: +req.params.id,
        date_created: req.body.date_created
    })

    return res.status(201).json(newInvoice)
});

//POST INVOICE ITEMS
routes.post('/invoice-items/:id', async (req, res) => {

    const validation = validateInvoiceItems(req.body);

    if (validation.error) {
        return res.status(400).send(validation.error.details[0].message)
    }

    await db.none(`INSERT INTO invoice_items(
        invoice_id,item_id,quantity)
        VALUES(
            $(invoice_id),$(item_id),$(quantity)
        )`, {
        invoice_id: +req.params.id,
        item_id: req.body.item_id,
        quantity: req.body.quantity
    })


    const newInvoiceItem = await db.manyOrNone(`SELECT * FROM invoice_items WHERE invoice_items.invoice_id = $(id)`, {
        id: +req.params.id
    })

    return res.status(201).json(newInvoiceItem)
});

//PUT ROUTES=========================================================

//update user info
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
    company_name = $(company_name),
    phone_number = $(phone_number)
    WHERE id = $(id)`, {
        id: +req.params.id,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        company_name: req.body.company_name,
        phone_number: req.body.phone_number
    })

    const updatedUser = await db.oneOrNone(`SELECT * FROM users WHERE users.id = $(id)`, {
        id: +req.params.id
    })

    res.status(200).json(updatedUser);

});

//update client info
routes.put('/clients/:id', async (req, res) => {

    const client = await db.oneOrNone(`SELECT * FROM clients WHERE clients.id=$(id)`, {
        id: +req.params.id
    })

    if (!client) {
        res.status(404).send('Client was not found')
    }

    const validation = validateUserUpdate(req.body);

    if (validation.error) {
        return res.status(400).send(validation.error.details[0].message);
    }

    await db.oneOrNone(`UPDATE clients
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

    const updatedClient = await db.oneOrNone(`SELECT * FROM clients WHERE clients.id = $(id)`, {
        id: +req.params.id
    })

    res.status(200).json(updatedClient);

})

//Update Invoice completion MESSED
routes.put('/invoices/:id', async (req, res) => {

    const invoice = await db.oneOrNone(`SELECT * FROM invoices WHERE invoices.id=$(id)`, {
        id: +req.params.id
    })

    if (!invoice) {
        res.status(404).send('Invoice was not found')
    }

    await db.oneOrNone(`UPDATE invoices
    SET
    completed = $(completed)
    WHERE invoices.id = $(id)`, {
        id: +req.params.id,
        completed: req.body.completed
    })

    const updatedInvoice = await db.oneOrNone(`SELECT * FROM invoices WHERE invoices.id = $(id)`, {
        id: +req.params.id
    })

    res.status(200).json(updatedInvoice);

})



//DELETE ROUTES=======================================================

//DELETE user
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

//DELETE CLIENT
routes.delete('/clients/:id', async (req, res) => {

    const client = await db.oneOrNone(`SELECT * FROM clients WHERE clients.id = $(id)`, {
        id: +req.params.id
    })

    if (!client) {
        return res.status(404).send('Client ID not found')
    }

    const deleteClient = await db.none(`DELETE FROM clients WHERE clients.id = $(id)`, {
        id: +req.params.id
    })

    res.status(204).json(deleteClient);

})

//DELETE ALL ITEMS (CURRENTLY USED FOR DEV PURPOSES BUT MAYBE HAVE IT TO WHERE THEY DELETE ON INVOICE POST)
routes.delete('/items', async (req, res) => {

    const deleteAllItems = await db.none(`DELETE FROM items`)

    res.status(204).json(deleteAllItems);
})

//DELETE ALL INVOICES (CURRENTLY DEV ONLY)
routes.delete('/invoices', async (req, res) => {

    const deleteAllInvoices = await db.none(`DELETE FROM invoices`)

    res.status(204).json(deleteAllInvoices);
})

//DELETE SPECIFIC INVOICE
routes.delete('/invoices/:id', async (req, res) => {

    const invoice = await db.oneOrNone(`SELECT * FROM invoices WHERE invoices.id = $(id)`, {
        id: +req.params.id
    })

    if (!invoice) {
        return res.status(404).send('Invoice ID not found')
    }

    const deleteInvoice = await db.none(`DELETE FROM invoices WHERE invoices.id=$(id)`, {
        id: +req.params.id
    })

    res.status(204).json(deleteInvoice);
})

//DELETE A SPECIFIC ITEM
routes.delete('/items/:id', async (req, res) => {

    const item = await db.oneOrNone(`SELECT * FROM items WHERE items.id = $(id)`, {
        id: +req.params.id
    })

    if (!item) {
        return res.status(404).send('Item ID not found')
    }

    const deleteItem = await db.none(`DELETE FROM items WHERE items.id = $(id)`, {
        id: +req.params.id
    })

    res.status(204).json(deleteItem);
})

//VALIDATIONS========================================================

function validateUser(user) {
    const schema = Joi.object({

        //fix phone number later
        first_name: Joi.string().min(1),
        last_name: Joi.string().min(1),
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'co'] } }).required(),
        phone_number: Joi.string().min(1),
        company_name: Joi.string().min(1)
    });

    return schema.validate(user);
};

//Also for client updates
function validateUserUpdate(user) {
    const schema = Joi.object({
        first_name: Joi.string().allow('', null),
        last_name: Joi.string().allow('', null),
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'co'] } }),
        company_name: Joi.string().allow('', null),
        phone_number: Joi.string().allow('', null)
    });

    return schema.validate(user);
};


function validateClient(client) {
    const schema = Joi.object({
        first_name: Joi.string().min(1).required(),
        last_name: Joi.string().min(1).required(),
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'co'] } }).required(),
        phone_number: Joi.string().min(1).required(),
        company_name: Joi.string().allow('', null)
    });

    return schema.validate(client);
};

function validateItem(item) {

    const schema = Joi.object({
        item: Joi.string().min(1).required(),
        rate: Joi.number().precision(2).required()
    });

    return schema.validate(item);
}


function validateInvoice(invoice) {

    const schema = Joi.object({
        date_created: Joi.date().required(),
        total: Joi.number().precision(2).required()
    });

    return schema.validate(invoice);
}

function validateInvoiceItems(invoiceItems) {

    const schema = Joi.object({
        item_id: Joi.number().integer().required(),
        quantity: Joi.number().integer().required()
    });

    return schema.validate(invoiceItems);
}


module.exports = routes;