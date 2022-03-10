export class ColorPicker {
    constructor(options?: {
        el?: HTMLElement | string;
        color?: string;
        swatches?: string[];
        onChange?: (color: string, picker: ColorPicker) => void;
    });
    destroy(): void;
    setColor(color: any, isNotify?: boolean): void;
}
