import React, { useEffect, useState } from 'react';

function TotalCommissionsComponent() {
    const [data, setData] = useState(null);

    useEffect(() => {
        console.log('Fetching total commissions data...');
        fetch('http://localhost:5001/api/total-commissions')
            .then(response => {
                console.log('Response from server:', response);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(responseData => {
                console.log('Fetched total commissions data:', responseData);
                setData(responseData.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    return (
        <div className="pa4">
            <h1 className="f4 bold center mw6">Total Commissions</h1>
            {data ? (
                <div className="mw6 center">
                    {data.map(person => (
                        <div key={person.id} className="ph3 pv2 ba b--light-silver mb3">
                            <p className="mv1"><strong>Salesperson:</strong> {person.firstName} {person.lastName}</p>
                            <p className="mv1"><strong>Total Commission:</strong> ${person.totalCommission.toFixed(2)}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default TotalCommissionsComponent;
