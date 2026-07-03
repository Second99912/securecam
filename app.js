let stream = null;

let sessionId = null;
let photoCount = 0;

let gpsText = "не найден";

// элементы
const video = document.getElementById("video");

const gpsEl = document.getElementById("gps");
const sessionEl = document.getElementById("session");
const counterEl = document.getElementById("counter");

const startBtn = document.getElementById("startSessionBtn");
const photoBtn = document.getElementById("photoBtn");
const endBtn = document.getElementById("endSessionBtn");

const canvas = document.getElementById("canvas");

// ---------------- GPS ----------------
function initGPS() {
  navigator.geolocation.watchPosition(
    (pos) => {
      gpsText =
        pos.coords.latitude.toFixed(6) +
        ", " +
        pos.coords.longitude.toFixed(6);

      gpsEl.textContent = "GPS: 🟢 " + gpsText;
    },
    () => {
      gpsEl.textContent = "GPS: ❌ нет доступа";
    },
    { enableHighAccuracy: true }
  );
}

// ---------------- CAMERA ----------------
async function initCamera() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
      audio: false
    });

    video.srcObject = stream;
  } catch (e) {
    alert("Ошибка камеры");
  }
}

// ---------------- SESSION ----------------
function startSession() {
  sessionId = "S" + Date.now().toString().slice(-6);
  photoCount = 0;

  sessionEl.textContent = "Сессия: " + sessionId;
  counterEl.textContent = "Фото: 0";

  photoBtn.disabled = false;
  endBtn.disabled = false;
}

function endSession() {
  sessionId = null;

  sessionEl.textContent = "Сессия: -";
  photoBtn.disabled = true;
  endBtn.disabled = true;
}

// ---------------- PHOTO ----------------
function takePhoto() {
  if (!sessionId || !cameraReady) return;

  const w = video.videoWidth;
  const h = video.videoHeight;

  if (!w || !h) {
    console.log("Камера ещё не готова (нет размеров)");
    return;
  }

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = w;
  canvas.height = h;

  // рисуем кадр
  ctx.drawImage(video, 0, 0, w, h);

  // затемнение под текст
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.fillRect(0, h - 60, w, 60);

  // координаты
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";

  const text = gpsText || "GPS: нет данных";
  ctx.fillText(text, 10, h - 20);

  // создаём изображение
  const imgUrl = canvas.toDataURL("image/jpeg", 0.9);

  // показываем preview
  let preview = document.getElementById("preview");

  if (!preview) {
    preview = document.createElement("img");
    preview.id = "preview";
    preview.style.width = "100%";
    preview.style.marginTop = "10px";
    preview.style.borderRadius = "10px";
    document.body.appendChild(preview);
  }

  preview.src = imgUrl;

  // счётчик
  photoCount++;
  counterEl.textContent = "Фото: " + photoCount;

  // вибрация ТОЛЬКО тут
  if (navigator.vibrate) navigator.vibrate(80);
}

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // затемнение снизу под текст
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.fillRect(0, canvas.height - 60, canvas.width, 60);

  // координаты
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText(gpsText, 10, canvas.height - 20);

  // создаём картинку
  const imgUrl = canvas.toDataURL("image/jpeg", 0.85);

  // показываем на экране
  showPreview(imgUrl);

  photoCount++;
  counterEl.textContent = "Фото: " + photoCount;

  if (navigator.vibrate) navigator.vibrate(100);
}

// ---------------- PREVIEW ----------------
function showPreview(imgUrl) {
  let preview = document.getElementById("preview");

  if (!preview) {
    preview = document.createElement("img");
    preview.id = "preview";
    preview.style.width = "100%";
    preview.style.marginTop = "10px";
    preview.style.borderRadius = "10px";

    document.body.appendChild(preview);
  }

  preview.src = imgUrl;
}

// ---------------- EVENTS ----------------
startBtn.onclick = startSession;
endBtn.onclick = endSession;
photoBtn.onclick = takePhoto;

// ---------------- INIT ----------------
initGPS();
initCamera(async function initCamera() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
      audio: false
    });

    video.srcObject = stream;

    await new Promise((resolve) => {
      video.onloadedmetadata = () => {
        video.play();
        resolve();
      };
    });

    cameraReady = true;

  } catch (e) {
    alert("Ошибка камеры");
  }
});
