const workouts = {
  mon: {
    day: "MONDAY / DAY 01",
    title: "Upper body",
    subtitle: "Strong foundations, one rep at a time.",
    tag: "STRENGTH",
    time: "45",
    exercises: [
      ["Barbell bench press", "4 × 8", "90s", "▰"],
      ["Single-arm dumbbell row", "3 × 10 / side", "60s", "↗"],
      ["Seated shoulder press", "3 × 10", "60s", "↑"],
      ["Lat pulldown", "3 × 12", "60s", "⌁"],
      ["Cable tricep pushdown", "3 × 12", "45s", "↓"]
    ]
  },
  tue: {
    day: "TUESDAY / DAY 02",
    title: "Lower body",
    subtitle: "Build from the ground up.",
    tag: "STRENGTH",
    time: "50",
    exercises: [
      ["Barbell back squat", "4 × 8", "120s", "▰"],
      ["Romanian deadlift", "3 × 10", "90s", "↘"],
      ["Walking lunges", "3 × 12 / side", "60s", "↗"],
      ["Leg curl", "3 × 12", "60s", "⌁"],
      ["Standing calf raise", "3 × 15", "45s", "↑"]
    ]
  },
  wed: {
    day: "WEDNESDAY / DAY 03",
    title: "Active recovery",
    subtitle: "Make space to come back stronger.",
    tag: "RECOVERY",
    time: "30",
    exercises: [
      ["Easy walk or cycle", "1 × 20 min", "—", "↗"],
      ["World's greatest stretch", "2 × 5 / side", "30s", "↗"],
      ["90/90 hip switches", "2 × 8 / side", "30s", "↔"],
      ["Thoracic rotations", "2 × 8 / side", "30s", "↻"],
      ["Box breathing", "3 × 5 breaths", "30s", "◌"]
    ]
  },
  thu: {
    day: "THURSDAY / DAY 04",
    title: "Push",
    subtitle: "Press with control. Leave one in the tank.",
    tag: "STRENGTH",
    time: "45",
    exercises: [
      ["Incline dumbbell press", "4 × 8", "90s", "↗"],
      ["Overhead press", "3 × 8", "90s", "↑"],
      ["Dumbbell lateral raise", "3 × 12", "60s", "↔"],
      ["Cable chest fly", "3 × 12", "60s", "↗"],
      ["Overhead tricep extension", "3 × 12", "45s", "↑"]
    ]
  },
  fri: {
    day: "FRIDAY / DAY 05",
    title: "Pull",
    subtitle: "Pull with purpose. Own every negative.",
    tag: "STRENGTH",
    time: "45",
    exercises: [
      ["Conventional deadlift", "4 × 6", "120s", "↗"],
      ["Chest-supported row", "3 × 10", "75s", "↙"],
      ["Neutral-grip pulldown", "3 × 10", "60s", "↓"],
      ["Face pull", "3 × 15", "45s", "↔"],
      ["Dumbbell hammer curl", "3 × 12", "45s", "↗"]
    ]
  },
  sat: {
    day: "SATURDAY / DAY 06",
    title: "Conditioning",
    subtitle: "Work hard. Keep a little in reserve.",
    tag: "ENGINE",
    time: "35",
    exercises: [
      ["Rowing machine", "5 × 2 min", "60s", "↗"],
      ["Kettlebell swings", "4 × 15", "45s", "↗"],
      ["Sled push", "4 × 20 m", "60s", "→"],
      ["Farmer carry", "3 × 30 m", "60s", "↔"],
      ["Easy cooldown walk", "1 × 5 min", "—", "↘"]
    ]
  },
  sun: {
    day: "SUNDAY / DAY 07",
    title: "Rest & reset",
    subtitle: "Recovery is training, too.",
    tag: "REST DAY",
    time: "20",
    exercises: [
      ["Get outside for a walk", "1 × 20 min", "—", "↗"],
      ["Drink a little more water", "All day", "—", "◌"],
      ["Make time for a good meal", "No rush", "—", "✳"],
      ["Set a simple intention", "1 × 2 min", "—", "↗"],
      ["Let your body recover", "You earned it", "—", "✳"]
    ]
  }
};

