import { useEffect, useState } from 'react';
import { Package } from '../../types/package';
import axios from 'axios';
const address = import.meta.env.VITE_API_ADDRESS;
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import TextBoxes from '../TextBox';
const TourPackageTable = () => {
  const [tours, setTours] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchTours = async () => {
      try {
        // Fetch the tours
        const response = await axios.get(`${address}/get/tourpackages`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const packages = response.data.allPackageTours; // assuming your data structure
        console.log('Tours fetched successfully:', tours);

        // Fetch packages for each tour
        const fetchPackages = packages.map(async (tour) => {
          try {
            const packageResponse = await axios.get(
              `${address}/get/tourpackage/${tour.id}`,
            );
            return { ...tour, packages: packageResponse.data };
          } catch (packageError) {
            console.error(
              `Error fetching packages for tour ${tour.id}:`,
              packageError,
            );
            return { ...tour, packages: [] }; // handle error by returning an empty packages array
          }
        });

        // Wait for all package requests to complete
        const toursWithPackages = await Promise.all(fetchPackages);
        console.log('Tours with packages:', toursWithPackages);

        // Update state with tours including their packages
        setTours(toursWithPackages);
      } catch (error) {
        console.error('Error fetching tours:', error);
      }
    };

    fetchTours();
  }, []);

  const deleteHandler = async (id: Number) => {
    try {
      const result = window.confirm(
        'Are you sure you want to delete this tour?',
      );
      if (result) {
        const response = await axios.delete(`${address}/tour/delete/${id}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log('Tour deleted successfully:', response.data);

        toast.success('Tour Deleted Successfully');
        setTours(tours.filter((tour) => tour.id !== id));
      } else {
        return;
      }
    } catch (error) {
      toast.error('Tour could not be deleted');
      console.error('Error deleting tour:', error);
    }
  };
  const editHandler = (tourId: Number) => {
    navigate(`/tour-detail/${tourId}`);
  };

  // const allTours = tours.map((item)=>{
  //   return(
  // })

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                PACKAGE NAME
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black text-center dark:text-white">
                TOURS INCLUDED
              </th>
              {/* <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Top Deals
              </th> */}
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody>
            {tours.map((packageItem, key) => {
              const packagesItem =
                packageItem?.packages && !Array.isArray(packageItem.packages)
                  ? packageItem.packages.tours.map((item) => item.tourTitle)
                  : ['No Tours Added'];
              return (
                <tr key={key}>
                  <td className=" w-[15%] border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                    <h3 className="font-medium text-xl text-black dark:text-white">
                      {packageItem.packageTitle}
                    </h3>
                  </td>
                  <td className=" w-[75%] border-b border-[#eee] py-5 px-4 dark:border-strokedark ">
                    <p className="text-black dark:text-white">
                      <TextBoxes strings={packagesItem} />
                    </p>
                  </td>
                  {/* <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p
                      className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
                        packageItem.topDeals === true
                          ? 'bg-success text-success'
                          : 'bg-warning text-warning'
                      }`}
                    >
                      {packageItem.topDeals ? 'Yes' : 'No'}
                    </p>
                  </td> */}
                  <td className=" w-[10%] border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <div className="flex items-center space-x-3.5">
                      <button
                        onClick={() => editHandler(packageItem.id)}
                        className="hover:text-primary"
                      >
                        <svg
                          className="fill-current"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8.99981 14.8219C3.43106 14.8219 0.674805 9.50624 0.562305 9.28124C0.47793 9.11249 0.47793 8.88749 0.562305 8.71874C0.674805 8.49374 3.43106 3.20624 8.99981 3.20624C14.5686 3.20624 17.3248 8.49374 17.4373 8.71874C17.5217 8.88749 17.5217 9.11249 17.4373 9.28124C17.3248 9.50624 14.5686 14.8219 8.99981 14.8219ZM1.85605 8.99999C2.4748 10.0406 4.89356 13.5562 8.99981 13.5562C13.1061 13.5562 15.5248 10.0406 16.1436 8.99999C15.5248 7.95936 13.1061 4.44374 8.99981 4.44374C4.89356 4.44374 2.4748 7.95936 1.85605 8.99999Z"
                            fill=""
                          />
                          <path
                            d="M9 11.3906C7.67812 11.3906 6.60938 10.3219 6.60938 9C6.60938 7.67813 7.67812 6.60938 9 6.60938C10.3219 6.60938 11.3906 7.67813 11.3906 9C11.3906 10.3219 10.3219 11.3906 9 11.3906ZM9 7.875C8.38125 7.875 7.875 8.38125 7.875 9C7.875 9.61875 8.38125 10.125 9 10.125C9.61875 10.125 10.125 9.61875 10.125 9C10.125 8.38125 9.61875 7.875 9 7.875Z"
                            fill=""
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => {
                          deleteHandler(packageItem.id);
                        }}
                        className="hover:text-danger"
                      >
                        <svg
                          className="fill-current"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                            fill=""
                          />
                          <path
                            d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                            fill=""
                          />
                          <path
                            d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                            fill=""
                          />
                          <path
                            d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
                            fill=""
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TourPackageTable;
