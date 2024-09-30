/// <reference types="vite/client" />

declare module "*.vue";

declare module "vue3-emoji"

// jigsaw.d.ts  
declare global {
    interface Window {
        jigsaw: {
            init: (opts: any) => any;
        };
    }
}

declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
    const component: DefineComponent<{}, {}, any>
    export default component
}
