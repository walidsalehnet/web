// تحميل Firebase بعد تحميل الصفحة بالكامل
document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ الصفحة جاهزة!");

    if (!firebase.apps.length) {
        console.log("🚀 جاري تهيئة Firebase...");
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
        console.log("✅ Firebase تم تهيئته بنجاح!");
    }

    const db = firebase.firestore();

    // مراقبة حالة تسجيل الدخول
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            console.log("🔹 المستخدم مسجل دخول:", user.email);

            // ✅ متابعة التحديثات الفورية للرصيد في Firestore
            db.collection("users").doc(user.uid).onSnapshot((doc) => {
                if (doc.exists) {
                    const userData = doc.data();
                    document.getElementById('user-username').textContent = userData.username;
                    document.getElementById('user-email').textContent = userData.email;
                    document.getElementById('user-wallet').textContent = userData.wallet + " جنيه";
                    console.log("✅ تم تحديث بيانات المستخدم:", userData);
                } else {
                    console.error("❌ لا يوجد بيانات للمستخدم في Firestore!");
                }
            });
        } else {
            console.warn("⚠️ لا يوجد مستخدم مسجل دخول!");
            window.location.href = 'login.html';
        }
    });

    // تسجيل الخروج
    function logout() {
        console.log("🚪 تسجيل الخروج...");
        firebase.auth().signOut().then(() => {
            window.location.href = 'login.html';
        });
    }

    window.logout = logout;
});
