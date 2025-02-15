// ✅ تكوين Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAdf5AKFgLXgK2PYERHw1hgF_HsMmuTfuo",
    authDomain: "noproblem-55b97.firebaseapp.com",
    projectId: "noproblem-55b97",
    storageBucket: "noproblem-55b97.firebasestorage.app",
    messagingSenderId: "316010224446",
    appId: "1:316010224446:web:5d7e7f792e53ee4b396a6f",
    measurementId: "G-VKSGWBRKVL"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ✅ إرسال إشعار إلى بوت تيليجرام
const TELEGRAM_CHAT_ID = "6798744902";  
const TELEGRAM_BOT_TOKEN = "7834569515:AAHGBtlyJ-clDjc_jv2j9TDudV0K0AlRjeo";

function sendTelegramNotification(message) {
    fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: message
        })
    }).then(response => console.log("✅ تم إرسال الإشعار إلى البوت"))
    .catch(error => console.error("❌ خطأ أثناء إرسال الإشعار إلى البوت:", error));
}

// ✅ إنشاء رسالة منبثقة
function showPopupMessage(message) {
    const popup = document.createElement("div");
    popup.className = "message-popup";
    popup.innerHTML = `<span class="close-btn" onclick="this.parentElement.style.display='none'">&times;</span> ${message}`;
    document.body.appendChild(popup);
    setTimeout(() => { popup.style.opacity = "1"; popup.style.visibility = "visible"; }, 100);
    setTimeout(() => { popup.style.opacity = "0"; popup.style.visibility = "hidden"; popup.remove(); }, 4000);
}

// ✅ إنشاء حساب جديد مع التحقق من البريد
function signUp() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const username = document.getElementById('username').value;

    if (!email || !password || !username) {
        showPopupMessage("❌ الرجاء إدخال جميع البيانات!");
        return;
    }

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            return user.updateProfile({ displayName: username }).then(() => {
                return user.sendEmailVerification().then(() => {
                    return db.collection("users").doc(user.uid).set({
                        email: email,
                        username: username,
                        wallet: 0  
                    });
                });
            }).then(() => {
                sendTelegramNotification(`🆕 مستخدم جديد سجل في الموقع!\n👤 الاسم: ${username}\n📧 البريد: ${email}`);
                showPopupMessage('✅ تم إنشاء الحساب بنجاح! الرجاء التحقق من بريدك الإلكتروني.');
                setTimeout(() => { window.location.href = 'login.html'; }, 2000);
            });
        })
        .catch((error) => {
            console.error("❌ خطأ أثناء تسجيل الحساب:", error);
            showPopupMessage(error.message);
        });
}

// ✅ تسجيل الدخول
function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
        showPopupMessage("❌ الرجاء إدخال البريد وكلمة المرور!");
        return;
    }

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;

            if (!user.emailVerified) {
                showPopupMessage("⚠️ الرجاء التحقق من بريدك الإلكتروني قبل تسجيل الدخول.");
                firebase.auth().signOut();
                return;
            }

            sendTelegramNotification(`🔓 تسجيل دخول جديد!\n📧 البريد: ${user.email}`);
            showPopupMessage("✅ تم تسجيل الدخول بنجاح!");
            setTimeout(() => { window.location.href = 'profile2.html'; }, 1500);
        })
        .catch((error) => {
            console.error("❌ خطأ أثناء تسجيل الدخول:", error.message);
            showPopupMessage(error.message);
        });
}

// ✅ تسجيل الخروج
function logout() {
    firebase.auth().signOut().then(() => {
        sendTelegramNotification("🚪 تم تسجيل خروج أحد المستخدمين.");
        showPopupMessage("✅ تم تسجيل الخروج بنجاح!");
        setTimeout(() => { window.location.href = "login.html"; }, 1000);
    });
}

// ✅ جلب بيانات المستخدم في `profile2.html`
firebase.auth().onAuthStateChanged((user) => {
    const currentPage = window.location.pathname;

    if (user) {
        if (currentPage === "/profile2.html") {
            db.collection("users").doc(user.uid).onSnapshot((doc) => {
                if (doc.exists) {
                    const userData = doc.data();
                    document.getElementById('user-username').textContent = userData.username;
                    document.getElementById('user-email').textContent = userData.email;
                    document.getElementById('user-wallet').textContent = userData.wallet + " جنيه";
                } else {
                    document.getElementById('user-wallet').textContent = "غير متاح";
                }
            });
        }
    } else {
        if (currentPage === "/profile2.html") {
            setTimeout(() => { window.location.href = "login.html"; }, 1000);
        }
    }
});

// ✅ ربط الدوال بنافذة المتصفح لتكون متاحة في HTML
window.signUp = signUp;
window.login = login;
window.logout = logout;
