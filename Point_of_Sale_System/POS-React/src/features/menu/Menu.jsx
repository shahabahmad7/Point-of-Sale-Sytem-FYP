import { useSearchParams } from 'react-router-dom';

import MenuItem from './MenuItem';
import { useGetProductsQuery } from '../../services/apiProducts';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Button from '../../Components/UI/Button';
import Modal from '../../Components/UI/Modal';
import UserInfoForm from './UserInfoForm';
import Spinner from '../../Components/UI/Spinner';
import { useGetDealsQuery } from '../../services/apiDeals';

const Menu = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');
  const { data, isLoading } = useGetProductsQuery();
  const { data: deals } = useGetDealsQuery();
  const [products, setProducts] = useState(null);
  const userInfo = useSelector(state => state.cart.userInfo);
  const type = searchParams.get('type');
  const table = searchParams.get('table');

  useEffect(() => {
    if (!category || !data) return;
    if (category === 'deals') {
      setProducts(deals);
    } else {
      setProducts(
        data?.filter(
          prod =>
            prod.category.name === category && prod.ingredients.length > 0,
        ),
      );
    }
  }, [category, data, deals]);

  return (
    <section className="mb-10 flex flex-col gap-4 px-4 py-5 sm:px-10">
      {/* IF no type is selected */}
      {!type && (
        <h1 className="mt-28 text-center text-[1.1rem] font-[500] text-primary-500">
          Please Select either Dine in, Take Away or Delivery.
        </h1>
      )}
      {/* if type and table is selected and no category is selected */}
      {type === 'dine in' && table && !category && (
        <h1 className="mt-28 text-center text-[1.1rem] font-[500] text-primary-500">
          Please Select Category.
        </h1>
      )}

      {/* If type is selected and type is not dine and also user info is added but no category is selected */}
      {type !== 'dine in' && type && !category && userInfo && (
        <h1 className="mt-28 text-center text-[1.1rem] font-[500] text-primary-500">
          Please Select Category.
        </h1>
      )}
      {/* If type is selcted and no table is selected */}
      {type === 'dine in' && !table && (
        <h1 className="mt-28 text-center text-[1.1rem] font-[500] text-primary-500">
          Please Select Table.
        </h1>
      )}

      {/* If type is dine in and table is selected and category is selected */}
      {type === 'dine in' && table && category && !isLoading && (
        <>
          <h1 className="text-[2rem] font-[700] uppercase tracking-wide">
            {category}
          </h1>
          {products && products.length > 0 ? (
            <ul className="menu-layout gap-4">
              {products?.map((item, i) => (
                <MenuItem item={item} key={i} category={category} />
              ))}
            </ul>
          ) : (
            <p>
              No {category === 'deals' ? 'deals ' : 'products '} were found!
            </p>
          )}
        </>
      )}

      {/* If type is not dine in and type is selected and no user info is selected */}
      {type !== 'dine in' && type && !userInfo && (
        <div className="flex flex-col items-center gap-6">
          <h1 className=" mt-28 text-center text-[1.1rem] font-[500] text-primary-500">
            Please add your information.
          </h1>
          <Modal>
            <Modal.Open id="user-info">
              <Button className="w-max" variant="dark">
                Add Info
              </Button>
            </Modal.Open>
            <Modal.Window id="user-info" closeOnOverlay zIndex="z-50">
              <UserInfoForm />
            </Modal.Window>
          </Modal>
        </div>
      )}

      {type && category && userInfo && isLoading && (
        <div className="mx-auto my-20">
          <Spinner />
        </div>
      )}

      {/* If type is not dine in and type is selected and user info is added */}
      {type !== 'dine in' && type && category && userInfo && !isLoading && (
        <>
          <h1 className="text-[2rem] font-[700] uppercase tracking-wide">
            {category}
          </h1>
          {products && products.length > 0 ? (
            <ul className="menu-layout gap-4">
              {products?.map((item, i) => (
                <MenuItem item={item} key={i} category={category} />
              ))}
            </ul>
          ) : (
            <p className="mt-20 text-center text-primary-500">
              No {category === 'deals' ? 'deals' : 'products'} were found!
            </p>
          )}
        </>
      )}
    </section>
  );
};

export default Menu;
