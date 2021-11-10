const { Client } = require('pg');
const client = new Client();

const initialize = async () => {
    await client.connect();

    const res = await client.query('SELECT $1::text as message', ['Database Connected.'])
    console.log(res.rows[0].message);
    await client.end();
};

exports.initialize = initialize;