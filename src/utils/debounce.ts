/**
 * Debounce function to limit how often a function is called
 * @param func The function to debounce
 * @param delay The delay in milliseconds
 * @returns A debounced version of the input function
 */
export const debounce = <F extends (...args: any[]) => any>(func: F, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  
  return function (this: any, ...args: Parameters<F>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}; 