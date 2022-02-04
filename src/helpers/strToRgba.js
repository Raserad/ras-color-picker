export function strToRgba(str) {
  const regex = /^((rgba)|rgb)[\D]+([\d.]+)[\D]+([\d.]+)[\D]+([\d.]+)[\D]*?([\d.]+|$)/i;
  let match, rgba;

  const ctx = document.createElement("canvas").getContext("2d");
  ctx.fillStyle = "#000";

  // Use canvas to convert the string to a valid color string
  ctx.fillStyle = str;
  match = regex.exec(ctx.fillStyle);

  if (match) {
    rgba = {
      r: match[3] * 1,
      g: match[4] * 1,
      b: match[5] * 1,
      a: match[6] * 1
    };
  } else {
    match = ctx.fillStyle
      .replace("#", "")
      .match(/.{2}/g)
      .map(function (h) {
        return parseInt(h, 16);
      });
    rgba = {
      r: match[0],
      g: match[1],
      b: match[2],
      a: 1
    };
  }

  return rgba;
}
