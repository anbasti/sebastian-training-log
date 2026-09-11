const plan = {
  monday: {
    label: "Monday",
    focus: "Chest · Shoulders · Arms · Abs",
    exercises: [
      ["Banded external rotation", "2 × 12–15", "45 sec", "Elbow pinned to your side; move slowly."],
      ["Incline dumbbell bench press", "3 × 6–8", "2 min", "Set shoulder blades; controlled lower."],
      ["Cable crossover", "3 × 10–12", "75 sec", "Bring hands slightly past midline."],
      ["Dumbbell overhead press", "2 × 6–8", "2 min", "Brace abs and glutes; no leg drive."],
      ["Dumbbell lateral raise", "2 × 12–15", "60 sec", "Lead with elbows; do not shrug."],
      ["Barbell strict curl", "2 × 6–8", "90 sec", "Keep elbows near ribs; no swing."],
      ["Dumbbell JM press", "2 × 8–10", "90 sec", "Controlled elbow bend; stop for elbow pain."],
      ["Hanging leg raise", "2 × 8–12", "60 sec", "Curl pelvis upward; do not swing."],
      ["Dumbbell drag plank", "2 × 8 / side", "60 sec", "Keep hips level through each drag."]
    ]
  },

  tuesday: {
    label: "Tuesday",
    focus: "Legs A · Calves",
    exercises: [
      ["Front squat", "3 × 6–8", "2–3 min", "Brace first; use a pain-free depth."],
      ["Barbell Romanian deadlift", "3 × 8–10", "2 min", "Hips back, soft knees, bar close."],
      ["Dumbbell reverse lunge", "2 × 10 / leg", "90 sec", "Step back; drive through the front foot."],
      ["Seated calf raise", "3 × 10–15", "60 sec", "Pause at the bottom stretch and top squeeze."]
    ]
  },

  wednesday: {
    label: "Wednesday",
    focus: "Back A · Calves",
    exercises: [
      ["Scapular pulldown", "2 × 12–15", "45 sec", "Mostly straight arms; move your shoulder blades."],
      ["Wide-grip seated cable row", "3 × 6–8", "2 min", "Elbows wide; avoid rocking."],
      ["Narrow-grip lat pulldown", "3 × 10–12", "90 sec", "Let the lats stretch; drive elbows down."],
      ["Straight-arm cable pushdown", "2 × 10–12", "75 sec", "Keep elbows nearly straight."],
      ["Standing calf raise", "3 × 10–15", "60 sec", "No bouncing; use full range."]
    ]
  },

  thursday: {
    label: "Thursday",
    focus: "Chest · Shoulders · Arms · Abs",
    exercises: [
      ["Dumbbell flat bench press", "3 × 6–8", "2 min", "Keep shoulder blades set throughout."],
      ["Thumbs-up incline dumbbell press", "2 × 8–10", "90 sec", "Neutral grip; wrists stacked over elbows."],
      ["High-to-low cable crossover", "2 × 12–15", "60–75 sec", "Squeeze chest without swinging the torso."],
      ["Dumbbell hip hugger", "2 × 12–15", "60 sec", "Elbows travel out and slightly back."],
      ["Overhead raise face pull", "2 × 12–15", "60 sec", "Externally rotate at the face; relax the neck."],
      ["Cross-body hammer curl", "2 × 10–12 / arm", "75 sec", "Curl toward the opposite shoulder; lower slowly."],
      ["Cable triceps pushdown", "2 × 10–12", "75 sec", "Upper arms stay still; fully extend."],
      ["Eccentric power-up", "2 × 8–10", "60 sec", "Slow lowering; keep the low back comfortable."],
      ["Hanging knee twist", "2 × 8–10", "60 sec", "One left-right cycle equals one rep."]
    ]
  },

  friday: {
    label: "Friday",
    focus: "Legs B · Back B · Calves · Abs",
    exercises: [
      ["Barbell squat", "3 × 6–8", "2–3 min", "Control descent; keep the whole foot planted."],
      ["Barbell hip thrust", "3 × 8–10", "2 min", "Brief squeeze at top; avoid overextension."],
      ["Dumbbell Spanish squat", "2 × 10–12", "90 sec", "Stay upright; control knee path."],
      ["Single-arm high cable row", "3 × 8–10 / side", "90 sec", "Pull elbow to hip without twisting."],
      ["Wide-grip lat pulldown", "2 × 10–12", "90 sec", "Chest tall; never pull behind the neck."],
      ["Standing calf raise", "3 × 12–15", "60 sec", "Hold stretched and top positions."],
      ["Russian twist-and-press", "2 × 8–10 / side", "60 sec", "Rotate under control."]
    ]
  }
};

const shortName = {
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri"
};

const $ = (id) => document.getElementById(id);

const today = new Date().toISOString().slice(0, 10);
const weekday = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"][new Date().getDay()];

let selectedDate = today;
let selectedDay = plan[weekday] ? weekday : "monday";
let db;

function escapeHTML(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<​", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function showToast(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.style.display = "block";
  setTimeout(() => { toast.style.display = "none"; }, 2500);
}

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("sebastian-training-log", 1);

    request.onupgradeneeded = () => {
      request.result.createObjectStore("sessions", { keyPath: "date" });
    };

    request.onsuccess = () => {
      db = request.result;
      resolve();
    };

    request.onerror = () => reject(request.error);
  });
}

function getSession(date) {
  return new Promise((resolve) => {
    const request = db.transaction("sessions").objectStore("sessions").get(date);
    request.onsuccess = () => {
      resolve(request.result || { date, day: selectedDay, items: {} });
    };
  });
}

