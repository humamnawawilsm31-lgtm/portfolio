// PIN Admin
const ADMIN_PIN = "1234";

// Data Default
const defaultForexData = [
  { hari: 1, modal: 100.0, lot: 0.1, ketahanan: 100, profit: 10.0, wd: 0.0 },
  { hari: 2, modal: 110.0, lot: 0.11, ketahanan: 100, profit: 11.0, wd: 0.0 },
  { hari: 3, modal: 121.0, lot: 0.12, ketahanan: 100, profit: 12.1, wd: 0.0 },
];

const defaultBtcData = [
  {
    minggu: 1,
    tanggal: "2026-09-01",
    setoran: 100000,
    hargaUsd: 60000,
    kurs: 15500,
  },
  {
    minggu: 2,
    tanggal: "2026-09-08",
    setoran: 100000,
    hargaUsd: 62000,
    kurs: 15500,
  },
];

let forexData =
  JSON.parse(localStorage.getItem("forex_mm_table_data")) || defaultForexData;
let btcData =
  JSON.parse(localStorage.getItem("btc_dca_table_data")) || defaultBtcData;
let isForexAdmin = false;
let isBtcAdmin = false;

document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // 1. LOGIKA TOGGLE SIDEBAR
  // ==========================================
  const toggleBtn =
    document.getElementById("toggle-menu") ||
    document.querySelector(".menu-btn") ||
    document.querySelector(".navbar-toggler");
  const closeBtn =
    document.getElementById("close-menu") ||
    document.querySelector(".close-sidebar-btn");
  const sidebar =
    document.getElementById("sidebar-menu") ||
    document.querySelector(".sidebar") ||
    document.querySelector("aside");
  const overlay =
    document.getElementById("sidebar-overlay") ||
    document.querySelector(".sidebar-overlay");

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation(); // Mencegah bentrokan event
      sidebar.classList.toggle("active");
      if (overlay) overlay.classList.toggle("active");
    });
  }

  const closeSidebar = () => {
    if (sidebar) sidebar.classList.remove("active");
    if (overlay) overlay.classList.remove("active");
  };

  if (closeBtn) closeBtn.addEventListener("click", closeSidebar);
  if (overlay) overlay.addEventListener("click", closeSidebar);

  // Modal click outside logic
  window.addEventListener("click", (e) => {
    const forexModal = document.getElementById("forex-modal");
    const btcModal = document.getElementById("btc-modal");
    if (e.target === forexModal) forexModal.classList.remove("active");
    if (e.target === btcModal) btcModal.classList.remove("active");
  });

  // ==========================================
  // 2. ADMIN LOGIN LISTENERS
  // ==========================================
  const btnAdminLogin = document.getElementById("btn-admin-login");
  if (btnAdminLogin) {
    btnAdminLogin.addEventListener("click", () => {
      if (!isForexAdmin) {
        const pinInput = prompt("Masukkan PIN Admin Forex:");
        if (pinInput === ADMIN_PIN) {
          isForexAdmin = true;
          btnAdminLogin.classList.add("active");
          btnAdminLogin.innerHTML =
            '<i class="fa-solid fa-unlock"></i> Mode Edit (Aktif)';
          toggleForexAdminUI(true);
        } else if (pinInput !== null) {
          alert("PIN Salah!");
        }
      } else {
        isForexAdmin = false;
        btnAdminLogin.classList.remove("active");
        btnAdminLogin.innerHTML = '<i class="fa-solid fa-lock"></i> Mode Edit';
        toggleForexAdminUI(false);
      }
    });
  }

  const btnBtcAdminLogin = document.getElementById("btn-btc-admin-login");
  if (btnBtcAdminLogin) {
    btnBtcAdminLogin.addEventListener("click", () => {
      if (!isBtcAdmin) {
        const pinInput = prompt("Masukkan PIN Admin Bitcoin:");
        if (pinInput === ADMIN_PIN) {
          isBtcAdmin = true;
          btnBtcAdminLogin.classList.add("active");
          btnBtcAdminLogin.innerHTML =
            '<i class="fa-solid fa-unlock"></i> Mode Edit (Aktif)';
          toggleBtcAdminUI(true);
        } else if (pinInput !== null) {
          alert("PIN Salah! Akses ditolak.");
        }
      } else {
        isBtcAdmin = false;
        btnBtcAdminLogin.classList.remove("active");
        btnBtcAdminLogin.innerHTML =
          '<i class="fa-solid fa-lock"></i> Mode Edit';
        toggleBtcAdminUI(false);
      }
    });
  }

  // ==========================================
  // 3. FORM SUBMIT LISTENERS
  // ==========================================
  const forexForm = document.getElementById("forex-form");
  if (forexForm) {
    forexForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const newRow = {
        hari: parseInt(document.getElementById("f-hari").value),
        modal: parseFloat(document.getElementById("f-modal").value),
        lot: parseFloat(document.getElementById("f-lot").value),
        ketahanan: parseInt(document.getElementById("f-ketahanan").value),
        profit: parseFloat(document.getElementById("f-profit").value),
        wd: parseFloat(document.getElementById("f-wd").value),
      };
      forexData.push(newRow);
      forexData.sort((a, b) => a.hari - b.hari);
      localStorage.setItem("forex_mm_table_data", JSON.stringify(forexData));
      forexForm.reset();
      renderForexTable();
    });
  }

  const btcForm = document.getElementById("btc-form");
  if (btcForm) {
    btcForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const newRow = {
        minggu: parseInt(document.getElementById("btc-minggu").value),
        tanggal: document.getElementById("btc-tanggal").value,
        setoran: parseFloat(document.getElementById("btc-setoran").value),
        hargaUsd: parseFloat(document.getElementById("btc-harga-usd").value),
        kurs: parseFloat(
          document.getElementById("btc-kurs-idr").value || 15500,
        ),
      };
      btcData.push(newRow);
      btcData.sort((a, b) => a.minggu - b.minggu);
      localStorage.setItem("btc_dca_table_data", JSON.stringify(btcData));
      btcForm.reset();
      const kursElem = document.getElementById("btc-kurs-idr");
      if (kursElem) kursElem.value = 15500;
      renderBtcTable();
    });
  }

  // Initial Render
  renderForexTable();
  renderBtcTable();
});

