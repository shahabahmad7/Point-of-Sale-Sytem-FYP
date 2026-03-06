import { ImPen } from 'react-icons/im';
import { MdDeleteForever } from 'react-icons/md';

import IconButton from '../../Components/UI/IconButton';
import Modal from '../../Components/UI/Modal';
import CategoryForm from './CategoryForm';
import ConfirmDelete from '../../Components/UI/ConfirmDelete';
import {
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
} from '../../services/apiCategories';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import DataTable from '../../Components/UI/DataTable';
import { toast } from 'react-toastify';

const CategoriesTable = () => {
  const { data, isLoading } = useGetCategoriesQuery();

  const [deleteCategory, { isLoading: isDeleting, isSuccess, reset, error }] =
    useDeleteCategoryMutation();
  const [categories, setCategories] = useState(data);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || undefined;

  // Filter data
  useEffect(() => {
    if (data && searchQuery) {
      const regExp = new RegExp(searchQuery, 'i');

      const newCategories = data?.filter(itm => regExp.test(itm.name));
      setCategories(newCategories);
    }
    if (data && !searchQuery) {
      setCategories(data);
    }
  }, [searchQuery, data]);

  // Set default data
  useEffect(() => {
    setCategories(data);
  }, [data]);

  // Handle error
  useEffect(() => {
    if (error) {
      toast.error(error.message, { autoClose: 5000 });
      reset();
    }
  }, [error]);
  return (
    <DataTable
      edit
      del
      rowColors
      data={searchQuery ? categories : data}
      isLoading={isLoading}
      pagination={false}
      head={['Image', 'Category']}
      width={[20, 60, 10, 10]}
      render={(cat, i) => (
        <>
          <Modal>
            <td className="w-[20%] px-3 py-2">
              <img
                src={`http://127.0.0.1:8000/public/images/${cat.image}`}
                className="h-[50px] w-[50px] object-cover"
                loading="lazy"
              />
            </td>
            <td className="px-3 py-2 font-[600]">{cat.name}</td>
            {/* Edit Button */}
            <td className="w-[10%] px-3 py-2">
              <Modal.Open id="edit">
                <IconButton
                  className={`text-[1.3rem] text-primary-500 ${
                    i % 2 !== 0 ? 'hover:bg-primary-200' : ''
                  }`}
                >
                  <ImPen />
                </IconButton>
              </Modal.Open>
              <Modal.Window id="edit" closeOnOverlay zIndex="z-50">
                <CategoryForm edit category={cat} />
              </Modal.Window>
            </td>
            {/* Delete Button */}
            <td className="w-[10%] px-3 py-2">
              <Modal.Open id="delete">
                <IconButton className="text-[1.3rem] text-red-500 hover:bg-red-200">
                  <MdDeleteForever />
                </IconButton>
              </Modal.Open>
              <Modal.Window id="delete" center closeOnOverlay zIndex="z-50">
                <ConfirmDelete
                  onConfirm={() => deleteCategory(cat._id)}
                  message="Are you sure you want to delete this category?"
                  successMessage={`Category "${cat.name}" successfully deleted!`}
                  isLoading={isDeleting}
                  isSuccess={isSuccess}
                  reset={reset}
                />
              </Modal.Window>
            </td>
          </Modal>
        </>
      )}
    />
  );
};

export default CategoriesTable;
