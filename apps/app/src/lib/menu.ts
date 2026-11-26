// Menú PROVISIONAL de 4 semanas. De aquí salen las comidas de cada día y la lista de la compra.
import type { MealItem } from "./data";

export const categories = ["Fruta y verdura", "Carne y pescado", "Lácteos y huevos", "Despensa"] as const;
export type Category = (typeof categories)[number];

type Unit = "g" | "ml" | "ud" | "rebanadas" | "latas";

export const ingredients = {
  aguacate: { name: "Aguacate", cat: "Fruta y verdura", unit: "ud" },
  platano: { name: "Plátano", cat: "Fruta y verdura", unit: "ud" },
  manzana: { name: "Manzana", cat: "Fruta y verdura", unit: "ud" },
  fresas: { name: "Fresas", cat: "Fruta y verdura", unit: "g" },
  arandanos: { name: "Arándanos", cat: "Fruta y verdura", unit: "g" },
  tomate: { name: "Tomate", cat: "Fruta y verdura", unit: "ud" },
  ensalada: { name: "Mezcla de ensalada", cat: "Fruta y verdura", unit: "g" },
  espinacas: { name: "Espinacas", cat: "Fruta y verdura", unit: "g" },
  brocoli: { name: "Brócoli", cat: "Fruta y verdura", unit: "g" },
  calabacin: { name: "Calabacín", cat: "Fruta y verdura", unit: "ud" },
  verduras: { name: "Verduras para saltear", cat: "Fruta y verdura", unit: "g" },
  boniato: { name: "Boniato", cat: "Fruta y verdura", unit: "g" },
  patata: { name: "Patata", cat: "Fruta y verdura", unit: "g" },
  pollo: { name: "Pechuga de pollo", cat: "Carne y pescado", unit: "g" },
  ternera: { name: "Ternera magra", cat: "Carne y pescado", unit: "g" },
  pavo: { name: "Pavo en lonchas", cat: "Carne y pescado", unit: "g" },
  salmon: { name: "Salmón", cat: "Carne y pescado", unit: "g" },
  merluza: { name: "Merluza", cat: "Carne y pescado", unit: "g" },
  huevos: { name: "Huevos", cat: "Lácteos y huevos", unit: "ud" },
  leche: { name: "Leche", cat: "Lácteos y huevos", unit: "ml" },
  yogur: { name: "Yogur griego", cat: "Lácteos y huevos", unit: "g" },
  quesoBatido: { name: "Queso fresco batido", cat: "Lácteos y huevos", unit: "g" },
  pan: { name: "Pan integral", cat: "Despensa", unit: "rebanadas" },
  avena: { name: "Copos de avena", cat: "Despensa", unit: "g" },
  arroz: { name: "Arroz integral", cat: "Despensa", unit: "g" },
  pasta: { name: "Pasta integral", cat: "Despensa", unit: "g" },
  quinoa: { name: "Quinoa", cat: "Despensa", unit: "g" },
  lentejas: { name: "Lentejas cocidas", cat: "Despensa", unit: "g" },
  atun: { name: "Atún al natural", cat: "Despensa", unit: "latas" },
  hummus: { name: "Hummus", cat: "Despensa", unit: "g" },
  nueces: { name: "Nueces", cat: "Despensa", unit: "g" },
  almendras: { name: "Almendras", cat: "Despensa", unit: "g" },
  proteina: { name: "Proteína en polvo", cat: "Despensa", unit: "g" },
  aceite: { name: "Aceite de oliva virgen", cat: "Despensa", unit: "ml" },
} satisfies Record<string, { name: string; cat: Category; unit: Unit }>;

export type IngredientId = keyof typeof ingredients;

export type Dish = MealItem & { uses: Partial<Record<IngredientId, number>> };

const dish = (
  id: string,
  name: string,
  qty: string,
  [kcal, p, c, f]: [number, number, number, number],
  uses: Dish["uses"],
): Dish => ({ id, name, qty, kcal, p, c, f, uses });

const breakfasts = [
  dish("b-tostadas", "Tostadas con aguacate y huevo", "2 rebanadas + 1 huevo", [420, 18, 38, 22], { pan: 2, aguacate: 0.5, huevos: 1 }),
  dish("b-avena", "Porridge de avena con plátano", "1 bol", [420, 18, 64, 10], { avena: 60, leche: 250, platano: 1 }),
  dish("b-yogur", "Yogur griego con fresas y nueces", "1 bol", [380, 22, 24, 22], { yogur: 200, fresas: 100, nueces: 20 }),
  dish("b-tortilla", "Tortilla francesa con pan y tomate", "2 huevos + 2 rebanadas", [400, 22, 32, 20], { huevos: 2, pan: 2, tomate: 1, aceite: 5 }),
];

const lunches = [
  dish("l-pollo", "Pollo a la plancha con arroz y ensalada", "1 plato", [710, 56, 68, 22], { pollo: 180, arroz: 80, ensalada: 100, tomate: 1, aceite: 10 }),
  dish("l-lentejas", "Lentejas con verduras y huevo", "1 plato", [640, 36, 70, 22], { lentejas: 250, calabacin: 0.5, tomate: 1, huevos: 1, aceite: 10 }),
  dish("l-pasta", "Pasta integral con atún y tomate", "1 plato", [680, 40, 80, 20], { pasta: 90, atun: 1, tomate: 2, aceite: 10 }),
  dish("l-ternera", "Ternera salteada con quinoa y verduras", "1 plato", [690, 48, 60, 26], { ternera: 150, quinoa: 70, verduras: 150, aceite: 10 }),
];

