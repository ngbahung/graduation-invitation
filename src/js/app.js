// ── State ──────────────────────────────────────────────────────
let latestImageData = null;
let videoStream     = null;

// ── Guest Name ─────────────────────────────────────────────────
function getGuestName() {
    const p = new URLSearchParams(window.location.search);
    const to = p.get('to');
    return to ? to.replace(/_/g, ' ') : 'Dear Guest';
}
const guestName = getGuestName();

// ── Clock ──────────────────────────────────────────────────────
function updateClock() {
    const now = new Date();
    const h = now.getHours().toString().padStart(2,'0');
    const m = now.getMinutes().toString().padStart(2,'0');
    const el = document.getElementById('clock');
    if (el) el.textContent = `${h}:${m}`;
}

// ── Countdown ─────────────────────────────────────────────────
const SAVE_THE_DATE = new Date('2026-06-09T00:00:00');

function pad2(n) { return String(Math.max(0, n)).padStart(2, '0'); }

function flashTick(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.add('tick');
    setTimeout(() => el.classList.remove('tick'), 150);
}

function updateCountdown() {
    const now  = new Date();
    const diff = SAVE_THE_DATE - now;

    if (diff <= 0) {
        // Event has passed / is now
        ['cdDays','cdHours','cdMins','cdSecs'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = '🎓';
        });
        return;
    }

    const totalSecs = Math.floor(diff / 1000);
    const days  = Math.floor(totalSecs / 86400);
    const hours = Math.floor((totalSecs % 86400) / 3600);
    const mins  = Math.floor((totalSecs % 3600) / 60);
    const secs  = totalSecs % 60;

    const dEl = document.getElementById('cdDays');
    const hEl = document.getElementById('cdHours');
    const mEl = document.getElementById('cdMins');
    const sEl = document.getElementById('cdSecs');

    if (sEl && sEl.textContent !== pad2(secs)) flashTick('cdSecs');
    if (mEl && mEl.textContent !== pad2(mins))  flashTick('cdMins');
    if (hEl && hEl.textContent !== pad2(hours)) flashTick('cdHours');
    if (dEl && dEl.textContent !== pad2(days))  flashTick('cdDays');

    if (dEl) dEl.textContent = pad2(days);
    if (hEl) hEl.textContent = pad2(hours);
    if (mEl) mEl.textContent = pad2(mins);
    if (sEl) sEl.textContent = pad2(secs);
}

// ── Spotify Carousel ──────────────────────────────────────────
function initSpotifyCarousel() {
    const carousel = document.getElementById('spotifyCarousel');
    const dotsEl   = document.getElementById('spotifyDots');
    if (!carousel || !dotsEl) return;

    const slides = carousel.querySelectorAll('.spotify-slide');
    const total  = slides.length;

    // Build dots
    dotsEl.innerHTML = '';
    slides.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = 'spotify-dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => goToSlide(i));
        dotsEl.appendChild(dot);
    });

    function goToSlide(idx) {
        carousel.scrollTo({ left: carousel.offsetWidth * idx, behavior: 'smooth' });
    }

    function syncDots() {
        const idx = Math.round(carousel.scrollLeft / carousel.offsetWidth);
        dotsEl.querySelectorAll('.spotify-dot').forEach((d, i) => {
            d.classList.toggle('active', i === idx);
        });
    }

    carousel.addEventListener('scroll', syncDots, { passive: true });
}


// ── Init ───────────────────────────────────────────────────────
window.addEventListener('load', () => {
    // Clock
    updateClock();
    setInterval(updateClock, 10000);

    // Date header + calendar icons
    const now = new Date();
    const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const dayNameEl = document.getElementById('dayName');
    if (dayNameEl) dayNameEl.textContent = days[now.getDay()];
    document.querySelectorAll('.cal-pixel-num').forEach(el => el.textContent = now.getDate());
    document.querySelectorAll('.cal-month').forEach(el => el.textContent = months[now.getMonth()]);

    // Guest name
    const greetEl = document.getElementById('letterGreeting');
    if (greetEl) greetEl.textContent =
        `Hey ${guestName}! 🎉 You're personally invited to join Hung's graduation celebration.`;

    // Push notification: Mail after 1.5s, auto-dismiss at 7.5s
    setTimeout(() => {
        const notif = document.getElementById('notifBanner');
        if (notif) notif.classList.add('show');
    }, 1500);
    setTimeout(() => {
        const notif = document.getElementById('notifBanner');
        if (notif) notif.classList.remove('show');
    }, 7500);

    // Push notification: Music appears at 3s, stacked below Mail notif, auto-dismiss at 9s
    setTimeout(() => {
        const music = document.getElementById('notifMusic');
        if (music) music.classList.add('show');
    }, 3000);
    setTimeout(() => {
        const music = document.getElementById('notifMusic');
        if (music) music.classList.remove('show');
    }, 9000);

    // Push notification: Game appears at 5s (3rd notif), auto-dismiss at 11s
    setTimeout(() => {
        const game = document.getElementById('notifGame');
        if (game) game.classList.add('show');
    }, 5000);
    setTimeout(() => {
        const game = document.getElementById('notifGame');
        if (game) game.classList.remove('show');
    }, 11000);

    // Countdown to June 9 2026
    updateCountdown();
    setInterval(updateCountdown, 1000);

    // Spotify carousel dots (call after music modal is in DOM)
    initSpotifyCarousel();
});

