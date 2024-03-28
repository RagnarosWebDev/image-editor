import { map } from '../../utils.ts';

export abstract class Painter {
  abstract draw(context: CanvasRenderingContext2D): void;
  abstract isIntersect(context: CanvasRenderingContext2D, x: number, y: number): boolean;
}
export class ColoredPath extends Painter {
  path: Path2D;
  color: string;
  size: number;

  constructor(path: Path2D, color: string, size: number) {
    super();
    this.path = path;
    this.color = color;
    this.size = size;
  }

  draw(context: CanvasRenderingContext2D) {
    context.lineCap = 'round';
    context.fillStyle = this.color;
    context.strokeStyle = this.color;
    context.lineWidth = this.size;
    context.stroke(this.path);
  }

  isIntersect(context: CanvasRenderingContext2D, x: number, y: number): boolean {
    return context.isPointInPath(this.path, x, y);
  }
}
export class ColoredText extends Painter {
  text: string;
  size: number;
  color: string;
  x: number;
  y: number;

  constructor(text: string, size: number, color: string, x: number, y: number) {
    super();
    this.text = text;
    this.size = size;
    this.color = color;
    this.x = x;
    this.y = y;
  }

  draw(context: CanvasRenderingContext2D): void {
    context.lineWidth = 1;
    context.font = `bold ${this.size}px serif`;
    context.fillStyle = this.color;
    context.strokeStyle = this.color;
    context.fillText(this.text, this.x, this.y);
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  isIntersect(context: CanvasRenderingContext2D, x: number, y: number): boolean {
    // TODO Intersection from text not work
    return false;
  }
}

export class Editor {
  private background: HTMLImageElement | null = null;
  private paths: Painter[];
  private canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.paths = [];
    this.canvas = canvas;
  }

  createBackground(image: HTMLImageElement) {
    this.background = image;
    this.paths = [];
    this.draw();
  }

  draw() {
    const context = this.canvas.getContext('2d');

    if (!context) return;
    if (!this.background) return;

    this.canvas.width = this.background.width;
    this.canvas.height = this.background.height;
    context.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
    context.drawImage(this.background, 0, 0);

    for (const path of this.paths) {
      path.draw(context);
    }
  }

  add(text: Painter) {
    const context = this.canvas.getContext('2d');

    if (!context) return;

    this.paths.push(text);
    context.beginPath();
    text.draw(context);
  }
  removeLast() {
    this.paths.pop();
    this.draw();
  }
  clearAll() {
    this.paths = [];
    this.background = null;
    this.canvas.getContext('2d')?.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  addPointToPath(x: number, y: number) {
    const path = this.paths.at(-1);
    const context = this.canvas.getContext('2d');
    if (!context) return;

    if (!(path instanceof ColoredPath)) {
      return;
    }

    path.path.lineTo(x, y);
    context.lineTo(x, y);
    context.stroke();
  }
  endPoint() {
    this.canvas.getContext('2d')?.closePath();
  }
  mapByImage(x: number, y: number): [number, number] {
    if (!this.background) throw Error('');

    return [
      map(x, 0, this.canvas.clientWidth, 0, this.background?.width),
      map(y, 0, this.canvas.clientHeight, 0, this.background?.height),
    ];
  }

  tryRemoveByPoint(x: number, y: number) {
    const context = this.canvas.getContext('2d');
    if (!context) return;

    const target = this.paths.findIndex((e) => {
      return e.isIntersect(context, x, y);
    });

    if (target == -1) return;

    this.paths.splice(target, 1);
    this.draw();
  }
}
