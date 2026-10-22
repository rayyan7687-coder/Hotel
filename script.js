/**
 * Rayyan's Luxury Stay - script.js
 * Optimized and Refactored
 */

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwWa4vcCYBih7qwV3H6BbaOD4_lPi_swXLFzWzAzHeug_PtH_BwoQ0WcYFx3endIOlq/exec";

const HOTEL_CONFIG = {
    taxRate: 0.09, // 9% GST
    rooms: {
        "Standard Room": {
            price: 999,
            maxGuests: 2,
            bedType: "Queen Size Bed",
            size: "280 sq.ft",
            amenities: ["Free High-Speed Wi-Fi", "Complimentary Breakfast", "Smart LED TV", "Digital Safe"]
        },
        "Deluxe Room": {
            price: 1999,
            maxGuests: 3,
            bedType: "King Size Bed",
            size: "420 sq.ft",
            amenities: ["Free High-Speed Wi-Fi", "Complimentary Breakfast", "55\" 4K Smart TV", "Mini Bar & Espresso"]
        },
        "Executive Suite": {
            price: 3499,
            maxGuests: 4,
            bedType: "California King Bed",
            size: "650 sq.ft",
            amenities: ["Private Jacuzzi & Steam Shower", "24/7 Dedicated Butler", "Private Dining Set", "Airport VIP Transfer"]
        }
    }
};

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
       Dark Mode System
       ========================================== */
    const updateDarkIcon = (isDark) => {
        if (!darkButton) return;
        darkButton.innerHTML = isDark 
            ? '<i class="fa-solid fa-sun"></i> <span>Light</span>'
            : '<i class="fa-solid fa-moon"></i> <span>Dark</span>';
        darkButton.setAttribute("aria-label", isDark ? "Switch to Light Mode" : "Switch to Dark Mode");
    };

    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
        body.classList.add("dark");
        updateDarkIcon(true);
    } else {
        body.classList.remove("dark");
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
       Mobile Menu & Active Navigation
       ========================================== */
    if (menuButton && menu) {
        menuButton.addEventListener("click", () => {
            const isActive = menu.classList.toggle("active");
            menuButton.setAttribute("aria-expanded", isActive ? "true" : "false");
        });
        
        // Close menu on link click
        menu.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                menu.classList.remove("active");
                if (menuButton) menuButton.setAttribute("aria-expanded", "false");
            });
        });
    }

    // Active Navigation Highlight
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll("nav ul li a");
    navLinks.forEach(link => {
        const href = link.getAttribute("href");
        if (!href) return;

        if (currentPath === "index.html" || currentPath === "") {
            if (href === "index.html" || href === "#home" || href === "./") {
                link.classList.add("active");
            }
        } else if (href.includes(currentPath)) {
            link.classList.add("active");
        }
    });

    /* ==========================================
       Quick Booking Bar Logic
       ========================================== */
    const quickBookingForm = document.getElementById("quickBookingForm");
    if (quickBookingForm) {
        const qbCheckin = document.getElementById("qbCheckin");
        const qbCheckout = document.getElementById("qbCheckout");
        const qbGuests = document.getElementById("qbGuests");
        const qbRoom = document.getElementById("qbRoom");

        const todayStr = new Date().toISOString().split("T")[0];
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split("T")[0];

        if (qbCheckin) {
            qbCheckin.min = todayStr;
            qbCheckin.value = todayStr;
        }
        if (qbCheckout) {
            qbCheckout.min = tomorrowStr;
            qbCheckout.value = tomorrowStr;
        }

        quickBookingForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const params = new URLSearchParams({
                checkin: qbCheckin.value,
                checkout: qbCheckout.value,
                guests: qbGuests.value,
                roomtype: qbRoom.value
            });
            window.location.href = `booking.html?${params.toString()}`;
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
       FAQ Accordion
       ========================================== */
    const faqQuestions = document.querySelectorAll(".faq-question");
    faqQuestions.forEach(btn => {
        btn.addEventListener("click", () => {
            const item = btn.closest(".faq-item");
            const isOpen = item.classList.contains("active");

            // Close all items
            document.querySelectorAll(".faq-item").forEach(i => {
                i.classList.remove("active");
                const q = i.querySelector(".faq-question");
                if (q) q.setAttribute("aria-expanded", "false");
            });

            // Toggle current
            if (!isOpen) {
                item.classList.add("active");
                btn.setAttribute("aria-expanded", "true");
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
            const dot = document.createElement("span");
            dot.classList.add("dot");
            if (i === 0) dot.classList.add("active");
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
            dots.forEach(d => d.classList.remove("active"));
            dots[index].classList.add("active");
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
       Gallery Filters & Lightbox
       ========================================== */
    const filterBtns = document.querySelectorAll(".gallery-filter-btn");
    const galleryItems = document.querySelectorAll(".gallery-item");

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                filterBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                const category = btn.getAttribute("data-filter");

                galleryItems.forEach(item => {
                    if (category === "all" || item.getAttribute("data-category") === category) {
                        item.style.display = "block";
                    } else {
                        item.style.display = "none";
                    }
                });
            });
        });
    }

    // Lightbox Logic
    const lightbox = document.getElementById("galleryLightbox");
    if (lightbox && galleryItems.length > 0) {
        const lightboxImg = document.getElementById("lightboxImg");
        const lightboxCaption = document.getElementById("lightboxCaption");
        const lightboxClose = document.querySelector(".lightbox-close");
        const lightboxPrev = document.querySelector(".lightbox-prev");
        const lightboxNext = document.querySelector(".lightbox-next");
        let currentImgIndex = 0;

        const visibleItems = () => Array.from(galleryItems).filter(item => item.style.display !== "none");

        const showLightbox = (index) => {
            const items = visibleItems();
            if (index < 0) index = items.length - 1;
            if (index >= items.length) index = 0;
            currentImgIndex = index;

            const targetItem = items[currentImgIndex];
            if (targetItem) {
                const img = targetItem.querySelector("img");
                const captionText = targetItem.querySelector(".gallery-overlay span")?.textContent || img.alt;
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
                lightboxCaption.textContent = captionText;
                lightbox.classList.add("show");
                lightbox.setAttribute("aria-hidden", "false");
                body.style.overflow = "hidden";
            }
        };

        const closeLightbox = () => {
            lightbox.classList.remove("show");
            lightbox.setAttribute("aria-hidden", "true");
            body.style.overflow = "";
        };

        galleryItems.forEach(item => {
            item.addEventListener("click", () => {
                const items = visibleItems();
                const index = items.indexOf(item);
                showLightbox(index);
            });
        });

        if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
        if (lightboxPrev) lightboxPrev.addEventListener("click", () => showLightbox(currentImgIndex - 1));
        if (lightboxNext) lightboxNext.addEventListener("click", () => showLightbox(currentImgIndex + 1));

        lightbox.addEventListener("click", (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener("keydown", (e) => {
            if (lightbox.classList.contains("show")) {
                if (e.key === "Escape") closeLightbox();
                if (e.key === "ArrowLeft") showLightbox(currentImgIndex - 1);
                if (e.key === "ArrowRight") showLightbox(currentImgIndex + 1);
            }
        });
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

    /* Booking Form & Pricing System */
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

        // Summary DOM elements
        const sumRoomName = document.getElementById("sumRoomName");
        const sumRoomRate = document.getElementById("sumRoomRate");
        const sumNights = document.getElementById("sumNights");
        const sumRoomCharges = document.getElementById("sumRoomCharges");
        const sumTaxes = document.getElementById("sumTaxes");
        const sumGrandTotal = document.getElementById("sumGrandTotal");

        // Auto Populate URL Parameters
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get("roomtype") && bInputs.roomtype) {
            const rawRoom = urlParams.get("roomtype");
            const matchedKey = Object.keys(HOTEL_CONFIG.rooms).find(key => key.toLowerCase() === rawRoom.toLowerCase() || rawRoom.toLowerCase().includes(key.toLowerCase()));
            if (matchedKey) bInputs.roomtype.value = matchedKey;
        }
        if (urlParams.get("checkin") && bInputs.checkin) bInputs.checkin.value = urlParams.get("checkin");
        if (urlParams.get("checkout") && bInputs.checkout) bInputs.checkout.value = urlParams.get("checkout");
        if (urlParams.get("guests") && bInputs.guests) bInputs.guests.value = urlParams.get("guests");

        // Default Dates Setup
        const todayStr = new Date().toISOString().split("T")[0];
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split("T")[0];

        if (bInputs.checkin) {
            bInputs.checkin.min = todayStr;
            if (!bInputs.checkin.value) bInputs.checkin.value = todayStr;
        }
        if (bInputs.checkout) {
            bInputs.checkout.min = tomorrowStr;
            if (!bInputs.checkout.value) bInputs.checkout.value = tomorrowStr;
        }
        if (!bInputs.roomtype.value) bInputs.roomtype.value = "Standard Room";

        // Price Breakdown Calculator
        const calculatePricing = () => {
            const roomName = bInputs.roomtype.value || "Standard Room";
            const rate = ROOM_RATES[roomName] || 999;

            let nights = 1;
            if (bInputs.checkin.value && bInputs.checkout.value) {
                const startDate = new Date(bInputs.checkin.value);
                const endDate = new Date(bInputs.checkout.value);
                const timeDiff = endDate.getTime() - startDate.getTime();
                if (timeDiff > 0) {
                    nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
                }
            }

            const roomCharges = rate * nights;
            const taxAmount = Math.round(roomCharges * TAX_RATE);
            const totalAmount = roomCharges + taxAmount;

            if (sumRoomName) sumRoomName.textContent = roomName;
            if (sumRoomRate) sumRoomRate.textContent = `₹${rate.toLocaleString("en-IN")}`;
            if (sumNights) sumNights.textContent = `${nights} ${nights === 1 ? "Night" : "Nights"}`;
            if (sumRoomCharges) sumRoomCharges.textContent = `₹${roomCharges.toLocaleString("en-IN")}`;
            if (sumTaxes) sumTaxes.textContent = `₹${taxAmount.toLocaleString("en-IN")}`;
            if (sumGrandTotal) sumGrandTotal.textContent = `₹${totalAmount.toLocaleString("en-IN")}`;

            return { roomName, rate, nights, roomCharges, taxAmount, totalAmount };
        };

        // Event listeners for recalculation
        ["change", "input"].forEach(evt => {
            if (bInputs.checkin) bInputs.checkin.addEventListener(evt, () => {
                if (bInputs.checkin.value) {
                    const checkinDate = new Date(bInputs.checkin.value);
                    const minOut = new Date(checkinDate);
                    minOut.setDate(minOut.getDate() + 1);
                    bInputs.checkout.min = minOut.toISOString().split("T")[0];
                    if (new Date(bInputs.checkout.value) <= checkinDate) {
                        bInputs.checkout.value = minOut.toISOString().split("T")[0];
                    }
                }
                calculatePricing();
            });
            if (bInputs.checkout) bInputs.checkout.addEventListener(evt, calculatePricing);
            if (bInputs.roomtype) bInputs.roomtype.addEventListener(evt, calculatePricing);
        });

        // Initial Calculation
        calculatePricing();

        const validateBooking = () => {
            let isValid = true;
            if (bInputs.name.value.trim().length < 3) { setFieldError(bInputs.name, "Full name required (min 3 chars)"); isValid = false; } else clearFieldError(bInputs.name);
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bInputs.email.value)) { setFieldError(bInputs.email, "Valid email required"); isValid = false; } else clearFieldError(bInputs.email);
            if (!/^[6-9]\d{9}$/.test(bInputs.phone.value)) { setFieldError(bInputs.phone, "Valid 10-digit phone number required"); isValid = false; } else clearFieldError(bInputs.phone);
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
                return showError("Please wait 30 seconds before submitting another booking.");
            }

            const pricing = calculatePricing();
            const refId = "RLS-" + Math.floor(1000 + Math.random() * 9000);

            try {
                bSubmitBtn.disabled = true;
                bLoader.classList.remove("hidden");
                bSubmitBtn.querySelector("span").textContent = "Submitting...";

                const data = {
                    type: "booking",
                    refId: refId,
                    timestamp: new Date().toLocaleString(),
                    name: bInputs.name.value.trim(),
                    email: bInputs.email.value.trim(),
                    phone: bInputs.phone.value.trim(),
                    checkin: bInputs.checkin.value,
                    checkout: bInputs.checkout.value,
                    nights: pricing.nights,
                    guests: bInputs.guests.value,
                    roomtype: bInputs.roomtype.value,
                    totalAmount: pricing.totalAmount,
                    message: bInputs.message.value.trim()
                };

                const res = await fetch(SCRIPT_URL, { method: "POST", body: JSON.stringify(data) });
                const result = await res.json();

                if (result.status === "success") {
                    // Fill confirmation modal details
                    const confRefId = document.getElementById("confRefId");
                    const confGuestName = document.getElementById("confGuestName");
                    const confRoomType = document.getElementById("confRoomType");
                    const confDates = document.getElementById("confDates");
                    const confNights = document.getElementById("confNights");
                    const confTotalAmount = document.getElementById("confTotalAmount");

                    if (confRefId) confRefId.textContent = refId;
                    if (confGuestName) confGuestName.textContent = bInputs.name.value.trim();
                    if (confRoomType) confRoomType.textContent = bInputs.roomtype.value;
                    if (confDates) confDates.textContent = `${bInputs.checkin.value} to ${bInputs.checkout.value}`;
                    if (confNights) confNights.textContent = `${pricing.nights} ${pricing.nights === 1 ? "Night" : "Nights"}`;
                    if (confTotalAmount) confTotalAmount.textContent = `₹${pricing.totalAmount.toLocaleString("en-IN")}`;

                    bookingForm.reset();
                    calculatePricing();
                    localStorage.setItem("lastSubmitTime", Date.now());
                    showSuccess();
                } else {
                    showError(result.message);
                }
            } catch (err) {
                showError("Connection error or network problem. Please try again.");
            } finally {
                bSubmitBtn.disabled = false;
                bLoader.classList.add("hidden");
                bSubmitBtn.querySelector("span").textContent = "Submit Booking Request";
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
