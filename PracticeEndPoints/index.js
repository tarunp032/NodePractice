const express = require("express");

const app = express();
const port = 8080;

app.use(express.json());

// 1.
app.post("/add", async (req, res) => {
  const { a, b, operator } = req.body;
  if (!(a && b && operator)) {
    return res.status(400).json({ message: "All fields are required" });
  }

  let result;
  if (operator === "+") {
    result = a + b;
  } else if (operator === "-") {
    result = a - b;
  } else if (operator === "*") {
    result = a * b;
  } else if (operator === "/") {
    result = a / b;
  }
  return res.status(200).json(result);
});

// 2.
app.post("/even", async (req, res) => {
  const { a, b } = req.body;

  if (!a || !b) {
    return res.status(400).json({ message: "All fields are required" });
  }

  let result;

  if (b === "even") {
    result = a.filter((num) => num % 2 === 0);
  } else {
    result = a.filter((num) => num % 2 !== 0);
  }

  return res.status(200).json(result);
});

// 3.
app.post("/evenodd", async (req, res) => {
  const { a, b, c } = req.body;

  if (!(a && b && c)) {
    return res.status(400).json({ message: "All fields are required" });
  }

  let result = [];

  for (let i = a; i <= b; i++) {
    if (c === "even" && i % 2 === 0) {
      result = [...result, i];
    } else if (c === "odd" && i % 2 !== 0) {
      result = [...result, i];
    }
  }

  return res.status(200).json(result);
});

// 4. Max / Min between 3 numbers
app.post("/maxmin", async (req, res) => {
  const { a, b, c, type } = req.body;

  if (!(a && b && c && type)) {
    return res.status(400).json({ message: "All fields are required" });
  }

  let result;

  if (type === "max") {
    result = Math.max(a, b, c);
  } else {
    result = Math.min(a, b, c);
  }

  return res.status(200).json(result);
});

// 5. Array sum even / odd
app.post("/arraysum", async (req, res) => {
  const { a, b, c, type } = req.body;

  if (!(a && b && c && type)) {
    return res.status(400).json({ message: "All fields are required" });
  }

  let arr = [...a, ...b, ...c];
  let sum = 0;

  if (type === "even") {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] % 2 === 0) {
        sum += arr[i];
      }
    }
  } else {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] % 2 !== 0) {
        sum += arr[i];
      }
    }
  }

  return res.status(200).json(sum);
});

// 6. Positive / Negative / Zero filter
app.post("/filter", async (req, res) => {
  const { a, b, c, type } = req.body;

  if (a === undefined || b === undefined || c === undefined || !type) {
    return res.status(400).json({ message: "All fields are required" });
  }

  let arr = [a, b, c];
  let result;

  if (type === "positive") {
    result = arr.filter((num) => num > 0);
  } else if (type === "negative") {
    result = arr.filter((num) => num < 0);
  } else {
    result = arr.filter((num) => num === 0);
  }

  return res.status(200).json(result);
});

// 7. Age calculator
app.post("/age", async (req, res) => {
  const { day, month, year, type } = req.body;

  if (day === undefined || month === undefined || year === undefined || !type) {
    return res.status(400).json({ message: "All fields are required" });
  }

  let now = new Date();
  let birthDate = new Date(year, month - 1, day);

  let currentYear = now.getFullYear();
  let currentMonth = now.getMonth() + 1;

  let years = currentYear - year;
  let months = years * 12 + (currentMonth - month);

  let diff = now - birthDate;

  let days = Math.floor(diff / (1000 * 60 * 60 * 24));
  let hours = Math.floor(diff / (1000 * 60 * 60));
  let minutes = Math.floor(diff / (1000 * 60));
  let seconds = Math.floor(diff / 1000);

  let result;

  if (type === "years" || type === "year") {
    result = years;
  } else if (type === "months" || type === "month") {
    result = months;
  } else if (type === "days" || type === "day") {
    result = days;
  } else if (type === "hours" || type === "hour") {
    result = hours;
  } else if (type === "minutes" || type === "minute") {
    result = minutes;
  } else if (type === "seconds" || type === "second") {
    result = seconds;
  } else {
    result = { years, months, days, hours, minutes, seconds };
  }

  return res.status(200).json(result);
});

// 8. Student result
app.post("/result", async (req, res) => {
  const { a, b, c, d } = req.body;

  if (!(a && b && c && d)) {
    return res.status(400).json({ message: "All fields are required" });
  }

  let total = a + b + c + d;
  let percentage = total / 4;
  let status = percentage >= 33 ? "pass" : "fail";

  return res.status(200).json({ total, percentage, status });
});

// 9. Salary calculator
app.post("/salary", async (req, res) => {
  const { basic, hra, da, tax } = req.body;

  if (!(basic && hra && da && tax)) {
    return res.status(400).json({ message: "All fields are required" });
  }

  let gross = basic + hra + da;
  let net = gross - tax;

  return res.status(200).json({ gross, net });
});

// 10. Discount calculator
app.post("/discount", async (req, res) => {
  const { price, qty, discount, gst } = req.body;

  if (!(price && qty && discount && gst)) {
    return res.status(400).json({ message: "All fields are required" });
  }

  let total = price * qty;
  let afterDiscount = total - (total * discount) / 100;
  let final = afterDiscount + (afterDiscount * gst) / 100;

  return res.status(200).json(final);
});

