/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

import {
  allPass,
  anyPass,
  complement,
  compose,
  curry,
  equals,
  filter,
} from "ramda";

// Предикаты
const isRed = equals("red");
const isNotRed = complement(isRed);
const isGreen = equals("green");
const isWhite = equals("white");
const isNotWhite = complement(isWhite);
const isBlue = equals("blue");
const isOrange = equals("orange");

const isGreatherThen = curry((goal, target) => target >= goal);
const isGreatherThenThree = isGreatherThen(3);
const isGreatherThenTwo = isGreatherThen(2);

const isEqual = curry((a, b) => a === b);
const isEqualOne = isEqual(1);
const isEqualTwo = isEqual(2);
const isEqualFour = isEqual(4);

// Трансформирующие функции
const ArrToSet = (arr) => new Set(arr);
const objToArr = (obj) => Object.values(obj);

// Гетеры
const getLength = (arr) => arr.length;
const getSize = (arr) => arr.size;

const getColorCountByCondition = (Condition) =>
  compose(getLength, filter(Condition), objToArr);
const getGreenColorCount = getColorCountByCondition(isGreen);
const getRedColorCount = getColorCountByCondition(isRed);
const getBlueColorCount = getColorCountByCondition(isBlue);
const getOrangeColorCount = getColorCountByCondition(isOrange);

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = ({ star, square, triangle, circle }) =>
  isRed(star) && isGreen(square) && isWhite(triangle) && isWhite(circle);

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = (props) => {
  // получения цветов и проверки по условия в отдельную функцию выносить не нашел смысла
  const isGreenColorCountGreatherTwo = compose(
    isGreatherThenTwo,
    getGreenColorCount
  );

  return isGreenColorCountGreatherTwo(props);
};

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = (props) => {
  return isEqual(getRedColorCount(props), getBlueColorCount(props));
};

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = ({ star, square, triangle, circle }) =>
  isBlue(circle) && isRed(star) && isOrange(square);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = (props) => {
  // очень специфичные гетеры и предикаты, выносить в модуль не стал
  const getUniqColourfulCount = compose(
    getSize,
    ArrToSet,
    filter(isNotWhite),
    objToArr
  );
  const getUniqColorCount = compose(getSize, ArrToSet, objToArr);

  const isUniqColourfulCountGreatherThree = compose(
    isGreatherThenThree,
    getUniqColourfulCount
  );
  const isUniqColorCountIsEqualOne = compose(isEqualOne, getUniqColorCount);

  const isUniqGreatherThreeOrIsOne = anyPass([
    isUniqColourfulCountGreatherThree,
    isUniqColorCountIsEqualOne,
  ]);

  return isUniqGreatherThreeOrIsOne(props);
};

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = (props) => {
  const isGreenColorCountIsEqualTwo = compose(isEqualTwo, getGreenColorCount);
  const isRedColorCountIsEqualOne = compose(isEqualOne, getRedColorCount);

  const isRedEqualOneAndGreenEqualTwo = allPass([
    isGreenColorCountIsEqualTwo,
    isRedColorCountIsEqualOne,
  ]);

  return isRedEqualOneAndGreenEqualTwo(props) && isGreen(props.triangle);
};

// 7. Все фигуры оранжевые.
export const validateFieldN7 = (props) => {
  const isOrangeColorCountIsEqualFour = compose(
    isEqualFour,
    getOrangeColorCount
  );

  return isOrangeColorCountIsEqualFour(props);
};

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = ({ star }) => {
  const isStarNotRedandWhite = allPass([isNotRed, isNotWhite]);

  return isStarNotRedandWhite(star);
};

// 9. Все фигуры зеленые.
export const validateFieldN9 = (props) => {
  const isOrangeColorCountIsEqualFour = compose(
    isEqualFour,
    getGreenColorCount
  );

  return isOrangeColorCountIsEqualFour(props);
};

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = ({ triangle, square }) => {
  return (
    isNotWhite(triangle) && isNotWhite(square) && isEqual(triangle, square)
  );
};
