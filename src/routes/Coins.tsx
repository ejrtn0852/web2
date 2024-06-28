import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { ICoin } from '../interface/CoinInterface';
import { useQuery } from 'react-query';
import { fetchCoins } from '../api';
import { Helmet } from 'react-helmet';
import React from 'react';

const Container = styled.div`
    margin: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
`;
const Header = styled.header`
    text-align: center;
`;
const CoinsList = styled.ul``;
const Coin = styled.li`
    display: flex;
    align-items: center;
    background-color: aliceblue;
    gap: 10px;
    color: black;
    margin: 20px;
    border-radius: 15px;
    padding: 15px;
`;
const Title = styled.h1`
    font-size: 35px;
    color: ${(props) => props.theme.accentColor};
`;
const Img = styled.img`
    width: 35px;
    height: 35px;
    margin-right: 10px;
`;

interface IImageProps {
    src: string;
}

function ImageComponent({ src }: IImageProps) {
    const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.src = '';
    };
    const imageLoaded = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const img = e.currentTarget;
        if (img.naturalWidth === 0 || img.naturalHeight === 0) {
            img.src = '';
        }
    };
    return <Img src={src} onError={handleError} onLoad={imageLoaded} />;
}

function Coins() {
    const { isLoading, data } = useQuery<ICoin[]>('allCoins', fetchCoins);
    const location = useLocation();

    return (
        <Container>
            <Helmet>
                <title>Coins</title>
            </Helmet>
            <Header>
                <Title>코인</Title>
                <CoinsList>
                    {!isLoading
                        ? data?.slice(0, 100).map((coin) => (
                              <Coin key={coin.id}>
                                  {/* TODO: 이미지 에러처리*/}
                                  {(
                                      <ImageComponent
                                          src={`https://raw.githubusercontent.com/ErikThiart/cryptocurrency-icons/master/16/${coin.name
                                              .toLowerCase()
                                              .split(' ')
                                              .join('-')}.png`}
                                      />
                                  ) ?? (
                                      <Img
                                          src={`https://raw.githubusercontent.com/ErikThiart/cryptocurrency-icons/master/16/${coin.name
                                              .toLowerCase()
                                              .split(' ')
                                              .join('-')}.png`}
                                      />
                                  )}
                                  <Link to={`/${coin.id}`} state={{ name: coin.name, path: location.pathname }}>
                                      {coin.name}
                                  </Link>
                              </Coin>
                          ))
                        : 'loading...'}
                </CoinsList>
            </Header>
        </Container>
    );
}

export default Coins;
