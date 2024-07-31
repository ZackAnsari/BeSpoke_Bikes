const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./BespokeBikes.db', (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    }
});

const tables = ["Products", "Salespersons", "Customers", "Sales", "Discounts"];

// Function to print table contents
function printTable(tableName) {
    console.log(`Contents of ${tableName} table:`);
    db.each(`SELECT * FROM ${tableName}`, (err, row) => {
        if (err) {
            console.error(`Error reading from ${tableName}:`, err.message);
        } else {
            console.log(row);
        }
    }, (err, count) => {
        if (err) {
            console.error(`Error after reading ${tableName}:`, err.message);
        } else if (count === 0) {
            console.log(`No data found in ${tableName}.`);
        }
        console.log(`-- End of ${tableName} --\n`);
    });
}

// Serialize queries to ensure order
db.serialize(() => {
    tables.forEach(table => printTable(table));
});

// Close the database
db.close((err) => {
    if (err) {
        console.error('Error closing the database', err.message);
    } else {
        console.log('Closed the database connection.');
    }
});