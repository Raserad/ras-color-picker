export function rgbaToHex(rgba) {
  let R = rgba.r.toString(16);
  let G = rgba.g.toString(16);
  let B = rgba.b.toString(16);
  let A = rgba.a;

  if (rgba.r < 16) {
    R = "0" + R;
  }

  if (rgba.g < 16) {
    G = "0" + G;
  }

  if (rgba.b < 16) {
    B = "0" + B;
  }

  if (rgba.a < 1) {
    let alpha = (rgba.a * 255) | 0;
    A = alpha.toString(16);

    if (alpha < 16) {
      A = "0" + A;
    }
  } else {
    A = "";
  }

  return "#" + R + G + B + A;
}
