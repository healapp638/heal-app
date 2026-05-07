import { useInfiniteQuery } from '@tanstack/react-query';
import api from '../api/Manager/manager';

const useInfiniteGetApi = (endpoint: string, key: any[], params: any = {}) => {
  return useInfiniteQuery({
    queryKey: key,
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get(endpoint, {
        ...params,
        page: pageParam,
      });
      if (!response.ok) {
        throw new Error(
          (response.data as any)?.message ||
            response.problem ||
            'Something went wrong',
        );
      }
      return response.data as any;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const totalCount = lastPage?.data?.totalCount || 0;
      const currentCount = allPages.flatMap((page) => page?.data?.result || []).length;
      return currentCount < totalCount ? allPages.length + 1 : undefined;
    },
  });
};

export default useInfiniteGetApi;
