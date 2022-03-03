export class ColorPicker {
    constructor(options?: {
        el?: HTMLDivElement | string;
        color?: string;
        swatches?: string[];
        onChange?: (color: string, picker: ColorPicker) => void;
    });
    destroy(): void;
    setColor(color: any, isNotify?: boolean): void;
}
