import { MdOutlineDiscount } from 'react-icons/md';

import PropTypes from 'prop-types';
import Input from '../../Components/UI/Input';
import { useForm } from 'react-hook-form';
import Button from '../../Components/UI/Button';
import {
  useCreateDealMutation,
  useUpdateDealMutation,
} from '../../services/apiDeals';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

const DealForm = ({
  selectProducts,
  onCloseModal,
  setSelectProducts,
  edit,
  deal,
}) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: edit ? { dealname: deal.name, price: +deal.price } : {},
  });
  const [createDeal, { isLoading, isSuccess, reset, error }] =
    useCreateDealMutation();
  const [
    updateDeal,
    {
      isLoading: isUpdating,
      reset: resetUpdate,
      isSuccess: isUpdated,
      error: updateError,
    },
  ] = useUpdateDealMutation();

  const total = {
    totalCost: 0,
    totalProfit: 0,
    totalProducts: 0,
    totalPrice: 0,
  };
  selectProducts?.forEach(prod => {
    const cost = prod.cost * prod.quantity;
    const profit = prod.price * prod.quantity - prod.cost * prod.quantity;
    total.totalProducts += +prod.quantity;
    total.totalCost += cost;
    total.totalProfit += profit;
    total.totalPrice += cost + profit;
  });

  const onSubmit = _data => {
    const data = {
      name: _data.dealname,
      price: +_data.price,
      products: {},
    };
    data.products = selectProducts.map(prd => ({
      product: prd._id,
      quantity: prd.quantity,
    }));

    if (edit) {
      updateDeal({ id: deal._id, data });
    } else {
      createDeal(data);
    }
  };

  // Handle success state when deal is created
  useEffect(() => {
    if (isSuccess) {
      toast.success('Deal successfully created!', { autoClose: 6000 });
      reset();
      onCloseModal();
      setSelectProducts([]);
    }
  }, [isSuccess, reset, onCloseModal, setSelectProducts]);

  // Handle success state when deal is updated
  useEffect(() => {
    if (isUpdated) {
      toast.success('Deal successfully updated!', { autoClose: 6000 });
      resetUpdate();
      onCloseModal();
    }
  }, [isUpdated, resetUpdate, onCloseModal]);

  useEffect(() => {
    if (error) {
      toast.error(error?.message, { autoClose: 5000 });
      reset();
    }
    if (updateError) {
      toast.error(updateError?.message, { autoClose: 5000 });
      resetUpdate();
    }
  }, [error, updateError, reset, resetUpdate]);

  return (
    <div>
      <h1 className="flex items-center justify-center gap-3 bg-primary-500 py-3 text-[1.4rem] font-[600] text-white">
        <MdOutlineDiscount />
        <span>Add new Deal</span>
      </h1>
      <div className="grid grid-cols-2 gap-2 py-2">
        <h3 className="px-3  text-[1rem] ">
          <span className="font-[600]">Total Products: </span>
          <span>{total.totalProducts}</span>
        </h3>
        <h3 className="px-3  text-[1rem] ">
          <span className="font-[600]">Total Cost: </span>
          <span>{total.totalCost}</span>
        </h3>
        <h3 className="px-3  text-[1rem] ">
          <span className="font-[600]">Total Profit: </span>
          <span>{total.totalProfit}</span>
        </h3>
        <h3 className="px-3  text-[1rem] ">
          <span className="font-[600]">Total Price: </span>
          <span>{total.totalPrice}</span>
        </h3>
      </div>
      <form className="my-3 px-5" onSubmit={handleSubmit(onSubmit)}>
        <Input
          register={register}
          label="Deal Name"
          id="dealname"
          required="Deal name is required!"
          error={errors?.dealname?.message}
          showError
          type="text"
          disabled={isLoading || isUpdating}
        />
        <Input
          register={register}
          label="Price"
          id="price"
          required="Price is required!"
          error={errors?.price?.message}
          showError
          type="number"
          min="0"
          step="any"
          disabled={isLoading || isUpdating}
        />

        <div className="flex-end mt-5">
          <Button
            disabled={isLoading || isUpdating}
            isLoading={isLoading || isUpdating}
            variant="dark"
            type="submit"
          >
            Save
          </Button>
        </div>
      </form>
    </div>
  );
};

DealForm.propTypes = {
  selectProducts: PropTypes.arrayOf(PropTypes.object),
  onCloseModal: PropTypes.func,
  setSelectProducts: PropTypes.func,
  edit: PropTypes.bool,
  deal: PropTypes.object,
};

export default DealForm;
