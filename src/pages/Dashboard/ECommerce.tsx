import React, { useEffect, useState } from 'react';
import CardDataStats from '../../components/CardDataStats';
import ChartOne from '../../components/Charts/ChartOne';
import ChartThree from '../../components/Charts/ChartThree';
import ChartTwo from '../../components/Charts/ChartTwo';
import ChatCard from '../../components/Chat/ChatCard';
import MapOne from '../../components/Maps/MapOne';
import TableOne from '../../components/Tables/TableOne';
import DefaultLayout from '../../layout/DefaultLayout';
import axios from 'axios';
import { toast } from 'react-toastify';
import { MultiSelect } from 'react-multi-select-component';
import Chip from '../../common/Chip';
import Spinner from '../../common/spinner/spinner';
const address = import.meta.env.VITE_API_ADDRESS;
const ECommerce: React.FC = () => {
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState([]);
  const [includedPackages, setIncludedPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState([
    { minititle: '', maintitle: '', img: null },
  ]);
  const [titleImage, setTitleImage] = useState();
  const [mainTitle, setMainTitle] = useState();
  const [miniTitile, setMiniTitle] = useState();
  const [savedSlider, setSavedSlider] = useState([]);
  const [save, setSave] = useState(false);
  console.log(savedSlider);
  useEffect(() => {
    const loadOption = async () => {
      try {
        const response = await axios.get(`${address}/getSliderData`, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        const data = response.data;
        setSavedSlider(data.data);
      } catch (err) {
        console.log(err);
      }
    };
    loadOption();
  }, [save]);
  useEffect(() => {
    const loadOption = async () => {
      try {
        const response = await axios.get(`${address}/get/tourpackages`, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        const response2 = await axios.get(`${address}/fetchhomepagesection`, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        const tourResponse = response2.data?.tourPackage;
        const itemSelected = tourResponse?.map((item) => item.packageTitle);

        setIncludedPackages(itemSelected);

        const tourPackages = response.data.allPackageTours;

        const options = tourPackages.map((item: Object) => ({
          value: item.id,
          label: item.packageTitle,
        }));
        setOptions(options);
      } catch (error) {
        console.error('Error loading options:', error);
      }
    };
    loadOption();
  }, [loading]);

  const handleChange1 = (index, field, value) => {
    const updatedItinerary = [...itinerary];
    if (field === 'img') {
      // For file input, handle files differently
      if (value.target.files && value.target.files.length > 0) {
        updatedItinerary[index][field] = value.target.files[0];
      }
    } else {
      // For text and textarea inputs
      updatedItinerary[index][field] = value;
    }
    setItinerary(updatedItinerary);
  };
  const handleChange3 = (index, field, value) => {
    const updatedSlider = [...savedSlider];
    updatedSlider[index][field] = value;
    setSavedSlider(updatedSlider);
  };

  const handleChange4 = (index, field, value) => {
    const updatedSlider = [...savedSlider];
    updatedSlider[index][field] = value;
    setSavedSlider(updatedSlider);
  };
  const handleChange = (selectedOptions) => {
    const selectedValues = selectedOptions.map((option) => option.value);
    setSelected(selectedValues);
  };
  const handleSubmit = async () => {
    if (selected.length === 0) {
      const response = window.confirm(
        'Are you sure to remove all the packages from the homepage?',
      );
      if (!response) {
        return;
      }
    }

    setLoading(true);

    try {
      const tourPackageIdArray = selected;
      const notSelected = options
        .filter((item) => !selected.includes(item.value))
        .map((item) => item.value);

      if (selected.length > 0) {
        await axios.post(`${address}/addhomepagesection`, tourPackageIdArray);
      }

      if (notSelected.length > 0) {
        await axios.post(`${address}/removehomepagesection`, notSelected);
      }
    } catch (error) {
      console.error('Error occurred on adding packages: ', error);
    } finally {
      setLoading(false);
    }
  };
  const addDay = () => {
    setItinerary([...itinerary, { minititle: '', maintitle: '', img: null }]);
  };
  const removeDay = (index) => {
    const updatedItinerary = itinerary.filter((_, i) => i !== index);
    setItinerary(updatedItinerary);
  };

  const saveHandler = async (index) => {
    const miniTitile = itinerary[index].minititle;
    const mainTitle = itinerary[index].maintitle;
    const titleImage = itinerary[index].img;
    if (!miniTitile || !mainTitle || !titleImage) {
      alert('Please fill all the fields');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('Title', miniTitile);
      formData.append('subTitle', mainTitle);
      formData.append('sliderImg', titleImage);

      const res = await axios.post(`${address}/addSliderData`, formData);
      if (res.data) {
        toast.success(res.data.msg);
        setSave((prev) => !prev);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const deleteHandler = async (id) => {
    const result = window.confirm('Are you sure you want to delete data?');
    if (!result) {
      return;
    }
    try {
      const res = await axios.delete(`${address}/deleteSliderData/${id}`);
      if (res.data) {
        toast.success(res.data.msg);
        setSave((prev) => !prev);
      }
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };
  const urlToFile = async (url, filename) => {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    const mimeType = response.headers.get('content-type');
    return new File([buffer], filename, { type: mimeType });
  };
  const editHandler = async (id, index) => {
    const miniTitile = savedSlider[index].Title;
    const mainTitle = savedSlider[index].subTitle;
    const titleImage = savedSlider[index].imgPath;
    // Convert the image URL to a File object
    console.log(miniTitile);
    const file = await urlToFile(
      `${address}/sliderImg/${titleImage}`,
      `image_${index}.jpg`,
    );

    try {
      const formData = new FormData();
      formData.append('Title', miniTitile);
      formData.append('subTitle', mainTitle);
      formData.append('sliderImg', file);
      formData.append('id', id);
      const res = await axios.put(`${address}/editSliderData/`, formData);
      if (res.data) {
        toast.success(res.data.msg);
        setSave((prev) => !prev);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const IncludedPackages = (includedPackages || []).map((chip, index) => (
    <Chip key={index} label={chip} />
  ));
  return (
    <DefaultLayout>
      <div className="">
        <div className="grid grid-cols-1 ">
          <div className="flex flex-col gap-9">
            {/* <!-- Create Input Fields --> */}
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Home Page Layout
                </h3>
              </div>
              <div className="flex flex-col gap-5.5 p-6.5">
                <label className="mb-3 block text-black dark:text-white">
                  Tour Packages Displayed In Homepage
                </label>
                {/* className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary" */}
                <div className="flex flex-wrap mb-4  w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ">
                  {IncludedPackages.length > 0
                    ? IncludedPackages
                    : 'No Tours added'}

                  {/* {includedPackages.map((chip, index) => (
                    <Chip key={index} label={chip} />
                  ))} */}
                </div>
              </div>
              <div className="flex flex-col gap-5.5 p-6.5">
                <label className="mb-3 block text-black dark:text-white">
                  Select Tour Packages To Display In Homepage
                </label>
                <MultiSelect
                  className="mb-3 block text-sm font-medium text-black  border border-stroke py-2 pl-3 pr-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                  options={options}
                  value={options.filter((option) =>
                    selected.includes(option.value),
                  )}
                  onChange={handleChange}
                  labelledBy="Select"
                />

                {/* <SelectState /> */}
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
                  className="inline-flex items-center justify-center gap-2.5 bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                  onClick={handleSubmit}
                >
                  <span></span>
                  {loading ? <Spinner /> : 'Set Layout'}
                </button>
              </div>
            </div>

            {/* Slider image present currently */}
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                <label className="mb-3 block text-black dark:text-white">
                  Slider images present currently
                </label>
                <form
                  onSubmit={handleSubmit}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {savedSlider.map((day, index) => (
                    <div key={index} className="mb-4 p-4 border rounded">
                      <h3 className="text-lg font-medium mb-2">
                        Slider {index + 1}
                      </h3>
                      <div className="mb-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Mini Title:
                        </label>
                        <input
                          type="text"
                          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                          value={day.Title}
                          onChange={(e) =>
                            handleChange3(index, 'Title', e.target.value)
                          }
                        />
                      </div>
                      <div className="mb-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Main Title:
                        </label>
                        <textarea
                          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                          value={day.subTitle}
                          onChange={(e) =>
                            handleChange4(index, 'subTitle', e.target.value)
                          }
                        />
                      </div>
                      <div className="mb-2">
                        <label className="mb-3 block text-black dark:text-white">
                          Title Image
                        </label>
                        <img
                          src={`${address}/sliderImg/${day.imgPath}`}
                          alt={`Thumbnail ${index}`}
                          className="w-24 h-24 object-cover rounded-lg shadow-md"
                        />
                      </div>
                      <button
                        type="button"
                        className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 mr-2"
                        onClick={() => editHandler(day.id, index)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                        onClick={() => deleteHandler(day.id)}
                      >
                        Remove Slider
                      </button>
                    </div>
                  ))}
                </form>
              </div>
            </div>

            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                <label className="mb-3 block text-black dark:text-white">
                  Add images to be displayed on the homepage Slider
                </label>
                <form
                  onSubmit={handleSubmit}
                  // className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                >
                  {itinerary.map((day, index) => (
                    <div key={index} className="mb-4 p-4 border rounded">
                      <h3 className="text-lg font-medium mb-2">
                        Slider {index + 1}
                      </h3>
                      <div className="mb-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Mini Title:
                        </label>
                        <input
                          type="text"
                          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                          value={day.minititle}
                          onChange={(e) =>
                            handleChange1(index, 'minititle', e.target.value)
                          }
                        />
                      </div>
                      <div className="mb-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Main Title:
                        </label>
                        <textarea
                          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                          value={day.maintitle}
                          onChange={(e) =>
                            handleChange1(index, 'maintitle', e.target.value)
                          }
                        />
                      </div>

                      <div className="mb-2">
                        <label className="mb-3 block text-black dark:text-white">
                          Attach Title Image
                        </label>
                        <input
                          type="file"
                          className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                          onChange={(e) => handleChange1(index, 'img', e)}
                        />
                      </div>

                      <button
                        type="button"
                        className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 mr-2"
                        onClick={() => saveHandler(index)}
                      >
                        Save
                      </button>
                      {index >= 1 && (
                        <button
                          type="button"
                          className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                          onClick={() => removeDay(index)}
                        >
                          Remove Slider
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mr-2"
                    onClick={addDay}
                  >
                    Add Another Slider
                  </button>
                </form>
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
        {/* <CardDataStats title="Total views" total="$3.456K" rate="0.43%" levelUp>
          <svg
            className="fill-primary dark:fill-white"
            width="22"
            height="16"
            viewBox="0 0 22 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11 15.1156C4.19376 15.1156 0.825012 8.61876 0.687512 8.34376C0.584387 8.13751 0.584387 7.86251 0.687512 7.65626C0.825012 7.38126 4.19376 0.918762 11 0.918762C17.8063 0.918762 21.175 7.38126 21.3125 7.65626C21.4156 7.86251 21.4156 8.13751 21.3125 8.34376C21.175 8.61876 17.8063 15.1156 11 15.1156ZM2.26876 8.00001C3.02501 9.27189 5.98126 13.5688 11 13.5688C16.0188 13.5688 18.975 9.27189 19.7313 8.00001C18.975 6.72814 16.0188 2.43126 11 2.43126C5.98126 2.43126 3.02501 6.72814 2.26876 8.00001Z"
              fill=""
            />
            <path
              d="M11 10.9219C9.38438 10.9219 8.07812 9.61562 8.07812 8C8.07812 6.38438 9.38438 5.07812 11 5.07812C12.6156 5.07812 13.9219 6.38438 13.9219 8C13.9219 9.61562 12.6156 10.9219 11 10.9219ZM11 6.625C10.2437 6.625 9.625 7.24375 9.625 8C9.625 8.75625 10.2437 9.375 11 9.375C11.7563 9.375 12.375 8.75625 12.375 8C12.375 7.24375 11.7563 6.625 11 6.625Z"
              fill=""
            />
          </svg>
        </CardDataStats>
        <CardDataStats title="Total Profit" total="$45,2K" rate="4.35%" levelUp>
          <svg
            className="fill-primary dark:fill-white"
            width="20"
            height="22"
            viewBox="0 0 20 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.7531 16.4312C10.3781 16.4312 9.27808 17.5312 9.27808 18.9062C9.27808 20.2812 10.3781 21.3812 11.7531 21.3812C13.1281 21.3812 14.2281 20.2812 14.2281 18.9062C14.2281 17.5656 13.0937 16.4312 11.7531 16.4312ZM11.7531 19.8687C11.2375 19.8687 10.825 19.4562 10.825 18.9406C10.825 18.425 11.2375 18.0125 11.7531 18.0125C12.2687 18.0125 12.6812 18.425 12.6812 18.9406C12.6812 19.4219 12.2343 19.8687 11.7531 19.8687Z"
              fill=""
            />
            <path
              d="M5.22183 16.4312C3.84683 16.4312 2.74683 17.5312 2.74683 18.9062C2.74683 20.2812 3.84683 21.3812 5.22183 21.3812C6.59683 21.3812 7.69683 20.2812 7.69683 18.9062C7.69683 17.5656 6.56245 16.4312 5.22183 16.4312ZM5.22183 19.8687C4.7062 19.8687 4.2937 19.4562 4.2937 18.9406C4.2937 18.425 4.7062 18.0125 5.22183 18.0125C5.73745 18.0125 6.14995 18.425 6.14995 18.9406C6.14995 19.4219 5.73745 19.8687 5.22183 19.8687Z"
              fill=""
            />
            <path
              d="M19.0062 0.618744H17.15C16.325 0.618744 15.6031 1.23749 15.5 2.06249L14.95 6.01562H1.37185C1.0281 6.01562 0.684353 6.18749 0.443728 6.46249C0.237478 6.73749 0.134353 7.11562 0.237478 7.45937C0.237478 7.49374 0.237478 7.49374 0.237478 7.52812L2.36873 13.9562C2.50623 14.4375 2.9531 14.7812 3.46873 14.7812H12.9562C14.2281 14.7812 15.3281 13.8187 15.5 12.5469L16.9437 2.26874C16.9437 2.19999 17.0125 2.16562 17.0812 2.16562H18.9375C19.35 2.16562 19.7281 1.82187 19.7281 1.37499C19.7281 0.928119 19.4187 0.618744 19.0062 0.618744ZM14.0219 12.3062C13.9531 12.8219 13.5062 13.2 12.9906 13.2H3.7781L1.92185 7.56249H14.7094L14.0219 12.3062Z"
              fill=""
            />
          </svg>
        </CardDataStats>
        <CardDataStats title="Total Product" total="2.450" rate="2.59%" levelUp>
          <svg
            className="fill-primary dark:fill-white"
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21.1063 18.0469L19.3875 3.23126C19.2157 1.71876 17.9438 0.584381 16.3969 0.584381H5.56878C4.05628 0.584381 2.78441 1.71876 2.57816 3.23126L0.859406 18.0469C0.756281 18.9063 1.03128 19.7313 1.61566 20.3844C2.20003 21.0375 2.99066 21.3813 3.85003 21.3813H18.1157C18.975 21.3813 19.8 21.0031 20.35 20.3844C20.9 19.7656 21.2094 18.9063 21.1063 18.0469ZM19.2157 19.3531C18.9407 19.6625 18.5625 19.8344 18.15 19.8344H3.85003C3.43753 19.8344 3.05941 19.6625 2.78441 19.3531C2.50941 19.0438 2.37191 18.6313 2.44066 18.2188L4.12503 3.43751C4.19378 2.71563 4.81253 2.16563 5.56878 2.16563H16.4313C17.1532 2.16563 17.7719 2.71563 17.875 3.43751L19.5938 18.2531C19.6282 18.6656 19.4907 19.0438 19.2157 19.3531Z"
              fill=""
            />
            <path
              d="M14.3345 5.29375C13.922 5.39688 13.647 5.80938 13.7501 6.22188C13.7845 6.42813 13.8189 6.63438 13.8189 6.80625C13.8189 8.35313 12.547 9.625 11.0001 9.625C9.45327 9.625 8.1814 8.35313 8.1814 6.80625C8.1814 6.6 8.21577 6.42813 8.25015 6.22188C8.35327 5.80938 8.07827 5.39688 7.66577 5.29375C7.25327 5.19063 6.84077 5.46563 6.73765 5.87813C6.6689 6.1875 6.63452 6.49688 6.63452 6.80625C6.63452 9.2125 8.5939 11.1719 11.0001 11.1719C13.4064 11.1719 15.3658 9.2125 15.3658 6.80625C15.3658 6.49688 15.3314 6.1875 15.2626 5.87813C15.1595 5.46563 14.747 5.225 14.3345 5.29375Z"
              fill=""
            />
          </svg>
        </CardDataStats>
        <CardDataStats title="Total Users" total="3.456" rate="0.95%" levelDown>
          <svg
            className="fill-primary dark:fill-white"
            width="22"
            height="18"
            viewBox="0 0 22 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.18418 8.03751C9.31543 8.03751 11.0686 6.35313 11.0686 4.25626C11.0686 2.15938 9.31543 0.475006 7.18418 0.475006C5.05293 0.475006 3.2998 2.15938 3.2998 4.25626C3.2998 6.35313 5.05293 8.03751 7.18418 8.03751ZM7.18418 2.05626C8.45605 2.05626 9.52168 3.05313 9.52168 4.29063C9.52168 5.52813 8.49043 6.52501 7.18418 6.52501C5.87793 6.52501 4.84668 5.52813 4.84668 4.29063C4.84668 3.05313 5.9123 2.05626 7.18418 2.05626Z"
              fill=""
            />
            <path
              d="M15.8124 9.6875C17.6687 9.6875 19.1468 8.24375 19.1468 6.42188C19.1468 4.6 17.6343 3.15625 15.8124 3.15625C13.9905 3.15625 12.478 4.6 12.478 6.42188C12.478 8.24375 13.9905 9.6875 15.8124 9.6875ZM15.8124 4.7375C16.8093 4.7375 17.5999 5.49375 17.5999 6.45625C17.5999 7.41875 16.8093 8.175 15.8124 8.175C14.8155 8.175 14.0249 7.41875 14.0249 6.45625C14.0249 5.49375 14.8155 4.7375 15.8124 4.7375Z"
              fill=""
            />
            <path
              d="M15.9843 10.0313H15.6749C14.6437 10.0313 13.6468 10.3406 12.7874 10.8563C11.8593 9.61876 10.3812 8.79376 8.73115 8.79376H5.67178C2.85303 8.82814 0.618652 11.0625 0.618652 13.8469V16.3219C0.618652 16.975 1.13428 17.4906 1.7874 17.4906H20.2468C20.8999 17.4906 21.4499 16.9406 21.4499 16.2875V15.4625C21.4155 12.4719 18.9749 10.0313 15.9843 10.0313ZM2.16553 15.9438V13.8469C2.16553 11.9219 3.74678 10.3406 5.67178 10.3406H8.73115C10.6562 10.3406 12.2374 11.9219 12.2374 13.8469V15.9438H2.16553V15.9438ZM19.8687 15.9438H13.7499V13.8469C13.7499 13.2969 13.6468 12.7469 13.4749 12.2313C14.0937 11.7844 14.8499 11.5781 15.6405 11.5781H15.9499C18.0812 11.5781 19.8343 13.3313 19.8343 15.4625V15.9438H19.8687Z"
              fill=""
            />
          </svg>
        </CardDataStats> */}
      </div>

      {/* <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <ChartOne />
        <ChartTwo />
        <ChartThree />
        <MapOne />
        <div className="col-span-12 xl:col-span-8">
          <TableOne />
        </div>
        <ChatCard />
      </div> */}
    </DefaultLayout>
  );
};

export default ECommerce;
