import React, { useEffect, useState } from 'react';
import Modal from './Modal'; 

function ExampleProductsComponent() {
    const [data, setData] = useState(null);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetch('http://localhost:5001/api/products')
            .then(response => response.json())
            .then(responseData => {
                setData(responseData.data);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const handleEditClick = (product) => {
        setCurrentProduct(product);
        setError(null); 
        setIsModalOpen(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentProduct(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);
        fetch(`http://localhost:5001/api/products/${currentProduct.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(currentProduct)
        })
            .then(response => response.json())
            .then(responseData => {
                if (responseData.error) {
                    setError(responseData.error);
                } else {
                    setData(data.map(product => 
                        product.id === currentProduct.id ? currentProduct : product
                    ));
                    setIsModalOpen(false);
                    setCurrentProduct(null);
                }
            })
            .catch(error => console.error('Error updating data:', error));
    };

    return (
        <div className="pa4">
            <h1 className="f4 bold center mw6">Products</h1>
            {data ? (
                <div className="mw6 center">
                    {data.map(product => (
                        <div key={product.id} className="grow ph3 pv2 ba b--light-silver mb3">
                            <p className="mv1"><strong>Name:</strong> {product.name}</p>
                            <p className="mv1"><strong>Manufacturer:</strong> {product.manufacturer}</p>
                            <p className="mv1"><strong>Style:</strong> {product.style}</p>
                            <p className="mv1"><strong>Purchase Price:</strong> ${product.purchasePrice}</p>
                            <p className="mv1"><strong>Sale Price:</strong> ${product.salePrice}</p>
                            <p className="mv1"><strong>Quantity On Hand:</strong> {product.qtyOnHand}</p>
                            <p className="mv1"><strong>Commission Percentage:</strong> {product.commissionPercentage}%</p>
                            <button onClick={() => handleEditClick(product)}>Edit</button>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Loading...</p>
            )}

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                {currentProduct && (
                    <form onSubmit={handleSubmit} className="mt3">
                        <h2>Edit Product</h2>
                        {error && <p className="red">{error}</p>}
                        <div className="mb3">
                            <label className="db mb1">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={currentProduct.name}
                                onChange={handleChange}
                                className="pa2 input-reset ba bg-transparent w-100"
                            />
                        </div>
                        <div className="mb3">
                            <label className="db mb1">Manufacturer</label>
                            <input
                                type="text"
                                name="manufacturer"
                                value={currentProduct.manufacturer}
                                onChange={handleChange}
                                className="pa2 input-reset ba bg-transparent w-100"
                            />
                        </div>
                        <div className="mb3">
                            <label className="db mb1">Style</label>
                            <input
                                type="text"
                                name="style"
                                value={currentProduct.style}
                                onChange={handleChange}
                                className="pa2 input-reset ba bg-transparent w-100"
                            />
                        </div>
                        <div className="mb3">
                            <label className="db mb1">Purchase Price</label>
                            <input
                                type="number"
                                name="purchasePrice"
                                value={currentProduct.purchasePrice}
                                onChange={handleChange}
                                className="pa2 input-reset ba bg-transparent w-100"
                            />
                        </div>
                        <div className="mb3">
                            <label className="db mb1">Sale Price</label>
                            <input
                                type="number"
                                name="salePrice"
                                value={currentProduct.salePrice}
                                onChange={handleChange}
                                className="pa2 input-reset ba bg-transparent w-100"
                            />
                        </div>
                        <div className="mb3">
                            <label className="db mb1">Quantity On Hand</label>
                            <input
                                type="number"
                                name="qtyOnHand"
                                value={currentProduct.qtyOnHand}
                                onChange={handleChange}
                                className="pa2 input-reset ba bg-transparent w-100"
                            />
                        </div>
                        <div className="mb3">
                            <label className="db mb1">Commission Percentage</label>
                            <input
                                type="number"
                                name="commissionPercentage"
                                value={currentProduct.commissionPercentage}
                                onChange={handleChange}
                                className="pa2 input-reset ba bg-transparent w-100"
                            />
                        </div>
                        <div>
                            <button type="submit" className="pa2 ba b--black bg-transparent">Save</button>
                            <button type="button" onClick={() => setIsModalOpen(false)} className="pa2 ba b--black bg-transparent ml2">Cancel</button>
                        </div>
                    </form>
                )}
            </Modal>
        </div>
    );
}

export default ExampleProductsComponent;
