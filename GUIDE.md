# MakeShift — User Guide & Demo Script

> **Audience:** Non-technical staff, admins, and demo presenters
> **Last updated:** April 2026

---

## Table of Contents

1. [What is MakeShift?](#1-what-is-makeshift)
2. [The Two Sides of MakeShift](#2-the-two-sides-of-makeshift)
3. [Logging In (Admin Access)](#3-logging-in-admin-access)
4. [Dashboard](#4-dashboard)
5. [Spaces Module](#5-spaces-module)
   - [Rooms](#rooms)
   - [Amenities](#amenities)
   - [Layouts](#layouts)
6. [Availability Module](#6-availability-module)
   - [Schedules](#schedules)
   - [Schedule Overrides](#schedule-overrides)
7. [Transactions Module](#7-transactions-module)
   - [Bookings](#bookings)
   - [Booking Status Flow](#booking-status-flow)
   - [Payments](#payments)
   - [Payment Providers](#payment-providers)
8. [Logs Module](#8-logs-module)
   - [Audit Logs](#audit-logs)
   - [Mail Logs](#mail-logs)
9. [People Module](#9-people-module)
10. [Tools Module](#10-tools-module)
11. [Settings](#11-settings)
12. [Public Website](#12-public-website)
13. [Demo Script & Suggested Sequence](#13-demo-script--suggested-sequence)

---

## 1. What is MakeShift?

MakeShift is a **space booking management platform** designed for co-working spaces, event venues, and shared offices. It has two parts that work together:

- A **public website** where customers browse spaces, check availability, and send booking inquiries.
- An **admin panel** where your team manages everything — from setting up rooms and schedules to processing payments and confirming reservations.

---

## 2. The Two Sides of MakeShift

| Side | Who uses it | What they do |
|---|---|---|
| **Public Website** | Customers / Guests | Browse spaces, check availability, submit inquiries, contact the business |
| **Admin Panel** | Staff / Administrators | Manage rooms, handle bookings, record payments, configure the site |

Customers never need an account. Admins have their own secure login.

---

## 3. Logging In (Admin Access)

The admin login page is intentionally kept unlisted to prevent exposure to the general public.

- **URL:** `yoursite.com/auth-access`
- Enter your admin email and password to log in.

> **Security note:** This URL is not linked anywhere on the public website. Only share it with authorized staff.

---

## 4. Dashboard

The dashboard is the first thing you see after logging in. It gives you a quick overview of what's happening today.

### Widgets

- **Today's Bookings** — Shows all bookings (Pending and Confirmed) scheduled for today, so front desk staff know who to expect.
- **Recent Bookings** — The 5 most recently created bookings at a glance.
- **Last Active Users** — The 5 admin accounts that logged in most recently.

### Booking Verification (Check-In Tool)

When a customer arrives at your space, you can verify their booking directly from the dashboard:

1. Ask the customer for their **voucher code** or have them show the **QR code** from their confirmation email.
2. On the dashboard, enter the code manually or scan the QR code.
3. MakeShift will instantly show you their full booking details (name, room, date, time) so you can confirm they have a valid, confirmed reservation.

> This is the primary tool for **front desk staff** to use on the day of the booking.

---

## 5. Spaces Module

This is where you set up and manage the physical spaces available for booking.

### Rooms

Rooms are the core of MakeShift. Each room represents a bookable space (a meeting room, event hall, hot desk area, etc.).

**When creating or editing a room, you can configure:**

| Field | What it means |
|---|---|
| **Name** | The display name shown to customers |
| **Description** | A detailed description of the space |
| **Price per Hour** | Hourly rate charged for this room |
| **Size (sqm)** | Floor area of the space |
| **Qty (Quantity)** | Total number of units available. For a room, this is usually 1. For a hot desk area, this would be the total number of seats. |
| **Cap (Capacity per unit)** | How many people fit per unit. For private rooms, this is the room capacity. For shared desks, each desk = 1 seat, so capacity is typically 1. |
| **Active** | Toggle this ON to make the room appear on the public website. Toggle OFF to hide it without deleting it. |
| **Private** | When ON, this is treated as a non-shared space (a full room booking). When OFF, individual seats/desks can be booked by different customers at the same time. |
| **Schedule** | Assign an availability schedule to control when this room can be booked. |
| **Amenities** | Select which amenities are available in this room (e.g., WiFi, Projector, Whiteboard). |
| **Layouts** | Select which layout configurations customers can choose from (e.g., Classroom, Boardroom, U-Shape). |
| **Images / Gallery** | Upload photos of the room to display on the public website. |

> **Tip:** A room will not appear as bookable unless it has an active schedule assigned to it.

---

### Amenities

Amenities are the features or equipment available in your spaces (e.g., "WiFi," "Air Conditioning," "Projector," "Whiteboard").

- Go to **Spaces → Amenities** to add, edit, or remove amenities.
- Each amenity has a **name** and an **icon**.
- Once created, amenities can be selected when setting up or editing a room.
- Customers see the amenity list on the space detail page.

---

### Layouts

Layouts define the seating or setup arrangements available in a room (e.g., "Classroom," "Boardroom," "U-Shape," "Theater").

- Go to **Spaces → Layouts** to manage layout options.
- Once created, layouts can be assigned to rooms.
- During booking, customers can select their preferred layout from the options assigned to the room.

---

## 6. Availability Module

This module controls **when** your rooms are open for booking.

### Schedules

A schedule is a **weekly template** that defines your regular operating hours. You create one schedule and assign it to one or more rooms.

**Each schedule includes:**

| Setting | What it means |
|---|---|
| **Name** | A label for this schedule (e.g., "Standard Weekday Hours," "Weekend Hours") |
| **Daily Hours** | For each day of the week (Mon–Sun), set the opening and closing time. Leave a day blank to mark it as closed. |
| **Max Days** | How many days in advance a customer is allowed to book. Example: setting 30 means customers can book up to 30 days from today. |
| **Max Date** | A hard cutoff date. No bookings will be accepted beyond this date, regardless of Max Days. Useful for seasonal closures or planning periods. |

> **How it works:** When a customer selects a date on the public website, MakeShift checks the room's assigned schedule to determine if it's open and what time slots are available.

---

### Schedule Overrides

Overrides let you **change availability for a specific date**, without modifying your regular schedule. Think of them as exceptions to your normal hours.

**Common use cases:**
- **Closing for a holiday** — Override a normally-open date to mark rooms as closed.
- **Scheduled maintenance** — Block off a room or multiple rooms for a specific day.
- **Special opening** — Open on a day that your regular schedule marks as closed (e.g., a special Sunday event).
- **Sudden changes** — Quickly close rooms for unexpected situations.

**How overrides work:**
- An override targets a **specific date**.
- You can apply one override to **multiple rooms at once**.
- You choose whether the override marks the rooms as **Open** (with custom hours) or **Closed**.
- **Overrides always take priority over the regular schedule.** If a room has an override on a given date, the override wins — no exceptions.

> **Example:** Your schedule says Monday–Friday, 8am–6pm. You create a "Closed" override for December 25. Even though that's a Tuesday, all affected rooms will show as unavailable on that day.

---

## 7. Transactions Module

This module is where all booking and payment activity is managed.

### Bookings

Bookings can be created in two ways:
1. A **customer submits an inquiry** through the public website.
2. An **admin manually creates a booking** from the admin panel.

The bookings list supports two views — toggle between them using the **"View in Calendar / Table format"** button:

- **Table view** — paginated list with full detail columns.
- **Calendar view** — month calendar showing all bookings colour-coded by status. Click any event to open the booking.

Both views share the same **filter panel** (the sliders icon). You can filter by status, date range, room, and layout. Filters are cleared automatically when you switch between views.

**When viewing or creating a booking, key fields include:**

| Field | What it means |
|---|---|
| **Room** | Which space is being booked |
| **Date** | The booking date |
| **Time Start / End** | The time range for the booking |
| **Layout** | The selected room setup (if applicable) |
| **Notes** | Any special requests from the customer |
| **Status** | Current state of the booking (see flow below) |
| **Expires At** | Deadline for the customer to complete payment before the booking is auto-cancelled |
| **Voucher Code** | Auto-generated when a booking is Confirmed; used for check-in |

---

### Booking Status Flow

Every booking moves through these statuses in order:

```
INQUIRY → PENDING → CONFIRMED
                ↘
              CANCELED
```

#### 1. Inquiry
- The booking has been received but **nothing is reserved yet**.
- The customer receives an automated email acknowledging their inquiry.
- Other customers can still book the same slot at this stage.
- The admin reviews the inquiry and decides whether to proceed.

#### 2. Pending
- The admin has reviewed and **tentatively reserved the slot**.
- The time slot is now blocked — other customers cannot book it.
- The admin sends the customer a **payment request email** (with payment instructions, bank details, and a deadline).
- The admin sets an **Expires At** deadline. If the customer does not pay by then, the booking is automatically moved to Canceled.
- Payments can now be recorded against this booking.
- The booking can still be canceled by the admin if needed.

#### 3. Confirmed
- **Payment has been received** and the admin has marked the booking as confirmed.
- A **voucher code and QR code** are automatically generated and emailed to the customer.
- The booking is now **locked** — it cannot be edited or canceled.
- The customer presents the QR code at arrival for check-in.

#### 4. Canceled
- The booking has been canceled, either manually by the admin or automatically due to payment expiry.
- A cancellation email is sent to the customer with a reason.
- A canceled booking can be revived back to Inquiry status if needed.

> **Payment threshold:** The system checks that the total recorded payments equal or exceed the booking's total price before allowing you to move it to Confirmed.

---

### Payments

The Payments section is a record of all payment transactions linked to bookings.

- An admin can **record a payment** from either the Payments page or directly from a Booking's detail page.
- A single booking can have **multiple partial payments** (e.g., a deposit followed by a balance payment).
- Each payment record includes:
  - Which booking it's for
  - Payment provider (e.g., GCash, Bank Transfer, Cash)
  - Reference number (e.g., GCash transaction ID or bank reference)
  - PR/PO number (for internal tracking)
  - Amount billed and amount paid
  - Date paid
  - File attachment (e.g., screenshot of transfer proof)
  - Status (Pending, Paid, Failed, Expired, Canceled, Refunded)
  - Notes

The system automatically totals all **Paid** payments for a booking to check if the full amount has been settled.

---

### Payment Providers

Payment Providers are the payment methods your business accepts (e.g., "GCash," "BDO Bank Transfer," "Cash").

- Go to **Transactions → Payment Providers** to add or manage them.
- Each provider can be set as **Active** (available for use) or **Default** (pre-selected when recording a payment).
- All payment methods in MakeShift are **manual** — staff record them after the customer transfers money offline. There is no automated online payment gateway.

---

## 8. Logs Module

### Audit Logs

The audit log tracks every create, update, and delete action made within the admin panel.

- **Who** did it, **what** they changed, and **when**.
- Useful for accountability and troubleshooting.
- Can be filtered by action type, model (e.g., Booking, Room, User), admin user, and date range.

### Mail Logs

A record of every email sent by MakeShift (both automated and manually triggered).

- Shows the recipient, subject, and date sent.
- Useful for confirming that emails were sent to customers.
- Can be filtered by date range and subject keyword.

---

## 9. People Module

### Users

The Users page manages **admin accounts** — the people who have access to the admin panel.

- Create new admin accounts by providing a name, email, and password.
- Edit an existing user's name, email, or password.
- View each user's **last login time**.
- Delete users who no longer need access.

> Customers do **not** have accounts — they interact only through the public website without logging in.

---

## 10. Tools Module

### Database Backups

MakeShift can automatically back up your database on a schedule and let you download those backups.

- Go to **Tools → Database** to see a list of all available backups.
- Click **Download** on any backup to save a copy to your computer.
- Click **Generate Backup** to create a new backup immediately.
- Backup frequency and how many backups to keep are configured in **Settings → Database**.

---

## 11. Settings

Settings let you customize the look, content, and behavior of MakeShift without touching any code.

### Profile & Password
Update your own admin name, email address, or password.

### Appearance (Admin UI)
Change the theme of the admin panel interface.

### Portal Appearance (Website Branding)
Configure your public-facing website:
- Upload your **logo** (PNG, max 2MB) and **favicon** (max 512KB)
- Set your site's short description (max 30 characters — shown in browser tabs and previews)
- Contact details: email, phone number, office address
- Google Maps embed link for the map shown on the Contact Us and Home pages

### Website Content (Homepage)
Edit what appears on the public homepage:
- **Featured Space** — select which room to highlight prominently
- **Who We Are** section — your company introduction text
- **YouTube Video** — embed a video tour or promo video
- **Map Section** — label and link for the location map
- **Room Slider** — choose which rooms appear in the homepage spaces carousel

### Legal Documents
Edit your **Terms of Service**, **Privacy Policy**, and **House Rules** using a rich text editor. These are shown to customers when they submit a booking inquiry and must be agreed to before proceeding.

### Email Templates
Customize what the automated emails say to customers. Each of the four customer emails has editable sections:

| Email | Editable Sections |
|---|---|
| **Inquiry Received** | "What Happens Next" message |
| **Payment Required (Acknowledged)** | Payment steps, screenshot requirement text, deadline warning |
| **Booking Confirmed** | Arrival instructions, additional information |
| **Booking Canceled** | Cancellation explanation, what it means, next steps, alternative options |

You can also update:
- **Bank account details** shown in payment emails
- **Support link** (shown as a button in all emails)
- **Footer text** (two lines shown at the bottom of all emails)

### Mailing Configuration
Configure system-level email delivery settings.

- **BCC** — Enter one or more email addresses (comma-separated) to be silently copied on every outgoing email sent by MakeShift. Useful for keeping an internal record of all customer communications.
  - Example: `admin@yourbusiness.com, records@yourbusiness.com`
  - Leave blank to disable BCC.

### Database Settings
Configure how often automatic backups run and how many backups to keep on file.

---

## 12. Public Website

The public website is what your customers see. No login required.

### Home Page (`/`)
- **Hero/Banner** — main header image
- **Featured Space** — highlighted room with photo, description, and a link to view it
- **Who We Are** — your business introduction
- **Video Tour** — embedded YouTube video (if configured)
- **Spaces Slider** — horizontal scroll of selected available rooms
- **Location Map** — embedded Google Map

### Spaces Page (`/spaces`)
- Lists all active rooms.
- Customers can filter by a specific date to see only rooms that are open and have availability on that day.
- Each room card shows the name, a photo, price per hour, capacity, and a link to view details.

### Space Detail Page (`/spaces/{room-name}`)
- Full details: description, size, capacity, price per hour
- Photo gallery
- Amenities list
- Available layout options
- Available time slots for a selected date
- **"Book This Space"** or **"Inquire"** button to start the booking process

### Reservation / Inquiry Form
- Customer selects their preferred date, start time, end time, and layout.
- Customer enters their name, email, and any special notes.
- Customer reviews and agrees to the legal documents (Terms of Service, House Rules, Privacy Policy).
- Customer can optionally tick **"Subscribe to our newsletter"** to opt in to marketing emails.
- On submission, MakeShift creates an Inquiry booking and sends a confirmation email to the customer.

### Contact Us Page (`/contact-us`)
- Business contact details (email, phone, address)
- Google Map
- **Resend My Bookings** — customers can enter their email address to receive all their confirmed booking vouchers resent to their inbox.

---

## 13. Demo Script & Suggested Sequence

Use this sequence to walk a customer through MakeShift from end to end. Each section includes what to show and talking points.

---

### Part 1 — The Public Experience (Customer's Perspective)

> *Start here to show what a customer sees before they ever contact you.*

**Step 1: Home Page**
- Open the public website home page.
- Point out the featured space, who we are section, and the spaces slider.
- Highlight that the site is branded with the business logo, colors, and contact info — all configurable.

**Step 2: Browse Spaces**
- Navigate to the Spaces page.
- Select today's date or a future date to filter available spaces.
- Show how unavailable rooms (closed by schedule or override) are automatically hidden.
- Click into a room to show the detail page.

**Step 3: Space Detail**
- Walk through the room's gallery, amenities, layouts, and pricing.
- Select a date and watch the available time slots populate.
- Point out that the system is checking availability in real time (existing bookings are accounted for).

**Step 4: Submit an Inquiry**
- Click the booking/inquiry button.
- Fill in sample customer details (name, email, note).
- Show the legal document agreement step (Terms, Privacy Policy, House Rules — all editable by the admin).
- Submit the form.
- Show the success page the customer sees.
- Mention: *"The customer receives an email immediately confirming we got their inquiry."*

---

### Part 2 — Admin Panel (Staff Perspective)

> *Now switch to the admin view. Log in at `/auth-access`.*

**Step 5: Dashboard**
- Show the dashboard overview: today's bookings, recent activity.
- Point out the **Booking Verification** widget.
- Explain: *"Front desk staff use this when a customer arrives — they scan or type the voucher code and instantly see if the booking is valid."*

**Step 6: Finding the New Inquiry**
- Navigate to **Transactions → Bookings**.
- Find the inquiry submitted in Step 4 (status: Inquiry).
- Open the booking detail page.
- Show all the booking info: room, date, time, layout, customer name and email, notes, total price.

**Step 7: Moving to Pending (Reserving the Slot)**
- From the booking detail, change the status to **Pending**.
- Set an **Expires At** date — the deadline for the customer to pay.
- Trigger the **Send Acknowledged Email** action.
- Explain: *"This sends the customer an email with payment instructions, your bank details, and their payment deadline. If they don't pay in time, the system automatically cancels it."*

**Step 8: Recording a Payment**
- Navigate to **Transactions → Payments** (or use the payment section on the booking detail).
- Create a new payment: select the booking, choose a payment provider (e.g., GCash), enter a reference number, amount, and date paid. Optionally attach a screenshot.
- Return to the booking and show that the total paid is now updated.

**Step 9: Confirming the Booking**
- With payment received, change the booking status to **Confirmed**.
- Show what happens automatically:
  - A unique voucher code is generated (format: `XXXX-XXXX-XXXX-XXXX`).
  - A QR code image is created from that code.
  - A confirmation email is sent to the customer with the voucher code and QR code.
- Mention: *"The customer uses this QR code to check in when they arrive."*

**Step 10: Check-In Simulation**
- Return to the Dashboard.
- Enter the voucher code from the confirmed booking into the Booking Verification tool.
- Show the booking details that appear — this is exactly what front desk staff see on the day.

---

### Part 3 — Setting Up Spaces

> *Show how to add and configure a room.*

**Step 11: Create an Amenity and Layout (if not already set up)**
- Go to **Spaces → Amenities** → create a sample amenity (e.g., "Projector").
- Go to **Spaces → Layouts** → create a sample layout (e.g., "Boardroom").

**Step 12: Create a Schedule**
- Go to **Availability → Schedules** → create a new schedule.
- Set weekday hours (e.g., Mon–Fri 8am–6pm, Sat 9am–3pm, Sun closed).
- Set Max Days to 30.
- Explain: *"This is the template that controls when this room is open for booking."*

**Step 13: Create a Room**
- Go to **Spaces → Rooms** → create a new room.
- Fill in: name, description, price per hour, quantity, capacity.
- Assign the schedule created in Step 12.
- Assign the amenity and layout from Step 11.
- Upload a sample image.
- Toggle **Active** ON.
- Explain: *"As soon as this is saved, the room appears on the public website and accepts bookings based on the schedule we assigned."*

**Step 14: Schedule Override**
- Go to **Availability → Overrides** → create a new override.
- Select tomorrow's date, set it to Closed, and assign it to the room just created.
- Go back to the public website, navigate to that room, and select tomorrow's date.
- Show that no time slots are available — the override worked.
- Explain: *"This is how you handle holidays, maintenance, or sudden closures without changing your regular schedule."*

---

### Part 4 — Configuration & Settings

> *Show the customization options.*

**Step 15: Website Settings**
- Go to **Settings → Portal Appearance** — show where to upload a logo and favicon, set contact info.
- Go to **Settings → Website Content** — show the homepage configuration options.
- Go to **Settings → Legal Documents** — show where Terms, Privacy Policy, and House Rules are edited.

**Step 16: Email Templates**
- Go to **Settings → Email Templates**.
- Show that all the text in the four customer emails can be customized.
- Mention bank account details and support link fields.
- Explain: *"You don't need a developer to update what the emails say — everything is editable here."*

**Step 17: Database Backups**
- Go to **Tools → Database**.
- Show the list of existing backups.
- Trigger a manual backup and show it appearing in the list.
- Go to **Settings → Database** and show the frequency and retention settings.

---

### Part 5 — Monitoring & Accountability

**Step 18: Audit Logs**
- Go to **Logs → Audit Logs**.
- Filter by today and show the actions taken during this demo (bookings created, status changes, etc.).
- Explain: *"Every action in the system is logged — who did it and when."*

**Step 19: Mail Logs**
- Go to **Logs → Mail Logs**.
- Show the emails sent to the demo customer during this walkthrough.
- Explain: *"You can always verify here whether an email was actually sent to a customer."*

---

### Summary of Key Selling Points

| Feature | Value |
|---|---|
| Hidden admin login | Security — not exposed to the public |
| Real-time availability | Customers only see genuinely available slots |
| Automated emails | No manual sending required for inquiry, payment request, and confirmation steps |
| QR code check-in | Fast, reliable on-site verification |
| Schedule + Override system | Flexible — handles regular hours and exceptions separately |
| Configurable email content | No developer needed to update messaging |
| Audit trail | Full accountability for all admin actions |
| Auto database backup | Data protection with minimal effort |
| Payment tracking | Multiple partial payments supported with proof of payment attachments |

---

*End of Guide*
