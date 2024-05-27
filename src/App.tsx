import React from 'react';
import Router from './routes/Router';
import { GlobalStyle } from './css/ResetCss';
import { ReactQueryDevtools } from 'react-query/devtools';

function App() {
    return (
        <>
            <GlobalStyle />
            <Router />
            <ReactQueryDevtools initialIsOpen={true}></ReactQueryDevtools>
        </>
    );
}

export default App;
