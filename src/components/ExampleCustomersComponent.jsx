import React, { useEffect, useState } from 'react';

function ExampleCustomersComponent() {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch('http://localhost:5001/api/customers')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(responseData => {
                setData(responseData.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    return (
        <div className="pa4">
            <h1 className="f4 bold center mw6">Customers</h1>
            {data ? (
                <div className="mw6 center">
                    {data.map(customer => (
                        <div key={customer.id} className="grow ph3 pv2 ba b--light-silver mb3">
                            <p className="mv1"><strong>First Name:</strong> {customer.firstName}</p>
                            <p className="mv1"><strong>Last Name:</strong> {customer.lastName}</p>
                            <p className="mv1"><strong>Address:</strong> {customer.address}</p>
                            <p className="mv1"><strong>Phone:</strong> {customer.phone}</p>
                            <p className="mv1"><strong>Start Date:</strong> {customer.startDate}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default ExampleCustomersComponent;