// ── Envelope / Letter ──────────────────────────────────────────
function openEnvelope() {
    const notif = document.getElementById('notifBanner');
    if (notif) notif.classList.remove('show');
    document.getElementById('letterContent').classList.add('show');
}

function closeLetterContent() {
    document.getElementById('letterContent').classList.remove('show');
}

function closeLetterIfClickedOutside(event) {
    if (event.target.id === 'letterContent') closeLetterContent();
}

// ── Calendar Event ─────────────────────────────────────────────
function openCalendarEvent() {
    document.getElementById('calModal').classList.add('show');
}

function closeCalendarEvent() {
    document.getElementById('calModal').classList.remove('show');
}

function closeCalendarIfOutside(event) {
    if (event.target.id === 'calModal') closeCalendarEvent();
}

// ── Map ────────────────────────────────────────────────────────
function openMap() {
    document.getElementById('mapModal').classList.add('show');
}

function closeMap() {
    document.getElementById('mapModal').classList.remove('show');
}

function closeMapIfOutside(event) {
    if (event.target.id === 'mapModal') closeMap();
}

// ── Music Player ───────────────────────────────────────────────
function openMusic() {
    const musicNotif = document.getElementById('notifMusic');
    if (musicNotif) musicNotif.classList.remove('show');
    document.getElementById('musicModal').classList.add('show');
}

function closeMusic() {
    document.getElementById('musicModal').classList.remove('show');
}

function closeMusicIfOutside(event) {
    if (event.target.id === 'musicModal') closeMusic();
}

// ── Camera ────────────────────────────────────────────────────
async function openCamera() {
    closeLetterContent();
    const modal = document.getElementById('cameraModal');
    modal.classList.add('show');

    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user', width: { ideal: 1080 }, height: { ideal: 1920 } },
            audio: false
        });
        const video = document.getElementById('videoStream');
        video.srcObject = stream;
        video.play();
        videoStream = stream;
        resetCameraUI();
    } catch (err) {
        showToast('📵', 'Camera unavailable');
        closeCamera();
    }
}

function capturePhoto() {
    const video  = document.getElementById('videoStream');
    const canvas = document.getElementById('captureCanvas');
    const img    = document.getElementById('resultImage');
    const ctx    = canvas.getContext('2d');

    canvas.width  = video.videoWidth  || 1080;
    canvas.height = video.videoHeight || 1920;

    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
    ctx.restore();

    latestImageData = canvas.toDataURL('image/jpeg', 0.92);
    img.src = latestImageData;

    // Update thumbnail
    const thumb = document.getElementById('cameraThumbnail');
    if (thumb) { thumb.src = latestImageData; thumb.style.display = 'block'; }

    video.style.display = 'none';
    img.style.display   = 'block';

    document.getElementById('cameraBottomBar').style.display = 'none';
    document.getElementById('previewControls').classList.add('show');
}

function retakePhoto() {
    resetCameraUI();
}

function resetCameraUI() {
    const video = document.getElementById('videoStream');
    const img   = document.getElementById('resultImage');
    if (video) video.style.display = 'block';
    if (img)   img.style.display   = 'none';

    const bar   = document.getElementById('cameraBottomBar');
    const ctrl  = document.getElementById('previewControls');
    if (bar)  bar.style.display = 'flex';
    if (ctrl) ctrl.classList.remove('show');
}

function closeCamera() {
    const modal = document.getElementById('cameraModal');
    if (modal) modal.classList.remove('show');
    if (videoStream) {
        videoStream.getTracks().forEach(t => t.stop());
        videoStream = null;
    }
    setTimeout(resetCameraUI, 400);
}

// "Use Photo" — confirm check-in and offer Instagram share
function submitAttendance() {
    if (!latestImageData) return;
    closeCamera();
    showToast('✅', 'Check-in confirmed!');

    // Show share prompt in invitation card
    openEnvelope();
    const shareRow = document.getElementById('shareCheckinRow');
    if (shareRow) shareRow.style.display = 'flex';
}

// ── Instagram Story Share ─────────────────────────────────────
/**
 * Main entry point called by "Share Story" button.
 * If the user has already taken a check-in photo, we compose a story
 * canvas using THAT photo as the centerpiece. Otherwise we build a
 * beautiful branded card without a photo.
 */
