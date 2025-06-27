export default async function asyncFuncExecutor<T>(
  func: () => Promise<T>
): Promise<[T | undefined, Error | undefined]> {
  let data: T | undefined;
  let err: Error | undefined;

  try {
    data = await func();
  } catch (error) {
    err = error as Error;
  }

  return [data, err];
}
