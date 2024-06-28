import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import CheckboxFive from '../components/Checkboxes/CheckboxFive';
import CheckboxFour from '../components/Checkboxes/CheckboxFour';
import CheckboxOne from '../components/Checkboxes/CheckboxOne';
import CheckboxThree from '../components/Checkboxes/CheckboxThree';
import CheckboxTwo from '../components/Checkboxes/CheckboxTwo';
import SwitcherFour from '../components/Switchers/SwitcherFour';
import SwitcherOne from '../components/Switchers/SwitcherOne';
import SwitcherThree from '../components/Switchers/SwitcherThree';
import SwitcherTwo from '../components/Switchers/SwitcherTwo';
import DefaultLayout from '../layout/DefaultLayout';
import DatePickerOne from '../components/Forms/DatePicker/DatePickerOne';
import DatePickerTwo from '../components/Forms/DatePicker/DatePickerTwo';
import SelectGroupTwo from '../components/Forms/SelectGroup/SelectGroupTwo';
import MultiSelect from '../components/Forms/MultiSelect';
import SelectState from '../components/Forms/SelectGroup/SelectState';
import { useRef, useState } from 'react';
import axios from 'axios';

const CreateTour = () => {
  const [tourTitle, setTourTitle] = useState('');

  const [tourPrice, setTourPrice] = useState('');
  const [tourDayDuration, setTourDayDuration] = useState('');
  const [tourNightDuration, setTourNightDuration] = useState('');

  const [tourTitleDesc, setTourTitleDesc] = useState('');
  const [tourMainDesc, setTourMainDesc] = useState('');
  const [titleImage, setTitleImage] = useState<File | null>(null);
  const [subImage, setSubImage] = useState<File[]>([]);
  const [topDeal, setTopDeal] = useState<boolean>(false);
  const [rating, setRating] = useState<string>('');
  const [stars, setStars] = useState<number | undefined>(undefined);
  const [luxuryHotel, setluxuryHotel] = useState<boolean>(false);
  const [freeWifi, setFreeWifi] = useState<boolean>(false);
  const [transport, setTransport] = useState<boolean>(false);
  const [fooding, setFooding] = useState<boolean>(false);
  const [otherServices, setOtherServices] = useState<string>('');
  const [tourLocation, setTourLocation] = useState<string>('');
  const address = import.meta.env.VITE_API_ADDRESS;

  const createTourHandler = async () => {
    try {
      // Create a new FormData instance for file uploads
      const formData = new FormData();

      // Append each field individually to FormData
      formData.append('title', tourTitle);
      formData.append('miniDesc', tourTitleDesc);
      formData.append('price', tourPrice);
      formData.append('durationDay', tourDayDuration);
      formData.append('durationNight', tourNightDuration);
      formData.append('location', tourLocation);
      formData.append('deals', topDeal);
      formData.append('rating', rating);
      formData.append('stars', stars);
      formData.append('longDesc', tourMainDesc);
      formData.append('luxuryHotel', luxuryHotel);
      formData.append('wifi', freeWifi);
      formData.append('transport', transport);
      formData.append('fooding', fooding);
      formData.append('others', otherServices);

      // Append single image file (titleImage)
      if (titleImage) {
        formData.append('TitleImage', titleImage);
      }

      // Append multiple image files (subImage)
      subImage.forEach((image, index) => {
        formData.append('SubImages', image);
      });

      // Make a POST request to your backend endpoint
      const response = await axios.post(`${address}/createtour`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Tour creation successful:', response.data);
      // Handle any success logic here
    } catch (error) {
      console.error('Error creating tour:', error);
      // Handle errors appropriately
    }
  };

  // const createTourHandler = async () => {
  //   console.log('jkhk');
  //   try {
  //     // Create an object with textual/JSON data
  //     const obj = {
  //       title: tourTitle,
  //       miniDesc: tourTitleDesc,
  //       price: tourPrice,
  //       durationDay: tourDayDuration,
  //       durationNight: tourNightDuration,
  //       location: tourLocation,
  //       deals: topDeal,
  //       rating: rating,
  //       stars: stars,
  //       longDesc: tourMainDesc,
  //       luxuryHotel: luxuryHotel,
  //       wifi: freeWifi,
  //       transport: transport,
  //       fooding: fooding,
  //       others: otherServices,
  //     };
  //     console.log(obj);

  //     // Create a new FormData instance for file uploads
  //     const formData = new FormData();

  //     // Append textual/JSON data to FormData
  //     formData.append('data', JSON.stringify(obj));

  //     // Append single image file (titleImage)
  //     if (titleImage) {
  //       formData.append('TitleImage', titleImage);
  //     }

  //     // Append multiple image files (subImage)
  //     subImage.forEach((image, index) => {
  //       formData.append(`subImage_${index}`, image);
  //     });

  //     // Make a POST request to your backend endpoint
  //     const response = await axios.post(`${address}/createtour`, formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     });
  //     console.log(response);
  //     console.log('Tour creation successful:', response.data);
  //     // Handle any success logic here
  //   } catch (error) {
  //     console.error('Error creating tour:', error);
  //     // Handle errors appropriately
  //   }
  // };
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Create Tour" />
      <div className="">
        <div className="flex flex-col gap-9">
          {/* <!-- Create Input Fields --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Create Tour Fields
              </h3>
            </div>
            <div className="flex flex-col gap-5.5 p-6.5">
              <div className="grid sm:grid-cols-2 md:flex md:flex-row">
                <div className="w-full md:w-1/2 md:pr-2">
                  <label className="mb-3 block text-black dark:text-white">
                    Tour Title Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Title Name"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    value={tourTitle}
                    onChange={(e) => setTourTitle(e.target.value)}
                  />
                </div>
                <div className="w-full md:w-1/2 md:pl-2">
                  <label className="mb-3 block text-black dark:text-white">
                    Tour Price
                  </label>
                  <input
                    type="number"
                    placeholder="Enter Tour Price"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    value={tourPrice}
                    onChange={(e) => setTourPrice(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 md:flex md:flex-row">
                <div className="w-full md:w-1/2 md:pr-2">
                  <label className="mb-3 block text-black dark:text-white">
                    Tour Duration (Day)
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Duration in Days"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    value={tourDayDuration}
                    onChange={(e) => setTourDayDuration(e.target.value)}
                  />
                </div>

                <div className="w-full md:w-1/2 md:pl-2">
                  <label className="mb-3 block text-black dark:text-white">
                    Tour Duration (Night)
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Duration in Nights"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    value={tourNightDuration}
                    onChange={(e) => setTourNightDuration(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="mb-3 block text-black dark:text-white">
                  Tour Title Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Enter up to 20 words"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  maxLength="200"
                  value={tourTitleDesc}
                  onChange={(e) => setTourTitleDesc(e.target.value)}
                ></textarea>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Limit: 20 words
                </p>
              </div>
              <div>
                <label className="mb-3 block text-black dark:text-white">
                  Tour Main Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Enter main description "
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  value={tourMainDesc}
                  onChange={(e) => setTourMainDesc(e.target.value)}
                ></textarea>
              </div>
              <div>
                <label className="mb-3 block text-black dark:text-white">
                  Attach Title Image
                </label>
                <input
                  type="file"
                  className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setTitleImage(e.target.files[0]); // Store the file object in state
                    }
                  }}
                />
              </div>
              <div>
                <label className="mb-3 block text-black dark:text-white">
                  Attach Sub Images
                </label>
                <input
                  type="file"
                  multiple
                  className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const input = e.target;
                    if (input.files) {
                      const filesArray = Array.from(input.files); // Convert FileList to Array

                      if (filesArray.length < 5) {
                        alert('Please select at least 5 images.');
                        input.value = ''; // Clear the input
                        return;
                      }

                      setSubImage(filesArray); // Store the files array in state
                    }
                  }}
                />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Please attach at least 5 images.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 md:flex md:flex-row">
                <div className="w-full md:w-1/2 md:pr-2">
                  <SelectState />
                </div>
                <div className="w-full md:w-1/2 md:pr-2">
                  <label className="mb-3 block text-black dark:text-white">
                    Tour in Top Deal
                  </label>
                  <select
                    onChange={(e) => {
                      setTopDeal(e.target.value === '1');
                    }}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    value={topDeal ? '1' : '0'} // Bind the state value to the select element
                  >
                    <option value="0">No</option>
                    <option value="1">Yes</option>
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 md:flex md:flex-row">
                <div className="w-full md:w-1/2 md:pr-2">
                  <label className="mb-3 block text-black dark:text-white">
                    Rating
                  </label>
                  <input
                    type="number"
                    placeholder="Enter Rating in number"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                  />
                </div>

                <div className="w-full md:w-1/2 md:pl-2">
                  <label className="mb-3 block text-black dark:text-white">
                    Stars
                  </label>
                  <input
                    type="number"
                    placeholder="Enter stars from 1 to 5"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    value={stars !== undefined ? stars : ''}
                    onChange={(e) =>
                      setStars(
                        e.target.value ? Number(e.target.value) : undefined,
                      )
                    }
                    min="1" // Minimum value constraint
                    max="5" // Maximum value constraint
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-3 md:flex md:flex-row">
                <div className="w-full md:w-1/3 md:pr-2">
                  <label className="mb-3 block text-black dark:text-white">
                    Luxury Hotel
                  </label>
                  <select
                    onChange={(e) => {
                      setluxuryHotel(e.target.value === '1');
                    }}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  >
                    <option value="0">No</option>
                    <option value="1">Yes</option>
                  </select>
                </div>

                <div className="w-full md:w-1/3 md:pl-2">
                  <label className="mb-3 block text-black dark:text-white">
                    Free Wifi
                  </label>
                  <select
                    onChange={(e) => {
                      setFreeWifi(e.target.value === '1');
                    }}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  >
                    <option value="0">No</option>
                    <option value="1">Yes</option>
                  </select>
                </div>
                <div className="w-full md:w-1/3 md:pl-2">
                  <label className="mb-3 block text-black dark:text-white">
                    Transport Facility
                  </label>

                  <select
                    onChange={(e) => {
                      setTransport(e.target.value === '1');
                    }}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  >
                    <option value="0">No</option>
                    <option value="1">Yes</option>
                  </select>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 md:flex md:flex-row">
                <div className="w-full md:w-1/2 md:pr-2">
                  <label className="mb-3 block text-black dark:text-white">
                    Fooding (Lunch / Dinner)
                  </label>
                  <select
                    onChange={(e) => {
                      setFooding(e.target.value === '1');
                    }}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  >
                    <option value="0">No</option>
                    <option value="1">Yes</option>
                  </select>
                </div>

                <div className="w-full md:w-1/2 md:pl-2">
                  <label className="mb-3 block text-black dark:text-white">
                    Others
                  </label>
                  <input
                    type="text"
                    placeholder="Enter in two to four words."
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    value={otherServices}
                    onChange={(e) => setOtherServices(e.target.value)}
                  />
                </div>
              </div>
              {/* rating , star, top deals. */}
              {/* <div>
                <label className="mb-3 block text-black dark:text-white">
                  Active Input
                </label>
                <input
                  type="text"
                  placeholder="Active Input"
                  className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                />
              </div>

              <div>
                <label className="mb-3 block font-medium text-black dark:text-white">
                  Disabled label
                </label>
                <input
                  type="text"
                  placeholder="Disabled label"
                  disabled
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary dark:disabled:bg-black"
                />
              </div> */}
              <button
                // to="#"
                onClick={createTourHandler}
                className="inline-flex items-center justify-center gap-2.5 bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
              >
                <span>
                  <svg
                    className="fill-current"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17.8125 16.6656H2.1875C1.69022 16.6656 1.21331 16.4681 0.861675 16.1164C0.510044 15.7648 0.3125 15.2879 0.3125 14.7906V5.20935C0.3125 4.71207 0.510044 4.23516 0.861675 3.88353C1.21331 3.53189 1.69022 3.33435 2.1875 3.33435H17.8125C18.3098 3.33435 18.7867 3.53189 19.1383 3.88353C19.49 4.23516 19.6875 4.71207 19.6875 5.20935V14.7906C19.6875 15.2879 19.49 15.7648 19.1383 16.1164C18.7867 16.4681 18.3098 16.6656 17.8125 16.6656ZM2.1875 4.58435C2.02174 4.58435 1.86277 4.6502 1.74556 4.76741C1.62835 4.88462 1.5625 5.04359 1.5625 5.20935V14.7906C1.5625 14.9564 1.62835 15.1153 1.74556 15.2325C1.86277 15.3498 2.02174 15.4156 2.1875 15.4156H17.8125C17.9783 15.4156 18.1372 15.3498 18.2544 15.2325C18.3717 15.1153 18.4375 14.9564 18.4375 14.7906V5.20935C18.4375 5.04359 18.3717 4.88462 18.2544 4.76741C18.1372 4.6502 17.9783 4.58435 17.8125 4.58435H2.1875Z"
                      fill=""
                    />
                    <path
                      d="M9.9996 10.6438C9.63227 10.6437 9.2721 10.5421 8.95898 10.35L0.887102 5.45001C0.744548 5.36381 0.642073 5.22452 0.602222 5.06277C0.58249 4.98268 0.578725 4.89948 0.591144 4.81794C0.603563 4.73639 0.631922 4.65809 0.674602 4.58751C0.717281 4.51692 0.773446 4.45543 0.839888 4.40655C0.906331 4.35767 0.981751 4.32236 1.06184 4.30263C1.22359 4.26277 1.39455 4.28881 1.5371 4.37501L9.60898 9.28126C9.7271 9.35331 9.8628 9.39143 10.0012 9.39143C10.1395 9.39143 10.2752 9.35331 10.3934 9.28126L18.4621 4.37501C18.5323 4.33233 18.6102 4.30389 18.6913 4.29131C18.7725 4.27873 18.8554 4.28227 18.9352 4.30171C19.015 4.32115 19.0901 4.35612 19.1564 4.40462C19.2227 4.45312 19.2788 4.51421 19.3215 4.58438C19.3642 4.65456 19.3926 4.73245 19.4052 4.81362C19.4177 4.89478 19.4142 4.97763 19.3948 5.05743C19.3753 5.13723 19.3404 5.21242 19.2919 5.27871C19.2434 5.34499 19.1823 5.40108 19.1121 5.44376L11.0402 10.35C10.7271 10.5421 10.3669 10.6437 9.9996 10.6438Z"
                      fill=""
                    />
                  </svg>
                </span>
                Create New Tour
              </button>
            </div>
          </div>

          {/* <!-- Toggle switch input --> */}
          {/* <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Toggle switch input
              </h3>
            </div>
            <div className="flex flex-col gap-5.5 p-6.5">
              <SwitcherOne />
              <SwitcherTwo />
              <SwitcherThree />
              <SwitcherFour />
            </div>
          </div> */}

          {/* <!-- Time and date --> */}
          {/* <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Time and date
              </h3>
            </div>
            <div className="flex flex-col gap-5.5 p-6.5">
              <DatePickerOne />
              <DatePickerTwo />
            </div>
          </div> */}

          {/* <!-- File upload --> */}
          {/* <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                File upload
              </h3>
            </div>
            <div className="flex flex-col gap-5.5 p-6.5">
              <div>
                <label className="mb-3 block text-black dark:text-white">
                  Attach file
                </label>
                <input
                  type="file"
                  className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-3 block text-black dark:text-white">
                  Attach file
                </label>
                <input
                  type="file"
                  className="w-full rounded-md border border-stroke p-3 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white"
                />
              </div>
            </div>
          </div> */}
        </div>

        <div className="flex flex-col gap-9">
          {/* <!-- Textarea Fields --> */}
          {/* <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Textarea Fields
              </h3>
            </div>
            <div className="flex flex-col gap-5.5 p-6.5">
              <div>
                <label className="mb-3 block text-black dark:text-white">
                  Default textarea
                </label>
                <textarea
                  rows={6}
                  placeholder="Default textarea"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                ></textarea>
              </div>

              <div>
                <label className="mb-3 block text-black dark:text-white">
                  Active textarea
                </label>
                <textarea
                  rows={6}
                  placeholder="Active textarea"
                  className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                ></textarea>
              </div>

              <div>
                <label className="mb-3 block text-black dark:text-white">
                  Disabled textarea
                </label>
                <textarea
                  rows={6}
                  disabled
                  placeholder="Disabled textarea"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary dark:disabled:bg-black"
                ></textarea>
              </div>
            </div>
          </div> */}

          {/* <!-- Checkbox and radio --> */}
          {/* <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Checkbox and radio
              </h3>
            </div>
            <div className="flex flex-col gap-5.5 p-6.5">
              <CheckboxOne />
              <CheckboxTwo />
              <CheckboxThree />
              <CheckboxFour />
              <CheckboxFive />
            </div>
          </div> */}

          {/* <!-- Select input --> */}
          {/* <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Select input
              </h3>
            </div>
            <div className="flex flex-col gap-5.5 p-6.5">
              <SelectGroupTwo />
              <MultiSelect id="multiSelect" />
            </div>
          </div> */}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default CreateTour;