async function shareToInstagram() {
    const canvas = document.getElementById('storyCanvas');
    const ctx    = canvas.getContext('2d');
    canvas.width  = 1080;
    canvas.height = 1920;

    // Gradient bg
    const grad = ctx.createLinearGradient(0, 0, 1080, 1920);
    grad.addColorStop(0,   '#C9D6FF');
    grad.addColorStop(0.5, '#E2C4FF');
    grad.addColorStop(1,   '#FFACCC');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1080, 1920);

    // Decorative blobs
    _drawBlob(ctx, 150, 250, 200, 'rgba(255,158,188,0.3)');
    _drawBlob(ctx, 950, 1700, 250, 'rgba(178,141,255,0.3)');
    _drawBlob(ctx, 900, 400,  120, 'rgba(130,202,255,0.25)');

    // Title text
    ctx.fillStyle   = '#FFFFFF';
    ctx.textAlign   = 'center';
    ctx.shadowColor = 'rgba(0,0,0,0.15)';
    ctx.shadowBlur  = 20;
    ctx.font        = 'bold 80px -apple-system, sans-serif';
    ctx.fillText("🎓 HUNG'S GRADUATION", 540, 220);
    ctx.font = '50px -apple-system, sans-serif';
    ctx.fillText('Class of 2026', 540, 310);
    ctx.shadowBlur = 0;

    if (latestImageData) {
        // Compose with check-in photo — user's ACTUAL selfie
        const photo = new Image();
        photo.onload = () => {
            _drawCheckinPhoto(ctx, photo, canvas);
            _addEventInfo(ctx);
            _finalizeShare(canvas);
        };
        photo.src = latestImageData;
    } else {
        // No photo — branded card
        _addEventInfo(ctx);
        _drawNoBranding(ctx);
        _finalizeShare(canvas);
    }
}

// Called from camera preview — share the just-taken selfie immediately
async function shareCheckinPhotoToInstagram() {
    if (!latestImageData) {
        showToast('📸', 'Take a photo first!');
        return;
    }
    await shareToInstagram();
}

function _drawBlob(ctx, x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
}

function _drawCheckinPhoto(ctx, photo, canvas) {
    // Polaroid frame
    const px = 90, py = 420, pw = 900, ph = 1000;
    ctx.fillStyle    = 'white';
    ctx.shadowColor  = 'rgba(0,0,0,0.25)';
    ctx.shadowBlur   = 50;
    ctx.shadowOffsetY= 10;
    // Slightly rotated polaroid
    ctx.save();
    ctx.translate(540, 420 + ph/2);
    ctx.rotate(-0.03);
    ctx.fillRect(-pw/2, -ph/2, pw, ph);
    ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
    // Draw photo inside polaroid (with slight padding at bottom for caption)
    const photoH = ph - 120;
    ctx.drawImage(photo, -pw/2 + 20, -ph/2 + 20, pw - 40, photoH - 20);
    // Caption inside polaroid
    ctx.fillStyle = '#1c1c1e';
    ctx.font = 'bold 38px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText("I'm going! 🎉", 0, ph/2 - 35);
    ctx.restore();
}

function _addEventInfo(ctx) {
    const y0 = 1490;
    // Info pill
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.beginPath();
    ctx.roundRect(140, y0, 800, 200, 24);
    ctx.fill();

    ctx.fillStyle = '#1c1c1e';
    ctx.textAlign = 'center';
    ctx.font = 'bold 42px -apple-system, sans-serif';
    ctx.fillText('📅 Oct 15, 2026', 540, y0 + 70);
    ctx.font = '36px -apple-system, sans-serif';
    ctx.fillText('⏰ 08:30 AM  •  🏛️ UIT Auditorium', 540, y0 + 130);

    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = 'italic 34px -apple-system, sans-serif';
    ctx.fillText('Your presence means the world 💜', 540, y0 + 240);
}

function _drawNoBranding(ctx) {
    // Envelope icon placeholder
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.beginPath();
    ctx.roundRect(190, 480, 700, 900, 32);
    ctx.fill();

    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.font      = '200px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✉️', 540, 980);

    ctx.font = 'bold 52px -apple-system, sans-serif';
    ctx.fillText('Join the celebration!', 540, 1130);
}

async function _finalizeShare(canvas) {
    canvas.toBlob(async (blob) => {
        const file = new File([blob], 'graduation_story.jpg', { type: 'image/jpeg' });

        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
            try {
                await navigator.share({
                    files: [file],
                    title: "Hung's Graduation 🎓",
                    text:  "I'm attending Hung's Graduation! 🎓✨"
                });
                return;
            } catch (err) {
                if (err.name === 'AbortError') return; // user cancelled
            }
        }

        // Desktop / unsupported: download
        const url = URL.createObjectURL(blob);
        const a   = document.createElement('a');
        a.href     = url;
        a.download = latestImageData ? 'my_checkin_story.jpg' : 'graduation_story.jpg';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        showToast('📥', 'Story saved! Share on Instagram ✨');
    }, 'image/jpeg', 0.92);
}

// ── Toast ─────────────────────────────────────────────────────
function showToast(icon, msg) {
    const toast = document.getElementById('toastSuccess');
    if (!toast) return;
    const iconEl = toast.querySelector('.ios-toast-icon');
    const msgEl  = toast.querySelector('.ios-toast-msg');
    if (iconEl) iconEl.textContent = icon;
    if (msgEl)  msgEl.textContent  = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}