const snacks = [
  dish("s-manzana", "Manzana y almendras", "1 ud + 25 g", [250, 6, 30, 13], { manzana: 1, almendras: 25 }),
  dish("s-batido", "Batido de proteína con plátano", "1 vaso", [320, 32, 38, 5], { proteina: 30, platano: 1, leche: 200 }),
  dish("s-queso", "Queso fresco batido con arándanos", "1 bol", [190, 19, 22, 2], { quesoBatido: 200, arandanos: 80 }),
  dish("s-hummus", "Tostada con hummus y pavo", "1 rebanada", [240, 16, 21, 10], { pan: 1, hummus: 40, pavo: 50 }),
];

const dinners = [
  dish("d-salmon", "Salmón al horno con boniato y brócoli", "1 plato", [560, 37, 47, 23], { salmon: 150, boniato: 200, brocoli: 150 }),
  dish("d-merluza", "Merluza con patata y verduras", "1 plato", [460, 38, 44, 14], { merluza: 180, patata: 200, verduras: 150, aceite: 10 }),
  dish("d-ensalada", "Ensalada de pollo y aguacate", "1 plato grande", [490, 40, 16, 29], { pollo: 150, ensalada: 150, aguacate: 0.5, tomate: 1, aceite: 10 }),
  dish("d-tortilla", "Tortilla de espinacas con ensalada", "3 huevos", [430, 25, 10, 31], { huevos: 3, espinacas: 100, ensalada: 80, aceite: 10 }),
];

export const WEEKS = 4;
export const dayNames = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

export type Meal = { id: string; name: string; time: string; items: Dish[] };

/** Comidas de un día del menú. `week` 0-3, `day` 0 (lunes) - 6 (domingo). */
export function menuFor(week: number, day: number): Meal[] {
  const pick = (list: Dish[], shift: number) => list[(day + shift) % list.length];
  return [
    { id: "desayuno", name: "Desayuno", time: "08:00", items: [pick(breakfasts, week)] },
    { id: "comida", name: "Comida", time: "14:00", items: [pick(lunches, week)] },
    { id: "merienda", name: "Merienda", time: "17:30", items: [pick(snacks, week * 3)] },
    { id: "cena", name: "Cena", time: "21:00", items: [pick(dinners, week * 2 + 1)] },
  ];
}

const parseKey = (key: string) => {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export function mondayKey(d: Date = new Date()) {
  const m = new Date(d.getFullYear(), d.getMonth(), d.getDate() - ((d.getDay() + 6) % 7));
  return `${m.getFullYear()}-${String(m.getMonth() + 1).padStart(2, "0")}-${String(m.getDate()).padStart(2, "0")}`;
}

/** Semana y día del menú que corresponden a una fecha (el menú se repite cada 4 semanas). */
export function planForDate(date: string, planStart: string) {
  const d = parseKey(date);
  const weeks = Math.round((parseKey(mondayKey(d)).getTime() - parseKey(planStart).getTime()) / (7 * 86_400_000));
  const week = ((weeks % WEEKS) + WEEKS) % WEEKS;
  const day = (d.getDay() + 6) % 7;
  return { week, day, meals: menuFor(week, day) };
}

/**
 * Lunes real de la próxima vez que toca una semana del menú (la actual o una posterior).
 * Sirve para que, cuando el menú se repite, la lista de la compra empiece sin marcar.
 */
export function weekMonday(week: number, currentWeek: number, today: Date = new Date()) {
  const ahead = (week - currentWeek + WEEKS) % WEEKS;
  return mondayKey(new Date(today.getFullYear(), today.getMonth(), today.getDate() + ahead * 7));
}

export type ShoppingItem ={ id: IngredientId; name: string; cat: Category; amount: string; days: number[] };

function formatAmount(total: number, unit: Unit) {
  const n = (v: number) => v.toLocaleString("es-ES", { maximumFractionDigits: 2 });
  if (unit === "g") return total >= 1000 ? `${n(total / 1000)} kg` : `${n(total)} g`;
  if (unit === "ml") return total >= 1000 ? `${n(total / 1000)} l` : `${n(total)} ml`;
  // Lo que se compra por unidades se redondea hacia arriba
  const units = Math.ceil(total);
  if (units === 1 && unit !== "ud") return `1 ${unit.slice(0, -1)}`;
  return `${units} ${unit}`;
}

/** Ingredientes sumados para los días indicados de una semana. */
export function shoppingList(week: number, days: number[]): ShoppingItem[] {
  const sum = new Map<IngredientId, { total: number; days: Set<number> }>();
  for (const day of days) {
    for (const meal of menuFor(week, day)) {
      for (const item of meal.items) {
        for (const [id, amount] of Object.entries(item.uses) as [IngredientId, number][]) {
          const row = sum.get(id) ?? { total: 0, days: new Set<number>() };
          row.total += amount;
          row.days.add(day);
          sum.set(id, row);
        }
      }
    }
  }
  return [...sum]
    .map(([id, row]) => {
      const info = ingredients[id];
      return { id, name: info.name, cat: info.cat as Category, amount: formatAmount(row.total, info.unit as Unit), days: [...row.days] };
    })
    .sort((a, b) => a.name.localeCompare(b.name, "es"));
}
