import { useEffect, useState } from 'react';
import { addProduct, UpdateProduct, updateProductRenovation, updateProductTournament } from '../../API/api';
import Loader from '../../common/Loader/index';
import useSnackbar from '../../hooks/useSnackbar';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../reducers/index';
import { Switch } from '@headlessui/react';
import {
  fetchProduct,
  fetchProductCategories,
  IsDeleteProduct,
} from '../../reducers/productSlice';

const TableProd = () => {
  const { showSnackbar } = useSnackbar();
  const dispatch = useDispatch<any>();
  const Product = useSelector((state: RootState) => state.product.product);
  const categories = useSelector(
    (state: RootState) => state.product.categories,
  );
  const loading = useSelector((state: RootState) => state.product.loading);
  const error = useSelector((state: RootState) => state.product.error);

  const [addProductModel, setAddProductModel] = useState(false);
  const [productForm, setProductForm] = useState({
    product_name: '',
    product_price: '',
    product_description: '',
    category: '',
    images: '',
    Product_stock: '',
    Product_dis_rate: '',
    Product_rating: '',
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setProducts([]); // Clear results if input is empty
      return;
    }

    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/product_Search/${searchTerm}`
        );
        const data = await response.json();
        setProducts(data.result);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchProducts();
    }, 500); // Add debounce to prevent excessive API calls

    return () => clearTimeout(delayDebounce); // Cleanup on unmount or input change
  }, [searchTerm]);

  console.log('productForm :>> ', productForm);
  const HandleAddProduct = async () => {
    try {
      const res = await addProduct(productForm);
      dispatch(fetchProduct());
    } catch (error) {
      console.log('error :>> ', error);
    }
  };

  const handleRenovationToggle = async (productId: string) => {
    console.log('productId:', productId);
    try {
      await updateProductRenovation(productId);

      await dispatch(fetchProduct());

      showSnackbar('Renovation status updated successfully!', 'success');
    } catch (error) {
      showSnackbar('Failed to update renovation status', 'error');
    }
  };
  const handleTournamentToggle = async (productId: string) => {
    console.log('productId:', productId);
    try {
      await updateProductTournament(productId);

      await dispatch(fetchProduct());

      showSnackbar('Tournament status updated successfully!', 'success');
    } catch (error) {
      showSnackbar('Failed to update Tournament status', 'error');
    }
  };
  const handleDelete = async (id: string) => {
    try {
      dispatch(IsDeleteProduct(id)).then(() => {
        dispatch(fetchProduct());
        showSnackbar('User deleted successfully!', 'success');
      });
    } catch (error) {
      showSnackbar('Failed to delete user', 'error');
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      await UpdateProduct(id);
      showSnackbar('User Update successfully!', 'success');
      dispatch(fetchProduct());
    } catch (error) {
      showSnackbar('Failed to Update user', 'error');
    }
  };

  const HandleChange = (e: React.FormEvent<any>) => {
    const { id, value, type, files } = e.target as any;
    setProductForm((prevForm) => ({
      ...prevForm,
      [id]: type === 'file' ? files[0] : value,
    }));
  };

  useEffect(() => {
    dispatch(fetchProduct());
    dispatch(fetchProductCategories());
  }, []);

  if (error) return;
  return (
    <>
      <Breadcrumb pageName="Box Management" />
      <div className="bg-gray-300 p-4">
        <span>Search:</span>
        <input
          type="text"
          className='p-2 px-2'
          placeholder="Type to search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="">
        {loading ? (
          <Loader />
        ) : (
          <div className="max-w-full overflow-x-auto">
            <button
              className="px-4 my-3 py-1 bg-yellow-200 text-black rounded-lg"
              onClick={() => {
                setAddProductModel(true);
              }}
            >
              Add Box
            </button>
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="min-w-[20px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                    Index
                  </th>
                  <th className=" py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                    Box Name
                  </th>
                  <th className=" py-4 px-4 font-medium text-black dark:text-white">
                    Price
                  </th>
                  <th className=" py-4 px-4 font-medium text-black dark:text-white">
                    Description
                  </th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">
                    Image
                  </th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">
                    Address
                  </th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">
                    Discount Rate
                  </th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">
                    Rating
                  </th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">
                    Renovation
                  </th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">
                    Part of Tournament
                  </th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">
                    Delete
                  </th>
                  {/* <th className="py-4 px-4 font-medium text-black dark:text-white">
                    Edit
                  </th> */}
                </tr>
              </thead>
              <tbody>
                {Product &&
                  (Product).map((item: any, index: any) => (
                    <tr key={index}>
                      <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                        <h5 className="font-medium text-black dark:text-white">
                          {index + 1}
                        </h5>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                        <h5 className="font-medium text-black dark:text-white">
                          {item.product_name}
                        </h5>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          ₹{item.product_price}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          {item.product_description}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <img
                          src={item.product_img[0]}
                          alt={item.product_name}
                          className="w-20 h-20 object-cover"
                        />
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          {item?.product_address}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          {item.Product_dis_rate}%
                        </p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          {item.Product_rating}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <Switch
                          checked={item.isRenovation}
                          onChange={() => handleRenovationToggle(item._id)}
                          className={`${item.isRenovation ? 'bg-green-500' : 'bg-blue-300'}
      relative inline-flex h-6 w-11 items-center rounded-full`}
                        >
                          <span
                            className={`${item.isRenovation ? 'translate-x-6' : 'translate-x-1'}
        inline-block h-4 w-4 transform bg-white rounded-full transition`}
                          />
                        </Switch>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <Switch
                          checked={item.isTournament}
                          onChange={() => handleTournamentToggle(item._id)}
                          className={`${item.isTournament ? 'bg-green-500' : 'bg-blue-300'}
      relative inline-flex h-6 w-11 items-center rounded-full`}
                        >
                          <span
                            className={`${item.isTournament ? 'translate-x-6' : 'translate-x-1'}
        inline-block h-4 w-4 transform bg-white rounded-full transition`}
                          />
                        </Switch>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <div className="flex items-center space-x-3.5">
                          <button
                            className="hover:text-primary bg-red-400 px-3 rounded-md text-white "
                            onClick={() => {
                              handleDelete(item._id);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                      {/* <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <div className="flex items-center space-x-3.5">
                          <button
                            className="hover:text-primary bg-green-400 px-3 rounded-md text-white "
                            onClick={() => {
                              handleUpdate(item._id);
                            }}
                          >
                            Edit
                          </button>
                        </div>
                      </td> */}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
        {addProductModel && (
          <>
            <div className="justify-center items-center text-sm flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
              <div className="relative my-6 mx-auto text-sm mt-30 min-w-[600px] max-w-3xl">
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none">
                  <div className="flex items-start justify-between p-2 border-b border-solid border-blueGray-200 rounded-t">
                    <h3 className="text-xl font-semibold">Add Box</h3>
                    <button
                      className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                      onClick={() => setAddProductModel(false)}
                    >
                      <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                        ×
                      </span>
                    </button>
                  </div>
                  {/*body*/}
                  <div className="relative p-6 flex-auto">
                    <form>
                      <div className="grid gap-6 mb-6 md:grid-cols-2">
                        <div>
                          <label
                            htmlFor="product_name"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            ProductName
                          </label>
                          <input
                            type="text"
                            onChange={HandleChange}
                            id="product_name"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="ProductName"
                            required
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="product_description"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Description
                          </label>
                          <input
                            type="text"
                            onChange={HandleChange}
                            id="product_description"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Description"
                            required
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="product_price"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Price
                          </label>
                          <input
                            type="text"
                            id="product_price"
                            onChange={HandleChange}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="500$"
                            required
                          />
                        </div>

                        <form className="max-w-sm mx-auto">
                          <label
                            htmlFor="Category"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            city
                          </label>
                          <select
                            onChange={HandleChange}
                            id="category"
                            className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          >
                            <option value="" disabled selected>
                              Choose a category
                            </option>
                            {categories &&
                              categories.map((item: any) => (
                                <option key={item._id} value={item._id}>
                                  {item.name}
                                </option>
                              ))}
                          </select>
                        </form>

                        {/* <div>
                        <label
                          htmlFor="category"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          
                        </label>
                        <input
                          type="text"
                          id="category"
                          onChange={HandleChange}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="Category"
                          required
                        />
                      </div> */}
                        <div>
                          <label
                            htmlFor="product_address"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Box Address
                          </label>
                          <input
                            type="text"
                            onChange={HandleChange}
                            id="product_address"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Box Address"
                            required
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="Product_stock"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Size
                          </label>
                          <input
                            type="text"
                            onChange={HandleChange}
                            id="Product_stock"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Size (1140 sq'ft)"
                            required
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="Product_dis_rate"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Discount Rate
                          </label>
                          <input
                            type="text"
                            onChange={HandleChange}
                            id="Product_dis_rate"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="product discount rate"
                            required
                          />
                        </div>
                      </div>
                      <div className="mb-6">
                        <label
                          htmlFor="Product_rating"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Rating
                        </label>
                        <input
                          type="text"
                          onChange={HandleChange}
                          id="Product_rating"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="out of 10"
                          required
                        />
                      </div>
                      <div className="mb-6">
                        <label
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          htmlFor="images"
                        >
                          Upload file
                        </label>
                        <input
                          onChange={HandleChange}
                          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                          id="images"
                          type="file"
                        />
                      </div>
                    </form>
                  </div>
                  <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                    <button
                      className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => setAddProductModel(false)}
                    >
                      Close
                    </button>
                    <button
                      className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => {
                        setAddProductModel(false);
                        HandleAddProduct();
                      }}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        )}
      </div>
    </>
  );
};

export default TableProd;
