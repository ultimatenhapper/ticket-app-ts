export const amountToTime = (totalTime: number = 0) => {
  const getSeconds = `0${totalTime % 60}`.slice(-2);
  const minutes = Math.floor(totalTime / 60);
  const getMinutes = `0${minutes % 60}`.slice(-2);
  const hours = Math.floor(totalTime / 3600);
  const getHours =
    hours > 0 ? `0${Math.floor(totalTime / 3600)}:`.slice(-2) : "";

  return `${getHours}${getMinutes}:${getSeconds}`;
};
