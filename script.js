function closeDropdowns() {
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
        menu.classList.remove('active');
        const button = document.querySelector(`[aria-controls="${menu.id}"]`);
        if (button) {
            button.setAttribute('aria-expanded', 'false');
        }
    });
}

function toggleDropdown(id, event) {
    if (event) {
        event.stopPropagation();
    }

    const dropdown = document.getElementById(id);
    if (!dropdown) {
        return;
    }

    const willOpen = !dropdown.classList.contains('active');

    document.querySelectorAll('.dropdown-menu').forEach(menu => {
        if (menu.id !== id) {
            menu.classList.remove('active');
            const button = document.querySelector(`[aria-controls="${menu.id}"]`);
            if (button) {
                button.setAttribute('aria-expanded', 'false');
            }
        }
    });

    dropdown.classList.toggle('active', willOpen);

    const button = document.querySelector(`[aria-controls="${id}"]`);
    if (button) {
        button.setAttribute('aria-expanded', String(willOpen));
    }
}

function toggleMobileMenu() {
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const mobileMenu = document.getElementById('mobileMenu');
    if (!mobileMenu || !mobileMenuButton) {
        return;
    }

    const isOpening = !mobileMenu.classList.contains('visible');
    if (isOpening) {
        mobileMenu.classList.remove('hidden');
        requestAnimationFrame(() => {
            mobileMenu.classList.add('visible');
        });
    } else {
        mobileMenu.classList.remove('visible');
        window.setTimeout(() => {
            if (!mobileMenu.classList.contains('visible')) {
                mobileMenu.classList.add('hidden');
            }
        }, 350);
    }
    mobileMenuButton.classList.toggle('is-open', isOpening);
    mobileMenuButton.setAttribute('aria-expanded', String(isOpening));
}

const previewGalleryState = {
    items: [],
    index: 0,
    container: null
};

function resolvePreviewSrc(image) {
    const dataSrc = image?.dataset?.src?.trim();
    if (dataSrc && !dataSrc.includes('placehold.co')) {
        return dataSrc;
    }
    return image?.currentSrc || image?.src || dataSrc || '';
}

function showLargeImageView(src) {
    const largeImageView = document.createElement('div');
    largeImageView.classList.add('fixed', 'top-0', 'left-0', 'right-0', 'bottom-0', 'bg-[#1e1e1e]', 'z-50', 'flex', 'justify-center', 'items-center');

    const largeImage = document.createElement('img');
    largeImage.src = src;
    largeImage.classList.add('max-w-full', 'max-h-screen');

    largeImageView.appendChild(largeImage);
    document.body.appendChild(largeImageView);
    largeImageView.onclick = () => {
        document.body.removeChild(largeImageView);
    };
}

function clearPreviewThumbState() {
    document.querySelectorAll('[data-image-preview]').forEach(image => {
        image.classList.remove('preview-thumb-active');
    });
}

function closePreviewGallery() {
    if (previewGalleryState.container) {
        previewGalleryState.container.remove();
    }
    previewGalleryState.container = null;
    previewGalleryState.items = [];
    previewGalleryState.index = 0;
    clearPreviewThumbState();
}

function renderPreviewGallery() {
    if (!previewGalleryState.container || previewGalleryState.items.length === 0) {
        return;
    }
    const current = previewGalleryState.items[previewGalleryState.index];
    const image = previewGalleryState.container.querySelector('img');
    if (current && image) {
        image.src = resolvePreviewSrc(current);
        image.alt = current.alt || '預覽圖片';
    }
    clearPreviewThumbState();
    if (current) {
        current.classList.add('preview-thumb-active');
    }
}

function stepPreviewGallery(step) {
    if (previewGalleryState.items.length === 0) {
        return;
    }
    const length = previewGalleryState.items.length;
    previewGalleryState.index = (previewGalleryState.index + step + length) % length;
    renderPreviewGallery();
}

