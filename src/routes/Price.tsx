import { useQuery } from 'react-query';
import { useContext } from 'react';
import { boxShadow, TickerContext } from './Coin';
import styled from 'styled-components';

const PriceContainer = styled.div``;
const PriceWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 10px;
    height: 50px;
    background-color: darkslateblue;
    color: ${(props) => props.theme.accentColor};
    font-weight: bold;
    padding: 20px;
    border-radius: 15px;
    margin: 10px;
    ${boxShadow};
`;
const FlexDirection = styled(PriceWrapper)`
    height: auto;
    display: flex;
    justify-content: space-around;
    & span {
        color: white;
    }
`;

const Title = styled.div`
    color: ${(props) => props.theme.accentColor};
`;

const TickerDescription = styled.div`
    color: wheat;
`;

function Price() {
    const ticker = useContext(TickerContext);

    return (
        <PriceContainer>
            <PriceWrapper>
                <span>{ticker?.quotes.USD.ath_date.toString() + ':  '}</span>
                <span>{ticker?.quotes.USD.ath_price}</span>
            </PriceWrapper>

            <FlexDirection>
                <div style={{ display: 'flex' }}>
                    <Title>1h_:</Title>
                    <TickerDescription>{ticker?.quotes.USD.percent_change_1h + ','}</TickerDescription>
                </div>
                <div style={{ display: 'flex' }}>
                    <Title>1y_: </Title>
                    <TickerDescription>{ticker?.quotes.USD.percent_change_1y}</TickerDescription>
                </div>

                <div style={{ display: 'flex' }}>
                    <Title>6h: </Title>
                    <TickerDescription>{ticker?.quotes.USD.percent_change_6h}</TickerDescription>
                </div>
            </FlexDirection>

            <PriceWrapper>
                <div style={{ display: 'flex' }}>
                    <Title>First_Date:</Title>
                    <TickerDescription>{ticker?.first_data_at.toString()}</TickerDescription>
                </div>

                <div style={{ display: 'flex' }}>
                    <Title>Last_Update: </Title>
                    <TickerDescription>{ticker?.last_updated.toString()}</TickerDescription>
                </div>
            </PriceWrapper>
        </PriceContainer>
    );
}

export default Price;
