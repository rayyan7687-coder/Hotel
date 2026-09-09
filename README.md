# Redundant and Unnecessary Code Snippets

The following code blocks were removed from the main `script.js` file to improve performance and maintainability.

## 1. Redundant Booking Form Validation (Partial Duplication)

This block contained a duplicate set of validation functions for the booking form that were already defined or better handled in the main booking logic block.

```javascript
/* Lines 303-541 in original script.js */
    const bookingForm = document.getElementById("bookingForm");

    if (bookingForm) {

        const name = document.getElementById("name");
        const email = document.getElementById("email");
        const phone = document.getElementById("phone");
        const guests = document.getElementById("guests");
        const checkin = document.getElementById("checkin");
        const checkout = document.getElementById("checkout");
        const roomtype = document.getElementById("roomtype");
        const message = document.getElementById("message");

        const submitBtn = document.getElementById("submitBtn");
        const loader = document.getElementById("loader");

        // ... (validation functions: showError, clearError, validateName, validateEmail, validatePhone, validateGuests, validateRoom, validateDates) ...

        function validateForm() {
            return (
                validateName() &&
                validateEmail() &&
                validatePhone() &&
                validateGuests() &&
                validateRoom() &&
                validateDates()
            );
        }
    }
```

## 2. Duplicate Internal Booking Form Variables (Redundant within the same block)

The booking form logic had several internal duplications of variable declarations and event listener setups within the same `if (bookingForm)` block.

## 3. Disjointed Contact Form Logic

The original contact form logic was nested and used incorrect element IDs, preventing it from functioning correctly on the contact page.
