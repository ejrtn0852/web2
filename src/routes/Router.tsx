import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Coins from './Coins';
import Coin from './Coin';
import Price from './Price';
import Chart from './Chart';

function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/:coinId" element={<Coin />}>
                    <Route path={`/:coinId/price`} element={<Price />} />
                    <Route path={`/:coinId/chart`} element={<Chart />} />
                </Route>
                <Route path="/" element={<Coins />} />
            </Routes>
        </BrowserRouter>
    );
}

export default Router;
