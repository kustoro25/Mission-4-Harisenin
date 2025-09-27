document.addEventListener("DOMContentLoaded", function () {
  // Dapatkan elemen-elemen yang diperlukan
  const landingPage = document.getElementById("landing-page");

  // Elemen-elemen landing page
  const landingButtons = document.getElementById("landing-buttons");
  const loginBtn = document.getElementById("login-btn");
  const registerBtn = document.getElementById("register-btn");

  // Form register
  const registerForm = document.getElementById("register-form");
  const cancelRegisterBtn = document.getElementById("cancel-register-btn");
  const saveRegisterBtn = document.getElementById("save-register-btn");
  const registerError = document.getElementById("register-error");

  // Form login
  const loginForm = document.getElementById("login-form");
  const cancelLoginBtn = document.getElementById("cancel-login-btn");
  const loginSubmitBtn = document.getElementById("login-submit-btn");
  const loginError = document.getElementById("login-error");

  // Data pengguna
  let users = JSON.parse(localStorage.getItem("users")) || [];

  // Tampilkan form register
  registerBtn.addEventListener("click", function () {
    landingButtons.style.display = "none";
    loginForm.style.display = "none";
    registerForm.style.display = "block";
    registerError.textContent = "";
    registerError.classList.remove("visible");
  });

  // Tampilkan form login
  loginBtn.addEventListener("click", function () {
    landingButtons.style.display = "none";
    registerForm.style.display = "none";
    loginForm.style.display = "block";
    loginError.textContent = "";
    loginError.classList.remove("visible");
  });

  // Batalkan register dan kembali ke landing
  cancelRegisterBtn.addEventListener("click", function () {
    registerForm.style.display = "none";
    landingButtons.style.display = "flex";
  });

  // Batalkan login dan kembali ke landing
  cancelLoginBtn.addEventListener("click", function () {
    loginForm.style.display = "none";
    landingButtons.style.display = "flex";
  });

  // Proses register
  saveRegisterBtn.addEventListener("click", function () {
    const name = document.getElementById("register-name").value;
    const profesi = document.getElementById("register-profesi").value;
    const username = document.getElementById("register-username").value;
    const password = document.getElementById("register-password").value;
    const confirmPassword = document.getElementById(
      "register-confirm-password"
    ).value;

    // Validasi
    if (!name || !profesi || !username || !password || !confirmPassword) {
      registerError.textContent = "Semua field harus diisi!";
      registerError.classList.add("visible");
      return;
    }

    if (password !== confirmPassword) {
      registerError.textContent =
        "Password dan konfirmasi password tidak cocok!";
      registerError.classList.add("visible");
      return;
    }

    // Cek apakah username sudah ada
    if (users.find((user) => user.username === username)) {
      registerError.textContent = "Username sudah digunakan!";
      registerError.classList.add("visible");
      return;
    }

    // Simpan user baru
    const newUser = {
      name,
      profesi,
      username,
      password, // Dalam aplikasi nyata, password harus di-hash
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    // Inisialisasi tugas untuk user baru
    let tasks = JSON.parse(localStorage.getItem("tasks")) || {};
    tasks[username] = [];
    localStorage.setItem("tasks", JSON.stringify(tasks));

    // Login otomatis setelah register
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    window.location.href = "app.html";
  });

  // Proses login
  loginSubmitBtn.addEventListener("click", function () {
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    // Validasi
    if (!username || !password) {
      loginError.textContent = "Username dan password harus diisi!";
      loginError.classList.add("visible");
      return;
    }

    // Cek kredensial
    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) {
      loginError.textContent = "Username atau password salah!";
      loginError.classList.add("visible");
      return;
    }

    // Simpan user yang login
    localStorage.setItem("currentUser", JSON.stringify(user));
    window.location.href = "app.html";
  });

  // Cek apakah ada user yang sudah login
  const savedUser = localStorage.getItem("currentUser");
  if (savedUser) {
    window.location.href = "app.html";
  }
});
