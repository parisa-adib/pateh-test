/**
 * @param date
 * @returns
 */
export const useConvertDate = (date: string): string => {
    return new Date(date).toLocaleDateString('fa-IR');
  };
  
  