function openPreviewGallery(clickedImage) {
    const scope = clickedImage.closest('section') || document;
    const images = Array.from(scope.querySelectorAll('[data-image-preview]'));
    const index = images.indexOf(clickedImage);
    if (images.length === 0 || index < 0) {
        showLargeImageView(resolvePreviewSrc(clickedImage));
        return;
    }

    const overlay = document.createElement('div');
    overlay.classList.add('fixed', 'top-0', 'left-0', 'right-0', 'bottom-0', 'bg-black/90', 'z-50', 'flex', 'items-center', 'justify-center', 'p-4');
    overlay.innerHTML = `
        <button type="button" data-preview-close class="absolute top-4 right-4 text-white/80 hover:text-white text-3xl leading-none">&times;</button>
        <button type="button" data-preview-prev class="absolute left-4 md:left-8 text-white/70 hover:text-white text-4xl leading-none">&#10094;</button>
        <img src="" alt="" class="max-w-full max-h-[90vh] rounded-lg shadow-2xl">
        <button type="button" data-preview-next class="absolute right-4 md:right-8 text-white/70 hover:text-white text-4xl leading-none">&#10095;</button>
    `;

    overlay.addEventListener('click', event => {
        if (event.target === overlay || event.target.hasAttribute('data-preview-close')) {
            closePreviewGallery();
        }
    });
    overlay.querySelector('[data-preview-prev]')?.addEventListener('click', event => {
        event.stopPropagation();
        stepPreviewGallery(-1);
    });
    overlay.querySelector('[data-preview-next]')?.addEventListener('click', event => {
        event.stopPropagation();
        stepPreviewGallery(1);
    });

    document.body.appendChild(overlay);
    previewGalleryState.items = images;
    previewGalleryState.index = index;
    previewGalleryState.container = overlay;
    renderPreviewGallery();
}

function scrollFunction() {
    const backToTopButton = document.getElementById('backToTop');
    if (!backToTopButton) {
        return;
    }

    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        backToTopButton.style.display = 'block';
    } else {
        backToTopButton.style.display = 'none';
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function scrollToTarget(targetId) {
    const target = document.getElementById(targetId);
    if (target && !target.hidden) {
        target.scrollIntoView({ behavior: 'smooth' });
    }
}

let googleTranslateReady = false;
let googleTranslateTarget = 'en';

window.googleTranslateElementInit = function () {
    if (!window.google?.translate?.TranslateElement) {
        return;
    }

    new window.google.translate.TranslateElement({
        pageLanguage: 'zh-TW',
        includedLanguages: 'zh-TW,en,ja,ko,zh-CN',
        autoDisplay: false
    }, 'google_translate_element');
    googleTranslateReady = true;
};

function getGoogleTranslateCombo() {
    return document.querySelector('.goog-te-combo');
}

function setGoogleTranslateButtonState(isTranslated) {
    const button = document.getElementById('googleTranslateToggle');
    if (!button) {
        return;
    }

    button.setAttribute('aria-pressed', String(isTranslated));
    button.title = isTranslated ? '切回原始語言' : '使用 Google 翻譯';
}

function applyGoogleTranslate(language) {
    const combo = getGoogleTranslateCombo();
    if (!combo) {
        return false;
    }

    combo.value = language;
    combo.dispatchEvent(new Event('change'));
    setGoogleTranslateButtonState(Boolean(language));
    return true;
}

function toggleGoogleTranslate() {
    const button = document.getElementById('googleTranslateToggle');
    const isTranslated = button?.getAttribute('aria-pressed') === 'true';
    const nextLanguage = isTranslated ? '' : googleTranslateTarget;

    if (googleTranslateReady && applyGoogleTranslate(nextLanguage)) {
        return;
    }

    window.setTimeout(() => {
        applyGoogleTranslate(nextLanguage);
    }, 600);
}

const backgroundMusicState = {
    audioContext: null,
    gainNode: null,
    oscillators: [],
    usingGeneratedAudio: false
};

function updateMusicButton(isPlaying) {
    const button = document.getElementById('musicToggle');
    const icon = document.getElementById('musicToggleIcon');
    const text = document.getElementById('musicToggleText');
    if (!button || !icon || !text) {
        return;
    }

    button.setAttribute('aria-pressed', String(isPlaying));
    button.title = isPlaying ? '停止背景音樂' : '播放背景音樂';
    icon.className = isPlaying ? 'fas fa-volume-up' : 'fas fa-volume-mute';
    text.textContent = isPlaying ? '停止音樂' : '播放音樂';
}

function startGeneratedBackgroundMusic() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) {
        return false;
    }

    const audioContext = new AudioContext();
    const gainNode = audioContext.createGain();
    gainNode.gain.value = 0.035;
    gainNode.connect(audioContext.destination);

    [261.63, 329.63, 392.00, 523.25].forEach((frequency, index) => {
        const oscillator = audioContext.createOscillator();
        const oscillatorGain = audioContext.createGain();
        oscillator.type = index === 3 ? 'triangle' : 'sine';
        oscillator.frequency.value = frequency;
        oscillator.detune.value = index * 4;
        oscillatorGain.gain.value = index === 3 ? 0.18 : 0.28;
        oscillator.connect(oscillatorGain);
        oscillatorGain.connect(gainNode);
        oscillator.start();
        backgroundMusicState.oscillators.push(oscillator);
    });

    backgroundMusicState.audioContext = audioContext;
    backgroundMusicState.gainNode = gainNode;
    backgroundMusicState.usingGeneratedAudio = true;
    return true;
}

