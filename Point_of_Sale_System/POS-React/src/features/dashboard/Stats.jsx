import { LiaClipboardListSolid, LiaMoneyBillWaveSolid } from 'react-icons/lia';
import { MdAutoGraph } from 'react-icons/md';
import { useSearchParams } from 'react-router-dom';
import { useGetReportsQuery } from '../../services/apiOrders';

const LoadingIndicator = () => (
  <section className="flex animate-pulse flex-col gap-4">
    <div className="flex-between gap-4">
      <div className="flex flex-1 items-center gap-3 self-stretch rounded-md bg-white px-3 py-4 shadow-sm">
        <div className="h-12 w-12 rounded-full bg-gray-200"></div>
        <div className="flex flex-col justify-between gap-2">
          <div className="h-3 w-8 rounded bg-gray-200"></div>
          <div className="h-6 w-[150px] rounded bg-gray-200"></div>
        </div>
      </div>
      <div className="flex flex-1 items-center gap-3 self-stretch rounded-md bg-white px-3 py-4 shadow-sm">
        <div className="h-12 w-12 rounded-full bg-gray-200"></div>
        <div className="flex flex-col justify-between gap-2">
          <div className="h-3 w-8 rounded bg-gray-200"></div>
          <div className="h-6 w-[150px] rounded bg-gray-200"></div>
        </div>
      </div>
      <div className="flex flex-1 items-center gap-3 self-stretch rounded-md bg-white px-3 py-4 shadow-sm">
        <div className="h-12 w-12 rounded-full bg-gray-200"></div>
        <div className="flex flex-col justify-between gap-2">
          <div className="h-3 w-8 rounded bg-gray-200"></div>
          <div className="h-6 w-[150px] rounded bg-gray-200"></div>
        </div>
      </div>
    </div>
  </section>
);

const Stats = () => {
  const [searchParams] = useSearchParams();
  const last = +searchParams.get('last') || 7;
  const { data: report, isLoading, isFetching } = useGetReportsQuery(last);

  return isLoading || isFetching ? (
    <LoadingIndicator />
  ) : (
    <section className="flex flex-col gap-4">
      <div className="flex-between flex-wrap gap-4">
        <div className="flex flex-1 basis-[200px] items-center gap-3 self-stretch rounded-md bg-white px-3 py-4 shadow-sm">
          <div className="flex-center h-[4rem] w-[4rem] rounded-full bg-primary-100 text-[2rem] text-primary-500">
            <LiaMoneyBillWaveSolid />
          </div>
          <div className="flex flex-col justify-between">
            <h4 className="text-[0.8rem] font-[600] uppercase tracking-wide text-gray-500">
              Sales
            </h4>
            <div className="text-[1.5rem] font-[600] text-gray-700">
              Rs. {report?.totalSale || 0}
            </div>
          </div>
        </div>
        <div className="flex flex-1 basis-[200px] items-center gap-3 self-stretch rounded-md bg-white px-3 py-4 shadow-sm">
          <div className="flex-center h-[4rem] w-[4rem] rounded-full bg-red-100 text-[2rem] text-red-500">
            <LiaClipboardListSolid />
          </div>
          <div className="flex flex-col justify-between">
            <h4 className="text-[0.8rem] font-[600] uppercase tracking-wide text-gray-500">
              Orders
            </h4>
            <div className="text-[1.5rem] font-[600] text-gray-700">
              {report?.totalOrders || 0}
            </div>
          </div>
        </div>
        <div className="flex flex-1 basis-[200px] items-center gap-3 self-stretch rounded-md bg-white px-3 py-4 shadow-sm">
          <div className="flex-center h-[4rem] w-[4rem] rounded-full bg-green-100 text-[2rem] text-green-500">
            <MdAutoGraph />
          </div>
          <div className="flex flex-col justify-between">
            <h4 className="text-[0.8rem] font-[600] uppercase tracking-wide text-gray-500">
              Profit
            </h4>
            <div className="text-[1.5rem] font-[600] text-gray-700">
              Rs. {report?.totalProfit || 0}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
