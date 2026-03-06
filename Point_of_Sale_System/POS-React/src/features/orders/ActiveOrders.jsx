import { useEffect, useState } from 'react';
import Spinner from '../../Components/UI/Spinner';
import {
  useGetActiveOrdersQuery,
  useGetOrderByIDMutation,
} from '../../services/apiOrders';
import { useDispatch } from 'react-redux';
import { addCartData } from '../cart/cartSlice';
import { useGetCategoriesQuery } from '../../services/apiCategories';
import { useSearchParams } from 'react-router-dom';
import PropTypes from 'prop-types';

const ActiveOrders = ({ onCloseModal }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { data, isLoading } = useGetActiveOrdersQuery();
  const [orders, setOrders] = useState(data && data);
  const { data: categories } = useGetCategoriesQuery();
  const [
    getOrderByID,
    { isLoading: isFetchingById, isSuccess: isFetchedOrder, data: order },
  ] = useGetOrderByIDMutation();
  const dispatch = useDispatch();
  const filter = searchParams.get('filter') || 'dine_in';

  const handlefilter = filter => {
    searchParams.set('filter', filter);
    setSearchParams(searchParams);
  };

  useEffect(() => {
    if (isFetchedOrder) {
      onCloseModal();
      const products = order.products.map(prod => {
        const img = categories?.find(
          cat => cat?.name === prod.product.category.name,
        )?.image;

        return {
          ...prod.product,
          quantity: prod.quantity,
          img,
        };
      });

      const deals = order.deals.map(deal => {
        return {
          ...deal.deal,
          quantity: deal.quantity,
          deal: true,
        };
      });

      const userInfo = {
        name: order.customerName,
        phone: order.phoneNumber,
        address: order.address,
      };

      dispatch(
        addCartData({
          items: [...deals, ...products],
          userInfo,
          orderId: order.orderId,
        }),
      );
    }
  }, [isFetchedOrder]);

  useEffect(() => {
    if (isFetchedOrder) {
      if (order.type === 'dine_in') {
        searchParams.set('table', order.table);
      }
      searchParams.set('type', order.type.replace('_', ' '));
      setSearchParams(searchParams);
    }
  }, [isFetchedOrder]);

  useEffect(() => {
    if (!data) return;
    const filterOrders = data?.filter(ord => ord?.type === filter);
    setOrders(filterOrders);
  }, [data, filter]);

  return (
    <div className=" relative px-5 py-10">
      {isFetchingById && (
        <div className="flex-center absolute inset-0 z-50 h-full w-full bg-white/80">
          <Spinner />
        </div>
      )}
      <h1 className="mb-4 text-center text-[1.5rem] font-[600]">
        Active Orders
      </h1>

      {/* Filter */}
      <div className="mb-4 flex justify-end">
        <div className="flex items-center gap-2 rounded-md border-2 border-gray-100 bg-white px-2 py-[0.4rem] text-[0.7rem] sm:gap-4 sm:text-[0.9rem]">
          <button
            onClick={() => handlefilter('dine_in')}
            className={`rounded-md px-3 py-[0.2rem] hover:bg-primary-500 hover:text-white ${
              filter === 'dine_in' ? 'bg-primary-500 text-white' : ''
            }`}
          >
            Dine in
          </button>
          <button
            onClick={() => handlefilter('take_away')}
            className={`rounded-md px-3 py-[0.2rem] hover:bg-primary-500 hover:text-white ${
              filter === 'take_away' ? 'bg-primary-500 text-white' : ''
            }`}
          >
            Take Away
          </button>
          <button
            onClick={() => handlefilter('delivery')}
            className={`rounded-md px-3 py-[0.2rem] hover:bg-primary-500 hover:text-white ${
              filter === 'delivery' ? 'bg-primary-500 text-white' : ''
            }`}
          >
            Delivery
          </button>
        </div>
      </div>
      {isLoading && (
        <div className="flex-center my-20">
          <Spinner />
        </div>
      )}

      {!isLoading && !orders?.length && (
        <p className="my-20 text-center text-primary-500">
          No Active orders yet!
        </p>
      )}

      {orders && !isLoading && (
        <ul className="grid grid-cols-2 flex-wrap justify-center gap-x-4 gap-y-6">
          {orders?.map((ord, i) => (
            <li
              onClick={() => getOrderByID(ord.orderId)}
              key={i}
              className="flex cursor-pointer gap-3 rounded-lg border-2 px-3 py-1"
            >
              {ord.type === 'dine_in' ? (
                <div className="flex-center h-[50px] w-[50px] rounded-lg bg-red-400 text-[1.2rem] text-white">
                  H{ord.table}
                </div>
              ) : (
                <div className="flex-center h-[50px] w-[50px] rounded-full bg-red-400 text-[1.2rem] uppercase text-white">
                  {ord.type.slice(0, 2)}
                </div>
              )}
              <div>
                <h3 className="font-[600] capitalize">{ord?.customerName}</h3>
                <div
                  className={`flex-between gap-2 text-[0.9rem] font-[500] text-gray-400 ${ord.type === 'dine_in' ? 'flex-col' : ''}`}
                >
                  <span>
                    {ord.products.reduce((acc, itm) => +itm.quantity + acc, 0) +
                      ord.deals.reduce(
                        (acc, itm) => +itm.quantity + acc,
                        0,
                      )}{' '}
                    {ord.products.length === 1 &&
                    ord.products.at(0).quantity === 1
                      ? 'Item'
                      : 'Items'}
                  </span>
                  <span>{ord.type}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

ActiveOrders.propTypes = {
  onCloseModal: PropTypes.func,
};

export default ActiveOrders;
