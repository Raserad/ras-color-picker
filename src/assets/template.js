export const template = `
<div class="ras-color-picker" style="--color: green;">
  <div class="ras-color-picker-area ras-color-picker-control-area">
    <div class="ras-color-picker-control-point" data-type="color-picker"></div>
  </div>
  <div class="ras-color-picker-line ras-color-picker-control-area ras-color-picker-color-line">
    <div class="ras-color-picker-control-point" data-type="color-line"></div>
  </div>
  <div class="ras-color-picker-line ras-color-picker-control-area ras-color-picker-alpha-line ras-color-picker-alpha-bg ">
    <div class="ras-color-picker-control-point ras-color-picker-alpha-bg" data-type="alpha">
      <div class="ras-color-picker-color-alpha"></div>
    </div>
    <div class="ras-color-picker-alpha-gradient"></div>
  </div>
  <div class="ras-color-picker-inputs">
    <div class="ras-color-picker-current-color ras-color-picker-alpha-bg">
      <div class="ras-color-picker-color-alpha"></div>
    </div>
    <input class="ras-color-picker-input ras-color-picker-color-input" />
    <input class="ras-color-picker-input ras-color-picker-alpha-input" min="0" max="100" type="number" />
  </div>
</div>
`;
