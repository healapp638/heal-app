import { useMutation } from '@tanstack/react-query';
import api from '../api/Manager/manager';

const useDeleteApi = (): any => {
  return useMutation({
    mutationFn: async ({
      endpoint,
      data,
      headers,
    }: {
      endpoint: string;
      data: any;
      headers?: any;
    }) => {
      const response = await api.delete(endpoint, {}, { data, headers });

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

export default useDeleteApi;
