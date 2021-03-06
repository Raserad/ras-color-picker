import "./assets/styles.css";
import { template } from "./assets/template";
import { hsvaToRgba, rgbaToHex, rgbaToHsva, strToRgba, debounce } from "./helpers";

export class ColorPicker {
  constructor(
    options = {
      el: document.createElement("div"),
      color: "rgba(255, 255, 255, 1)",
      onChange: (color) => {}
    }
  ) {
    const $element =
      typeof options.el === "string"
        ? document.querySelector(options.el)
        : options.el;
    $element.innerHTML = template;
    this.$pickerBox = $element.querySelector(".ras-color-picker");
    this.$colorPicker = $element.querySelector(
      ".ras-color-picker-area .ras-color-picker-control-point"
    );
    this.$colorSlider = $element.querySelector(
      ".ras-color-picker-color-line .ras-color-picker-control-point"
    );
    this.$alphaSlider = $element.querySelector(
      ".ras-color-picker-alpha-line .ras-color-picker-control-point"
    );
    this.$colorValue = $element.querySelector(".ras-color-picker-color-input");
    this.$alphaValue = $element.querySelector(".ras-color-picker-alpha-input");

    this.$colorPicker.parentElement.addEventListener(
      "mousedown",
      this.onMouseDown.bind(this)
    );
    this.$colorSlider.parentElement.addEventListener(
      "mousedown",
      this.onMouseDown.bind(this)
    );
    this.$alphaSlider.parentElement.addEventListener(
      "mousedown",
      this.onMouseDown.bind(this)
    );

    this.$colorValue.addEventListener("input", () => {
      this.convertColorToValues(this.$colorValue.value);
      this.showCurrentColors();
      this.showAlphaValue();
      this.emitChanges();
    });
    this.$alphaValue.addEventListener("input", () => {
      const value = this.$alphaValue.value;
      this.alphaSliderValue = Math.min(100, Math.max(0, value));
      this.showCurrentColors();
      this.showColorValue();
      this.emitChanges();
    });
    this.onChange = debounce(options.onChange, 0);

    this.setColor(options.color);
  }

  destroy() {
    this.$pickerBox.remove();
    this.onChange = null;
  }

  setColor(color, isNotify = false) {
    this.convertColorToValues(color);
    this.showCurrentColors();
    this.showColorValue();
    this.showAlphaValue();
    if (isNotify) {
      this.emitChanges()
    }
  }

  emitChanges() {
    const hex = this.getCurrentColorHex();
    this.onChange(hex);
  }

  convertColorToValues(color) {
    const rgba = strToRgba(color);
    const hsva = rgbaToHsva(rgba);

    this.colorSliderValue = hsva.h;
    this.alphaSliderValue = Math.round(hsva.a * 100);
    this.colorPickerValue = {
      x: hsva.s,
      y: hsva.v
    };
  }

  showCurrentColors() {
    const hsva = {
      h: this.colorSliderValue,
      s: this.colorPickerValue.x,
      v: this.colorPickerValue.y,
      a: this.alphaSliderValue / 100
    };
    const rgba = hsvaToRgba(hsva);
    const color = `rgba(${rgba.r}, ${rgba.g}, ${rgba.b})`;
    const colorWithAlpha = `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;
    this.$pickerBox.style.setProperty("--currentColor", color);
    this.$pickerBox.style.setProperty(
      "--currentColorWithAlpha",
      colorWithAlpha
    );
    this.$pickerBox.style.setProperty(
      "--color",
      `hsl(${this.colorSliderValue}, 100%, 50%)`
    );

    const colorPickerBox = this.$colorPicker.parentElement.getBoundingClientRect();
    this.$colorPicker.style.left = `${
      (this.colorPickerValue.x / 100) * colorPickerBox.width
    }px`;
    this.$colorPicker.style.top = `${
      colorPickerBox.height - (this.colorPickerValue.y / 100) * colorPickerBox.height
    }px`;

    const colorSliderBox = this.$colorSlider.parentElement.getBoundingClientRect();
    this.$colorSlider.style.left = `${
      (this.colorSliderValue / 100 / 3.6) * colorSliderBox.width
    }px`;

    const alphaSliderBox = this.$alphaSlider.parentElement.getBoundingClientRect();
    this.$alphaSlider.style.left = `${
      (this.alphaSliderValue / 100) * alphaSliderBox.width
    }px`;
  }

  showAlphaValue() {
    this.$alphaValue.value = this.alphaSliderValue;
  }

  getCurrentColorHex() {
    const hsva = {
      h: this.colorSliderValue,
      s: this.colorPickerValue.x,
      v: this.colorPickerValue.y,
      a: this.alphaSliderValue / 100
    };
    const rgba = hsvaToRgba(hsva);
    return rgbaToHex(rgba);
  }

  showColorValue() {
    const hex = this.getCurrentColorHex()
    this.$colorValue.value = hex;
  }

  onColorPickerMove(event, target) {
    const box = target.parentNode.getBoundingClientRect();
    const x = Math.min(Math.max(0, event.clientX - box.left), box.width);
    const y = Math.min(Math.max(0, event.clientY - box.top), box.height);

    this.colorPickerValue = {
      x: (x / box.width) * 100,
      y: 100 - (y / box.height) * 100
    };
    this.showCurrentColors();
    this.showColorValue();
    this.showAlphaValue();
    this.emitChanges();
  }

  onColorLineMove(event, target) {
    const box = target.parentNode.getBoundingClientRect();
    const x = Math.min(Math.max(0, event.clientX - box.left), box.width);

    this.colorSliderValue = Math.round((x / box.width) * 100 * 3.6);
    this.showCurrentColors();
    this.showColorValue();
    this.showAlphaValue();
    this.emitChanges();
  }

  onAlphaMove(event, target) {
    const box = target.parentNode.getBoundingClientRect();
    const x = Math.min(Math.max(0, event.clientX - box.left), box.width);

    this.alphaSliderValue = Math.round((x / box.width) * 100);
    this.showCurrentColors();
    this.showColorValue();
    this.showAlphaValue();
    this.emitChanges();
  }

  onControllerMove(event, target, type) {
    switch (type) {
      case "color-picker":
        return this.onColorPickerMove(event, target);
      case "color-line":
        return this.onColorLineMove(event, target);
      case "alpha":
        return this.onAlphaMove(event, target);
      default:
        return;
    }
  }

  onMouseDown(event) {
    let target = event.target.closest(".ras-color-picker-control-point");
    if (!target) {
      const area = event.target.closest(".ras-color-picker-control-area");
      if (area) {
        target = area.querySelector(".ras-color-picker-control-point");
      } else {
        return;
      }
    }

    const type = target.dataset.type;

    const onMouseMove = (event) => {
      this.onControllerMove(event, target, type);
    };

    const onDragStart = () => {
      return false;
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("dragstart", onDragStart);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    document.addEventListener("dragstart", onDragStart);

    this.onControllerMove(event, target, type);
  }
}