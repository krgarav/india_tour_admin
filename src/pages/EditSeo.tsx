import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../layout/DefaultLayout';
import SelectGroupTwo from '../components/Forms/SelectGroup/SelectGroupTwo';
import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

import ChipArray from '../components/ChipArray/ChipArray';
import Spinner from '../common/spinner/spinner';
const address = import.meta.env.VITE_API_ADDRESS;
const EditSeo = () => {
  const [metaId, setMetaId] = useState();
  const [options, setOptions] = useState<File[]>([]);
  const [packageOptions, setPackageOptions] = useState<File[]>([]);
  const [title, setTitle] = useState<String>('');
  const [label, setLabel] = useState();
  const [loading, setLoading] = useState(false);
  const [keywords, setKeywords] = useState([]);
  const [description, setDescription] = useState<String>('');
  const [chips, setChips] = useState([]);
  useEffect(() => {
    const loadOption = async () => {
      try {
        const response = await axios.get(`${address}/tours`, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        const response2 = await axios.get(`${address}/get/tourpackages`, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        const structuredOptions = response2.data.allPackageTours.map(
          (item: Object) => ({
            value: item.id,
            label: item.packageTitle,
          }),
        );
        const options = response.data.data.map((item: Object) => ({
          value: item.id,
          label: item.tourTitle,
        }));
        setPackageOptions(structuredOptions);
        setOptions(options);
      } catch (error) {
        console.error('Error loading options:', error);
      }
    };
    loadOption();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tour = label;
        const pageId = +title;
        if (tour && pageId) {
          const res = await axios.get(
            `${address}/getmetadata?label=${tour}&pageId=${pageId}`,
          );
          if (res?.data) {
            console.log(res.data.data);
            setMetaId(res.data.data.id);
            if (res.data.data.description) {
              setDescription(res.data.data.description);
            } else {
              setDescription('');
            }
            setChips(res.data.data.keywords);
          }
          //   res?.data
          //   console.log(res)
        }
      } catch (error) {
        console.log(error);
        setDescription('');
        setChips([]);
      }
    };
    fetchData();
  }, [label, title]);

  const handleChip = useCallback((items: any) => {
    const structuredKeywords = items.map((item: any) => item.label);
    setKeywords(structuredKeywords);
  }, []);
  const optionHandler = useCallback(async (selectedOption, selectedlabel) => {
    setLabel(selectedlabel);
    if (selectedOption === 'homepage') {
      setTitle('1');
      return;
    } else if (selectedOption === 'contact') {
      setTitle('2');
      return;
    }

    setTitle(selectedOption);
  }, []);
  const handleClick = async () => {
    try {
      setLoading(true);
      const obj = {
        pageId: +title,
        keyword: keywords,
        description: description,
        label: label,
      };

      const response = await axios.put(
        `${address}/updatemetadata/${metaId}`,
        obj,
        {
          headers: {
            'Content-Type': 'application/json', // Set the Content-Type to application/json
          },
        },
      );
      setLoading(false);
      toast.success(`Keywords Added`);
    } catch (error) {
      setLoading(false);
      if (error?.response?.data.message) {
        toast.error(error?.response?.data.message);
        return;
      }
      if (error?.message) {
        toast.error(error?.message);
      }
      console.error('Error updating tour:', error);
    }
  };
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Edit SEO" />
      <div className="grid grid-cols-1 ">
        <div className="flex flex-col gap-9">
          {/* <!-- Create Input Fields --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Edit SEO for all the pages.
              </h3>
            </div>
            <div className="flex flex-col gap-5.5 p-6.5">
              <div>
                <SelectGroupTwo
                  onchange={optionHandler}
                  tourOptions={options}
                  packageOptions={packageOptions}
                />
              </div>
              <div>
                <label className="mb-3 block text-black dark:text-white">
                  Description
                </label>
                <input
                  type="text"
                  placeholder="Enter the Description"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  onChange={(e) => setDescription(e.target.value)}
                  value={description}
                />
              </div>
              <div>
                <label className="mb-3 block text-black dark:text-white">
                  Keywords
                </label>
                <div className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary">
                  <ChipArray chips={chips} onChange={handleChip} />
                </div>
              </div>

              <button
                className="inline-flex items-center justify-center gap-2.5 bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                onClick={handleClick}
                disabled={loading}
              >
                {loading && <Spinner />}
                {!loading && 'UPDATE SEO'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default EditSeo;
