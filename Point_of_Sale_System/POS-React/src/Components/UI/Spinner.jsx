const Spinner = ({ small, color }) => {
  if (small && color === 'orange') return <div className="loader-orange"></div>;
  if (small) return <div className="loader"></div>;
  return (
    <div className="lds-default">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default Spinner;
