# BillSplit 💸

**BillSplit** is a fintech platform that simplifies group expense collection and payment management in Nigeria. It enables users to create shared bills, generate payment links, collect contributions through card payments and bank transfers, and track payments in real time.

Built on top of **Nomba's payment infrastructure**, BillSplit is designed to solve everyday Nigerian payment challenges such as birthday contributions, departmental dues, rent sharing, event contributions, and group savings.

---

## Problem Statement

Collecting money from groups is often stressful and disorganized:

* Sending money to personal bank accounts
* Requesting payment screenshots
* Manually tracking who has paid
* Difficulty reconciling payments
* Lack of transparency for contributors

BillSplit provides a centralized platform that automates payment collection and contribution tracking.

---
## Login Credentials
email:davcodes24@gmail.com
password:T2345@24

## Solution

BillSplit allows users to:

* Create a shared bill or contribution campaign
* Generate shareable payment links
* Accept payments via card or bank transfer
* Monitor payment progress in real time
* Automatically update contribution statuses
* Reconcile payment records for accuracy and transparency

---

## Real-World Use Cases

### 🎂 Birthday Contributions

Create a contribution campaign and allow friends to pay online.

### 🎓 Departmental Dues

Collect dues from students and track contributions automatically.

### 🏠 Rent Sharing

Split rent among roommates and monitor who has paid.

### 🎉 Event Contributions

Manage payments for parties, weddings, and social gatherings.

### ✈️ Group Trips

Organize vacation contributions and monitor payment progress.

---

# System Architecture

```text
Creator
↓
Creates Bill
↓
BillSplit Backend
↓
Share Payment Link
↓
Participants Open Link
↓
Choose Payment Method
├── Card Payment
│      ↓
│   Nomba Checkout
│      ↓
│   Webhook
│
└── Bank Transfer
       ↓
   Dedicated Virtual Account
       ↓
       Webhook
↓
Database Updated
↓
Dashboard Updated
↓
Analytics & Reports
```

---

# Nomba Integration

## 1. OAuth Authentication

BillSplit securely communicates with Nomba APIs using OAuth 2.0 Client Credentials.

Flow:

```text
clientId + clientSecret
↓
Generate Access Token
↓
Bearer Token
↓
Call Nomba APIs
```

All secrets are securely stored in environment variables and never exposed to the frontend.

---

## 2. Checkout API

Enables contributors to pay using cards.

Flow:

```text
Participant
↓
Clicks Pay
↓
Create Checkout Session
↓
Receive checkoutUrl
↓
Redirect to Nomba Checkout
↓
Payment Successful
```

---

## 3. Virtual Accounts

Allows contributors to pay via bank transfer using dedicated NUBAN accounts.

Flow:

```text
Generate Virtual Account
↓
Participant Transfers Money
↓
Nomba Detects Transfer
↓
Webhook Triggered
↓
Contribution Updated
```

This feature caters to Nigerian users who prefer bank transfers over card payments.

---

## 4. Webhooks

Webhooks notify BillSplit whenever payment events occur.

Flow:

```text
Payment Successful
↓
Nomba Sends Webhook
↓
Verify Signature
↓
Update Database
↓
Update Dashboard
```

Webhooks power real-time contribution tracking.

---

## 5. Webhook Security

Every webhook request is signed using HMAC-SHA256.

Flow:

```text
Webhook Arrives
↓
Verify Signature
↓
Valid?
↓
Process Event
```

This prevents malicious actors from sending fake payment notifications.

---

## 6. Idempotency

BillSplit ensures that duplicate webhook requests do not create duplicate payment records.

Flow:

```text
Receive requestId
↓
Already Processed?
↓
Yes
↓
Ignore Request
```

This guarantees payment accuracy and prevents double counting.

---

## 7. Kobo Conversion

All monetary values sent to Nomba are converted from Naira to Kobo.

```text
₦5,000
↓
500,000 Kobo
```

Formula:

```text
Amount in Kobo = Amount in Naira × 100
```

---

## 8. Overpayment Handling

Example:

```text
Expected: ₦5,000
Received: ₦6,000
```

BillSplit records:

* Contribution completed
* Excess amount detected
* Option to issue refund or store credit

---

## 9. Underpayment Handling

Example:

```text
Expected: ₦5,000
Received: ₦3,000
```

BillSplit records:

* Partially paid status
* Outstanding balance
* Remaining amount due

---

## 10. Reconciliation

To ensure financial accuracy, BillSplit regularly compares local transaction records with Nomba's records.

Flow:

```text
Nightly Reconciliation Job
↓
Fetch Transactions
↓
Compare Records
↓
Identify Differences
↓
Repair Inconsistencies
```

Reconciliation prevents silent payment discrepancies.

---

## 11. Structured Logging

Every payment operation is logged with a unique reference.

Example:

```json
{
  "merchantTxRef": "BILL-123",
  "payer": "David",
  "amount": 500000,
  "status": "SUCCESS"
}
```

Structured logs simplify monitoring and debugging.

---

## 12. Health Check Endpoint

BillSplit exposes a health endpoint that provides system status information.

Example Response:

```json
{
  "status": "healthy",
  "database": "connected",
  "nomba": "reachable"
}
```

This allows judges and administrators to quickly verify system availability.

---

# Optional Advanced Features

## Transfers API

Distribute collected funds to organizers.

Flow:

```text
Contributions Collected
↓
Verify Recipient
↓
Initiate Transfer
↓
Funds Sent
```

---

## Mandates API

Support recurring contributions and subscriptions.

Flow:

```text
Create Mandate
↓
Customer Approval
↓
Automatic Debits
↓
Contribution Updated
```

---

# Core Features

* User Authentication
* Bill Creation and Management
* Shareable Payment Links
* Card Payments via Nomba Checkout
* Bank Transfers via Virtual Accounts
* Real-Time Contribution Tracking
* Payment Status Dashboard
* Reconciliation System
* Structured Logging
* Health Monitoring
* Overpayment and Underpayment Handling

---

# Tech Stack

### Frontend

* Next.js
* TypeScript
* Tailwind CSS

### Backend

* Next.js API Routes
* Supabase

### Payment Infrastructure

* Nomba Checkout API
* Nomba Virtual Accounts API
* Nomba Webhooks
* OAuth 2.0 Authentication

---

# Project Vision

BillSplit is more than a bill-splitting application. It is a payment orchestration platform that enables individuals, communities, and organizations to collect, manage, and monitor shared expenses using production-grade payment infrastructure built on top of Nomba's APIs.

---

# One-Line Architecture

```text
Create Bill → Share Link → Pay via Card or Transfer → Nomba Processes Payment → Webhook Updates Database → Dashboard Updates in Real Time → Reconcile Records → Analytics and Reporting
```
