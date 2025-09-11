export const useSearchParams = (key: string) => {
  const query = new URLSearchParams(window.location.search);
  return query.get(key);
};
