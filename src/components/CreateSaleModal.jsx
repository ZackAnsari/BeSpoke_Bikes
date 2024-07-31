import React, { useState, useEffect } from 'react';
import Modal from './Modal'; 

function CreateSaleModal({ isOpen, onClose, salespersons, products, customers, onSaleCreated }) {
    const [selectedSalesperson, setSelectedSalesperson] = useState('');
    const [selectedProduct, setSelectedProduct] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [salesDate, setSalesDate] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen) {
            setSelectedSalesperson('');
            setSelectedProduct('');
            setSelectedCustomer('');
            setSalesDate('');
            setError(null);
        }
    }, [isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);

        fetch('http://localhost:5001/api/sales', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productId: selectedProduct,
                salespersonId: selectedSalesperson,
                customerId: selectedCustomer,
                salesDate
            })
        })
            .then(response => response.json())
            .then(responseData => {
                if (responseData.error) {
                    setError(responseData.error);
                } else {
                    onSaleCreated();
                    onClose();
                }
            })
            .catch(error => console.error('Error creating sale:', error));
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <form onSubmit={handleSubmit} className="mt3">
                <h2>Create Sale</h2>
                {error && <p className="red">{error}</p>}
                <div className="mb3">
                    <label className="db mb1">Salesperson</label>
                    <select
                        value={selectedSalesperson}
                        onChange={e => setSelectedSalesperson(e.target.value)}
                        className="pa2 input-reset ba bg-transparent w-100"
                    >
                        <option value="">Select Salesperson</option>
                        {salespersons.map(sp => (
                            <option key={sp.id} value={sp.id}>
                                {sp.firstName} {sp.lastName}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb3">
                    <label className="db mb1">Product</label>
                    <select
                        value={selectedProduct}
                        onChange={e => setSelectedProduct(e.target.value)}
                        className="pa2 input-reset ba bg-transparent w-100"
                    >
                        <option value="">Select Product</option>
                        {products.map(p => (
                            <option key={p.id} value={p.id}>
                                {p.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb3">
                    <label className="db mb1">Customer</label>
                    <select
                        value={selectedCustomer}
                        onChange={e => setSelectedCustomer(e.target.value)}
                        className="pa2 input-reset ba bg-transparent w-100"
                    >
                        <option value="">Select Customer</option>
                        {customers.map(c => (
                            <option key={c.id} value={c.id}>
                                {c.firstName} {c.lastName}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb3">
                    <label className="db mb1">Sales Date</label>
                    <input
                        type="date"
                        value={salesDate}
                        onChange={e => setSalesDate(e.target.value)}
                        className="pa2 input-reset ba bg-transparent w-100"
                    />
                </div>
                <div>
                    <button type="submit" className="pa2 ba b--black bg-transparent">Create Sale</button>
                    <button type="button" onClick={onClose} className="pa2 ba b--black bg-transparent ml2">Cancel</button>
                </div>
            </form>
        </Modal>
    );
}

export default CreateSaleModal;
