import { useMutation } from '@tanstack/react-query';
import api from '../api/Manager/manager';

const usePostApi = () => {
  return useMutation({
    mutationFn: async ({ endpoint, data }: { endpoint: string; data: any }) => {
      const response = await api.post(endpoint, data);

      if (!response.ok) {
        throw new Error(
          (response.data as any)?.message ||
            response.problem ||
            'Something went wrong',
        );
      }
      return response.data;
    },
  });
};

export default usePostApi;
