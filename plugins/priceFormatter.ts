export default defineNuxtPlugin(() => {
    return {
      provide: {
        formatPrice: (num: number): string => {
          return Math.ceil(num).toLocaleString("fa-IR");
        },
        formatNumber: (num: number): string => {
          return num.toLocaleString("fa-IR");
        },
      },
    };
  });
  