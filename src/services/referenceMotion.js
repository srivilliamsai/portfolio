// Geometry shared by the paper-fold intro and the rotary 404 sequence.
export const DIAL_DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
export const ERROR_DIGITS = [4, 0, 4];
export const modulo = (value, divisor) => ((value % divisor) + divisor) % divisor;
export const easeInOutCubic = (value) => value < 0.5 ? 4 * value ** 3 : 1 - (-2 * value + 2) ** 3 / 2;
export function nextDialTurn(angle, digit) {
  const index = DIAL_DIGITS.indexOf(digit);
  if (index < 0 || !Number.isFinite(angle)) throw new Error('Invalid dial input');
  const step = 360 / DIAL_DIGITS.length;
  const delta = modulo(-index * step - angle, 360);
  const distance = delta < step ? delta + 360 : delta;
  return { from: angle, to: angle + distance, duration: 420 + distance * 1.6 };
}
function clipAtFold(points, threshold, before) {
  const inside = ([x, y]) => before ? x + y <= threshold : x + y >= threshold;
  const result = [];
  points.forEach((point, index) => {
    const next = points[(index + 1) % points.length];
    if (inside(point)) result.push(point);
    if (inside(point) !== inside(next)) {
      const ratio = (threshold - point[0] - point[1]) / (next[0] + next[1] - point[0] - point[1]);
      result.push([point[0] + ratio * (next[0] - point[0]), point[1] + ratio * (next[1] - point[1])]);
    }
  });
  return result;
}
const polygon = (points) => points.length < 3 ? 'polygon(0 0,0 0,0 0)' : `polygon(${points.map(([x,y]) => `${x.toFixed(2)}px ${y.toFixed(2)}px`).join(',')})`;
export function paperFoldFrame(progress, width, height) {
  if (![progress,width,height].every(Number.isFinite) || width <= 0 || height <= 0) throw new Error('Invalid paper bounds');
  const eased = easeInOutCubic(Math.min(1, Math.max(0, progress)));
  const sum = width + height;
  const threshold = sum * (1 - eased) - 2;
  const corners = [[0,0],[width,0],[width,height],[0,height]];
  const page = clipAtFold(corners, threshold, true);
  const fold = clipAtFold(corners, threshold, false).map(([x,y]) => [threshold-y,threshold-x]);
  const front = threshold / sum * 100;
  const back = (2 * threshold - sum) / sum * 100;
  return { page: polygon(page), fold: polygon(fold), shade: `linear-gradient(135deg,var(--reference-shade) ${back}%,var(--reference-fold) ${(back+front)/2}%,var(--reference-edge) ${front-.5}%)` };
}

// Shared timing for the signature strokes and page fold.
export function createSignatureTimeline(lengths) {
  if (!Array.isArray(lengths) || !lengths.length || lengths.some((length) => !Number.isFinite(length) || length <= 0)) throw new Error('Invalid signature strokes');
  const totalLength = lengths.reduce((sum, length) => sum + length, 0);
  let drawingEnd = 250;
  const strokes = lengths.map((length, index) => {
    const duration = Math.max(90, 1700 * length / totalLength);
    const stroke = { index, delay: drawingEnd, duration };
    drawingEnd += duration + 50;
    return stroke;
  });
  return { strokes, drawingEnd, foldStart: drawingEnd + 640, end: drawingEnd + 1590 };
}
export function signatureFrame(timeline, elapsed) {
  return {
    phase: elapsed < timeline.drawingEnd ? 'drawing' : elapsed < timeline.foldStart ? 'hold' : elapsed < timeline.end ? 'folding' : 'complete',
    foldProgress: Math.min(1, Math.max(0, (elapsed - timeline.foldStart) / 950)),
  };
}
