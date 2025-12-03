// LOGO PNG BASE64 (tanpa prefix data:image/png;base64,)
const LOGO_BASE64 = ""

// =========================
// LOAD LOGO PNG → BASE64
// =========================

window.logoReady = false

function loadLogoToBase64() {
  const img = document.getElementById("logoSettings")

  img.onload = () => {
    try {
      const canvas = document.createElement("canvas")
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight

      const ctx = canvas.getContext("2d")
      ctx.drawImage(img, 0, 0)

      window.LOGO_BASE64 = canvas
        .toDataURL("image/png")
        .replace("data:image/png;base64,", "")

      window.logoReady = true
      console.log("LOGO BASE64 READY")
    } catch (e) {
      console.log("GAGAL convert logo")
    }
  }
}

// Panggil fungsi saat halaman load
window.addEventListener("load", () => {
  loadLogoToBase64()
})

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

let blockClose = false // mencegah popup auto close

// =========================
// OPEN POPUP
// =========================
function openPopup() {
  // mem-block klik pertama supaya tidak menutup
  blockClose = true
  setTimeout(() => (blockClose = false), 250)

  popup.style.display = "flex"

  // load input

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
// DOUBLE-CLICK DESKTOP
// =========================
logo.addEventListener("dblclick", (e) => {
  e.stopPropagation()
  openPopup()
})

// =========================
// DOUBLE TAP MOBILE/TABLET
// =========================
let lastTap = 0

logo.addEventListener(
  "touchstart",
  (e) => {
    e.stopPropagation()
    const now = Date.now()

    if (now - lastTap < 350) {
      openPopup()
    }

    lastTap = now
  },
  { passive: true }
)

// menghentikan ghost click
logo.addEventListener("click", (e) => e.stopPropagation())

// =========================
// CLOSE POPUP
// =========================
closeBtn.addEventListener("click", (e) => {
  e.stopPropagation()
  popup.style.display = "none"
})

// klik area hitam untuk menutup popup
popup.addEventListener("click", (e) => {
  if (blockClose) return // cegah auto-close saat awal buka
  if (e.target === popup) popup.style.display = "none"
})

// konten dalam popup jangan menutup popup
popupBox.addEventListener("click", (e) => {
  e.stopPropagation()
})

// =========================
// LOAD LOCAL STORAGE
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
  const today = new Date().toISOString().substring(0, 10) // format YYYY-MM-DD
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
})

// =========================
// ANIMASI TOMBOL
// =========================
const wrapper = document.getElementById("btnWrapper")
const btn = document.getElementById("mainBtn")

wrapper.addEventListener("mousedown", () => {
  btn.src = "img/button2.png"
})

wrapper.addEventListener("mouseup", () => {
  btn.src = "img/button1.png"
})

wrapper.addEventListener("mouseleave", () => {
  btn.src = "img/button1.png"
})

// untuk HP
wrapper.addEventListener("touchstart", () => {
  btn.src = "img/button2.png"
})

wrapper.addEventListener("touchend", () => {
  btn.src = "img/button1.png"
})

// =========================
// CONFIG CETAK NOMOR ANTRIAN
// =========================

function getTimeNow() {
  const d = new Date()
  return (
    d.getHours().toString().padStart(2, "0") +
    ":" +
    d.getMinutes().toString().padStart(2, "0")
  )
}

function printLogo() {
  if (!window.LOGO_BASE64 || window.LOGO_BASE64.length < 50) {
    console.log("LOGO belum siap, skip print gambar")
    return
  }

  if (typeof AndroidPrint !== "undefined") {
    AndroidPrint.printImage(window.LOGO_BASE64)
  }
}

function printESC(data) {
  const ip = localStorage.getItem("printer")
  const port = localStorage.getItem("portPrinter")

  if (typeof AndroidPrint !== "undefined") {
    AndroidPrint.printText(data, ip, port)
  }
}

