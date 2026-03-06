import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { PiArrowLineRightBold } from 'react-icons/pi';

import Button from '../../Components/UI/Button';
import IconButton from '../../Components/UI/IconButton';
import CartItem from './CartItem';
import {
  useCreateOrderMutation,
  useUpdateOrderMutation,
} from '../../services/apiOrders';
import { clearCart, lockItems } from './cartSlice';

import Modal from '../../Components/UI/Modal';
import Checkout from './Checkout';

const Cart = ({ onSidebarHide }) => {
  const [searchParams] = useSearchParams();

  const [
    addOrder,
    {
      isLoading: isAdding,
      isSuccess: isAdded,
      error: addError,

      data: orderData,
      reset: resetAddOrder,
    },
  ] = useCreateOrderMutation();

  const [
    updateOrder,
    {
      isLoading: isUpdating,
      isSuccess: isUpdated,
      data: updatedData,
      error: updateError,
      reset: resetUpdateOrder,
    },
  ] = useUpdateOrderMutation();
  const dispatch = useDispatch();
  console.log(updateError);
  const cart = useSelector(state => state.cart);
  const isLock = cart?.items.some(itm => itm.lock);
  const isOrderAlreadyCreated = cart.items.some(itm => itm.lock === true);
  const isAnyOrderItem = cart.items.some(itm => !itm.lock || itm.updated);

  // Get table and type
  const table = searchParams.get('table');
  const type = searchParams.get('type');

  // Create or update order
  const handleOrder = () => {
    const products = [];
    const deals = [];

    // If deals add in deals and if product add in products
    cart.items.forEach(itm => {
      if (itm.deal) {
        deals.push({ deal: itm._id, quantity: +itm.quantity });
      } else {
        products.push({ product: itm._id, quantity: +itm.quantity });
      }
    });

    // Prepare data
    let data = {};
    if (type === 'dine in') {
      data = {
        type: type.toLowerCase().replace(' ', '_'),
        table,
        products,
        deals,
      };
    } else {
      data = {
        type: type.toLowerCase().replace(' ', '_'),
        products,
        deals,
        customerName: cart.userInfo.name,
        address: cart.userInfo.address,
        phoneNumber: cart.userInfo.phone,
      };
    }

    // If order already created update the order otherwise create new order
    if (isOrderAlreadyCreated) {
      updateOrder({ id: cart.orderId, data });
    } else {
      addOrder(data);
    }
  };

  // Handle success/error state
  useEffect(() => {
    if (isAdded) {
      toast.success('Order successfully created!');
      dispatch(lockItems({ orderId: orderData.order.orderId }));
      resetAddOrder();
    }
    if (isUpdated) {
      toast.success('Order successfully updated!');
      dispatch(lockItems({ orderId: updatedData.orderId }));
      resetUpdateOrder();
    }
    if (addError) {
      console.log(addError);
      toast.error(addError?.message);
      resetAddOrder();
    }

    if (updateError) {
      toast.error(updateError?.message);
      resetUpdateOrder();
    }
  }, [
    isAdded,
    addError,
    isUpdated,
    dispatch,
    resetAddOrder,
    resetUpdateOrder,
    updatedData?.id,
    orderData?.id,
    updateError,
  ]);

  return (
    <div className="flex h-full flex-col overflow-x-hidden px-4 py-3">
      <div className="flex-between mb-4">
        <h2 className="text-[1.4rem] font-[700] ">Current Order</h2>
        <IconButton onClick={onSidebarHide}>
          <PiArrowLineRightBold className="text-primary-500" />
        </IconButton>
      </div>
      {/* Clear cart button */}
      <div className="flex-end mb-1">
        <button
          disabled={!cart.items.length}
          onClick={() => dispatch(clearCart())}
          className="rounded-lg bg-red-500 px-3 py-[2px] text-white disabled:opacity-50"
        >
          Clear Cart
        </button>
      </div>
      {/* Cart Items */}
      <section
        className={`h-full ${
          !cart.items.length ? 'overflow-y-hidden' : ' custom-scrollbar'
        }`}
      >
        {!cart.items.length && (
          <p className="flex-center h-full text-[0.9rem] font-[500] text-primary-500">
            No Items added yet!
          </p>
        )}
        <ul className="flex flex-col gap-3 pb-16">
          {cart.items.map((itm, i) => (
            <CartItem key={i} itm={itm} />
          ))}
        </ul>
      </section>
      {/* Total bill and print or send to kitchen Buttons */}
      <section className="mt-auto flex flex-col gap-3 border-t-2 p-3">
        <div className="flex justify-between px-3 font-[700]">
          <span>Total:</span>
          <span>Rs. {Number(cart.totalPrice).toFixed(2, 0)}</span>
        </div>
        <div className="flex justify-between">
          <Button
            disabled={
              isAdding || isUpdating || !cart?.items.length || !isAnyOrderItem
            }
            variant="dark"
            onClick={handleOrder}
          >
            {isAdding || isUpdating ? 'Loading...' : 'Send to Kitchen'}
          </Button>
          <Modal>
            <Modal.Open id="checkout">
              <Button
                disabled={
                  !cart?.items.length || isUpdated || !isLock || isAdding
                }
                variant="dark"
                onClick={handleOrder}
              >
                Checkout
              </Button>
            </Modal.Open>
            <Modal.Window id="checkout" closeOnOverlay zIndex="z-50">
              <Checkout />
            </Modal.Window>
          </Modal>
        </div>
      </section>
    </div>
  );
};

Cart.propTypes = {
  onSidebarHide: PropTypes.func,
};

export default Cart;
