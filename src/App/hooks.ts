import { createContext, useContext } from 'react';
import { useRouteMatch } from 'react-router-dom';

export function useMountPath(): string {
  // understand where app is mounted
  // and if it is on root / then it just returns an empty string to avoid breaking paths
  const { path } = useRouteMatch();
  return path === '/' ? '' : path;
}

const BasePath = createContext('');

/** Hands the screens the path the app is mounted at, read where the app's own routes begin. */
export const BasePathProvider = BasePath.Provider;

/** The path the app is mounted at, whichever of its routes is showing. */
export function useBasePath(): string {
  return useContext(BasePath);
}