// =========================
// GENERATE NOMOR ANTRIAN
// =========================
function cetakTiketESC() {
  const instansi = (localStorage.getItem("instansi") || "").toUpperCase()
  const layanan = (localStorage.getItem("layanan") || "").toUpperCase()
  const nomor = localStorage.getItem("lastNumber") || "-"
  const sisa = localStorage.getItem("sisaAntrian") || "0"

  let d = new Date()
  const tanggal =
    d.getDate().toString().padStart(2, "0") +
    "-" +
    (d.getMonth() + 1).toString().padStart(2, "0") +
    "-" +
    d.getFullYear()
  const jam = getTimeNow()

  // CETAK LOGO DI TENGAH
  printLogo() // dipanggil dulu

  setTimeout(() => {
    let esc = ""

    // RESET
    esc += "\x1B\x40"

    // =====================
    //  INSTANSI (BOLD + CENTER)
    // =====================
    esc += "\x1B\x61\x01" // center
    esc += "\x1B\x45\x01" // bold on
    esc += instansi + "\n"
    esc += "\x1B\x45\x00" // bold off

    // =====================
    //  TANGGAL KIRI - JAM KANAN
    // =====================
    esc += "\x1B\x61\x00" // left
    esc += tanggal

    esc += "\x1B\x61\x02" // right
    esc += jam + "\n"

    // Line spacing kecil
    esc += "\x1B\x61\x01" // center
    esc += "\n"

    // =====================
    //  LAYANAN
    // =====================
    esc += "\x1B\x45\x01" // bold
    esc += layanan + "\n"
    esc += "\x1B\x45\x00" // bold off

    // =====================
    //  TEXT “Nomor Antrian Anda”
    // =====================
    esc += "Nomor Antrian Anda\n\n"

    // =====================
    //  NOMOR ANTRIAN BESAR
    // =====================
    esc += "\x1D\x21\x11" // double height + width
    esc += nomor + "\n"
    esc += "\x1D\x21\x00" // normal
    esc += "\n"

    // =====================
    //  SISA ANTRIAN
    // =====================
    esc += "Sisa antrian : " + sisa + "\n\n"

    // =====================
    //  PESAN
    // =====================
    esc += "Silakan menunggu sampai nomor\n"
    esc += "antrian anda dipanggil.\n\n\n\n"

    // KIRIM PRINT
    printESC(esc)

    // CUT PAPER
    setTimeout(() => {
      printESC("\x1D\x56\x00")
    }, 300)
  }, 500)
}

wrapper.addEventListener("click", () => {
  if (!window.logoReady) {
    alert("Logo belum siap. Tunggu 1 detik lalu coba lagi.")
    return
  }

  const kode = localStorage.getItem("kode")

  let last = localStorage.getItem("lastNumber")
  let nextNumber

  if (!last) {
    nextNumber = 1
  } else {
    const lastNum = parseInt(last.replace(kode, ""))
    nextNumber = lastNum + 1
  }

  const nomorFormat = kode + nextNumber.toString().padStart(3, "0")

  localStorage.setItem("lastNumber", nomorFormat)
  localStorage.setItem("sisaAntrian", nextNumber - 1)

  // ========== UPDATE POPUP STRUK ==========
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

  // ----- HARI + TANGGAL -----
  const dayName = hariID[d.getDay()]
  const dateStr =
    d.getDate().toString().padStart(2, "0") +
    "-" +
    (d.getMonth() + 1).toString().padStart(2, "0") +
    "-" +
    d.getFullYear()

  document.getElementById("ticketDateLeft").innerText = `${dayName}, ${dateStr}`

  // ----- JAM -----
  document.getElementById("ticketClock").innerText =
    d.getHours().toString().padStart(2, "0") +
    ":" +
    d.getMinutes().toString().padStart(2, "0")

  document.getElementById("ticketNumber").innerText = nomorFormat
  document.getElementById("ticketSisa").innerText = nextNumber - 1

  // CETAK TIKET KE PRINTER
  cetakTiketESC()

  // TAMPILKAN POPUP + MULAI COUNTDOWN
  showTicketPopup()
})

// =========================
// RESET NOMOR ANTRIAN
// =========================

function resetHarian() {
  const today = new Date().toISOString().substring(0, 10) // YYYY-MM-DD
  const lastDate = localStorage.getItem("lastDate")

  if (today !== lastDate) {
    // ambil kode layanan
    const kode = localStorage.getItem("kode") || "P"

    // reset
    localStorage.setItem("lastNumber", kode + "001")
    localStorage.setItem("sisaAntrian", 0)

    // update tanggal
    localStorage.setItem("lastDate", today)

    console.log("RESET HARIAN BERHASIL → Nomor kembali ke " + kode + "001")
  }
}

setInterval(resetHarian, 1000)

// =========================
// POPUP STRUK + COUNTDOWN
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

    if (timeLeft <= 0) {
      closeTicketPopup()
    }
  }, 1000)
}

function closeTicketPopup() {
  ticketPopup.style.display = "none"
  clearInterval(ticketCountdown)
  closeTicketBtn.innerText = "Tutup" // reset label
}

// KLIK MANUAL TUTUP
closeTicketBtn.addEventListener("click", closeTicketPopup)