// 11. Electricity bill
app.post("/bill", async (req, res) => {
  const { units, rate, surcharge, tax } = req.body;

  if (!(units && rate && surcharge && tax)) {
    return res.status(400).json({ message: "All fields are required" });
  }

  let amount = units * rate;
  let total = amount + surcharge + tax;

  return res.status(200).json(total);
});

// 12. EMI calculator
app.post("/emi", async (req, res) => {
  const { amount, rate, months, type } = req.body;

  if (!(amount && rate && months && type)) {
    return res.status(400).json({ message: "All fields are required" });
  }

  let total = amount + (amount * rate) / 100;
  let emi = total / months;
  let result;

  if (type === "monthly") {
    result = emi;
  } else {
    result = total;
  }

  return res.status(200).json(result);
});

// 13. Reverse String
app.post("/reverse-string", async (req, res) => {
  const { text, type, caseType, separator } = req.body;

  if (!text || !type || !caseType || separator === undefined) {
    return res.status(400).json({ message: "All fields are required" });
  }

  let result;

  if (type === "full") {
    result = text.split("").reverse().join("");
  } else {
    result = text.split(separator).reverse().join(separator);
  }

  if (caseType === "upper") {
    result = result.toUpperCase();
  } else if (caseType === "lower") {
    result = result.toLowerCase();
  }

  return res.status(200).json(result);
});

// 14. Count Vowels
app.post("/count-vowels", async (req, res) => {
  const { text, ignoreCase, returnType } = req.body;

  if (!text || ignoreCase === undefined || !returnType) {
    return res.status(400).json({ message: "All fields are required" });
  }

  let str = ignoreCase ? text.toLowerCase() : text;

  let vowels = [];
  let count = 0;

  for (let i = 0; i < str.length; i++) {
    if ("aeiou".includes(str[i])) {
      count++;
      vowels.push(str[i]);
    }
  }

  let result;

  if (returnType === "count") {
    result = count;
  } else if (returnType === "vowels") {
    result = vowels;
  } else if (returnType === "both") {
    result = { count, vowels };
  } else {
    return res.status(400).json({ message: "Invalid returnType" });
  }

  return res.status(200).json(result);
});

// 15. Sum of Array
app.post("/sum-array", async (req, res) => {
  const { arr, type, bonus, multiply } = req.body;

  if (!arr || !type || bonus === undefined || multiply === undefined) {
    return res.status(400).json({ message: "All fields are required" });
  }

  let sum = 0;

  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }

  if (type === "bonus") {
    sum += bonus;
  } else if (type === "multiply") {
    sum *= multiply;
  } else if (type === "both") {
    sum = multiply * sum + bonus;
  }

  return res.status(200).json({
    message: `we have calculate ${type}`,
    answer: sum,
  });
});

// 16. Remove Duplicates
app.post("/remove-duplicates", async (req, res) => {
  const { arr, type, order } = req.body;

  if (!arr || !type || !order) {
    return res.status(400).json({ message: "All fields are required" });
  }

  let result = [...new Set(arr)];

  if (type === "even") {
    result = result.filter((num) => num % 2 === 0);
  } else if (type === "odd") {
    result = result.filter((num) => num % 2 !== 0);
  }

  if (order === "asc") {
    result = result.sort((a, b) => a - b);
  } else if (order === "desc") {
    result = result.sort((a, b) => b - a);
  } else {
    return res.status(400).json({ message: "Invalid order" });
  }

  return res.status(200).json(result);
});

// 17. Find Duplicates
app.post("/find-duplicates", async (req, res) => {
  const { arr, type, order } = req.body;

  if (!arr || !type || !order) {
    return res.status(400).json({ message: "All fields are required" });
  }

  let result = [];

  for (let i = 0; i < arr.length; i++) {
    let count = 0;

    for (let j = 0; j < arr.length; j++) {
      if (arr[i] === arr[j]) {
        count++;
      }
    }

    if (count > 1 && !result.includes(arr[i])) {
      result.push(arr[i]);
    }
  }

  if (type === "even") {
    result = result.filter((num) => num % 2 === 0);
  } else if (type === "odd") {
    result = result.filter((num) => num % 2 !== 0);
  } else if (type !== "all") {
    return res.status(400).json({ message: "Invalid type" });
  }

  if (order === "asc") {
    result.sort((a, b) => a - b);
  } else if (order === "desc") {
    result.sort((a, b) => b - a);
  } else {
    return res.status(400).json({ message: "Invalid order" });
  }

  return res.status(200).json(result);
});

// 18. Sum from 1 to N
app.post("/sum-1-to-n", async (req, res) => {
  const { n, type, extra, multiply } = req.body;

  if (
    n === undefined ||
    !type ||
    extra === undefined ||
    multiply === undefined
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  let sum = 0;

  for (let i = 1; i <= n; i++) {
    sum += i;
  }

  if (type === "extra") {
    sum += extra;
  } else if (type === "multiply") {
    sum *= multiply;
  }

  return res.status(200).json(sum);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
