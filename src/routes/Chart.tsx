import { useQuery } from 'react-query';
import { fetchCoinHistory } from '../api';
import ReactApexChart from 'react-apexcharts';

interface IHistorical {
  time_open: number;
  time_close: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  market_cap: number;
}

interface IApex {
  name: string;
  data: [];
}

interface ChartProps {
  coinId: string;
  isDark: boolean;
}

function Chart({ coinId, isDark }: ChartProps) {
  const { isLoading, data } = useQuery<IHistorical[]>(
    ['ohlcv', coinId],
    () => fetchCoinHistory(coinId),
    {
      refetchInterval: 5000,
    }
  );
  return (
    <h1>
      {isLoading ? (
        'Loading chart...'
      ) : (
        <ReactApexChart
          type='line'
          series={[
            {
              name: 'price',
              data: data?.map((price) => parseInt(price.close)) ?? [],
            },
          ]}
          options={{
            theme: {
              mode: isDark ? 'dark' : 'light',
            },
            chart: {
              height: 500,
              width: 500,
              toolbar: {
                show: false,
              },
              background: 'transparent',
            },
            grid: {
              show: false,
            },
            stroke: {
              curve: 'smooth',
              width: 4,
            },
            yaxis: {
              show: false,
            },
            xaxis: {
              axisBorder: {
                show: false,
              },
              axisTicks: {
                show: false,
              },
              labels: {
                show: false,
              },
              type: 'datetime',
              categories: data?.map((price) =>
                new Date(price.time_close).toISOString()
              ),
            },
            fill: {
              type: 'gradient',
              gradient: { gradientToColors: ['#0be881'], stops: [0, 100] },
            },
            colors: ['#0fbcf9'],
            tooltip: {
              y: {
                formatter: (value) => `$ ${value.toFixed(2)}`,
              },
            },
          }}
        />
      )}
    </h1>
  );
}

export default Chart;
