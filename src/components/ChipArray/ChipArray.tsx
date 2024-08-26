import React, { useEffect, useState } from 'react';
import Chip from '../../common/Chip';
import PropTypes from 'prop-types';
const ChipArray = (props) => {
  const [chips, setChips] = useState([]);
  const [inputValue, setInputValue] = useState('');

    useEffect(() => {
    if (chips !== props.chips) {
      props.onChange(chips);
    }
  }, [chips]);
  useEffect(() => {
    if (Array.isArray(props.chips) && props.chips.length > 0) {
      const allChips = props.chips.map((item) => ({
        id: item.id,
        label: item.keyword,
      }));
      setChips(allChips);
    } else {
      setChips([]);
    }
  }, [props.chips]);
  const handleDelete = (chipId) => {
    setChips(chips.filter((chip) => chip.id !== chipId));
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyPress = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      setChips([...chips, { id: Date.now(), label: inputValue.trim() }]);
      setInputValue('');
    }
  };

  return (
    <div className="p-4">
      <div className="flex flex-wrap mb-4">
        {chips.map((chip) => (
          <Chip
            key={chip.id}
            label={chip.label}
            onDelete={() => handleDelete(chip.id)}
          />
        ))}
      </div>
      <input
        type="text"
        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
        placeholder="Type desired keyword and press Enter to register"
        value={inputValue}
        onChange={handleInputChange}
        onKeyPress={handleInputKeyPress}
      />
    </div>
  );
};
ChipArray.propTypes = {
  onChange: PropTypes.func.isRequired,
  chips: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      keyword: PropTypes.string.isRequired,
    }),
  ),
};

ChipArray.defaultProps = {
  chips: [],
};

export default ChipArray;
