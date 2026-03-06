export const isToday = _date => {
  const today = new Date();
  const inputDate = new Date(_date);

  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();
  const todayDate = today.getDate();

  const inputDateYear = inputDate.getFullYear();
  const inputDateMonth = inputDate.getMonth();
  const inputDateDate = inputDate.getDate();

  return (
    inputDateYear === todayYear &&
    inputDateMonth === todayMonth &&
    inputDateDate === todayDate
  );
};
