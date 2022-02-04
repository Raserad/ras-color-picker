import "./assets/styles.css";
import { template } from "./assets/template";
import { hsvaToRgba, rgbaToHex, rgbaToHsva, strToRgba } from "./helpers";

export class ColorPicker {
  constructor(
    options = {
      el: document.createElement("div"),
      color: "rgba(255, 255, 255, 1)"
    }
  ) {
    options.el.innerHTML = template;
    this.$pickerBox = options.el.querySelector(".picker");
    this.$colorPicker = options.el.querySelector(
      ".picker-area .picker-control-point"
    );
    this.$colorSlider = options.el.querySelector(
      ".picker-color-line .picker-control-point"
    );
    this.$alphaSlider = options.el.querySelector(
      ".picker-alpha-line .picker-control-point"
    );
    this.$colorValue = options.el.querySelector(".picker-color-input");
    this.$alphaValue = options.el.querySelector(".picker-alpha-input");
    this.convertColorToValues(options.color);

    window.addEventListener("mousedown", this.onMouseDown.bind(this));

    this.$colorValue.addEventListener("change", () => {
      this.convertColorToValues(this.$colorValue.value);
    });
    this.$alphaValue.addEventListener("input", () => {
      const value = this.$alphaValue.value;
      this.alphaSlider = Math.min(100, Math.max(0, value));
      this.showCurrentColors();
      this.showCurrentColorValues();
    });
  }

  convertColorToValues(color) {
    const rgba = strToRgba(color);
    const hsva = rgbaToHsva(rgba);

    this.colorSlider = hsva.h;
    this.alphaSlider = Math.round(hsva.a * 100);
    this.picker = {
      x: hsva.s,
      y: hsva.v
    };
    this.showCurrentColors();
    this.showCurrentColorValues();
  }

  showCurrentColors() {
    const hsva = {
      h: this.colorSlider,
      s: this.picker.x,
      v: this.picker.y,
      a: this.alphaSlider / 100
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
      `hsl(${this.colorSlider}, 100%, 50%)`
    );

    const colorPickerBox = this.$colorPicker.parentElement.getBoundingClientRect();
    this.$colorPicker.style.left = `${
      (this.picker.x / 100) * colorPickerBox.width
    }px`;
    this.$colorPicker.style.top = `${
      colorPickerBox.height - (this.picker.y / 100) * colorPickerBox.height
    }px`;

    const colorSliderBox = this.$colorSlider.parentElement.getBoundingClientRect();
    this.$colorSlider.style.left = `${
      (this.colorSlider / 100 / 3.6) * colorSliderBox.width
    }px`;

    const alphaSliderBox = this.$alphaSlider.parentElement.getBoundingClientRect();
    this.$alphaSlider.style.left = `${
      (this.alphaSlider / 100) * alphaSliderBox.width
    }px`;
  }

  showCurrentColorValues() {
    this.$alphaValue.value = this.alphaSlider;
    const hsva = {
      h: this.colorSlider,
      s: this.picker.x,
      v: this.picker.y,
      a: this.alphaSlider / 100
    };
    const rgba = hsvaToRgba(hsva);
    const hex = rgbaToHex(rgba);
    this.$colorValue.value = hex;
  }

  onColorPickerMove(event, target) {
    const box = target.parentNode.getBoundingClientRect();
    const x = Math.min(Math.max(0, event.pageX - box.left), box.width);
    const y = Math.min(Math.max(0, event.pageY - box.top), box.height);

    this.picker = {
      x: (x / box.width) * 100,
      y: 100 - (y / box.height) * 100
    };
    this.showCurrentColors();
    this.showCurrentColorValues();
  }

  onColorLineMove(event, target) {
    const box = target.parentNode.getBoundingClientRect();
    const x = Math.min(Math.max(0, event.pageX - box.left), box.width);

    this.colorSlider = Math.round((x / box.width) * 100 * 3.6);
    this.showCurrentColors();
    this.showCurrentColorValues();
  }

  onAlphaMove(event, target) {
    const box = target.parentNode.getBoundingClientRect();
    const x = Math.min(Math.max(0, event.pageX - box.left), box.width);

    this.alphaSlider = Math.round((x / box.width) * 100);
    this.showCurrentColors();
    this.showCurrentColorValues();
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
    let target = event.target.closest(".picker-control-point");
    if (!target) {
      const area = event.target.closest(".picker-control-area");
      if (area) {
        target = area.querySelector(".picker-control-point");
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

new ColorPicker({
  el: document.body,
  color: "#fffaaa"
});
