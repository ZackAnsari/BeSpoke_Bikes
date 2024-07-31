import React, { useEffect, useState } from 'react';
import Modal from './Modal'; 

function ExampleSalespersonsComponent() {
    const [data, setData] = useState(null);
    const [currentSalesperson, setCurrentSalesperson] = useState(null);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetch('http://localhost:5001/api/salespersons')
            .then(response => response.json())
            .then(responseData => {
                setData(responseData.data);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const handleEditClick = (salesperson) => {
        setCurrentSalesperson(salesperson);
        setError(null); // Clear error state when opening the modal
        setIsModalOpen(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentSalesperson(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);
        fetch(`http://localhost:5001/api/salespersons/${currentSalesperson.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(currentSalesperson)
        })
            .then(response => response.json())
            .then(responseData => {
                if (responseData.error) {
                    setError(responseData.error);
                } else {
                    setData(data.map(salesperson => 
                        salesperson.id === currentSalesperson.id ? currentSalesperson : salesperson
                    ));
                    setIsModalOpen(false);
                    setCurrentSalesperson(null);
                }
            })
            .catch(error => console.error('Error updating data:', error));
    };

    return (
        <div className="pa4">
            <h1 className="f4 bold center mw6">Salespersons</h1>
            {data ? (
                <div className="mw6 center">
                    {data.map(salesperson => (
                        <div key={salesperson.id} className="grow ph3 pv2 ba b--light-silver mb3">
                            <p className="mv1"><strong>Name:</strong> {salesperson.firstName} {salesperson.lastName}</p>
                            <p className="mv1"><strong>Address:</strong> {salesperson.address}</p>
                            <p className="mv1"><strong>Phone:</strong> {salesperson.phone}</p>
                            <p className="mv1"><strong>Start Date:</strong> {salesperson.startDate}</p>
                            <p className="mv1"><strong>Termination Date:</strong> {salesperson.terminationDate || 'N/A'}</p>
                            <p className="mv1"><strong>Manager:</strong> {salesperson.manager}</p>
                            <button onClick={() => handleEditClick(salesperson)}>Edit</button>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Loading...</p>
            )}

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                {currentSalesperson && (
                    <form onSubmit={handleSubmit} className="mt3">
                        <h2>Edit Salesperson</h2>
                        {error && <p className="red">{error}</p>}
                        <div className="mb3">
                            <label className="db mb1">First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={currentSalesperson.firstName}
                                onChange={handleChange}
                                className="pa2 input-reset ba bg-transparent w-100"
                            />
                        </div>
                        <div className="mb3">
                            <label className="db mb1">Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={currentSalesperson.lastName}
                                onChange={handleChange}
                                className="pa2 input-reset ba bg-transparent w-100"
                            />
                        </div>
                        <div className="mb3">
                            <label className="db mb1">Address</label>
                            <input
                                type="text"
                                name="address"
                                value={currentSalesperson.address}
                                onChange={handleChange}
                                className="pa2 input-reset ba bg-transparent w-100"
                            />
                        </div>
                        <div className="mb3">
                            <label className="db mb1">Phone</label>
                            <input
                                type="text"
                                name="phone"
                                value={currentSalesperson.phone}
                                onChange={handleChange}
                                className="pa2 input-reset ba bg-transparent w-100"
                            />
                        </div>
                        <div className="mb3">
                            <label className="db mb1">Start Date</label>
                            <input
                                type="date"
                                name="startDate"
                                value={currentSalesperson.startDate}
                                onChange={handleChange}
                                className="pa2 input-reset ba bg-transparent w-100"
                            />
                        </div>
                        <div className="mb3">
                            <label className="db mb1">Termination Date</label>
                            <input
                                type="date"
                                name="terminationDate"
                                value={currentSalesperson.terminationDate || ''}
                                onChange={handleChange}
                                className="pa2 input-reset ba bg-transparent w-100"
                            />
                        </div>
                        <div className="mb3">
                            <label className="db mb1">Manager</label>
                            <input
                                type="text"
                                name="manager"
                                value={currentSalesperson.manager}
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

export default ExampleSalespersonsComponent;