// ==========================================
// FUNGSI HELPER & RENDER (GLOBAL)
// ==========================================
function toggleForexAdminUI(show) {
  document.querySelectorAll("#forex-modal .admin-only").forEach((el) => {
    el.style.display = show
      ? el.tagName === "FORM"
        ? "grid"
        : "table-cell"
      : "none";
  });
  renderForexTable();
}

function renderForexTable() {
  const forexTableBody = document.getElementById("forex-table-body");
  if (!forexTableBody) return;
  forexTableBody.innerHTML = "";
  let totalProfitUsd = 0;
  let initialModal = forexData.length > 0 ? parseFloat(forexData[0].modal) : 0;
  let lastTotal = 0;

  forexData.forEach((item, index) => {
    const modal = parseFloat(item.modal);
    const profit = parseFloat(item.profit);
    const wd = parseFloat(item.wd);
    const total = modal + profit - wd;
    totalProfitUsd += profit;
    lastTotal = total;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="td-hari">${item.hari}</td>
      <td class="td-modal">$${modal.toFixed(2)}</td>
      <td>${item.lot}</td>
      <td>${item.ketahanan}</td>
      <td>$${profit.toFixed(2)}</td>
      <td>$${wd.toFixed(2)}</td>
      <td class="td-total">$${total.toFixed(2)}</td>
      ${isForexAdmin ? `<td><button class="btn-delete" onclick="deleteForexRow(${index})"><i class="fa-solid fa-trash"></i></button></td>` : ""}
    `;
    forexTableBody.appendChild(row);
  });

  const rateIDR = 14500;
  const profitIDR = totalProfitUsd * rateIDR;
  const profitPct =
    initialModal > 0 ? ((lastTotal - initialModal) / initialModal) * 100 : 0;

  const elemTotalAkun = document.getElementById("sum-total-akun");
  const elemProfitUsd = document.getElementById("sum-profit-usd");
  const elemProfitIdr = document.getElementById("sum-profit-idr");
  const elemProfitPct = document.getElementById("sum-profit-pct");

  if (elemTotalAkun) elemTotalAkun.innerText = `$${lastTotal.toFixed(2)}`;
  if (elemProfitUsd) elemProfitUsd.innerText = `$${totalProfitUsd.toFixed(2)}`;
  if (elemProfitIdr)
    elemProfitIdr.innerText = `Rp ${profitIDR.toLocaleString("id-ID")}`;
  if (elemProfitPct) elemProfitPct.innerText = `${profitPct.toFixed(0)}%`;
}

window.deleteForexRow = function (index) {
  forexData.splice(index, 1);
  localStorage.setItem("forex_mm_table_data", JSON.stringify(forexData));
  renderForexTable();
};

// Fungsi Buka Modal Forex (Sekaligus Tutup Sidebar)
window.openForexModal = function (e) {
  if (e) e.preventDefault();
  const modal = document.getElementById("forex-modal");
  const sidebar =
    document.getElementById("sidebar-menu") ||
    document.querySelector(".sidebar");
  const overlay =
    document.getElementById("sidebar-overlay") ||
    document.querySelector(".sidebar-overlay");

  if (modal) modal.classList.add("active");
  if (sidebar) sidebar.classList.remove("active");
  if (overlay) overlay.classList.remove("active");

  renderForexTable();
};

window.closeForexModal = function () {
  const modal = document.getElementById("forex-modal");
  if (modal) modal.classList.remove("active");
};
document.addEventListener("DOMContentLoaded", function () {
  const closeBtn = document.getElementById("close-forex");
  if (closeBtn) {
    closeBtn.addEventListener("click", window.closeForexModal);
  }
});

function toggleBtcAdminUI(show) {
  document.querySelectorAll("#btc-modal .admin-only").forEach((el) => {
    el.style.display = show
      ? el.tagName === "FORM"
        ? "grid"
        : "table-cell"
      : "none";
  });
  renderBtcTable();
}

function formatTanggalIndo(dateString) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function renderBtcTable() {
  const btcTableBody = document.getElementById("btc-table-body");
  if (!btcTableBody) return;
  btcTableBody.innerHTML = "";

  let totalSetoran = 0;
  let runningBtc = 0;

  btcData.forEach((item, index) => {
    const setoran = parseFloat(item.setoran);
    const hargaUsd = parseFloat(item.hargaUsd);
    const kurs = parseFloat(item.kurs || 15500);

    const hargaIdr = hargaUsd * kurs;
    const dapatBtc = setoran / hargaIdr;

    totalSetoran += setoran;
    runningBtc += dapatBtc;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td><strong>Minggu ${item.minggu}</strong></td>
      <td>${formatTanggalIndo(item.tanggal)}</td>
      <td>Rp ${setoran.toLocaleString("id-ID")}</td>
      <td>$${hargaUsd.toLocaleString("en-US")}</td>
      <td><span style="color:#00e676;">+${dapatBtc.toFixed(8)} BTC</span></td>
      <td><strong style="color:#f7931a;">${runningBtc.toFixed(8)} BTC</strong></td>
      ${isBtcAdmin ? `<td><button class="btn-delete" onclick="deleteBtcRow(${index})"><i class="fa-solid fa-trash"></i></button></td>` : ""}
    `;
    btcTableBody.appendChild(row);
  });

  const elemSumInvestasi = document.getElementById("btc-sum-investasi");
  const elemSumTotalBtc = document.getElementById("btc-sum-total-btc");

  if (elemSumInvestasi)
    elemSumInvestasi.innerText = `Rp ${totalSetoran.toLocaleString("id-ID")}`;
  if (elemSumTotalBtc)
    elemSumTotalBtc.innerText = `${runningBtc.toFixed(8)} BTC`;
}

