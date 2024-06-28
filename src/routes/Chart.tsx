import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { fetchCoinHistory } from '../api';
import { ChartHistory } from '../interface/ChartHistory';
import ReactApexChart from 'react-apexcharts';

function Chart() {
    const { coinId } = useParams();
    const { isLoading, data } = useQuery<ChartHistory[]>(['ohicv', coinId], () => fetchCoinHistory(coinId));

    if (isLoading) {
        return <div>Loading chart...</div>;
    }

    if (!Array.isArray(data)) {
        return <div>차트가 정상적으로 불러오지 않았습니다.</div>;
    }

    // 데이터를 숫자로 변환하고, 유효하지 않은 값은 필터링
    const chartData =
        data
            ?.map((price) => {
                const closeValue = parseFloat(price.close);
                return isNaN(closeValue) ? null : closeValue; // 유효하지 않은 값은 null로 대체
            })
            .filter((value) => value !== null) ?? []; // null 값을 제거

    const categories = data?.map((d) => new Date(d.time_close * 1000).toLocaleDateString());
    return (
        <div style={{ width: '80%' }}>
            <ReactApexChart
                type="line"
                series={[
                    {
                        name: 'Price',
                        data: chartData,
                    },
                ]}
                options={{
                    theme: {
                        mode: 'dark',
                    },
                    chart: {
                        height: 400, // 차트 높이 설정
                        width: '100%',
                        toolbar: {
                            show: false,
                        },
                        background: 'transparent',
                    },
                    grid: { show: true },
                    stroke: {
                        curve: 'stepline',
                        width: 4,
                    },
                    yaxis: {
                        show: true,
                    },
                    xaxis: {
                        categories: categories,
                        type: 'datetime',
                        axisBorder: { show: true },
                        axisTicks: { show: true },
                        labels: { show: false },
                    },
                    fill: { type: 'gradient', gradient: { gradientToColors: ['blue'] } },
                    tooltip: {
                        y: {
                            formatter: (value) => `$${value.toFixed(3)}`,
                        },
                    },
                }}
            />
        </div>
    );
}

export default Chart;
