const express = require('express');
const cors = require('cors');
const db = require('./database'); 

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/products', (req, res) => {
    const sql = 'SELECT * FROM Products';
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        });
    });
});

app.get('/api/salespersons', (req, res) => {
    const sql = 'SELECT * FROM Salespersons';
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        });
    });
});

app.get('/api/customers', (req, res) => {
    const sql = 'SELECT * FROM Customers';
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        });
    });
});

app.get('/api/sales', (req, res) => {
    const sql = `
        SELECT Sales.id, Sales.salesDate, Products.name AS productName, Products.salePrice, Products.commissionPercentage, Customers.firstName AS customerFirstName, 
               Customers.lastName AS customerLastName, Salespersons.firstName AS salespersonFirstName, 
               Salespersons.lastName AS salespersonLastName, 
               (Products.salePrice * Products.commissionPercentage / 100) AS commission
        FROM Sales
        JOIN Products ON Sales.productId = Products.id
        JOIN Customers ON Sales.customerId = Customers.id
        JOIN Salespersons ON Sales.salespersonId = Salespersons.id
    `;
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error("Error querying sales data:", err.message);
            res.status(400).json({ "error": err.message });
            return;
        }
        console.log("Sales data fetched:", rows);
        res.json({
            "message": "success",
            "data": rows
        });
    });
});

app.get('/api/discounts', (req, res) => {
    const sql = 'SELECT * FROM Discounts';
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        });
    });
});

app.get('/api/total-commissions', (req, res) => {
    const sql = `
        SELECT id, firstName, lastName, totalCommission
        FROM Salespersons
    `;
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error("Error fetching total commissions:", err.message);
            res.status(500).json({ "error": "Internal server error: fetching total commissions" });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        });
    });
});
app.put('/api/salespersons/:id', (req, res) => {
    console.log(`PUT request to update salesperson with id ${req.params.id}`); // Add this line
    const { firstName, lastName, address, phone, startDate, terminationDate, manager } = req.body;
    const id = req.params.id;

    // Check for duplicate names
    const checkSql = `
        SELECT * FROM Salespersons
        WHERE firstName = ? AND lastName = ? AND id != ?
    `;
    db.get(checkSql, [firstName, lastName, id], (err, row) => {
        if (err) {
            console.error("Error checking for duplicate names:", err.message);
            res.status(500).json({ "error": "Internal server error" });
            return;
        }
        if (row) {
            res.status(400).json({ "error": "Duplicate name found" });
            return;
        }

        // Proceed with the update if no duplicates found
        const updateSql = `
            UPDATE Salespersons
            SET firstName = ?, lastName = ?, address = ?, phone = ?, startDate = ?, terminationDate = ?, manager = ?
            WHERE id = ?
        `;
        const params = [firstName, lastName, address, phone, startDate, terminationDate, manager, id];
        db.run(updateSql, params, function(err) {
            if (err) {
                console.error("Error updating salesperson:", err.message);
                res.status(500).json({ "error": "Internal server error" });
                return;
            }
            res.json({
                "message": "success",
                "changes": this.changes
            });
        });
    });
});

app.put('/api/products/:id', (req, res) => {
    const { name, manufacturer, style, purchasePrice, salePrice, qtyOnHand, commissionPercentage } = req.body;
    const id = req.params.id;

    // Check for duplicate products
    const checkSql = `
        SELECT * FROM Products
        WHERE name = ? AND manufacturer = ? AND style = ? AND id != ?
    `;
    db.get(checkSql, [name, manufacturer, style, id], (err, row) => {
        if (err) {
            console.error("Error checking for duplicate products:", err.message);
            res.status(500).json({ "error": "Internal server error" });
            return;
        }
        if (row) {
            res.status(400).json({ "error": "Duplicate product found" });
            return;
        }

        // Proceed with the update if no duplicates found
        const updateSql = `
            UPDATE Products
            SET name = ?, manufacturer = ?, style = ?, purchasePrice = ?, salePrice = ?, qtyOnHand = ?, commissionPercentage = ?
            WHERE id = ?
        `;
        const params = [name, manufacturer, style, purchasePrice, salePrice, qtyOnHand, commissionPercentage, id];
        db.run(updateSql, params, function(err) {
            if (err) {
                console.error("Error updating product:", err.message);
                res.status(500).json({ "error": "Internal server error" });
                return;
            }
            res.json({
                "message": "success",
                "changes": this.changes
            });
        });
    });
});

app.post('/api/sales', (req, res) => {
    const { productId, salespersonId, customerId, salesDate } = req.body;

    // Fetch the sale price and commission percentage
    const fetchSql = `
        SELECT salePrice, commissionPercentage
        FROM Products
        WHERE id = ?
    `;
    db.get(fetchSql, [productId], (err, product) => {
        if (err) {
            console.error("Error fetching product details:", err.message);
            res.status(500).json({ "error": "Internal server error: fetching product details" });
            return;
        }

        if (!product) {
            res.status(400).json({ "error": "Product not found" });
            return;
        }

        const { salePrice, commissionPercentage } = product;
        const commission = (salePrice * commissionPercentage) / 100;

        // Insert the sale
        const insertSaleSql = `
            INSERT INTO Sales (productId, salespersonId, customerId, salesDate)
            VALUES (?, ?, ?, ?)
        `;
        db.run(insertSaleSql, [productId, salespersonId, customerId, salesDate], function(err) {
            if (err) {
                console.error("Error inserting sale:", err.message);
                res.status(500).json({ "error": "Internal server error: inserting sale" });
                return;
            }

            // Recalculate the total commission for the salesperson
            const recalculateCommissionSql = `
                SELECT SUM(Products.salePrice * Products.commissionPercentage / 100) AS totalCommission
                FROM Sales
                JOIN Products ON Sales.productId = Products.id
                WHERE Sales.salespersonId = ?
            `;
            db.get(recalculateCommissionSql, [salespersonId], (err, row) => {
                if (err) {
                    console.error("Error recalculating commission:", err.message);
                    res.status(500).json({ "error": "Internal server error: recalculating commission" });
                    return;
                }

                const totalCommission = row.totalCommission || 0;

                const updateCommissionSql = `
                    UPDATE Salespersons
                    SET totalCommission = ?
                    WHERE id = ?
                `;
                db.run(updateCommissionSql, [totalCommission, salespersonId], function(err) {
                    if (err) {
                        console.error("Error updating commission:", err.message);
                        res.status(500).json({ "error": "Internal server error: updating commission" });
                        return;
                    }

                    res.json({
                        "message": "success",
                        "saleId": this.lastID,
                        "commission": commission
                    });
                });
            });
        });
    });
});

const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
