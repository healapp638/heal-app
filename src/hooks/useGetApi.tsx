import { useQuery } from '@tanstack/react-query';
import api from '../api/Manager/manager';

const useGetApi = (endpoint: string, key: any[], params: any = {}, options: any = {}): any => {
  return useQuery({
    queryKey: key,
    queryFn: async () => {
      const response = await api.get(endpoint, params);
      if (!response.ok) {
        throw new Error(
          (response.data as any)?.message ||
            response.problem ||
            'Something went wrong',
        );
      }
      return response.data as any;
    },
    ...options
  });
};

export default useGetApi;
