import Button from '../../Components/UI/Button';
import DataTable from '../../Components/UI/DataTable';
import Modal from '../../Components/UI/Modal';
import { useGetActiveOrdersQuery } from '../../services/apiOrders';
import OrderDetail from './OrderDetail';
import { isToday } from '../../utils/isToday';

const colors = {
  processing: 'text-primary-500',
  completed: 'text-green-500',
  cancelled: 'text-red-500',
};
const ActiveOrders = () => {
  const { data: activeOrders, isLoading } = useGetActiveOrdersQuery();
  console.log(activeOrders);
  return (
    <section className="rounded-md bg-white px-3 py-5 shadow-sm">
      <h2 className="text-[1.3rem] font-[600] capitalize">Active Orders</h2>
      <DataTable
        head={['Order ID', 'Type', 'Name', 'Date', 'Status', 'View']}
        width={[20, 15, 25, 25, 15]}
        data={activeOrders}
        isLoading={isLoading}
        render={item => (
          <>
            <td className="px-3 py-2 text-start">#{item.orderId}</td>
            <td className="px-3 py-2 capitalize">
              {item.type.replace('_', ' ')}
            </td>
            <td className="px-3 py-2 capitalize">{item.customerName ?? '-'}</td>
            <td className="px-3 py-2">
              <div>
                {isToday(new Date(item.createdAt).toLocaleDateString())
                  ? 'Today at '
                  : new Date(item.createdAt).toLocaleDateString()}{' '}
              </div>
              <div>{new Date(item.createdAt).toLocaleTimeString()}</div>
            </td>
            <td
              className={`font-[700] capitalize ${colors[item.status.toLowerCase()]}
        `}
            >
              {item.status === 'processing' ? 'in progress' : item.status}
            </td>
            <Modal>
              <Modal.Open id="view-order">
                <td>
                  <Button variant="underline" className="text-primary-500">
                    View
                  </Button>
                </td>
              </Modal.Open>
              <Modal.Window zIndex="z-50" id="view-order" closeOnOverlay>
                <OrderDetail order={item} />
              </Modal.Window>
            </Modal>
          </>
        )}
      />
    </section>
  );
};

export default ActiveOrders;
