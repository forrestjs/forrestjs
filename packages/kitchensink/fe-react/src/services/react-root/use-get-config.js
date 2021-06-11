import React, { useContext } from 'react';

export const GetConfig = React.createContext();

export const useGetConfig = (path, defaultValue) => {
  const getConfig = useContext(GetConfig);
  return getConfig(path, defaultValue);
};
