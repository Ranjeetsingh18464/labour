import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useFirestoreQuery(key, queryFn, options = {}) {
  return useQuery({
    queryKey: key,
    queryFn,
    ...options,
  });
}

export function useFirestoreMutation(mutationFn, options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    ...options,
    onSuccess: (...args) => {
      if (options.invalidateKeys) {
        options.invalidateKeys.forEach(key => queryClient.invalidateQueries({ queryKey: key }));
      }
      if (options.onSuccess) options.onSuccess(...args);
    },
  });
}
