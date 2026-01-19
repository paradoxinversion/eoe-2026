export function makeId(type: string, uuid?: string) {
  const id =
    uuid ||
    (typeof crypto !== "undefined" && (crypto as any).randomUUID
      ? (crypto as any).randomUUID()
      : `r${Date.now()}${Math.floor(Math.random() * 10000)}`);
  return `${type}-${id}`;
}

export default makeId;
