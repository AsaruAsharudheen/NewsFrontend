export const CheckToken = () => {
  return localStorage.getItem('TOKEN') ? true : false;
};
