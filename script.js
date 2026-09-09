/**
 * Rayyan's Luxury Stay - script.js
 * Optimized and Refactored
 */

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwWa4vcCYBih7qwV3H6BbaOD4_lPi_swXLFzWzAzHeug_PtH_BwoQ0WcYFx3endIOlq/exec";

document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const body = document.body;
    const header = document.querySelector("header");
    const darkButton = document.getElementById("darkMode");
    const topBtn = document.getElementById("topBtn");
    const menuButton = document.getElementById("menuToggle");
    const menu = document.getElementById("menu");
    const loadTimeInput = document.getElementById("loadTime");
    const contactLoadTimeInput = document.getElementById("contactLoadTime");
    const bookingForm = document.getElementById("bookingForm");
    const contactForm = document.getElementById("contactForm");

    // Initialize Load Time
    const now = Date.now();
    if (loadTimeInput) loadTimeInput.value = now;
    if (contactLoadTimeInput) contactLoadTimeInput.value = now;

    /* ==========================================
       Sticky Header & Back to Top
       ========================================== */
    const isHomePage = !!document.getElementById("home");
    
    const handleHeader = () => {
        if (!isHomePage || window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    };

    window.addEventListener("scroll", handleHeader);
    handleHeader();

    window.addEventListener("scroll", () => {
        // Back to Top
        if (topBtn) {
            if (window.scrollY > 500) {
                topBtn.classList.add("show");
            } else {
                topBtn.classList.remove("show");
            }
        }
    });

    if (topBtn) {
        topBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    /* ==========================================
       Dark Mode
       ========================================== */
    const updateDarkIcon = (isDark) => {
        if (!darkButton) return;
        darkButton.innerHTML = isDark 
            ? '<i class="fa-solid fa-sun"></i> <span>Light Mode</span>' 
            : '<i class="fa-solid fa-moon"></i> <span>Dark Mode</span>';
    };

    if (localStorage.getItem("theme") === "dark") {
        body.classList.add("dark");
        updateDarkIcon(true);
    } else {
        updateDarkIcon(false);
    }

    if (darkButton) {
        darkButton.addEventListener("click", () => {
            body.classList.toggle("dark");
            const isDark = body.classList.contains("dark");
            localStorage.setItem("theme", isDark ? "dark" : "light");
            updateDarkIcon(isDark);
        });
    }

    /* ==========================================
       Mobile Menu
       ========================================== */
    if (menuButton && menu) {
        menuButton.addEventListener("click", () => {
            menu.classList.toggle("active");
        });
        
        // Close menu on link click
        menu.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                menu.classList.remove("active");
            });
        });
    }

    /* ==========================================
       Smooth Scroll
       ========================================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function(e) {
            const targetId = this.getAttribute("href");
            if (targetId === "#") return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
    });

    /* ==========================================
       Room Slider
       ========================================== */
    const slider = document.querySelector(".slides");
    if (slider) {
        const slides = document.querySelectorAll(".slide");
        const next = document.querySelector(".next");
        const prev = document.querySelector(".prev");
        const dotsContainer = document.querySelector(".dots");
        let index = 0;
        let autoSlide;

        slides.forEach((_, i) => {
            const dot = document.createElement("button");
            dot.type = "button";
            dot.classList.add("dot");
            dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
            if (i === 0) {
                dot.classList.add("active");
                dot.setAttribute("aria-current", "true");
            } else {
                dot.setAttribute("aria-current", "false");
            }
            dot.addEventListener("click", () => {
                index = i;
                updateSlider();
                restartAuto();
            });
            dotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll(".dot");

        function updateSlider() {
            slider.style.transform = `translateX(-${index * 100}%)`;
            dots.forEach((d, i) => {
                const isActive = i === index;
                d.classList.toggle("active", isActive);
                d.setAttribute("aria-current", isActive ? "true" : "false");
            });
        }

        function nextSlide() {
            index = (index + 1) % slides.length;
            updateSlider();
        }

        if (next) next.addEventListener("click", () => { nextSlide(); restartAuto(); });
        if (prev) prev.addEventListener("click", () => { index = (index - 1 + slides.length) % slides.length; updateSlider(); restartAuto(); });

        const startAuto = () => autoSlide = setInterval(nextSlide, 5000);
        const restartAuto = () => { clearInterval(autoSlide); startAuto(); };
        startAuto();
    }

    /* ==========================================
       Booking & Contact Form Logic
       ========================================== */
    const successModal = document.getElementById("successModal");
    const errorModal = document.getElementById("errorModal");
    const errorText = document.getElementById("errorText");

    const showSuccess = () => {
        if (successModal) successModal.classList.add("show");
        body.style.overflow = "hidden";
        setTimeout(closeModals, 5000);
    };

    const showError = (msg) => {
        if (errorModal) {
            errorText.textContent = msg || "Something went wrong.";
            errorModal.classList.add("show");
            body.style.overflow = "hidden";
        }
    };

    const closeModals = () => {
        if (successModal) successModal.classList.remove("show");
        if (errorModal) errorModal.classList.remove("show");
        body.style.overflow = "";
    };

    window.closeSuccess = closeModals;
    window.closeError = closeModals;

    // Validation Helpers
    const setFieldError = (input, text) => {
        const group = input.closest(".form-group");
        if (group) {
            const errEl = group.querySelector(".error");
            if (errEl) errEl.textContent = text;
            input.classList.add("input-error");
        }
    };

    const clearFieldError = (input) => {
        const group = input.closest(".form-group");
        if (group) {
            const errEl = group.querySelector(".error");
            if (errEl) errEl.textContent = "";
            input.classList.remove("input-error");
        }
    };

    /* Booking Form */
    if (bookingForm) {
        const bInputs = {
            name: document.getElementById("name"),
            email: document.getElementById("email"),
            phone: document.getElementById("phone"),
            guests: document.getElementById("guests"),
            checkin: document.getElementById("checkin"),
            checkout: document.getElementById("checkout"),
            roomtype: document.getElementById("roomtype"),
            message: document.getElementById("message")
        };
        const bSubmitBtn = document.getElementById("submitBtn");
        const bLoader = document.getElementById("loader");

        // Set min check-in
        const today = new Date().toISOString().split("T")[0];
        if (bInputs.checkin) bInputs.checkin.min = today;

        const validateBooking = () => {
            let isValid = true;
            if (bInputs.name.value.trim().length < 3) { setFieldError(bInputs.name, "Full name required"); isValid = false; } else clearFieldError(bInputs.name);
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bInputs.email.value)) { setFieldError(bInputs.email, "Valid email required"); isValid = false; } else clearFieldError(bInputs.email);
            if (!/^[6-9]\d{9}$/.test(bInputs.phone.value)) { setFieldError(bInputs.phone, "Valid 10-digit number required"); isValid = false; } else clearFieldError(bInputs.phone);
            if (!bInputs.guests.value) { setFieldError(bInputs.guests, "Required"); isValid = false; } else clearFieldError(bInputs.guests);
            if (!bInputs.roomtype.value) { setFieldError(bInputs.roomtype, "Required"); isValid = false; } else clearFieldError(bInputs.roomtype);
            
            if (!bInputs.checkin.value) { setFieldError(bInputs.checkin, "Required"); isValid = false; } else clearFieldError(bInputs.checkin);
            if (!bInputs.checkout.value) { setFieldError(bInputs.checkout, "Required"); isValid = false; } else clearFieldError(bInputs.checkout);
            
            if (bInputs.checkin.value && bInputs.checkout.value) {
                if (new Date(bInputs.checkout.value) <= new Date(bInputs.checkin.value)) {
                    setFieldError(bInputs.checkout, "Check-out must be after check-in");
                    isValid = false;
                }
            }
            return isValid;
        };

        bookingForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            if (!navigator.onLine) return showError("No internet connection.");
            if (!validateBooking()) return;

            // Spam Protection
            const website = document.getElementById("website").value;
            const loadTime = document.getElementById("loadTime").value;
            if (website) return; // Honeypot
            if (Date.now() - loadTime < 3000) return showError("Please take your time to fill the form.");

            // Cooldown check
            const lastTime = localStorage.getItem("lastSubmitTime");
            if (lastTime && (Date.now() - lastTime < 30000)) {
                return showError("Please wait 30 seconds before another booking.");
            }

            try {
                bSubmitBtn.disabled = true;
                bLoader.classList.remove("hidden");
                bSubmitBtn.querySelector("span").textContent = "Processing...";

                const data = {
                    type: "booking",
                    timestamp: new Date().toLocaleString(),
                    name: bInputs.name.value.trim(),
                    email: bInputs.email.value.trim(),
                    phone: bInputs.phone.value.trim(),
                    checkin: bInputs.checkin.value,
                    checkout: bInputs.checkout.value,
                    guests: bInputs.guests.value,
                    roomtype: bInputs.roomtype.value,
                    message: bInputs.message.value.trim()
                };

                const res = await fetch(SCRIPT_URL, { method: "POST", body: JSON.stringify(data) });
                const result = await res.json();

                if (result.status === "success") {
                    bookingForm.reset();
                    localStorage.setItem("lastSubmitTime", Date.now());
                    showSuccess();
                } else {
                    showError(result.message);
                }
            } catch (err) {
                showError("Connection error. Try again.");
            } finally {
                bSubmitBtn.disabled = false;
                bLoader.classList.add("hidden");
                bSubmitBtn.querySelector("span").textContent = "Book Now";
            }
        });
    }

    /* Contact Form */
    if (contactForm) {
        contactForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            // Spam Protection
            const cWebsite = document.getElementById("contactWebsite").value;
            const cLoadTime = document.getElementById("contactLoadTime").value;
            if (cWebsite) return; // Honeypot
            if (Date.now() - cLoadTime < 3000) return showError("Please take your time to fill the form.");

            const cName = document.getElementById("contactName");
            const cEmail = document.getElementById("contactEmail");
            const cSub = document.getElementById("contactSubject");
            const cMsg = document.getElementById("contactMessage");
            const cBtn = document.getElementById("contactSubmitBtn");
            const cLoader = document.getElementById("contactLoader");

            if (!cName.value || !cEmail.value || !cMsg.value) return showError("Please fill required fields.");

            try {
                cBtn.disabled = true;
                if (cLoader) cLoader.classList.remove("hidden");
                cBtn.querySelector("span").textContent = "Sending...";

                const data = {
                    type: "contact",
                    name: cName.value.trim(),
                    email: cEmail.value.trim(),
                    subject: cSub.value.trim(),
                    message: cMsg.value.trim()
                };

                const res = await fetch(SCRIPT_URL, { method: "POST", body: JSON.stringify(data) });
                const result = await res.json();

                if (result.status === "success") {
                    contactForm.reset();
                    showSuccess();
                } else {
                    showError(result.message);
                }
            } catch (err) {
                showError("Failed to send message.");
            } finally {
                cBtn.disabled = false;
                if (cLoader) cLoader.classList.add("hidden");
                cBtn.querySelector("span").textContent = "Send Message";
            }
        });
    }

    // Modal Events
    window.addEventListener("click", (e) => {
        if (e.target === successModal || e.target === errorModal) closeModals();
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeModals();
    });

    /* ==========================================
       AOS Init
       ========================================== */
    if (typeof AOS !== "undefined") {
        AOS.init({ duration: 900, once: true, easing: "ease-in-out" });
    }
});