function saveSession(session) {
  return new Promise((resolve) => {
    const request = db.transaction("sessions", "readwrite")
      .objectStore("sessions")
      .put(session);
    request.onsuccess = resolve;
  });
}

function getAllSessions() {
  return new Promise((resolve) => {
    const request = db.transaction("sessions").objectStore("sessions").getAll();
    request.onsuccess = () => {
      resolve(request.result.sort((a, b) => b.date.localeCompare(a.date)));
    };
  });
}

async function renderHistory() {
  const sessions = await getAllSessions();
  const history = $("history-list");

  if (!sessions.length) {
    history.innerHTML = `<p class="empty">No sessions saved yet. Your first completed exercise will appear here.</p>`;
    return;
  }

  history.innerHTML = sessions.map((session) => {
    const completed = Object.values(session.items || {}).filter((item) => item.done).length;
    const day = plan[session.day] ? session.day : "monday";

    return `
      <button class="history-row" type="button" data-date="${session.date}" data-day="${day}">
        <span>
          <strong>${session.date}</strong>
          <small>${plan[day].label} · ${plan[day].focus}</small>
        </span>
        <small>${completed} complete</small>
      </button>
    `;
  }).join("");

  document.querySelectorAll("[data-date]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedDate = button.dataset.date;
      selectedDay = button.dataset.day;
      $("training-date").value = selectedDate;
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
}

async function render() {
  const session = await getSession(selectedDate);
  const exercises = plan[selectedDay].exercises;

  $("day-label").textContent = plan[selectedDay].label.toUpperCase();
  $("workout-focus").textContent = plan[selectedDay].focus;

  const completed = exercises.filter((_, index) => {
    return session.items[`${selectedDay}-${index}`]?.done;
  }).length;

  $("session-count").textContent = `${completed} / ${exercises.length} completed`;
  $("progress").textContent = `${Math.round((completed / exercises.length) * 100)}%`;

  $("day-tabs").innerHTML = Object.keys(plan).map((day) => `
    <button type="button" class="day-tab ${day === selectedDay ? "active" : ""}" data-day="${day}">
      ${shortName[day]}
    </button>
  `).join("");

  $("exercise-list").innerHTML = exercises.map((exercise, index) => {
    const item = session.items[`${selectedDay}-${index}`] || {};
    const isDone = item.done ? "completed" : "";

    return `
      <div class="exercise-row ${isDone}">
        <input
          type="checkbox"
          data-check="${index}"
          ${item.done ? "checked" : ""}
          aria-label="Mark ${escapeHTML(exercise[0])} complete"
        >
        <div>
          <div class="exercise-name">${exercise[0]}</div>
          <div class="exercise-target">${exercise[1]}</div>
          <p class="exercise-cue">${exercise[3]} Rest: ${exercise[2]}.</p>
        </div>
        <div class="weight-wrap">
          <input
            class="weight"
            inputmode="decimal"
            placeholder="0"
            value="${escapeHTML(item.weight)}"
            data-weight="${index}"
            aria-label="Weight in kg for ${escapeHTML(exercise[0])}"
          >
          <span class="kg">kg</span>
        </div>
      </div>
    `;
  }).join("");

  document.querySelectorAll("[data-day]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedDay = button.dataset.day;
      render();
    });
  });

  document.querySelectorAll("[data-check]").forEach((checkbox) => {
    checkbox.addEventListener("change", async () => {
      const index = checkbox.dataset.check;
      const current = await getSession(selectedDate);

      current.day = selectedDay;
      current.items[`${selectedDay}-${index}`] = {
        ...(current.items[`${selectedDay}-${index}`] || {}),
        done: checkbox.checked
      };

      await saveSession(current);
      render();
    });
  });

  document.querySelectorAll("[data-weight]").forEach((input) => {
    input.addEventListener("change", async () => {
      const index = input.dataset.weight;
      const current = await getSession(selectedDate);

      current.day = selectedDay;
      current.items[`${selectedDay}-${index}`] = {
        ...(current.items[`${selectedDay}-${index}`] || {}),
        weight: input.value
      };

      await saveSession(current);
      showToast("Weight saved");
      renderHistory();
    });
  });

  renderHistory();
}

$("training-date").value = selectedDate;

$("training-date").addEventListener("change", (event) => {
  selectedDate = event.target.value;
  render();
});

$("clear-day").addEventListener("click", async () => {
  if (!confirm("Clear all entries for this date?")) return;

  const session = await getSession(selectedDate);
  session.day = selectedDay;
  session.items = {};

  await saveSession(session);
  render();
  showToast("Day cleared");
});

$("history-jump").addEventListener("click", () => {
  $("history").scrollIntoView({ behavior: "smooth" });
});

$("export-backup").addEventListener("click", async () => {
  const sessions = await getAllSessions();

  const backup = {
    version: 1,
    exportedAt: new Date().toISOString(),
    sessions
  };

  const blob = new Blob([JSON.stringify(backup, null, 2)], {
    type: "application/json"
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "sebastian-training-log-backup.json";
  link.click();

  URL.revokeObjectURL(url);
  showToast("Backup downloaded");
});

$("import-backup").addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = async () => {
    try {
      const parsed = JSON.parse(reader.result);
      const sessions = parsed.sessions || parsed;

      for (const session of sessions) {
        await saveSession(session);
      }

      render();
      showToast("Backup restored");
    } catch {
      showToast("Could not restore that file");
    }
  };

  reader.readAsText(file);
  event.target.value = "";
});

openDatabase()
  .then(render)
  .catch(() => showToast("Could not open local storage."));

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js");
}