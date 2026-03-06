import {
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  ResponsiveContainer,
} from 'recharts';
import { useSearchParams } from 'react-router-dom';
import { useGetReportsQuery } from '../../services/apiOrders';

const LoadingIndicator = () => (
  <div className="w-full animate-pulse rounded-md bg-gray-100 px-3 py-5 shadow-sm">
    <div className="mb-10 h-5 w-3/4 bg-gray-200"></div>
    <div className="h-60 w-full bg-gray-200"></div>
  </div>
);

const SalesChart = () => {
  const [searchParams] = useSearchParams();

  const last = +searchParams.get('last') || 7;
  const { data, isFetching, error } = useGetReportsQuery(last);

  const filterData = data?.dailyReport?.map(itm => {
    const date = new Date(itm._id);
    const sales = itm?.totalDailyPrice;
    const profit = itm?.totalDailyProfit;
    return {
      sales,
      profit,
      date: date.getDate() + date.toLocaleString('en-US', { weekday: 'short' }),
    };
  });

  return isFetching ? (
    <LoadingIndicator />
  ) : (
    <section className="w-full rounded-md bg-white px-3 py-5 shadow-sm">
      <h2 className="mb-10 text-[1.3rem] font-[600]">
        Sales from Last {last} Days
      </h2>

      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={filterData}>
          <YAxis unit="Rs" />
          <XAxis dataKey="date" />
          <CartesianGrid strokeDasharray="6" />
          <Tooltip contentStyle={{ backgroundColor: 'white' }} />
          <Area
            type="monotone"
            dataKey="sales"
            stroke="#f66b20"
            strokeWidth={2}
            fill="#f66b20"
            name="Sales"
            unit="Rs"
          />
          <Area
            type="monotone"
            dataKey="profit"
            stroke="#66b366"
            fill="#66b366"
            strokeWidth={2}
            unit="Rs"
            name="Profit"
          />
        </AreaChart>
      </ResponsiveContainer>
    </section>
  );
};

export default SalesChart;
