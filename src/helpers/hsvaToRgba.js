export function hsvaToRgba(hsva) {
  var saturation = hsva.s / 100;
  var value = hsva.v / 100;
  var chroma = saturation * value;
  var hueBy60 = hsva.h / 60;
  var x = chroma * (1 - Math.abs((hueBy60 % 2) - 1));
  var m = value - chroma;

  chroma = chroma + m;
  x = x + m;

  var index = Math.floor(hueBy60) % 6;
  var red = [chroma, x, m, m, x, chroma][index];
  var green = [x, chroma, chroma, x, m, m][index];
  var blue = [m, m, x, chroma, chroma, x][index];

  return {
    r: Math.round(red * 255),
    g: Math.round(green * 255),
    b: Math.round(blue * 255),
    a: hsva.a
  };
}
