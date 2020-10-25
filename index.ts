require('dotenv').config({path: __dirname + '/.env'});
const PQuery = require('prettyquery');
const esc = require('sql-escape');

async function main() {
    const pQuery = new PQuery({user: process.env.DB_USER, password: process.env.DB_PASSWORD, db: process.env.DATABASE});

    if (process.argv[2] === 'prev') {
        let num;
        if (/--amt/.test(process.argv[3])) {
            num = /\d+/.exec(process.argv[3])[0];
            num ? true : num = 10;
        } else {
            num = 10;
        }
        const hs = await pQuery.query(`SELECT * FROM habits ORDER BY id DESC LIMIT ${num};`); // hsus! 
        console.log('\nHabits installed:\n');
        hs.forEach(h => console.log(`After '${h.h_after}', then '${h.h_then}'. Set on:`, h.datetime_submitted));
    } else {
        await pQuery.insert('habits', ['h_after', 'h_then'], [[process.argv[2], process.argv[3]]]);
        console.log(`\nSet the habit:`);
        console.log(`\nAfter ${process.argv[2]}, then ${process.argv[3]}`);
        
    }
    pQuery.connection.end();
    process.exit(0);
}

main().catch(err => console.error(err));