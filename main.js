// ===== Theme Toggle =====
const toggle = document.getElementById("theme-toggle");
const STORAGE_KEY = "theme";

function getPreferredTheme() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(STORAGE_KEY, theme);
}

applyTheme(getPreferredTheme());

toggle.addEventListener("click", function () {
  const current = document.documentElement.getAttribute("data-theme");
  applyTheme(current === "dark" ? "light" : "dark");
});

// ===== Lotto Generator =====
const generateBtn = document.getElementById("generate-btn");
const numbersContainer = document.getElementById("lotto-numbers");
const historySection = document.getElementById("history");
const historyList = document.getElementById("history-list");

function getRandomNumbers() {
  const pool = [];
  for (let i = 1; i <= 45; i++) pool.push(i);

  const picked = [];
  for (let i = 0; i < 7; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    picked.push(pool.splice(idx, 1)[0]);
  }

  const main = picked.slice(0, 6).sort(function (a, b) { return a - b; });
  const bonus = picked[6];
  return { main: main, bonus: bonus };
}

function getRangeClass(num) {
  if (num <= 10) return "range-1";
  if (num <= 20) return "range-10";
  if (num <= 30) return "range-20";
  if (num <= 40) return "range-30";
  return "range-40";
}

function renderNumbers(result) {
  numbersContainer.innerHTML = "";

  result.main.forEach(function (num, i) {
    var ball = document.createElement("div");
    ball.className = "ball " + getRangeClass(num);
    ball.textContent = num;
    ball.style.animationDelay = (i * 0.1) + "s";
    ball.classList.add("pop");
    numbersContainer.appendChild(ball);
  });

  var sep = document.createElement("div");
  sep.className = "bonus-separator";
  sep.textContent = "+";
  numbersContainer.appendChild(sep);

  var bonusBall = document.createElement("div");
  bonusBall.className = "ball bonus " + getRangeClass(result.bonus);
  bonusBall.textContent = result.bonus;
  bonusBall.style.animationDelay = "0.7s";
  bonusBall.classList.add("pop");
  numbersContainer.appendChild(bonusBall);
}

function addToHistory(result) {
  historySection.classList.add("visible");

  var li = document.createElement("li");
  var mainText = result.main.map(function (n) {
    return String(n).padStart(2, "0");
  }).join("  ");
  li.textContent = mainText + "  + " + String(result.bonus).padStart(2, "0");

  historyList.insertBefore(li, historyList.firstChild);

  if (historyList.children.length > 10) {
    historyList.removeChild(historyList.lastChild);
  }
}

generateBtn.addEventListener("click", function () {
  var result = getRandomNumbers();
  renderNumbers(result);
  addToHistory(result);
});
