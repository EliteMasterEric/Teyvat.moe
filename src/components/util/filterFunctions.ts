export const filterNotEmpty = <TValue>(value: TValue | null | undefined): value is TValue => {
  return value !== null && value !== undefined;
};

