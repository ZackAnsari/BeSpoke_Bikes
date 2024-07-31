const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./bespokeBikes.db', (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        db.exec('PRAGMA foreign_keys = ON;', (error) => {
            if (error) {
                console.error("Pragma statement didn't execute.", error);
            } else {
                console.log("Foreign Key Enforcement is on.");
            }
        });
        initializeDB();
    }
});

function initializeDB() {
    db.serialize(() => {
        db.run(`
            CREATE TABLE IF NOT EXISTS Products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                manufacturer TEXT NOT NULL,
                style TEXT,
                purchasePrice REAL NOT NULL,
                salePrice REAL NOT NULL,
                qtyOnHand INTEGER NOT NULL,
                commissionPercentage REAL NOT NULL,
                UNIQUE(name, manufacturer, style)
            )
        `, (err) => {
            if (err) {
                console.error("Error creating Products table:", err.message);
            }
        });

        db.run(`
            CREATE TABLE IF NOT EXISTS Salespersons (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                firstName TEXT NOT NULL,
                lastName TEXT NOT NULL,
                address TEXT,
                phone TEXT,
                startDate DATE,
                terminationDate DATE,
                manager TEXT,
                totalCommission REAL DEFAULT 0,
                UNIQUE(firstName, lastName, phone)
            )
        `, (err) => {
            if (err) {
                console.error("Error creating Salespersons table:", err.message);
            }
        });

        db.run(`
            CREATE TABLE IF NOT EXISTS Customers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                firstName TEXT NOT NULL,
                lastName TEXT NOT NULL,
                address TEXT,
                phone TEXT,
                startDate DATE,
                UNIQUE(firstName, lastName, phone)
            )
        `, (err) => {
            if (err) {
                console.error("Error creating Customers table:", err.message);
            }
        });

        db.run(`
            CREATE TABLE IF NOT EXISTS Sales (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                productId INTEGER,
                salespersonId INTEGER,
                customerId INTEGER,
                salesDate DATE,
                FOREIGN KEY(productId) REFERENCES Products(id),
                FOREIGN KEY(salespersonId) REFERENCES Salespersons(id),
                FOREIGN KEY(customerId) REFERENCES Customers(id)
            )
        `, (err) => {
            if (err) {
                console.error("Error creating Sales table:", err.message);
            }
        });

        db.run(`
            CREATE TABLE IF NOT EXISTS Discounts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                productId INTEGER,
                beginDate DATE,
                endDate DATE,
                discountPercentage REAL NOT NULL,
                FOREIGN KEY(productId) REFERENCES Products(id)
            )
        `, (err) => {
            if (err) {
                console.error("Error creating Discounts table:", err.message);
            }
        });

        if (process.env.SEED_DB === "true") {
            clearAndSeedData();
        }
    });
}

function clearAndSeedData() {
    const tables = ['Sales', 'Discounts', 'Products', 'Salespersons', 'Customers'];
    const clearTablePromises = tables.map(table => {
        return new Promise((resolve, reject) => {
            db.run(`DELETE FROM ${table}`, [], (err) => {
                if (err) {
                    console.error(`Failed to clear ${table}:`, err.message);
                    reject(err);
                } else {
                    console.log(`Cleared ${table}`);
                    resolve();
                }
            });
        });
    });

    Promise.all(clearTablePromises)
        .then(() => {
            seedData();
        })
        .catch(err => {
            console.error('Error clearing tables:', err);
        });
}