const tabs = [...document.querySelectorAll(".day-tab")];
const panel = document.querySelector("#day-panel");
const exerciseList = document.querySelector(".exercise-list");
const completionText = document.querySelector(".completion-text");
const completeButton = document.querySelector(".finish-button");
const completeBanner = document.querySelector(".workout-complete");
const addMovementToggle = document.querySelector(".add-movement-toggle");
const addMovementForm = document.querySelector(".add-movement-form");
const addMovementStatus = document.querySelector(".add-form-status");
const customExercisesKey = "forma-custom-exercises";
let currentDay = "mon";
let weeklySessions = 3;
const completedDays = new Set();

function loadCustomExercises() {
  try {
    const saved = JSON.parse(localStorage.getItem(customExercisesKey) || "{}");
    return Object.fromEntries(Object.entries(saved).filter(([, items]) =>
      Array.isArray(items) && items.every((item) =>
        Array.isArray(item) && item.length === 4 && item.every((value) => typeof value === "string")
      )
    ));
  } catch {
    return {};
  }
}

let customExercises = loadCustomExercises();

function getExercises(day) {
  return [...workouts[day].exercises, ...(customExercises[day] || [])];
}

function renderWorkout(day) {
  const workout = workouts[day];
  const exercises = getExercises(day);
  currentDay = day;
  tabs.forEach((tab) => {
    const selected = tab.dataset.day === day;
    tab.classList.toggle("is-active", selected);
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });
  panel.setAttribute("aria-labelledby", `tab-${day}`);
  panel.querySelector(".workout-day-label").textContent = workout.day;
  panel.querySelector(".workout-title").textContent = workout.title;
  panel.querySelector(".workout-subtitle").textContent = workout.subtitle;
  panel.querySelector(".workout-tag").textContent = workout.tag;
  panel.querySelector(".stat-value").textContent = exercises.length.toString().padStart(2, "0");
  panel.querySelectorAll(".stat-value")[1].innerHTML = `${workout.time}<span class="stat-unit">′</span>`;
  exerciseList.replaceChildren();
  exercises.forEach(([name, sets, rest, symbol], index) => {
    const row = document.createElement("div");
    row.className = "exercise-row";
    row.dataset.index = String(index);

    const nameCell = document.createElement("span");
    nameCell.className = "exercise-name";
    const symbolCell = document.createElement("span");
    symbolCell.className = "exercise-symbol";
    symbolCell.setAttribute("aria-hidden", "true");
    symbolCell.textContent = symbol;
    nameCell.append(symbolCell, document.createTextNode(name));

    const setsCell = document.createElement("span");
    setsCell.className = "exercise-detail";
    setsCell.textContent = sets;
    const restCell = document.createElement("span");
    restCell.className = "exercise-detail rest";
    restCell.textContent = rest;
    const checkButton = document.createElement("button");
    checkButton.className = "set-check";
    checkButton.type = "button";
    checkButton.setAttribute("aria-label", `Mark ${name} complete`);
    checkButton.setAttribute("aria-pressed", "false");
    checkButton.textContent = "✓";

    row.append(nameCell, setsCell, restCell, checkButton);
    exerciseList.append(row);
  });
  const isComplete = completedDays.has(day);
  if (isComplete) {
    exerciseList.querySelectorAll(".set-check").forEach((button) => {
      button.setAttribute("aria-pressed", "true");
      button.disabled = true;
      button.classList.add("is-checked");
      button.closest(".exercise-row").classList.add("is-complete");
    });
  }
  completeBanner.hidden = !isComplete;
  completeButton.hidden = isComplete;
  addMovementToggle.hidden = isComplete;
  addMovementForm.hidden = true;
  addMovementToggle.setAttribute("aria-expanded", "false");
  addMovementForm.reset();
  addMovementStatus.textContent = "";
  updateCompletion();
}

