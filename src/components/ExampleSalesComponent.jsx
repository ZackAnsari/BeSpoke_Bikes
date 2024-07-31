import React, { useEffect, useState } from 'react';
import CreateSaleModal from './CreateSaleModal';

function ExampleSalesComponent() {
    const [sales, setSales] = useState(null);
    const [salespersons, setSalespersons] = useState([]);
    const [products, setProducts] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [isCreateSaleModalOpen, setIsCreateSaleModalOpen] = useState(false);

    useEffect(() => {
        fetch('http://localhost:5001/api/sales')
            .then(response => response.json())
            .then(responseData => setSales(responseData.data))
            .catch(error => console.error('Error fetching sales:', error));

        fetch('http://localhost:5001/api/salespersons')
            .then(response => response.json())
            .then(responseData => setSalespersons(responseData.data))
            .catch(error => console.error('Error fetching salespersons:', error));

        fetch('http://localhost:5001/api/products')
            .then(response => response.json())
            .then(responseData => setProducts(responseData.data))
            .catch(error => console.error('Error fetching products:', error));

        fetch('http://localhost:5001/api/customers')
            .then(response => response.json())
            .then(responseData => setCustomers(responseData.data))
            .catch(error => console.error('Error fetching customers:', error));
    }, []);

    const handleSaleCreated = () => {
        fetch('http://localhost:5001/api/sales')
            .then(response => response.json())
            .then(responseData => setSales(responseData.data))
            .catch(error => console.error('Error fetching sales:', error));
    };

    return (
        <div className="pa4">
            <h1 className="f4 bold center mw6">Sales</h1>
            <button onClick={() => setIsCreateSaleModalOpen(true)} className="grow pa2 ba b--black bg-blue ">Create Sale</button>

            {sales ? (
                <div className="mw6 center">
                    {sales.map(sale => (
                        <div key={sale.id} className="grow shadow-5 ph3 pv2 ba b--light-silver mb3">
                            <p className="mv1"><strong>Product:</strong> {sale.productName}</p>
                            <p className="mv1"><strong>Customer:</strong> {sale.customerFirstName} {sale.customerLastName}</p>
                            <p className="mv1"><strong>Salesperson:</strong> {sale.salespersonFirstName} {sale.salespersonLastName}</p>
                            <p className="mv1"><strong>Sales Date:</strong> {sale.salesDate}</p>
                            <p className="mv1"><strong>Sale Price:</strong> ${sale.salePrice}</p>
                            <p className="mv1"><strong>Commission:</strong> ${sale.commission}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Loading...</p>
            )}

            <button onClick={() => setIsCreateSaleModalOpen(true)} className="grow pa2 ba b--black bg-blue">Create Sale</button>

            <CreateSaleModal
                isOpen={isCreateSaleModalOpen}
                onClose={() => setIsCreateSaleModalOpen(false)}
                salespersons={salespersons}
                products={products}
                customers={customers}
                onSaleCreated={handleSaleCreated}
            />
        </div>
    );
}

export default ExampleSalesComponent;
