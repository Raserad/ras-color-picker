import "./assets/styles.css";
import { template } from "./assets/template";
import { hsvaToRgba, rgbaToHex, rgbaToHsva, strToRgba } from "./helpers";

export class ColorPicker {
  constructor({
      el = document.createElement("div"),
      color = "rgba(255, 255, 255, 1)",
      swatches = [],
      onChange = (color, picker) => {}
  }) {
    this.recalculateWrapperPosition = this.recalculateWrapperPosition.bind(this)
    this.checkScrollable = this.checkScrollable.bind(this)
    let $element =
      typeof el === "string"
        ? document.querySelector(el)
        : el;
    if ($element.tagName == 'INPUT') {
      const $wrapper = document.createElement('div')
      $element.parentNode.insertBefore($wrapper, $element)
      $wrapper.appendChild($element)
      this.$input = $element
      this.$input.addEventListener('focus', () => {
        this.$pickerBox.style.zIndex = 99
        this.$pickerBox.style.display = 'block'
        requestAnimationFrame(() => {
          this.showCurrentColors()
          this.recalculateWrapperPosition()
          this.checkScrollable()
        })
      })
      this.hideWrapper = this.hideWrapper.bind(this)
      document.addEventListener('mousedown', this.hideWrapper)
      $element = document.createElement('div')
      $wrapper.appendChild($element)
      this.$wrapper = $wrapper
    } else {
      this.$wrapper = $element
    }

    this.$wrapper.classList.add('ras-color-picker-wrapper')
    $element.innerHTML = template;
    this.$pickerBox = $element.querySelector(".ras-color-picker");
    this.$colorPicker = $element.querySelector(
      ".ras-color-picker-area .ras-color-picker-control-point"
    );
    this.$colorPickerIndicator = $element.querySelector(
      ".ras-color-picker-indicator"
    );
    this.$colorSlider = $element.querySelector(
      ".ras-color-picker-color-line .ras-color-picker-control-point"
    );
    this.$alphaSlider = $element.querySelector(
      ".ras-color-picker-alpha-line .ras-color-picker-control-point"
    );
    if (this.$input) {
      this.$colorValue = this.$input
      $element.querySelector(".ras-color-picker-color-input").remove()
      const $indicator = $element.querySelector('.ras-color-picker-current-color')
      $indicator.style.display = 'inline-block'
      this.$wrapper.insertBefore($indicator, this.$input)
      $element.querySelector('.ras-color-picker-inputs').remove()
      this.$wrapper.style.position = 'relative'
      this.$wrapper.style.display = 'inline-flex'
      this.$wrapper.style.gap = '10px'
      this.$pickerBox.style.position = 'absolute'
      this.$pickerBox.style.top = '100%'
    } else {
      this.$colorValue = $element.querySelector(".ras-color-picker-color-input");
    }
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

    window.addEventListener('resize', this.recalculateWrapperPosition, false)

    if (this.$input) {
      this.$colorPickerIndicator.addEventListener('click', this.focusInput.bind(this))
    }

    this.$colorValue.addEventListener("change", this.onColorInputChange.bind(this))
    this.$colorValue.addEventListener("paste", this.onColorInputChange.bind(this))
    this.$alphaValue.addEventListener("change", this.onAlphaInputChange.bind(this))
    this.onChange = onChange;

    this.setColor(color);

    if (this.$input) {
      this.$pickerBox.style.display = 'none'
    }

    this.swatches = swatches

    this.isAlphaChanged = false

    this.showSwatches()
  }

  getScrollParent(node) {
    if (node == null) {
      return null;
    }
  
    if (node.scrollHeight > node.clientHeight) {
      return node;
    }

    return this.getScrollParent(node.parentNode);
  }

  checkScrollable() {
    this.$scrollParent = this.getScrollParent(this.$wrapper)
    this.$scrollParent.addEventListener('scroll', this.recalculateWrapperPosition)
  }

  focusInput() {
    if (!this.$input) {
      return;
    }
    this.$input.focus()
  }

