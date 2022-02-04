export const template = `
<div class="picker" style="--color: green;">
  <div class="picker-area picker-control-area">
    <div class="picker-control-point" data-type="color-picker"></div>
  </div>
  <div class="picker-line picker-control-area picker-color-line">
    <div class="picker-control-point" data-type="color-line"></div>
  </div>
  <div class="picker-line picker-control-area picker-alpha-line picker-alpha-bg ">
    <div class="picker-control-point picker-alpha-bg" data-type="alpha">
      <div class="picker-color-alpha"></div>
    </div>
    <div class="picker-alpha-gradient"></div>
  </div>
  <div class="picker-inputs">
    <div class="picker-current-color picker-alpha-bg">
      <div class="picker-color-alpha"></div>
    </div>
    <input class="picker-input picker-color-input" />
    <input class="picker-input picker-alpha-input" min="0" max="100" type="number" />
  </div>
</div>
`;
