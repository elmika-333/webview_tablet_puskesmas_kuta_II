// =========================
// JAM & TANGGAL
// =========================
function updateClock() {
  let d = new Date()

  document.getElementById("clockBox").innerText =
    d.getHours().toString().padStart(2, "0") +
    ":" +
    d.getMinutes().toString().padStart(2, "0")

  const hari = ["MINGGU", "SENIN", "SELASA", "RABU", "KAMIS", "JUMAT", "SABTU"]
  document.getElementById("dayName").innerText = hari[d.getDay()]

  document.getElementById("fullDate").innerText =
    d.getDate().toString().padStart(2, "0") +
    "-" +
    (d.getMonth() + 1).toString().padStart(2, "0") +
    "-" +
    d.getFullYear()
}
setInterval(updateClock, 1000)
updateClock()

// =========================
// POPUP ELEMENTS
// =========================
const popup = document.getElementById("settingsPopup")
const logo = document.getElementById("logoSettings")
const closeBtn = document.getElementById("closeSettings")
const popupBox = document.querySelector(".popupBox")
let blockClose = false

// =========================
// OPEN POPUP
// =========================
function openPopup() {
  blockClose = true
  setTimeout(() => (blockClose = false), 250)
  popup.style.display = "flex"

  document.getElementById("inputKode").value =
    localStorage.getItem("kode") || ""
  document.getElementById("inputPrinterIP").value =
    localStorage.getItem("printer") || ""
  document.getElementById("inputPortPrinterIP").value =
    localStorage.getItem("portPrinter") || ""
  document.getElementById("inputInstansi").value =
    document.getElementById("instansiText").innerText
  document.getElementById("inputBtn").value =
    document.getElementById("btnText").innerText
  document.getElementById("inputRunning").value =
    document.getElementById("runText").innerText
}

// =========================
// DOUBLE TAP / CLICK
// =========================
logo.addEventListener("dblclick", (e) => {
  e.stopPropagation()
  openPopup()
})

let lastTap = 0
logo.addEventListener(
  "touchstart",
  (e) => {
    e.stopPropagation()
    const now = Date.now()
    if (now - lastTap < 250) openPopup()
    lastTap = now
  },
  { passive: true }
)

logo.addEventListener("click", (e) => e.stopPropagation())

// =========================
// CLOSE POPUP
// =========================
closeBtn.addEventListener("click", (e) => {
  e.stopPropagation()
  popup.style.display = "none"
})
popup.addEventListener("click", (e) => {
  if (!blockClose && e.target === popup) popup.style.display = "none"
})
popupBox.addEventListener("click", (e) => e.stopPropagation())

// =========================
// LOAD SETTINGS
// =========================
function loadSettings() {
  const kode = localStorage.getItem("kode")
  const printer = localStorage.getItem("printer")
  const portPrinter = localStorage.getItem("portPrinter")
  const s1 = localStorage.getItem("instansi")
  const s2 = localStorage.getItem("layanan")
  const s3 = localStorage.getItem("running")

  if (kode) document.getElementById("inputKode").value = kode
  if (printer) document.getElementById("inputPrinterIP").value = printer
  if (portPrinter)
    document.getElementById("inputPortPrinterIP").value = portPrinter
  if (s1) document.getElementById("instansiText").innerText = s1
  if (s2) document.getElementById("btnText").innerText = s2
  if (s3) document.getElementById("runText").innerText = s3
}
loadSettings()

if (!localStorage.getItem("lastDate")) {
  const today = new Date().toISOString().substring(0, 10)
  localStorage.setItem("lastDate", today)
}

// =========================
// SAVE SETTINGS
// =========================
document.getElementById("saveSettings").addEventListener("click", () => {
  const kode = document.getElementById("inputKode").value
  const printer = document.getElementById("inputPrinterIP").value
  const portPrinter = document.getElementById("inputPortPrinterIP").value
  const instansi = document.getElementById("inputInstansi").value
  const layanan = document.getElementById("inputBtn").value
  const running = document.getElementById("inputRunning").value

  document.getElementById("instansiText").innerText = instansi
  document.getElementById("btnText").innerText = layanan
  document.getElementById("runText").innerText = running

  localStorage.setItem("kode", kode)
  localStorage.setItem("printer", printer)
  localStorage.setItem("portPrinter", portPrinter)
  localStorage.setItem("instansi", instansi)
  localStorage.setItem("layanan", layanan)
  localStorage.setItem("running", running)

  popup.style.display = "none"

  AndroidPrint.savePrinter(printer, portPrinter)
})

// =========================
// ANIMASI BUTTON
// =========================
const wrapper = document.getElementById("btnWrapper")
const btn = document.getElementById("mainBtn")

wrapper.addEventListener("mousedown", () => (btn.src = "img/button2.png"))
wrapper.addEventListener("mouseup", () => (btn.src = "img/button1.png"))
wrapper.addEventListener("mouseleave", () => (btn.src = "img/button1.png"))
wrapper.addEventListener("touchstart", () => (btn.src = "img/button2.png"))
wrapper.addEventListener("touchend", () => (btn.src = "img/button1.png"))
wrapper.addEventListener("touchcancel", () => (btn.src = "img/button1.png"))