function stopGeneratedBackgroundMusic() {
    backgroundMusicState.oscillators.forEach(oscillator => {
        try {
            oscillator.stop();
        } catch (error) {
            // Oscillator may already be stopped.
        }
    });
    backgroundMusicState.oscillators = [];
    backgroundMusicState.gainNode?.disconnect();
    backgroundMusicState.audioContext?.close();
    backgroundMusicState.gainNode = null;
    backgroundMusicState.audioContext = null;
    backgroundMusicState.usingGeneratedAudio = false;
}

async function playBackgroundMusic() {
    const audio = document.getElementById('backgroundMusic');
    if (audio && !backgroundMusicState.usingGeneratedAudio) {
        audio.volume = 0.35;
        try {
            await audio.play();
            updateMusicButton(true);
            return;
        } catch (error) {
            audio.pause();
        }
    }

    if (startGeneratedBackgroundMusic()) {
        updateMusicButton(true);
    }
}

function stopBackgroundMusic() {
    const audio = document.getElementById('backgroundMusic');
    if (audio) {
        audio.pause();
    }
    stopGeneratedBackgroundMusic();
    updateMusicButton(false);
}

function toggleBackgroundMusic() {
    const button = document.getElementById('musicToggle');
    const isPlaying = button?.getAttribute('aria-pressed') === 'true';
    if (isPlaying) {
        stopBackgroundMusic();
        return;
    }
    playBackgroundMusic();
}

document.addEventListener('click', closeDropdowns);
document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
        closePreviewGallery();
        closeDropdowns();
        return;
    }
    if (previewGalleryState.container && event.key === 'ArrowLeft') {
        stepPreviewGallery(-1);
        return;
    }
    if (previewGalleryState.container && event.key === 'ArrowRight') {
        stepPreviewGallery(1);
    }
});
window.onscroll = scrollFunction;

document.getElementById('homeReload')?.addEventListener('click', () => {
    location.reload();
});

document.querySelectorAll('[data-dropdown-toggle]').forEach(button => {
    button.addEventListener('click', event => {
        toggleDropdown(button.dataset.dropdownToggle, event);
    });
});

document.getElementById('mobileMenuButton')?.addEventListener('click', toggleMobileMenu);
document.getElementById('mobileMenu')?.addEventListener('click', toggleMobileMenu);
document.querySelector('#mobileMenu > div')?.addEventListener('click', event => {
    event.stopPropagation();
});

document.querySelectorAll('[data-scroll-target]').forEach(link => {
    link.addEventListener('click', () => {
        scrollToTarget(link.dataset.scrollTarget);
        closeDropdowns();

        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            toggleMobileMenu();
        }
    });
});

