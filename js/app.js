document.addEventListener("DOMContentLoaded", function () {
  // Dapatkan elemen-elemen yang diperlukan
  const appContainer = document.getElementById("app-container");

  // Elemen-elemen aplikasi utama
  const logoutBtn = document.getElementById("logout-btn");
  const userName = document.getElementById("user-name");
  const userProfession = document.getElementById("user-profession");
  const currentDay = document.getElementById("current-day");
  const currentDateFull = document.getElementById("current-date-full");
  const taskInput = document.getElementById("task-input");
  const taskDate = document.getElementById("task-date");
  const taskPriority = document.getElementById("task-priority");
  const addTaskBtn = document.getElementById("add-task-btn");
  const filterMenu = document.getElementById("filter-menu");
  const dateFilterContainer = document.getElementById("date-filter-container");
  const startDateInput = document.getElementById("start-date");
  const endDateInput = document.getElementById("end-date");
  const applyDateFilterBtn = document.getElementById("apply-date-filter");
  const resetDateFilterBtn = document.getElementById("reset-date-filter");
  const taskList = document.getElementById("task-list");
  const totalTasksEl = document.getElementById("total-tasks");
  const activeTasksEl = document.getElementById("active-tasks");
  const completedTasksEl = document.getElementById("completed-tasks");
  const deleteAllBtn = document.getElementById("delete-all-btn");

  // Data pengguna dan tugas
  let currentUser = JSON.parse(localStorage.getItem("currentUser"));
  let tasks = JSON.parse(localStorage.getItem("tasks")) || {};
  let currentFilter = "all";
  let dateFilter = { start: null, end: null };

  // Cek apakah user sudah login
  if (!currentUser) {
    window.location.href = "index.html";
    return;
  }

  // Set tanggal default ke hari ini
  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0];
  taskDate.value = formattedDate;

  // Tampilkan aplikasi
  appContainer.style.display = "block";
  userName.textContent = currentUser.name.split(" ")[0];
  userProfession.textContent = currentUser.profesi;
  updateCurrentDate();
  renderTasks();

  // Fungsi untuk memperbarui tanggal dan hari
  function updateCurrentDate() {
    const now = new Date();

    // Daftar nama hari
    const days = [
      "Minggu",
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jumat",
      "Sabtu",
    ];

    // Daftar nama bulan
    const months = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];

    const dayName = days[now.getDay()];
    const date = now.getDate();
    const monthName = months[now.getMonth()];
    const year = now.getFullYear();

    currentDay.textContent = dayName;
    currentDateFull.textContent = `${date} ${monthName} ${year}`;
  }

  function updateJam() {
    const sekarang = new Date();
    document.getElementById("jam").textContent =
      sekarang.toLocaleTimeString("id-ID");
  }

  // Update setiap detik (1000ms = 1 detik)
  setInterval(updateJam, 1000);
  updateJam(); // Panggil sekali di awal

  // Logout
  logoutBtn.addEventListener("click", function () {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
  });

  // Tambah tugas
  addTaskBtn.addEventListener("click", function () {
    const taskText = taskInput.value.trim();
    const taskDueDate = taskDate.value;
    const taskPriorityValue = taskPriority.value;

    if (taskText) {
      const newTask = {
        id: Date.now(),
        text: taskText,
        dueDate: taskDueDate,
        priority: taskPriorityValue,
        completed: false,
        createdAt: new Date().toISOString(),
      };

      // Inisialisasi array tugas jika belum ada
      if (!tasks[currentUser.username]) {
        tasks[currentUser.username] = [];
      }

      tasks[currentUser.username].push(newTask);
      localStorage.setItem("tasks", JSON.stringify(tasks));
      renderTasks();
      taskInput.value = "";
      // Reset tanggal ke hari ini
      taskDate.value = formattedDate;
      // Reset prioritas ke sedang
      taskPriority.value = "medium";
    }
  });

  // Tambah tugas dengan Enter
  taskInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      addTaskBtn.click();
    }
  });

  // Filter tugas
  filterMenu.addEventListener("click", function (e) {
    if (e.target.classList.contains("filter-btn")) {
      // Hapus kelas active dari semua tombol
      document.querySelectorAll(".filter-btn").forEach((btn) => {
        btn.classList.remove("active");
      });

      // Tambahkan kelas active ke tombol yang diklik
      e.target.classList.add("active");

      // Set filter yang aktif
      currentFilter = e.target.dataset.filter;

      // Tampilkan atau sembunyikan filter tanggal
      if (currentFilter === "date") {
        dateFilterContainer.classList.add("visible");
      } else {
        dateFilterContainer.classList.remove("visible");
        dateFilter = { start: null, end: null };
        startDateInput.value = "";
        endDateInput.value = "";
      }

      renderTasks();
    }
  });

  // Terapkan filter tanggal
  applyDateFilterBtn.addEventListener("click", function () {
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;

    if (startDate && endDate && startDate > endDate) {
      alert("Tanggal mulai tidak boleh lebih besar dari tanggal akhir");
      return;
    }

    dateFilter = {
      start: startDate || null,
      end: endDate || null,
    };

    renderTasks();
  });

  // Reset filter tanggal
  resetDateFilterBtn.addEventListener("click", function () {
    dateFilter = { start: null, end: null };
    startDateInput.value = "";
    endDateInput.value = "";
    renderTasks();
  });

  // Hapus semua tugas
  deleteAllBtn.addEventListener("click", function () {
    if (confirm("Apakah Anda yakin ingin menghapus semua tugas?")) {
      tasks[currentUser.username] = [];
      localStorage.setItem("tasks", JSON.stringify(tasks));
      renderTasks();
    }
  });

  // Fungsi untuk memfilter tugas berdasarkan filter yang aktif
  function filterTasks(tasks) {
    const today = new Date().toISOString().split("T")[0];

    // Filter berdasarkan status (selesai/aktif)
    let filteredTasks = tasks;
    switch (currentFilter) {
      case "active":
        filteredTasks = tasks.filter((task) => !task.completed);
        break;
      case "completed":
        filteredTasks = tasks.filter((task) => task.completed);
        break;
      case "today":
        filteredTasks = tasks.filter((task) => task.dueDate === today);
        break;
    }

    // Filter berdasarkan tanggal jika ada
    if (dateFilter.start || dateFilter.end) {
      filteredTasks = filteredTasks.filter((task) => {
        const taskDate = task.dueDate;

        if (dateFilter.start && taskDate < dateFilter.start) {
          return false;
        }

        if (dateFilter.end && taskDate > dateFilter.end) {
          return false;
        }

        return true;
      });
    }

    return filteredTasks;
  }

  // Fungsi untuk menghitung statistik tugas
  function updateTaskStats() {
    const userTasks = tasks[currentUser.username] || [];
    const totalTasks = userTasks.length;
    const activeTasks = userTasks.filter((task) => !task.completed).length;
    const completedTasks = userTasks.filter((task) => task.completed).length;

    totalTasksEl.textContent = totalTasks;
    activeTasksEl.textContent = activeTasks;
    completedTasksEl.textContent = completedTasks;
  }

  // Fungsi untuk merender daftar tugas
  function renderTasks() {
    taskList.innerHTML = "";

    if (
      !tasks[currentUser.username] ||
      tasks[currentUser.username].length === 0
    ) {
      taskList.innerHTML =
        '<div class="no-tasks">Tidak ada tugas. Tambahkan tugas baru!</div>';
      updateTaskStats();
      return;
    }

    // Filter tugas berdasarkan filter yang aktif
    const filteredTasks = filterTasks(tasks[currentUser.username]);

    if (filteredTasks.length === 0) {
      let message = "";
      switch (currentFilter) {
        case "active":
          message = "Tidak ada tugas aktif.";
          break;
        case "completed":
          message = "Tidak ada tugas yang selesai.";
          break;
        case "today":
          message = "Tidak ada tugas untuk hari ini.";
          break;
        case "date":
          message = "Tidak ada tugas dalam rentang tanggal yang dipilih.";
          break;
        default:
          message = "Tidak ada tugas.";
      }
      taskList.innerHTML = `<div class="no-tasks">${message}</div>`;
      updateTaskStats();
      return;
    }

    // Urutkan tugas: yang belum selesai dulu, kemudian berdasarkan prioritas
    filteredTasks.sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }

      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

    filteredTasks.forEach((task) => {
      const taskItem = document.createElement("li");
      taskItem.className = "task-item";

      // Format tanggal
      const dueDate = new Date(task.dueDate);
      const formattedDueDate = dueDate.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

      // Teks prioritas
      const priorityText = {
        low: "Rendah",
        medium: "Sedang",
        high: "Tinggi",
      }[task.priority];

      taskItem.innerHTML = `
        <input type="checkbox" class="task-checkbox" ${
          task.completed ? "checked" : ""
        } data-id="${task.id}">
        <div class="task-content">
          <span class="task-text ${task.completed ? "completed" : ""}">${
        task.text
      }</span>
          <div class="task-meta">
            <span class="task-date">${formattedDueDate}</span>
            <span class="task-priority-badge priority-${
              task.priority
            }">${priorityText}</span>
          </div>
        </div>
        <button class="delete-task-btn" data-id="${task.id}">Hapus 
           <i class="fas fa-trash"></i>
        </button>
      `;
      taskList.appendChild(taskItem);
    });

    // Tambahkan event listener untuk checkbox
    document.querySelectorAll(".task-checkbox").forEach((checkbox) => {
      checkbox.addEventListener("change", function () {
        const taskId = parseInt(this.dataset.id);
        const task = tasks[currentUser.username].find((t) => t.id === taskId);
        task.completed = this.checked;
        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderTasks();
      });
    });

    // Tambahkan event listener untuk tombol hapus
    document.querySelectorAll(".delete-task-btn").forEach((button) => {
      button.addEventListener("click", function () {
        const taskId = parseInt(this.dataset.id);
        tasks[currentUser.username] = tasks[currentUser.username].filter(
          (t) => t.id !== taskId
        );
        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderTasks();
      });
    });

    // Update statistik
    updateTaskStats();
  }
});
