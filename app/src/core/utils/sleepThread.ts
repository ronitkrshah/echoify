export async function sleepThreadAsync(durationInMilis: number) {
  return await new Promise((res, rej) => {
    setTimeout(() => {
      res(true);
    }, durationInMilis);
  });
}
