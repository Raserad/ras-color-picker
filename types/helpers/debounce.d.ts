export function debounce(func: any, wait: any, immediate: any): {
    (...args: any[]): any;
    clear(): void;
    flush(): void;
};
