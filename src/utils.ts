export function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = function (e) {
      const img = new Image();
      img.onload = function () {
        resolve(img);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export function map(
  x: number,
  in_min: number,
  in_max: number,
  out_min: number,
  out_max: number,
): number {
  return ((x - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
}
