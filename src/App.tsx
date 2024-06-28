import React, { useState } from 'react';
import Router from './routes/Router';
import { GlobalStyle } from './css/ResetCss';
import { ReactQueryDevtools } from 'react-query/devtools';
import { darkTheme, lightTheme } from './theme';
import styled, { ThemeProvider } from 'styled-components';

const ToggleBtn = styled.button`
    border-radius: 15px;
    background: linear-gradient(to right, #ff7e5f, #feb47b);
    &:hover {
        background: linear-gradient(to right, deepskyblue, #feb47b);
    }
`;

function App() {
    const [isDark, setIsDark] = useState(false);
    const toggleDark = () => setIsDark((current) => !current);

    return (
        <>
            <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
                <ToggleBtn onClick={toggleDark}>toggle</ToggleBtn>
                <GlobalStyle />
                <Router toggleDark={toggleDark} />
                <ReactQueryDevtools initialIsOpen={true}></ReactQueryDevtools>
            </ThemeProvider>
        </>
    );
}

export default App;
