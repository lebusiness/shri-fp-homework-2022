/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import { allPass, compose, curry } from "ramda";
import Api from "../tools/api";

const api = new Api();

// Вспомогательные
const proxyLog = curry((log, value) => {
  log(value);
  return value;
});

// Трансформирующие функции
const strToNum = (str) => +str;
const toSqr = (num) => num * num;
const tenToSecBase = async (value) => {
  let res;
  try {
    res = await api.get("https://api.tech/numbers/base", {
      from: 10,
      to: 2,
      number: value,
    });
  } catch (e) {
    console.log(e);
    return tenToSecBase(value);
  }
  return res;
};

// Геттеры
const getLength = (s) => s.length;
const getStrAbs = (s) => (s[0] === "-" ? s.slice(1) : s);
const getNumLength = compose(getLength, getStrAbs);
const getMod = curry((mod, value) => value % mod);

const getAnimalsById = async (id) => {
  let animals;
  try {
    animals = await api.get(`https://animals.tech/${id}`, {});
  } catch (e) {
    console.log(e);
    return getAnimalsById(id);
  }
  return animals;
};

// Предикаты
const isGreatherThen = curry((goal, target) => target >= goal);
const isLessThen = curry((goal, target) => target <= goal);

const isGreatherThenTwo = isGreatherThen(2);
const isLessThenTen = isLessThen(10);

const isLengthGreatherTwo = compose(isGreatherThenTwo, getNumLength);
const isLengthLessTen = compose(isLessThenTen, getNumLength);

const isPositive = (value) => +value >= 0;
const isIntOrFloat = (value) => /^[0-9,.]+$/.test(value);

// Функция преобразования
const processSequence = async ({
  value,
  writeLog,
  handleSuccess,
  handleError,
}) => {
  writeLog(value);

  const proxyWriteLog = proxyLog(writeLog);

  const isPositiveValidLengthValue = allPass([
    isIntOrFloat,
    isPositive,
    isLengthLessTen,
    isLengthGreatherTwo,
  ]);
  if (!isPositiveValidLengthValue(value)) {
    handleError("ValidationError");
    return;
  }

  const round = compose(proxyWriteLog, Math.round, strToNum);
  const roundValue = round(value);

  const { result: secBaseVal } = await tenToSecBase(roundValue);
  writeLog(secBaseVal);

  const mod = compose(
    proxyWriteLog,
    getMod(3),
    proxyWriteLog,
    toSqr,
    strToNum,
    proxyWriteLog,
    getLength
  );
  const modValue = mod(secBaseVal);

  const { result: animal } = await getAnimalsById(modValue);
  handleSuccess(animal);
};

export default processSequence;