window.deleteBtcRow = function (index) {
  if (confirm("Apakah kamu yakin ingin menghapus baris data ini?")) {
    btcData.splice(index, 1);
    localStorage.setItem("btc_dca_table_data", JSON.stringify(btcData));
    renderBtcTable();
  }
};

// Fungsi Buka Modal Bitcoin (Sekaligus Tutup Sidebar)
window.openBtcModal = function (e) {
  if (e) e.preventDefault(); // Mencegah URL berubah/jumping
  const modal = document.getElementById("btc-modal");
  const sidebar =
    document.getElementById("sidebar-menu") ||
    document.querySelector(".sidebar");
  const overlay =
    document.getElementById("sidebar-overlay") ||
    document.querySelector(".sidebar-overlay");

  if (modal) modal.classList.add("active");
  if (sidebar) sidebar.classList.remove("active");
  if (overlay) overlay.classList.remove("active");

  renderBtcTable();
};

window.closeBtcModal = function () {
  const modal = document.getElementById("btc-modal");
  if (modal) modal.classList.remove("active");
};
// 1. Fungsi Buka Modal
window.openCompoundModal = function (e) {
  if (e) e.preventDefault();
  const modal = document.getElementById("compound-modal");
  const sidebar =
    document.getElementById("sidebar-menu") ||
    document.querySelector(".sidebar");
  const overlay =
    document.getElementById("sidebar-overlay") ||
    document.querySelector(".sidebar-overlay");

  if (modal) modal.classList.add("active");
  if (sidebar) sidebar.classList.remove("active");
  if (overlay) overlay.classList.remove("active");
};

