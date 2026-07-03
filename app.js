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
  if (!sessionId) return;

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
initCamera();
