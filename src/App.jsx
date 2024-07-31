import React from 'react';
import ExampleProductsComponent from './components/ExampleProductsComponent';
import ExampleSalespersonsComponent from './components/ExampleSalespersonsComponent';
import ExampleCustomersComponent from './components/ExampleCustomersComponent';
import ExampleSalesComponent from './components/ExampleSalesComponent';
import TotalCommissionsComponent from './components/TotalCommisonsComponet';

function App() {
    return (
        <div className="App">
          <h1 className="bold center mw6 font-light-green">BeSpoke Bikes</h1>
            <div className="flex justify-between">
                <div className="w-33 pa2">
                    <ExampleProductsComponent />
                </div>
                <div className="w-33 pa2">
                    <ExampleSalespersonsComponent />
                </div>
                <div className="w-33 pa2">
                    <ExampleCustomersComponent />
                </div>
                <div className="w-33 pa2">
                    <ExampleSalesComponent />
                </div>
                <div className="w-33 pa2">
                    <TotalCommissionsComponent />
                </div>
            </div>
        </div>
    );
}

export default App;

