const start = (): [number, number] => {
  return process.hrtime();
};

const calculate = (start: [number, number]) => {
  const diff = process.hrtime(start);
  return diff[0] * 1000 + diff[1] / 1e6; // Convierte a milisegundos
};

export const TimeUtils = {
  start,
  calculate,
};
