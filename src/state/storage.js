const setItem = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const getItem = (key) => {
  const storedItem = localStorage.getItem(key);

  if (!storedItem) return null;

  try {
    return JSON.parse(storedItem);
  } catch (error) {
    return storedItem;
  }
};

const clear = () => {
  localStorage.clear();
};

const storage = {
  setItem,
  getItem,
  clear,
};

export default storage;
