import { useEffect, useRef, useState } from 'react';
import { useGetInvoiceMutation } from '../../services/apiOrders';
import { useDispatch, useSelector } from 'react-redux';
import Invoice from '../../Components/Invoices/Invoice';
import Button from '../../Components/UI/Button';
import { useReactToPrint } from 'react-to-print';
import { clearCart } from './cartSlice';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

const PrintButton = ({ isLoading, printBill, onCloseModal }) => {
  const [getInvoice, { isLoading: isGetting, error }] = useGetInvoiceMutation();
  const [amount, setAmount] = useState(null);
  const dispatch = useDispatch();
  const cart = useSelector(state => state.cart);
  const isLock = cart.items.some(itm => itm.lock);
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    documentTitle: 'Invoice',
    content: () => componentRef.current,
    onBeforeGetContent: () => printBill && getInvoice(cart.orderId),
    onAfterPrint: () => {
      if (printBill) {
        dispatch(clearCart());
        onCloseModal();
      }
    },
  });

  const handleAlert = () => {
    const value = prompt('Please Enter Amount!');
    if (!value) return;
    if (value < cart.totalPrice) {
      toast.error('The Amount is less than total Bill', { autoClose: 6000 });
      return;
    }
    setAmount(+value);
  };

  useEffect(() => {
    if (error) toast.error(error?.message, { autoClose: 6000 });
  }, [error]);

  return (
    <>
      <Button
        onClick={printBill && !amount ? handleAlert : handlePrint}
        disabled={!cart?.items.length || isGetting || !isLock || isLoading}
        variant="dark"
      >
        {isGetting
          ? 'Loading...'
          : printBill
            ? 'Print Invoice'
            : 'Duplicate Invoice'}
      </Button>
      <div className="hidden">
        <Invoice
          ref={componentRef}
          cart={cart}
          printBill={printBill}
          amountPaid={amount}
          remainingBalance={amount - cart.totalPrice}
        />
      </div>
    </>
  );
};

PrintButton.propTypes = {
  isLoading: PropTypes.bool,
  printBill: PropTypes.bool,
  onCloseModal: PropTypes.func,
};

export default PrintButton;