document.querySelectorAll('[data-image-preview]').forEach(image => {
    image.addEventListener('click', () => {
        openPreviewGallery(image);
    });
});

document.getElementById('backToTop')?.addEventListener('click', scrollToTop);
document.getElementById('googleTranslateToggle')?.addEventListener('click', event => {
    event.stopPropagation();
    toggleGoogleTranslate();
});
document.getElementById('musicToggle')?.addEventListener('click', event => {
    event.stopPropagation();
    toggleBackgroundMusic();
});
document.getElementById('backgroundMusic')?.addEventListener('error', () => {
    const button = document.getElementById('musicToggle');
    const shouldKeepPlaying = button?.getAttribute('aria-pressed') === 'true';
    if (shouldKeepPlaying && !backgroundMusicState.usingGeneratedAudio && startGeneratedBackgroundMusic()) {
        updateMusicButton(true);
    }
});

const authFeature = document.getElementById('auth-section');
if (authFeature && !authFeature.hidden && window.firebase) {
    const firebaseConfig = {
        apiKey: 'AIzaSyC80UTugkddrFHoVjNpGmf69fxRol0WU-c',
        authDomain: 'lms-games-868db.firebaseapp.com',
        databaseURL: 'https://lms-games-868db-default-rtdb.firebaseio.com',
        projectId: 'lms-games-868db',
        storageBucket: 'lms-games-868db.firebasestorage.app',
        messagingSenderId: '891730384363',
        appId: '1:891730384363:web:c2e422a6684a59930135ae'
    };

    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const db = firebase.database();

    window.signUp = function () {
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;

        auth.createUserWithEmailAndPassword(email, password)
            .then(userCredential => {
                const user = userCredential.user;
                user.sendEmailVerification()
                    .then(() => {
                        alert('驗證郵件已寄出，請檢查你的收件匣。');
                    })
                    .catch(err => {
                        alert('寄送驗證郵件時發生錯誤：' + err.message);
                    });
            })
            .catch(err => alert(err.message));
    };

    window.logIn = function () {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        auth.signInWithEmailAndPassword(email, password).catch(err => alert(err.message));
    };

    window.logOut = function () {
        auth.signOut();
    };

    window.toggleAuth = function (view) {
        document.getElementById('signup').classList.toggle('hidden', view !== 'signup');
        document.getElementById('login').classList.toggle('hidden', view !== 'login');
    };

    window.saveTestData = function () {
        const data = document.getElementById('testData').value;
        const user = auth.currentUser;
        if (user && data) {
            db.ref('users/' + user.uid).push({
                text: data,
                timestamp: Date.now()
            });
            document.getElementById('testData').value = '';
        }
    };

    document.getElementById('signUpButton')?.addEventListener('click', window.signUp);
    document.getElementById('logInButton')?.addEventListener('click', window.logIn);
    document.getElementById('logOutButton')?.addEventListener('click', window.logOut);
    document.getElementById('saveTestDataButton')?.addEventListener('click', window.saveTestData);
    document.querySelectorAll('[data-auth-view]').forEach(button => {
        button.addEventListener('click', () => {
            window.toggleAuth(button.dataset.authView);
        });
    });

    auth.onAuthStateChanged(user => {
        if (user) {
            if (user.emailVerified) {
                document.getElementById('auth').classList.add('hidden');
                document.getElementById('userPage').classList.remove('hidden');

                db.ref('users/' + user.uid).on('value', snapshot => {
                    const output = document.getElementById('dataOutput');
                    output.innerHTML = '';
                    snapshot.forEach(child => {
                        const item = child.val();
                        output.innerHTML += `<p>${item.text} <span class="text-gray-400">(${new Date(item.timestamp).toLocaleString()})</span></p>`;
                    });
                });
            } else {
                alert('請先驗證電子郵件後再登入。');
                auth.signOut();
            }
        } else {
            document.getElementById('auth').classList.remove('hidden');
            document.getElementById('userPage').classList.add('hidden');
        }
    });
}
