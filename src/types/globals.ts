export {};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Window {
    roleEnv: {
      REACT_APP_API_BASE_URL: string;
      REACT_APP_MOCK_API: string;
    };
  }
}
