/**
 * Butterfly AR Explorer — Common Banded Peacock (Papilio crino)
 * Dedicated Single-Model AR Application with 2-Layer AR Engine
 */

const viewer = document.getElementById('butterfly-viewer');
const cameraArOverlay = document.getElementById('camera-ar-overlay');
const cameraArVideo = document.getElementById('camera-ar-video');
const cameraArViewer = document.getElementById('camera-ar-viewer');

// Primary AR Launchers
const btnLaunchAr = document.getElementById('btn-launch-ar');
const btnCameraAr = document.getElementById('btn-camera-ar');

// Quick Stage Controls
const btnToggleAnim = document.getElementById('btn-toggle-anim');
const animIcon = document.getElementById('anim-icon');
const animLabel = document.getElementById('anim-label');
const btnSwitchAction = document.getElementById('btn-switch-action');
const actionLabel = document.getElementById('action-label');
const btnToggleRotate = document.getElementById('btn-toggle-rotate');
const btnResetView = document.getElementById('btn-reset-view');

// Sidebar Action Switcher
const btnActionFlight = document.getElementById('btn-action-flight');
const btnActionPerch = document.getElementById('btn-action-perch');

// Camera AR Studio Controls
const btnExitCameraAr = document.getElementById('btn-exit-camera-ar');
const btnFlipCamera = document.getElementById('btn-flip-camera');
const btnCamAnim = document.getElementById('btn-cam-anim');
const btnSnapPhoto = document.getElementById('btn-snap-photo');
const btnCenterArModel = document.getElementById('btn-center-ar-model');

// Modals
const btnGuide = document.getElementById('btn-guide');
const btnDesktopQr = document.getElementById('btn-desktop-qr');
const modalQr = document.getElementById('modal-qr');
const btnCloseQr = document.getElementById('btn-close-qr');
const modalGuide = document.getElementById('modal-guide');
const btnCloseGuide = document.getElementById('btn-close-guide');
const qrDisplayUrl = document.getElementById('qr-display-url');

let isPlaying = true;
let currentAction = 'flight'; // 'flight' | 'perch'
let cameraStream = null;
let currentFacingMode = 'environment';

document.addEventListener('DOMContentLoaded', init);

function init() {
  setupControls();
  setupAr();
  setupModals();
  setupViewerEvents();
}

function setupControls() {
  // Play / Pause
  btnToggleAnim.addEventListener('click', () => {
    isPlaying = !isPlaying;
    if (isPlaying) {
      viewer.play();
      animIcon.textContent = '⏸️';
      animLabel.textContent = 'Pause';
    } else {
      viewer.pause();
      animIcon.textContent = '▶️';
      animLabel.textContent = 'Play';
    }
  });

  // Cycle Action Clip
  btnSwitchAction.addEventListener('click', toggleActionClip);
  btnActionFlight.addEventListener('click', () => setAction('flight'));
  btnActionPerch.addEventListener('click', () => setAction('perch'));

  // Auto rotate
  btnToggleRotate.addEventListener('click', () => {
    viewer.autoRotate = !viewer.autoRotate;
    btnToggleRotate.classList.toggle('active-action', viewer.autoRotate);
  });

  // Reset Center
  btnResetView.addEventListener('click', () => {
    viewer.cameraOrbit = '0deg 60deg 1.1m';
    viewer.cameraTarget = '0m 0.15m 0m';
    viewer.jumpCameraToGoal();
  });
}

function toggleActionClip() {
  setAction(currentAction === 'flight' ? 'perch' : 'flight');
}

function setAction(action) {
  currentAction = action;
  const isFlight = action === 'flight';
  const clipName = isFlight ? 'Garden Flight (A → B)' : 'Perched Close-Up';

  viewer.animationName = clipName;
  if (isPlaying) viewer.play();

  // Update UI Labels
  actionLabel.textContent = isFlight ? 'Flight (A → B)' : 'Perched';
  btnActionFlight.classList.toggle('active', isFlight);
  btnActionPerch.classList.toggle('active', !isFlight);

  // Sync to Camera AR viewer if open
  if (cameraArViewer && !cameraArOverlay.classList.contains('hidden')) {
    cameraArViewer.animationName = clipName;
    cameraArViewer.play();
    if (btnCamAnim) {
      btnCamAnim.textContent = isFlight ? '🎬 Flight (A → B)' : '🦋 Perched';
    }
  }
}

/**
 * 2-Layer AR Engine:
 * Layer 1: Native Floor Tracking (WebXR on Chrome Android, Scene Viewer, Quick Look on iOS)
 * Layer 2: Universal Live Camera Room AR (instant fallback on any phone without plane scanning)
 */
