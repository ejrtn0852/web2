import { useNavigate, Link, Outlet, useLocation, useParams, useMatch } from 'react-router-dom';
import { CoinTicker } from '../interface/CoinTicker';
import styled, { css } from 'styled-components';
import { CoinInfo } from '../interface/CoinInfo';
import { useQuery } from 'react-query';
import { fetchCoinInfo, fetchCoinTickers } from '../api';
import { Helmet } from 'react-helmet';
import { createContext, ReactElement } from 'react';

export const boxShadow = css`
    box-shadow:
        rgba(0, 0, 0, 0.25) 0px 54px 55px,
        rgba(0, 0, 0, 0.12) 0px -12px 30px,
        rgba(0, 0, 0, 0.12) 0px 4px 6px,
        rgba(0, 0, 0, 0.17) 0px 12px 13px,
        rgba(0, 0, 0, 0.09) 0px -3px 5px;
`;

const Layout = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Container = styled.div`
    width: 70%;
    margin: 20px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;
const Title = styled.h1`
    text-align: center;
    font-size: 48px;
    font-weight: bold;
    color: ${(props) => props.theme.accentColor};
`;
const CoinLayout = styled.div`
    margin: 20px;
    padding: 20px;
    width: 50%;
    background-color: darkslateblue;
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: center;
    ${boxShadow};
    border-radius: 15px;
`;
const CoinView = styled.div`
    width: 33%;
    display: flex;
    flex-direction: column;
    gap: 15px;
`;
const Description = styled.p`
    padding: 10px;
    width: 50%;
    text-align: center;
`;
const ButtonWrapper = styled.div`
    width: 50%;
    display: flex;
    justify-content: space-between;
    margin: 30px;
`;

const ButtonLayout = styled.div<{ isActive: boolean }>`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 80px;
    height: 30px;
    background-color: darkslateblue;
    border-radius: 10px;
    ${boxShadow};
    color: ${(props) => (props.isActive ? props.theme.accentColor : props.theme.textColor)};

    & a:hover {
        color: ${(props) => props.theme.accentColor};
    }
`;

export const TickerContext = createContext<CoinTicker | undefined>(undefined);

function Coin() {
    const { coinId } = useParams() as { coinId: string };
    const { state } = useLocation();
    const { isLoading: infoLoading, data: infoData } = useQuery<CoinInfo>(['info', coinId], () =>
        fetchCoinInfo(coinId),
    );
    const { isLoading: tickersLoading, data: tickersData } = useQuery<CoinTicker>(['tickers', coinId], () =>
        fetchCoinTickers(coinId),
    );

    // 선택한 URL에 들어가있다면 관련된 객체를 반환한다.
    const priceMatch = useMatch('/:coinId/price');
    const chartMatch = useMatch('/:coinId/chart');
    const loading = infoLoading || tickersLoading;

    return (
        <Layout>
            <Helmet>
                <title>{state?.name ? state?.name : loading ? 'Loading...' : infoData?.name}</title>
            </Helmet>
            <Container>
                <Title>{state?.name ? state?.name : loading ? 'Loading...' : infoData?.name}</Title>
                <CoinLayout>
                    <CoinView>
                        <span>Rank</span>
                        <span>{infoData?.rank}</span>
                    </CoinView>
                    <CoinView>
                        <span>Symbol</span>
                        <span>{infoData?.symbol}</span>
                    </CoinView>
                    <CoinView>
                        <span>Price</span>
                        <span>{tickersData?.quotes.USD.price.toFixed(3)}</span>
                    </CoinView>
                </CoinLayout>
                <Description>{infoData?.description}</Description>
                <CoinLayout>
                    <CoinView>
                        <span>Total Suply:</span>
                        <span>{tickersData?.total_supply}</span>
                    </CoinView>
                    <CoinView>
                        <span>Max Suply:</span>
                        <span>{tickersData?.max_supply}</span>
                    </CoinView>
                </CoinLayout>
                <ButtonWrapper>
                    <ButtonLayout isActive={chartMatch !== null}>
                        <Link to={`/${coinId}/chart`}>Chart</Link>
                    </ButtonLayout>

                    <ButtonLayout isActive={priceMatch !== null}>
                        <Link to={`/${coinId}/price`}>price</Link>
                    </ButtonLayout>
                </ButtonWrapper>

                <TickerContext.Provider value={tickersData}>
                    <Outlet />
                </TickerContext.Provider>
            </Container>
        </Layout>
    );
}

export default Coin;