// 2. Fungsi Tutup Modal
window.closeCompoundModal = function () {
  const modal = document.getElementById("compound-modal");
  if (modal) modal.classList.remove("active");
};

// 3. Fungsi Hitung Bunga Bergulung
function calculateCompound(e) {
  e.preventDefault();

  const P = parseFloat(document.getElementById("initial-deposit").value) || 0;
  const PMT =
    parseFloat(document.getElementById("monthly-contribution").value) || 0;
  const annualRate =
    parseFloat(document.getElementById("annual-rate").value) || 0;
  const years =
    parseInt(document.getElementById("investment-years").value) || 0;

  const r = annualRate / 100 / 12; // bunga per bulan
  const n = years * 12; // jumlah bulan

  // Rumus Future Value
  let futureValue = P * Math.pow(1 + r, n);
  if (r > 0) {
    futureValue += PMT * ((Math.pow(1 + r, n) - 1) / r);
  } else {
    futureValue += PMT * n;
  }

  const totalDeposit = P + PMT * n;
  const totalInterest = futureValue - totalDeposit;

  // Format ke USD ($)
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });

  // Tampilkan Hasil ke Layar
  document.getElementById("res-total-deposit").innerText =
    formatter.format(totalDeposit);
  document.getElementById("res-total-interest").innerText =
    formatter.format(totalInterest);
  document.getElementById("res-final-balance").innerText =
    formatter.format(futureValue);

  // Munculkan Kartu Hasil
  document.getElementById("compound-results").style.display = "grid";
}
// Variabel Status Tipe Investasi ('averaging' atau 'lumpsum')
let currentInvestmentType = "averaging";

// Buka Modal Compounding
window.openCompoundModal = function (e) {
  if (e) e.preventDefault();
  const modal = document.getElementById("compound-modal");
  const sidebar =
    document.getElementById("sidebar-menu") ||
    document.querySelector(".sidebar");
  const overlay =
    document.getElementById("sidebar-overlay") ||
    document.querySelector(".sidebar-overlay");

  if (modal) modal.classList.add("active");
  if (sidebar) sidebar.classList.remove("active");
  if (overlay) overlay.classList.remove("active");
};

