require('dotenv').config();
const PQuery = require('prettyquery');
async function up(pQuery, loud) {
    if (loud)
        console.log('Migrating for habits');
    await pQuery.query('CREATE TABLE habits (id INTEGER PRIMARY KEY AUTO_INCREMENT, h_after VARCHAR(255), h_then VARCHAR(255), datetime_submitted DATETIME DEFAULT (NOW()));');
}
async function down(pQuery, loud) {
    await dropTable(loud, pQuery, 'habits');
}
async function dropTable(loud, pQuery, table_name) {
    if (loud)
        console.log(`Dropping for ${table_name}`);
    await pQuery.query(`DROP TABLE IF EXISTS ${table_name};`);
}
async function refresh(pQuery, loud) {
    await down(pQuery, loud);
    await up(pQuery, loud);
}
async function main(isTest, loud) {
    if (loud)
        console.log('The MODE is ===', process.env.MODE);
    let pQuery = new PQuery({ user: process.env.DB_USER, password: process.env.DB_PASSWORD, host: 'localhost' });
    await pQuery.useDb('habits');
    await refresh(pQuery, loud);
    pQuery.connection.end();
}
if (require.main === module) {
    if (/l|(loud)/i.test(process.argv[2])) {
        main('loud').catch(err => console.error(err));
    }
    else {
        main().catch(err => console.error(err));
    }
}
delete require.cache[module.id];
module.exports = main;