async function seedData() {
    const products = [
        { name: "Roadster", manufacturer: "SpeedX", style: "Road", purchasePrice: 500, salePrice: 750, qtyOnHand: 10, commissionPercentage: 5 },
        { name: "Mountain Climber", manufacturer: "HillMover", style: "Mountain", purchasePrice: 400, salePrice: 600, qtyOnHand: 15, commissionPercentage: 7 },
        { name: "City Bike", manufacturer: "UrbanMove", style: "Urban", purchasePrice: 450, salePrice: 675, qtyOnHand: 20, commissionPercentage: 6 },
        { name: "Speed Demon", manufacturer: "FastWheels", style: "Racing", purchasePrice: 800, salePrice: 1200, qtyOnHand: 5, commissionPercentage: 10 },
        { name: "Commuter", manufacturer: "DailyRide", style: "Hybrid", purchasePrice: 350, salePrice: 500, qtyOnHand: 25, commissionPercentage: 4 }
    ];

    const salespersons = [
        { firstName: "John", lastName: "Doe", address: "1234 Elm St", phone: "555-1234", startDate: "2020-01-10", terminationDate: null, manager: "Zack Ansari" },
        { firstName: "Jane", lastName: "Smith", address: "5678 Oak St", phone: "555-5678", startDate: "2019-05-15", terminationDate: null, manager: "Zack Ansari" },
        { firstName: "Jim", lastName: "Beam", address: "1234 Maple St", phone: "555-4321", startDate: "2020-06-01", terminationDate: null, manager: "Zack Ansari" },
        { firstName: "Jill", lastName: "Valentine", address: "4321 Pine St", phone: "555-8765", startDate: "2021-03-20", terminationDate: null, manager: "Zack Ansari" },
        { firstName: "Jake", lastName: "Long", address: "9876 Spruce St", phone: "555-5671", startDate: "2019-12-15", terminationDate: null, manager: "Zack Ansari" }
    ];

    const customers = [
        { firstName: "Alice", lastName: "Johnson", address: "1010 Maple St", phone: "555-1010", startDate: "2021-06-01" },
        { firstName: "Bob", lastName: "Smith", address: "2020 Pine St", phone: "555-2020", startDate: "2021-07-15" },
        { firstName: "Charlie", lastName: "Brown", address: "3030 Oak St", phone: "555-3030", startDate: "2022-01-01" },
        { firstName: "Daisy", lastName: "Duke", address: "4040 Elm St", phone: "555-4040", startDate: "2022-02-20" },
        { firstName: "Ethan", lastName: "Hunt", address: "5050 Birch St", phone: "555-5050", startDate: "2022-03-15" },
        { firstName: "Fiona", lastName: "Gallagher", address: "6060 Cedar St", phone: "555-6060", startDate: "2022-04-10" },
        { firstName: "George", lastName: "Bluth", address: "7070 Spruce St", phone: "555-7070", startDate: "2022-05-05" },
        { firstName: "Hannah", lastName: "Abbott", address: "8080 Redwood St", phone: "555-8080", startDate: "2022-06-01" },
        { firstName: "Ian", lastName: "Holm", address: "9090 Willow St", phone: "555-9090", startDate: "2022-07-07" },
        { firstName: "Jane", lastName: "Doe", address: "100100 Palm St", phone: "555-0001", startDate: "2022-08-12" }
    ];

    const productIds = [];
    const salespersonIds = [];
    const customerIds = [];

    // Insert data into Products
    for (const p of products) {
        await new Promise((resolve, reject) => {
            db.run('INSERT INTO Products (name, manufacturer, style, purchasePrice, salePrice, qtyOnHand, commissionPercentage) VALUES (?, ?, ?, ?, ?, ?, ?)', 
                [p.name, p.manufacturer, p.style, p.purchasePrice, p.salePrice, p.qtyOnHand, p.commissionPercentage], function(err) {
                    if (err) {
                        console.error('Failed to insert product:', err.message);
                        reject(err);
                    } else {
                        productIds.push(this.lastID);
                        resolve();
                    }
                });
        });
    }

    // Insert data into Salespersons
    for (const s of salespersons) {
        await new Promise((resolve, reject) => {
            db.run('INSERT INTO Salespersons (firstName, lastName, address, phone, startDate, terminationDate, manager, totalCommission) VALUES (?, ?, ?, ?, ?, ?, ?, 0)', 
                [s.firstName, s.lastName, s.address, s.phone, s.startDate, s.terminationDate, s.manager], function(err) {
                    if (err) {
                        console.error('Failed to insert salesperson:', err.message);
                        reject(err);
                    } else {
                        salespersonIds.push(this.lastID);
                        resolve();
                    }
                });
        });
    }

    // Insert data into Customers
    for (const c of customers) {
        await new Promise((resolve, reject) => {
            db.run('INSERT INTO Customers (firstName, lastName, address, phone, startDate) VALUES (?, ?, ?, ?, ?)', 
                [c.firstName, c.lastName, c.address, c.phone, c.startDate], function(err) {
                    if (err) {
                        console.error('Failed to insert customer:', err.message);
                        reject(err);
                    } else {
                        customerIds.push(this.lastID);
                        resolve();
                    }
                });
        });
    }

    const sales = [
        { productId: productIds[0], salespersonId: salespersonIds[0], customerId: customerIds[0], salesDate: "2022-07-01" },
        { productId: productIds[1], salespersonId: salespersonIds[0], customerId: customerIds[1], salesDate: "2022-07-02" },
        { productId: productIds[2], salespersonId: salespersonIds[1], customerId: customerIds[2], salesDate: "2022-07-03" },
        { productId: productIds[3], salespersonId: salespersonIds[2], customerId: customerIds[3], salesDate: "2022-07-04" },
        { productId: productIds[4], salespersonId: salespersonIds[3], customerId: customerIds[4], salesDate: "2022-07-05" }
    ];

    const discounts = [
        { productId: productIds[0], beginDate: "2022-06-01", endDate: "2022-06-30", discountPercentage: 10 },
        { productId: productIds[1], beginDate: "2022-06-15", endDate: "2022-07-15", discountPercentage: 15 },
        { productId: productIds[2], beginDate: "2022-07-01", endDate: "2022-07-31", discountPercentage: 20 },
        { productId: productIds[3], beginDate: "2022-07-15", endDate: "2022-08-15", discountPercentage: 25 },
        { productId: productIds[4], beginDate: "2022-08-01", endDate: "2022-08-31", discountPercentage: 30 }
    ];

    // Insert data into Sales
    for (const s of sales) {
        await new Promise((resolve, reject) => {
            db.run('INSERT INTO Sales (productId, salespersonId, customerId, salesDate) VALUES (?, ?, ?, ?)', 
                [s.productId, s.salespersonId, s.customerId, s.salesDate], err => {
                    if (err) {
                        console.error('Failed to insert sale:', err.message);
                        reject(err);
                    } else {
                        resolve();
                    }
                });
        });
    }

    // Insert data into Discounts
    for (const d of discounts) {
        await new Promise((resolve, reject) => {
            db.run('INSERT INTO Discounts (productId, beginDate, endDate, discountPercentage) VALUES (?, ?, ?, ?)', 
                [d.productId, d.beginDate, d.endDate, d.discountPercentage], err => {
                    if (err) {
                        console.error('Failed to insert discount:', err.message);
                        reject(err);
                    } else {
                        resolve();
                    }
                });
        });
    }

    // Calculate and update total commissions for each salesperson
    for (const salespersonId of salespersonIds) {
        await new Promise((resolve, reject) => {
            const recalculateCommissionSql = `
                SELECT SUM(Products.salePrice * Products.commissionPercentage / 100) AS totalCommission
                FROM Sales
                JOIN Products ON Sales.productId = Products.id
                WHERE Sales.salespersonId = ?
            `;
            db.get(recalculateCommissionSql, [salespersonId], (err, row) => {
                if (err) {
                    console.error("Error recalculating commission:", err.message);
                    reject(err);
                } else {
                    const totalCommission = row.totalCommission || 0;
                    const updateCommissionSql = `
                        UPDATE Salespersons
                        SET totalCommission = ?
                        WHERE id = ?
                    `;
                    db.run(updateCommissionSql, [totalCommission, salespersonId], (err) => {
                        if (err) {
                            console.error("Error updating commission:", err.message);
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                }
            });
        });
    }

    console.log('Database seeding completed.');
}

module.exports = db;