// =========================
// CETAK TIKET MENGGUNAKAN printTicketFull
// =========================
function cetakTiketESC() {
  const instansi = (localStorage.getItem("instansi") || "").toUpperCase()
  const layanan = (localStorage.getItem("layanan") || "").toUpperCase()
  const nomor = localStorage.getItem("lastNumber") || "-"

  let d = new Date()
  const tanggal =
    d.getDate().toString().padStart(2, "0") +
    "-" +
    (d.getMonth() + 1).toString().padStart(2, "0") +
    "-" +
    d.getFullYear()
  const jam =
    d.getHours().toString().padStart(2, "0") +
    ":" +
    d.getMinutes().toString().padStart(2, "0")

  const totalWidth = 48
  const lineTanggal =
    tanggal + " ".repeat(totalWidth - tanggal.length - jam.length) + jam

  let esc = ""

  esc += "\x1B\x40" // RESET

  // ============================
  // INSTANSI (sedikit diperbesar + tebal + center)
  // ============================
  esc += "\x1B\x61\x01" // CENTER
  esc += "\x1B\x45\x01" // BOLD ON
  esc += "\x1D\x21\x01" // Text a bit bigger
  esc += instansi + "\n"
  esc += "\x1D\x21\x00" // Normal size
  esc += "\x1B\x45\x00" // BOLD OFF

  // ============================
  // TANGGAL (normal, left)
  // ============================
  esc += "\x1B\x61\x00" // LEFT
  esc += lineTanggal

  esc += "================================================\n\n"

  // ============================
  // LAYANAN (center, sedikit lebih besar)
  // ============================
  esc += "\x1B\x61\x01" // CENTER
  esc += "\x1B\x45\x01" // BOLD ON
  esc += "\x1D\x21\x01" // Slightly bigger
  esc += layanan + "\n\n"
  esc += "\x1D\x21\x00" // Normal size
  esc += "\x1B\x45\x00" // BOLD OFF

  esc += "Nomor Antrian Anda\n\n"

  // ============================
  // NOMOR ANTRIAN (lebih besar dari yang lain)
  // ============================
  // 0x22 = 2x height + 2x width (besar jelas)
  esc += "\x1D\x21\x22"
  esc += nomor + "\n"
  esc += "\x1D\x21\x00\n"

  // ============================
  // FOOTER
  // ============================
  esc += "Silakan menunggu sampai nomor anda dipanggil.\n\n\n"

  // ============================
  // CETAK SEKALI DENGAN LOGO
  // ============================
  if (typeof AndroidPrint !== "undefined") {
    AndroidPrint.printTicketFull(esc + "\n\n")
    setTimeout(() => AndroidPrint.printText("\x1D\x56\x00"), 1000)
  }
}

// =========================
// TOMBOL CETAK
// =========================
wrapper.addEventListener("click", () => {
  const kode = localStorage.getItem("kode") || "P"
  let last = localStorage.getItem("lastNumber")
  let nextNumber = !last ? 1 : parseInt(last.replace(kode, "")) + 1
  const nomorFormat = kode + nextNumber.toString().padStart(3, "0")

  localStorage.setItem("lastNumber", nomorFormat)

  const hariID = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
  ]
  let d = new Date()
  document.getElementById("ticketInstansi").innerText =
    localStorage.getItem("instansi") || "INSTANSI"
  document.getElementById("ticketService").innerText =
    localStorage.getItem("layanan") || "LAYANAN"
  document.getElementById("ticketDateLeft").innerText = `${
    hariID[d.getDay()]
  }, ${d.getDate().toString().padStart(2, "0")}-${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${d.getFullYear()}`
  document.getElementById("ticketClock").innerText =
    d.getHours().toString().padStart(2, "0") +
    ":" +
    d.getMinutes().toString().padStart(2, "0")
  document.getElementById("ticketNumber").innerText = nomorFormat

  cetakTiketESC()
  showTicketPopup()
})

// =========================
// RESET HARIAN
// =========================
function resetHarian() {
  const today = new Date().toISOString().substring(0, 10)
  const lastDate = localStorage.getItem("lastDate")
  if (today !== lastDate) {
    localStorage.removeItem("lastNumber")
    localStorage.setItem("lastDate", today)
  }
}
setInterval(resetHarian, 1000)

// =========================
// POPUP STRUK
// =========================
const ticketPopup = document.getElementById("ticketPopup")
const closeTicketBtn = document.getElementById("closeTicketBtn")
let ticketCountdown

function showTicketPopup() {
  ticketPopup.style.display = "flex"
  let timeLeft = 5
  closeTicketBtn.innerText = `Tutup (${timeLeft})`

  ticketCountdown = setInterval(() => {
    timeLeft--
    closeTicketBtn.innerText = `Tutup (${timeLeft})`
    if (timeLeft <= 0) closeTicketPopup()
  }, 1000)
}

function closeTicketPopup() {
  ticketPopup.style.display = "none"
  clearInterval(ticketCountdown)
  closeTicketBtn.innerText = "Tutup"
}
