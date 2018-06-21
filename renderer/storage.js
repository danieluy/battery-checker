export const setLocal = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(error);
  }
};

export const getLocal = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch (error) {
    console.error(error);
  }
};

export const updateLocal = (key, value) => {
  try {
    let prev = getLocal(key, value);
    if (!prev)
      prev = {};
    setLocal(key, Object.assign(prev, value));
  } catch (error) {
    console.error(error);
  }
};


export default {
  setLocal,
  getLocal,
  updateLocal
};
