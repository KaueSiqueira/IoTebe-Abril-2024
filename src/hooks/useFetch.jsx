import { useEffect, useState } from "react";
import { AxiosInstance } from "../api/AxiosInstance";

export function useFetch(url, data) {
  const [isLoading, setIsLoading] = useState(true);
  const [value, setValue] = useState(null);
  const [error, setError] = useState(null);
  const [apiFetch] = useState(new AxiosInstance(url));

  useEffect(async () => {
    try {
      const res = await apiFetch.axiosPut(data);
      setValue(res);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, [data]);

  return { isLoading, value, error };
}

// api
//   .then((res) => {
//     setValue(res);
//   })
//   .catch((error) => {
//     setError(error);
//   })
//   .finally(() => {
//     setIsLoading(false);
//   });
