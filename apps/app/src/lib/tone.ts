export function adherenceTone(a: number) {
  return a >= 80 ? "text-ok" : a >= 60 ? "text-volt" : "text-bad";
}