// Tutup Modal Compounding
window.closeCompoundModal = function () {
  const modal = document.getElementById("compound-modal");
  if (modal) modal.classList.remove("active");
};

// Ganti Tipe Investasi (Averaging vs Lump Sump)
function setInvestmentType(type) {
  currentInvestmentType = type;
  const btnAveraging = document.getElementById("btn-averaging");
  const btnLumpSump = document.getElementById("btn-lump-sump");
  const groupMonthly = document.getElementById("monthly-contribution");

  if (type === "averaging") {
    btnAveraging.classList.add("active");
    btnLumpSump.classList.remove("active");
    groupMonthly.parentElement.style.display = "block";
  } else {
    btnLumpSump.classList.add("active");
    btnAveraging.classList.remove("active");
    groupMonthly.parentElement.style.display = "none";
    groupMonthly.value = 0;
  }
}

// Fungsi Hitung Compound Interest
function calculateCompound(e) {
  e.preventDefault();

  const P = parseFloat(document.getElementById("initial-deposit").value) || 0;
  const PMT =
    currentInvestmentType === "averaging"
      ? parseFloat(document.getElementById("monthly-contribution").value) || 0
      : 0;
  const annualRate =
    parseFloat(document.getElementById("annual-rate").value) || 0;
  const years =
    parseInt(document.getElementById("investment-years").value) || 0;

  let futureValue = 0;
  let totalDeposit = 0;

  if (currentInvestmentType === "lumpsum") {
    // Rumus Compounding Tahunan untuk Lump Sum
    const r = annualRate / 100;
    futureValue = P * Math.pow(1 + r, years);
    totalDeposit = P;
  } else {
    // Rumus Compounding Bulanan untuk Averaging (Deposit Tiap Bulan)
    const r = annualRate / 100 / 12; // bunga per bulan
    const n = years * 12; // total bulan

    futureValue = P * Math.pow(1 + r, n);
    if (r > 0) {
      futureValue += PMT * ((Math.pow(1 + r, n) - 1) / r);
    } else {
      futureValue += PMT * n;
    }
    totalDeposit = P + PMT * n;
  }

  const totalInterest = futureValue - totalDeposit;

  // Formatter Rupiah
  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  });

  document.getElementById("res-total-deposit").innerText =
    formatter.format(totalDeposit);
  document.getElementById("res-total-interest").innerText =
    formatter.format(totalInterest);
  document.getElementById("res-final-balance").innerText =
    formatter.format(futureValue);

  document.getElementById("compound-results").style.display = "grid";
}
// Fungsi untuk mereset seluruh form kalkulator dan menyembunyikan/mereset hasil
function resetCompoundForm() {
  // 1. Reset input form jika ada di dalam tag <form>
  const form = document.getElementById("compound-form");
  if (form) {
    form.reset();
  }

  // 2. Kosongkan nilai input secara manual (cadangan jika tidak pakai tag <form>)
  const initialDep = document.getElementById("initial-deposit");
  const monthlyDep = document.getElementById("monthly-contribution");
  const annualRate = document.getElementById("annual-rate");
  const years = document.getElementById("investment-years");

  if (initialDep) initialDep.value = "";
  if (monthlyDep) monthlyDep.value = "";
  if (annualRate) annualRate.value = "";
  if (years) years.value = "";

  // 3. Kembalikan atau sembunyikan kotak hasil perhitungan
  const resDeposit = document.getElementById("res-total-deposit");
  const resInterest = document.getElementById("res-total-interest");
  const resBalance = document.getElementById("res-final-balance");
  const resBox = document.getElementById("compound-results");

  if (resDeposit) resDeposit.innerText = "Rp 0";
  if (resInterest) resInterest.innerText = "Rp 0";
  if (resBalance) resBalance.innerText = "Rp 0";
  if (resBox) resBox.style.display = "none";

  // 4. Reset pilihan mode kembali ke default ('averaging') jika ada fungsinya
  if (typeof setInvestmentType === "function") {
    setInvestmentType("averaging");
  }
}