function setupAr() {
  // Direct Camera AR
  btnCameraAr.addEventListener('click', openCameraAR);

  // Primary Floor-Tracking AR
  btnLaunchAr.addEventListener('click', async () => {
    if (navigator.xr && navigator.xr.isSessionSupported) {
      try {
        const supported = await navigator.xr.isSessionSupported('immersive-ar');
        if (supported) {
          await viewer.activateAR();
          return;
        }
      } catch (e) {
        console.warn('WebXR failed:', e);
      }
    }

    if (viewer.canActivateAR) {
      try {
        await viewer.activateAR();
        return;
      } catch (e) {
        console.warn('Scene Viewer failed:', e);
      }
    }

    // Fallback: Open Live Camera AR
    openCameraAR();
  });

  // Camera AR Internal Controls
  btnExitCameraAr.addEventListener('click', closeCameraAR);

  btnFlipCamera.addEventListener('click', async () => {
    currentFacingMode = currentFacingMode === 'environment' ? 'user' : 'environment';
    await startVideoStream();
  });

  if (btnCamAnim) {
    btnCamAnim.addEventListener('click', toggleActionClip);
  }

  btnCenterArModel.addEventListener('click', () => {
    cameraArViewer.cameraOrbit = '0deg 60deg 1.1m';
    cameraArViewer.cameraTarget = '0m 0.15m 0m';
    cameraArViewer.jumpCameraToGoal();
  });

  btnSnapPhoto.addEventListener('click', snapArPhoto);
}

async function startVideoStream() {
  if (cameraStream) {
    cameraStream.getTracks().forEach(t => t.stop());
    cameraStream = null;
  }
  const constraints = {
    audio: false,
    video: {
      facingMode: { ideal: currentFacingMode },
      width: { ideal: 1920 },
      height: { ideal: 1080 }
    }
  };
  cameraStream = await navigator.mediaDevices.getUserMedia(constraints);
  cameraArVideo.srcObject = cameraStream;
  await cameraArVideo.play();
}

async function openCameraAR() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    showQrModal();
    return;
  }
  try {
    cameraArOverlay.classList.remove('hidden');
    cameraArViewer.cameraOrbit = '0deg 60deg 1.1m';
    cameraArViewer.cameraTarget = '0m 0.15m 0m';
    await startVideoStream();
    setAction(currentAction);
  } catch (err) {
    cameraArOverlay.classList.add('hidden');
    console.warn('Camera access denied:', err);
    showQrModal();
  }
}

function closeCameraAR() {
  if (cameraStream) {
    cameraStream.getTracks().forEach(t => t.stop());
    cameraStream = null;
  }
  cameraArOverlay.classList.add('hidden');
}

async function snapArPhoto() {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = cameraArVideo.videoWidth || window.innerWidth;
    canvas.height = cameraArVideo.videoHeight || window.innerHeight;

    // 1. Draw live camera frame
    ctx.drawImage(cameraArVideo, 0, 0, canvas.width, canvas.height);

    // 2. Draw 3D model canvas overlay
    const modelBlob = await cameraArViewer.toBlob({ idealAspect: true });
    const img = new Image();
    img.src = URL.createObjectURL(modelBlob);
    await new Promise(r => { img.onload = r; });
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // 3. Download snapshot
    const link = document.createElement('a');
    link.download = `butterfly-ar-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (err) {
    console.error('Photo snapshot failed:', err);
  }
}

function setupViewerEvents() {
  viewer.addEventListener('load', () => {
    setAction('flight');
  });

  viewer.addEventListener('ar-status', (event) => {
    if (event.detail.status === 'failed') {
      openCameraAR();
    }
  });
}

function setupModals() {
  btnDesktopQr.addEventListener('click', showQrModal);
  btnCloseQr.addEventListener('click', () => modalQr.classList.add('hidden'));
  btnGuide.addEventListener('click', () => modalGuide.classList.remove('hidden'));
  btnCloseGuide.addEventListener('click', () => modalGuide.classList.add('hidden'));

  [modalQr, modalGuide].forEach(m => {
    m.addEventListener('click', (e) => {
      if (e.target === m) m.classList.add('hidden');
    });
  });
}

function showQrModal() {
  const currentUrl = new URL(window.location.href);
  currentUrl.hash = '';
  const targetUrl = currentUrl.toString();

  qrDisplayUrl.textContent = targetUrl;
  const qrContainer = document.getElementById('qrcode');
  qrContainer.innerHTML = '';

  if (window.QRCode) {
    new QRCode(qrContainer, {
      text: targetUrl,
      width: 190,
      height: 190,
      colorDark: '#0a0f1d',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.M
    });
  }
  modalQr.classList.remove('hidden');
}
