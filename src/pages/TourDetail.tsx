import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';

import DefaultLayout from '../layout/DefaultLayout';
import DatePickerOne from '../components/Forms/DatePicker/DatePickerOne';
import DatePickerTwo from '../components/Forms/DatePicker/DatePickerTwo';
import SelectGroupTwo from '../components/Forms/SelectGroup/SelectGroupTwo';
import MultiSelect from '../components/Forms/MultiSelect';
import SelectState from '../components/Forms/SelectGroup/SelectState';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';

const TourDetail = () => {
  const [tourTitle, setTourTitle] = useState('');

  const [tourPrice, setTourPrice] = useState('');
  const [tourDayDuration, setTourDayDuration] = useState('');
  const [tourNightDuration, setTourNightDuration] = useState('');

  const [tourTitleDesc, setTourTitleDesc] = useState('');
  const [tourMainDesc, setTourMainDesc] = useState('');
  const [titleImage, setTitleImage] = useState<String>('');
  const [subImage, setSubImage] = useState<Array>([]);
  const [topDeal, setTopDeal] = useState<boolean>(false);
  const [rating, setRating] = useState<string>('');
  const [stars, setStars] = useState<number | undefined>(undefined);
  const [luxuryHotel, setLuxuryHotel] = useState<boolean>(false);
  const [freeWifi, setFreeWifi] = useState<boolean>(false);
  const [transport, setTransport] = useState<boolean>(false);
  const [fooding, setFooding] = useState<boolean>(false);
  const [otherServices, setOtherServices] = useState<string>('');
  const [tourLocation, setTourLocation] = useState<string>('');
  const address = import.meta.env.VITE_API_ADDRESS;
  const [loading, setLoading] = useState(true); // Initialize loading state
  const [images, setImages] = useState([
    'https://picsum.photos/200',
    'https://picsum.photos/200',
    'https://picsum.photos/200',
  ]);
  const [itinerary, setItinerary] = useState([{ day: 1, title: '', desc: '' }]);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchTourDetail = async () => {
      try {
        const response = await axios.get(`${address}/tour/${id}`, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        const { data, itneryTourData } = response.data;
        const { TourDatum } = data;

        console.log(data);
        // Update state with the fetched data
        setTourTitle(data.tourTitle || '');
        setTourPrice(data.tourPrice || '');
        setTourDayDuration(data.tourDurationDay || '');
        setTourNightDuration(data.tourDurationNight || '');
        setTourTitleDesc(data.miniTourDesc || '');
        setTourMainDesc(TourDatum.fullDescription || '');
        setTitleImage(data.tourTitleImage); // Adjust if the image is a URL
        setSubImage(data.SubImages.map((item) => item.filename)); // Adjust if the images are URLs
        setTopDeal(data.topDeals || false);
        setRating(data.rating || '');
        setStars(data.stars || undefined);
        setLuxuryHotel(TourDatum.luxuryHotel || false);
        setFreeWifi(TourDatum.freeWifi || false);
        setTransport(TourDatum.transport || false);
        setFooding(TourDatum.fooding || false);
        setOtherServices(TourDatum.others || '');
        // setTourLocation(data.tourLocation || '');

        setItinerary(itneryTourData);
      } catch (error) {
        console.error('Error occurred', error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    fetchTourDetail();
  }, [id]);

  const handleChange = (index, field, value) => {
    const updatedItinerary = [...itinerary];
    updatedItinerary[index][field] = value;
    setItinerary(updatedItinerary);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here, e.g., send `itinerary` state to backend
    console.log(itinerary);
  };

  const addDay = () => {
    const newDay = {
      day: itinerary.length + 1,
      title: '',
      desc: '',
    };
    setItinerary([...itinerary, newDay]);
  };

  const removeDay = (index) => {
    const updatedItinerary = [...itinerary];
    updatedItinerary.splice(index, 1);
    // Update day numbers after deletion
    updatedItinerary.forEach((item, idx) => {
      item.day = idx + 1;
    });
    setItinerary(updatedItinerary);
  };
  const resetForm = () => {
    setTourTitle('');
    setTourPrice('');
    setTourDayDuration('');
    setTourNightDuration('');
    setTourTitleDesc('');
    setTourMainDesc('');
    setTitleImage(null);
    setSubImage([]);
    setTopDeal(false);
    setRating('');
    setStars(undefined);
    setLuxuryHotel(false);
    setFreeWifi(false);
    setTransport(false);
    setFooding(false);
    setOtherServices('');
    setTourLocation('');
    setItinerary([{ day: 1, title: '', desc: '' }]);
  };

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
      formData.append('deals', topDeal.toString());
      formData.append('rating', rating);
      formData.append('stars', stars !== undefined ? stars.toString() : '');
      formData.append('longDesc', tourMainDesc);
      formData.append('luxuryHotel', luxuryHotel);
      formData.append('wifi', freeWifi);
      formData.append('transport', transport);
      formData.append('fooding', fooding);
      formData.append('others', otherServices);
      formData.append('itneryTourDetails', JSON.stringify(itinerary));

      // Append single image file (titleImage)
      if (titleImage) {
        formData.append('TitleImage', titleImage);
      }

      // Append multiple image files (subImage)
      subImage.forEach((image, index) => {
        formData.append('SubImages', image);
      });

      // Make a POST request to your backend endpoint
      const response = await axios.put(`${address}/tour/edit/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success(`${tourTitle} Updated`);
      resetForm();
      navigate('/tables');
      console.log('Tour updated successfully:', response.data);
      // Handle any success logic here
    } catch (error) {
      console.error('Error creating tour:', error);
      // Handle errors appropriately
      toast.success(` Error occured:${error} `);
    }
  };
  const handleImageDelete = (imageUrl) => {
    setImages(images.filter((image) => image !== imageUrl));
  };

  if (loading) {
    return <div className="loader">Loading...</div>; // Replace this with your actual loader component
  }
  console.log(titleImage);
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Create Tour" />
      <div className="">
        <div className="flex flex-col gap-9">
          {/* <!-- Create Input Fields --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div
              style={{ position: 'sticky' }}
              className=" sticky top-0 z-10  border-b border-stroke py-4 px-6.5 dark:border-strokedark"
            >
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
                  Attached Title Image
                </label>
                <div className="flex flex-wrap mt-4">
                  <div className="relative m-2">
                    <img
                      src={`${address}/images/${titleImage}`}
                      alt={`Thumbnail `}
                      className="w-24 h-24 object-cover rounded-lg shadow-md"
                    />
                    <button
                      // onClick={() => handleImageDelete()}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <label className="mb-3 block text-black dark:text-white">
                  Attached Sub Images
                </label>
                <div className="flex flex-wrap mt-4">
                  {subImage.map((image, index) => {
                    return (
                      <div key={index} className="relative m-2">
                        <img
                          src={`${address}/images/${image}`}
                          alt={`Thumbnail ${index}`}
                          className="w-24 h-24 object-cover rounded-lg shadow-md"
                        />
                        <button
                          onClick={() => handleImageDelete(image)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>
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
                    min={1}
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
                      setLuxuryHotel(e.target.value === '1');
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

              <h2 className="text-2xl font-semibold mb-4">
                Add Tour Itinerary
              </h2>
              <form
                onSubmit={handleSubmit}
                // className="grid grid-cols-1 sm:grid-cols-2 gap-6"
              >
                {itinerary.map((day, index) => (
                  <div key={index} className="mb-4 p-4 border rounded">
                    <h3 className="text-lg font-medium mb-2">Day {day.day}</h3>
                    <div className="mb-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mini Title:
                      </label>
                      <input
                        type="text"
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        value={day.title}
                        onChange={(e) =>
                          handleChange(index, 'title', e.target.value)
                        }
                      />
                    </div>
                    <div className="mb-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Main Description:
                      </label>
                      <textarea
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        value={day.desc}
                        onChange={(e) =>
                          handleChange(index, 'desc', e.target.value)
                        }
                      />
                    </div>
                    {index >= 1 && (
                      <button
                        type="button"
                        className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                        onClick={() => removeDay(index)}
                      >
                        Remove Day
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mr-2"
                  onClick={addDay}
                >
                  Add Day
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                >
                  Submit Itinerary
                </button>
              </form>

              <button
                onClick={createTourHandler}
                className="inline-flex items-center justify-center gap-2.5 bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
              >
                Update Current Tour
              </button>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default TourDetail;
