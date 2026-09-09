/************************************************
 * Rayyan's Luxury Stay  Deploment ID:https://script.google.com/macros/s/AKfycbwWa4vcCYBih7qwV3H6BbaOD4_lPi_swXLFzWzAzHeug_PtH_BwoQ0WcYFx3endIOlq/exec
 * Google Apps Script Backend Deploment url: https://script.google.com/macros/s/AKfycbwWa4vcCYBih7qwV3H6BbaOD4_lPi_swXLFzWzAzHeug_PtH_BwoQ0WcYFx3endIOlq/exec
 ************************************************/

const HOTEL_EMAIL = "YOUR_HOTEL_EMAIL@gmail.com";

const BOOKING_SHEET = "Bookings";

const CONTACT_SHEET = "Contact";

/************************************************
 * POST
 ************************************************/

function doPost(e) {

  try {

    const data = JSON.parse(e.postData.contents);

    if (data.type === "contact") {

      saveContact(data);

      sendContactNotification(data);

      return jsonResponse("success", "Message sent.");

    }

    saveBooking(data);

    sendCustomerConfirmation(data);

    sendHotelNotification(data);

    return jsonResponse("success", "Booking received.");

  }

  catch (err) {

    return jsonResponse("error", err.toString());

  }

}

/************************************************
 * JSON Response
 ************************************************/

function jsonResponse(status, message) {

  return ContentService

    .createTextOutput(

      JSON.stringify({

        status: status,

        message: message

      })

    )

    .setMimeType(ContentService.MimeType.JSON);

}

/************************************************
 * Save Booking
 ************************************************/

function saveBooking(data) {

  const sheet = SpreadsheetApp

    .getActiveSpreadsheet()

    .getSheetByName(BOOKING_SHEET);

  sheet.appendRow([

    new Date(),

    data.name,

    data.email,

    data.phone,

    data.checkin,

    data.checkout,

    data.guests,

    data.roomtype,

    data.message

  ]);

}

/************************************************
 * Save Contact
 ************************************************/

function saveContact(data) {

  const sheet = SpreadsheetApp

    .getActiveSpreadsheet()

    .getSheetByName(CONTACT_SHEET);

  sheet.appendRow([

    new Date(),

    data.name,

    data.email,

    data.subject,

    data.message

  ]);

}

/************************************************
 * Customer Confirmation
 ************************************************/

function sendCustomerConfirmation(data) {

  const subject =

    "Booking Confirmation - Rayyan's Luxury Stay";

  const html = `

<h2>Thank You, ${data.name}!</h2>

<p>

Your booking request has been received.

</p>

<table border="1" cellpadding="8">

<tr>

<td>Check-in</td>

<td>${data.checkin}</td>

</tr>

<tr>

<td>Check-out</td>

<td>${data.checkout}</td>

</tr>

<tr>

<td>Guests</td>

<td>${data.guests}</td>

</tr>

<tr>

<td>Room</td>

<td>${data.roomtype}</td>

</tr>

</table>

<br>

<p>

We'll contact you shortly to confirm your reservation.

</p>

<br>

<h3>

Rayyan's Luxury Stay

</h3>

`;

  GmailApp.sendEmail(

    data.email,

    subject,

    "HTML Email",

    {

      htmlBody: html

    }

  );

}

/************************************************
 * Hotel Notification
 ************************************************/

function sendHotelNotification(data) {

  const subject =

    "New Booking Received";

  const html = `

<h2>New Booking</h2>

<table border="1" cellpadding="8">

<tr><td>Name</td><td>${data.name}</td></tr>

<tr><td>Email</td><td>${data.email}</td></tr>

<tr><td>Phone</td><td>${data.phone}</td></tr>

<tr><td>Guests</td><td>${data.guests}</td></tr>

<tr><td>Room</td><td>${data.roomtype}</td></tr>

<tr><td>Check-in</td><td>${data.checkin}</td></tr>

<tr><td>Check-out</td><td>${data.checkout}</td></tr>

<tr><td>Message</td><td>${data.message}</td></tr>

</table>

`;

  GmailApp.sendEmail(

    HOTEL_EMAIL,

    subject,

    "HTML Email",

    {

      htmlBody: html

    }

  );

}

/************************************************
 * Contact Notification
 ************************************************/

function sendContactNotification(data) {

  const subject =

    "New Contact Form Submission";

  const html = `

<h2>New Contact Message</h2>

<table border="1" cellpadding="8">

<tr><td>Name</td><td>${data.name}</td></tr>

<tr><td>Email</td><td>${data.email}</td></tr>

<tr><td>Subject</td><td>${data.subject}</td></tr>

<tr><td>Message</td><td>${data.message}</td></tr>

</table>

`;

  GmailApp.sendEmail(

    HOTEL_EMAIL,

    subject,

    "HTML Email",

    {

      htmlBody: html

    }

  );

}

/************************************************
 * GET
 ************************************************/

function doGet() {

  return ContentService

    .createTextOutput(

      "Rayyan's Luxury Stay API Running"

    );

}