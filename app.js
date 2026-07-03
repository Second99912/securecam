let stream = null;

let sessionId = null;
let photoCount = 0;

let gpsText = "не найден";
let cameraReady = false;

// элементы
const video = document.getElementById("video");

const gpsEl = document.getElementById("gps");
const cameraEl = document.getElementById("camera");
const sessionEl = document.getElementById("session");
const counterEl = document.getElementById("counter");

const startBtn = document.getElementById("startSessionBtn");
const photoBtn = document.getElementById("photoBtn");
const endBtn = document.getElementById("endSessionBtn");

const canvas = document.getElementById("canvas");

// ---------------- GPS ----------------
function initGPS() {
  if (!navigator.geolocation) {
    gpsEl.textContent = "GPS: ❌ нет поддержки";
    return;
  }

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
    cameraReady = true;

    cameraEl.textContent = "Камера: 🟢";
  } catch (e) {
    cameraEl.textContent = "Камера: ❌ ошибка";
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

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0);

  // штамп GPS
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.fillRect(0, canvas.height - 50, canvas.width, 50);

  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText(gpsText, 10, canvas.height - 20);

  // просто превью (пока без отправки)
  const img = canvas.toDataURL("image/jpeg", 0.8);

  console.log("PHOTO:", img);

  photoCount++;
  counterEl.textContent = "Фото: " + photoCount;

  // лёгкая вибрация
  if (navigator.vibrate) navigator.vibrate(100);
}

// ---------------- EVENTS ----------------
startBtn.onclick = startSession;
endBtn.onclick = endSession;
photoBtn.onclick = takePhoto;

// ---------------- INIT ----------------
initGPS();
initCamera();
