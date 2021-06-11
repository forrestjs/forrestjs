import React, { useContext } from 'react';

export const GetContext = React.createContext();

export const useGetContext = (path, defaultValue) => {
  const getContext = useContext(GetContext);
  return getContext(path, defaultValue);
};
