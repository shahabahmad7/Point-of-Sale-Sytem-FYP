import { useSearchParams } from 'react-router-dom';

const Tab = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const last = +searchParams.get('last') || 7;
  const handleLast = last => {
    searchParams.set('last', last);
    setSearchParams(searchParams);
  };
  return (
    <div className="flex items-center gap-2 rounded-md border-2 border-gray-100 bg-white px-2 py-[0.4rem] text-[0.7rem] sm:gap-4 sm:text-[0.9rem]">
      <button
        onClick={() => handleLast(7)}
        className={`rounded-md px-3 py-[0.2rem] hover:bg-primary-500 hover:text-white ${
          last === 7 ? 'bg-primary-500 text-white' : ''
        }`}
      >
        Last 7 days
      </button>
      <button
        onClick={() => handleLast(30)}
        className={`rounded-md px-3 py-[0.2rem] hover:bg-primary-500 hover:text-white ${
          last === 30 ? 'bg-primary-500 text-white' : ''
        }`}
      >
        Last 30 days
      </button>
      <button
        onClick={() => handleLast(90)}
        className={`rounded-md px-3 py-[0.2rem] hover:bg-primary-500 hover:text-white ${
          last === 90 ? 'bg-primary-500 text-white' : ''
        }`}
      >
        Last 90 days
      </button>
    </div>
  );
};

export default Tab;
