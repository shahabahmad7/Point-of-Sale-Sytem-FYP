import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

const ConfirmDelete = ({
  onCloseModal,
  message,
  onConfirm,
  isLoading,
  isSuccess,
  reset,
  successMessage,
  className,
}) => {
  useEffect(() => {
    if (isSuccess) {
      if (successMessage) toast.success(successMessage);
      onCloseModal();
      reset?.();
    }
  }, [isSuccess, onCloseModal, reset, successMessage]);
  return (
    <div className="flex flex-col gap-5 sm:gap-10">
      <div className="w-full bg-primary-500 text-white">
        <h1 className="px-10 py-3 text-[1.5rem] font-[600]">Please Confirm</h1>
      </div>
      <p className={`px-5 text-center text-[1rem] ${className}`}>{message}</p>
      <div className="flex-end mb-5 px-5">
        <button
          onClick={onCloseModal}
          type="button"
          disabled={isLoading}
          className="rounded-md px-5 py-2 text-[0.9rem] uppercase tracking-wide hover:bg-primary-100 hover:text-primary-500 disabled:cursor-not-allowed sm:text-[1rem]"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={isLoading}
          type="button"
          className="rounded-md px-5 py-2 text-[0.9rem] font-[600] uppercase tracking-wide text-red-500 hover:bg-red-400 hover:text-white disabled:bg-red-400 disabled:text-white disabled:opacity-90 sm:text-[1rem]"
        >
          {isLoading ? 'Deleting...' : 'Confirm'}
        </button>
      </div>
    </div>
  );
};

ConfirmDelete.propTypes = {
  onCloseModal: PropTypes.func,
  message: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  isSuccess: PropTypes.bool,
  reset: PropTypes.func,
  successMessage: PropTypes.string,
  className: PropTypes.string,
};

export default ConfirmDelete;