  recalculateWrapperPosition() {
    this.$pickerBox.style.position = 'fixed'
    const wrapperRect = this.$wrapper.getBoundingClientRect()
    const pickerRect = this.$pickerBox.getBoundingClientRect()
    const differenceTop = wrapperRect.top + wrapperRect.height + pickerRect.height + 10 - window.innerHeight
    console.log("Current difference", differenceTop, pickerRect.height);
    this.$pickerBox.style.top = `${wrapperRect.top + wrapperRect.height + 10 - (differenceTop > 0 ? differenceTop : 0)}px`
    const differenceLeft = wrapperRect.left + (pickerRect.width + 20) - window.innerWidth
    this.$pickerBox.style.left = `${wrapperRect.left - (differenceLeft > 0 ? differenceLeft : 0)}px`
  }

  showSwatches() {
    const $prevSwatches = this.$pickerBox.querySelector('.ras-color-picker-swatches')
    if ($prevSwatches) {
      $prevSwatches.remove()
    }
    const $swatches = document.createElement('div')
    $swatches.classList.add('ras-color-picker-swatches')

    this.swatches.forEach(swatch => {
      const $swatch = document.createElement('div')
      $swatch.classList.add('ras-color-picker-swatch-item')
      $swatch.onclick = () => this.setColor(swatch, true)
      $swatch.style.backgroundColor = swatch
      $swatches.append($swatch)
    })

    this.$pickerBox.append($swatches)
  }

  hideWrapper(event) {
    const $wrapper = event.target.closest('.ras-color-picker-wrapper')
    if ($wrapper == this.$wrapper) {
      return
    }
    this.$pickerBox.style.display = 'none'
  }

  getColorValue() {
    if (!this.$colorValue.value) {
      return ''
    }
    return `#${this.$colorValue.value.replace(/#/g, '')}`
  }

  destroy() {
    if (this.$scrollParent) {
      this.$scrollParent.removeEventListener('scroll', this.recalculateWrapperPosition);
    }
    window.removeEventListener('resize', this.recalculateWrapperPosition)
    document.removeEventListener('mousedown', this.hideWrapper)
    this.$pickerBox.remove();
    this.onChange = null;
  }

  setColor(color, isNotify = false) {
    if (this.prevColor === color) {
      return
    }
    this.prevColor = color
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
    this.prevColor = hex;
    this.onChange(hex, this);
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
    this.$wrapper.style.setProperty("--currentColor", color);
    this.$wrapper.style.setProperty(
      "--currentColorWithAlpha",
      colorWithAlpha
    );
    this.$wrapper.style.setProperty(
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

  preventEvent(event) {
    if(event.stopPropagation) event.stopPropagation();
    if(event.preventDefault) event.preventDefault();
    event.cancelBubble=true;
    event.returnValue=false;
  }

  correctAlphaOnColorChange() {
    if (this.alphaSliderValue > 0 || this.isAlphaChanged) {
      return;
    }

    this.alphaSliderValue = 100;
  }

  onAlphaInputChange() {
    const value = this.$alphaValue.value;
    this.alphaSliderValue = Math.min(100, Math.max(0, value));
    this.isAlphaChanged = true;
    this.showCurrentColors();
    this.showColorValue();
    this.showAlphaValue();
    this.emitChanges();
  }

  onColorInputChange() {
    requestAnimationFrame(() => {
      setTimeout(() => {
        this.setColor(this.getColorValue(), true);
      })
    })
  }

  onColorPickerMove(event, target) {
    this.preventEvent(event)
    const box = target.parentNode.getBoundingClientRect();
    const x = Math.min(Math.max(0, event.clientX - box.left), box.width);
    const y = Math.min(Math.max(0, event.clientY - box.top), box.height);

    this.colorPickerValue = {
      x: (x / box.width) * 100,
      y: 100 - (y / box.height) * 100
    };
    this.correctAlphaOnColorChange();
    this.showCurrentColors();
    this.showColorValue();
    this.showAlphaValue();
    this.emitChanges();
  }

  onColorLineMove(event, target) {
    this.preventEvent(event)
    const box = target.parentNode.getBoundingClientRect();
    const x = Math.min(Math.max(0, event.clientX - box.left), box.width);

    this.colorSliderValue = Math.round((x / box.width) * 100 * 3.6);
    this.correctAlphaOnColorChange();
    this.showCurrentColors();
    this.showColorValue();
    this.showAlphaValue();
    this.emitChanges();
  }

  onAlphaMove(event, target) {
    this.preventEvent(event)
    const box = target.parentNode.getBoundingClientRect();
    const x = Math.min(Math.max(0, event.clientX - box.left), box.width);

    this.alphaSliderValue = Math.round((x / box.width) * 100);
    this.isAlphaChanged = true;
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