function updateCompletion() {
  const rows = [...exerciseList.querySelectorAll(".exercise-row")];
  const checked = rows.filter((row) => row.classList.contains("is-complete")).length;
  completionText.textContent = `${checked} of ${rows.length} movements complete`;
  panel.querySelector(".completion-icon").textContent = checked === rows.length ? "✓" : "↗";
  if (checked < rows.length) completeBanner.hidden = true;
}

tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => renderWorkout(tab.dataset.day));
  tab.addEventListener("keydown", (event) => {
    if (!["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft"].includes(event.key)) return;
    event.preventDefault();
    const direction = ["ArrowDown", "ArrowRight"].includes(event.key) ? 1 : -1;
    const nextIndex = (index + direction + tabs.length) % tabs.length;
    tabs[nextIndex].focus();
    renderWorkout(tabs[nextIndex].dataset.day);
  });
});

addMovementToggle.addEventListener("click", () => {
  const opening = addMovementForm.hidden;
  addMovementForm.hidden = !opening;
  addMovementToggle.setAttribute("aria-expanded", String(opening));
  addMovementStatus.textContent = "";
  if (opening) addMovementForm.elements.name.focus();
});

addMovementForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = addMovementForm.elements.name.value.trim();
  const sets = addMovementForm.elements.sets.value.trim();
  const rest = addMovementForm.elements.rest.value.trim();
  if (!name || !sets || !rest) return;

  const nextCustomExercises = {
    ...customExercises,
    [currentDay]: [...(customExercises[currentDay] || []), [name, sets, rest, "＋"]]
  };
  try {
    localStorage.setItem(customExercisesKey, JSON.stringify(nextCustomExercises));
  } catch {
    addMovementStatus.textContent = "Could not save in this browser. Check its storage settings.";
    return;
  }

  customExercises = nextCustomExercises;
  addMovementForm.reset();
  renderWorkout(currentDay);
  addMovementForm.hidden = false;
  addMovementToggle.setAttribute("aria-expanded", "true");
  addMovementStatus.textContent = `${name} added to this day.`;
  addMovementForm.elements.name.focus();
});

addMovementForm.querySelector(".add-cancel-button").addEventListener("click", () => {
  addMovementForm.reset();
  addMovementForm.hidden = true;
  addMovementToggle.setAttribute("aria-expanded", "false");
  addMovementStatus.textContent = "";
  addMovementToggle.focus();
});

exerciseList.addEventListener("click", (event) => {
  const button = event.target.closest(".set-check");
  if (!button) return;
  const row = button.closest(".exercise-row");
  const checked = button.getAttribute("aria-pressed") !== "true";
  button.setAttribute("aria-pressed", String(checked));
  button.classList.toggle("is-checked", checked);
  row.classList.toggle("is-complete", checked);
  updateCompletion();
});

completeButton.addEventListener("click", () => {
  const buttons = [...exerciseList.querySelectorAll(".set-check")];
  buttons.forEach((button) => {
    button.setAttribute("aria-pressed", "true");
    button.classList.add("is-checked");
    button.closest(".exercise-row").classList.add("is-complete");
  });
  updateCompletion();
  completeButton.hidden = true;
  completeBanner.hidden = false;
  completedDays.add(currentDay);
  if (currentDay !== "wed" && currentDay !== "sun") {
    weeklySessions = Math.min(5, weeklySessions + 1);
    document.querySelector("#session-count").textContent = weeklySessions;
    document.querySelector(".progress-fill").style.width = `${weeklySessions * 20}%`;
    document.querySelector(".progress-track").setAttribute("aria-label", `${weeklySessions} of 5 weekly sessions complete`);
  }
});

renderWorkout("mon");
