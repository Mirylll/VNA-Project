# VNA Project — User Guide

This guide explains how to use the Occupational Safety and Health (OSH) Management System from an end-user perspective. It covers both the Admin Portal (for government agency staff) and the Enterprise Portal (for company representatives).

---

## Table of Contents

- [Introduction](#introduction)
- [Accessing the Application](#accessing-the-application)
- [Default Accounts](#default-accounts)
- [Admin Portal Guide](#admin-portal-guide)
  - [User Management](#user-management)
  - [Role Management](#role-management)
  - [Permission Management](#permission-management)
  - [Enterprise Management](#enterprise-management)
  - [Enterprise Types](#enterprise-types)
  - [Industries](#industries)
  - [TNLĐ Contract Reports](#tnld-contract-reports)
  - [Account Settings](#account-settings)
- [Enterprise Portal Guide](#enterprise-portal-guide)
  - [Company Profile](#company-profile)
  - [Account Settings](#account-settings-1)
  - [TNLĐ Contract Reporting](#tnld-contract-reporting)
- [Business Workflows](#business-workflows)
  - [Enterprise Account Creation](#enterprise-account-creation)
  - [Contract Submission and Approval](#contract-submission-and-approval)
- [OTP and Email Verification](#otp-and-email-verification)
- [CSV Import](#csv-import)
- [Password Management](#password-management)

---

## Introduction

The OSH Management System is a web-based platform that manages occupational accident insurance contracts. It serves two types of users:

- **Government agency staff (Admin Portal)** — manage enterprises, users, roles, permissions, and review/submit contract reports.
- **Enterprise representatives (Enterprise Portal)** — manage company profiles, submit OSH contract reports, and track their approval status.

The system supports a complete workflow: enterprise registration, contract declaration by enterprises, and review/approval by government authorities.

---

## Accessing the Application

Open your web browser and navigate to the application URL provided by your system administrator.

The login page displays two input fields:

| Field | Description |
|-------|-------------|
| Username | Your assigned username |
| Password | Your assigned password |

Enter your credentials and click the login button. The system will redirect you to either the Admin Portal or the Enterprise Portal depending on your account type.

If you do not have an account, contact your system administrator to create one.

---

## Default Accounts

The following accounts are available after a fresh database seed:

| Username | Password | Role | Portal |
|----------|----------|------|--------|
| admin | admin123 | Super Administrator | Admin |
| 910000888295 | 12345678 | Enterprise | Enterprise |
| 910000888296 | 12345678 | Enterprise | Enterprise |
| 910000888297 | 12345678 | Enterprise | Enterprise |

Enterprise accounts use the company tax code as the username. Additional sample enterprise accounts exist with tax codes in the 9100008882XX range, all using the password `12345678`.

---

## Admin Portal Guide

The Admin Portal displays a sidebar menu on the left with the following functional sections.

### User Management

This section allows you to manage all system users.

**Viewing the user list:**
- The user list displays all users in a table with columns: username, full name, email, role, title, status, and actions.
- Use the search bar to filter by username, full name, or email address.
- Click column headers to sort the list.

**Creating a new user:**
1. Click the "Add User" button above the table.
2. Fill in the required fields: username, full name, email, title, role, and password.
3. Optionally upload an avatar image (JPEG or PNG, maximum 5 MB).
4. Set the user's gender and date of birth.
5. Set the user's active status using the toggle switch.
6. Click "Save" to create the account.

**Editing a user:**
1. Click the edit icon next to the user in the table.
2. Update the desired fields. The username cannot be changed after creation.
3. Click "Save" to apply changes.

**Resetting a user's password:**
1. Click the reset password icon next to the user.
2. Enter the new password (minimum 8 characters, must include uppercase, lowercase, and a digit).
3. Confirm by clicking "Save".

**Deleting a user:**
1. Click the delete icon next to the user.
2. Confirm the deletion in the dialog that appears.
3. The user is soft-deleted (their account is deactivated but not permanently removed from the database).

### Role Management

Roles define a set of permissions that control what users can do in the system.

**Viewing roles:**
- The role list displays all roles with their name and code.

**Creating a role:**
1. Click the "Add Role" button.
2. Enter a name and a unique code for the role.
3. Click "Save".

**Assigning permissions to a role:**
1. Click on a role in the list.
2. The permission tree displays all available permissions organized by group.
3. Check the boxes next to the permissions you want to assign.
4. Expanding a group reveals individual permissions (View, Create, Update, Delete, etc.).
5. Click "Save" to update the role's permissions.

**Deleting a role:**
- Roles that have users assigned to them cannot be deleted. Remove all users from the role first.

### Permission Management

Permissions define granular access to system features. They are organized in a hierarchical tree structure:

- **Groups** (e.g., User Group, Role Group, Enterprise Management Group) — top-level categories.
- **Components** (e.g., View User, Create User, Delete Enterprise) — individual actions.

To view the permission tree, navigate to the Permissions section. The tree displays all groups and their child permissions. This section is read-only for viewing purposes; permission assignments are done through roles.

### Enterprise Management

This section manages all registered enterprises.

**Viewing enterprises:**
- The enterprise list displays company names, tax codes, types, status, and contact information.
- Use the search bar to filter by company name or tax code.

**Creating an enterprise:**
1. Click the "Add Enterprise" button.
2. The creation wizard has multiple steps:
   - **Step 1:** Enter company name, foreign name, tax code, license date, enterprise type, industry, and contact information (address, phone, email).
   - **Step 2:** Review the entered information. Upload supporting documents (business license, tax registration, etc.) as file attachments.
3. Click "Save" to create the enterprise. The system automatically creates a user account for the enterprise with the tax code as the username.

**Editing an enterprise:**
1. Click on an enterprise in the list.
2. Update company information as needed.
3. Click "Save" to apply changes.

**Activating or deactivating an enterprise:**
- Use the status toggle on the enterprise list to enable or disable an enterprise's account.

**Managing attachments:**
1. Open the enterprise detail view.
2. Navigate to the attachments section.
3. Upload files by clicking the upload button and selecting a file.
4. Delete attachments by clicking the delete icon.

### Enterprise Types

This section manages the lookup table for enterprise types.

Available operations:
- **View** the list of enterprise types (e.g., LLC, Joint Stock Company, Private Enterprise).
- **Add** a new enterprise type by entering a code and name.
- **Edit** an existing enterprise type.
- **Delete** an enterprise type that is no longer needed.

### Industries

This section manages the industry classification system, organized as a hierarchical tree with up to four levels.

Available operations:
- **View** the industry tree with expandable levels.
- **Add** a new industry by selecting its parent and entering a name.
- **Edit** an existing industry's name or parent.
- **Delete** an industry that has no children or associated enterprises.

### TNLĐ Contract Reports

This section displays all occupational accident insurance contract reports submitted by enterprises.

**Viewing reports:**
- The report list shows submission date, enterprise name, year, period, status, and actions.
- Use filters to narrow down by status, enterprise, or date range.

**Reviewing a report:**
1. Click on a report to open its detail view.
2. The report contains three sections:
   - **Overview:** Total employees, payroll, accident statistics, and costs.
   - **Accident details:** Each accident incident with cause, injury factor, victim breakdown, and costs.
   - **Subsidy:** Compensation amounts, workdays lost, asset damage, and notes.
3. Review the attached documents if any.

**Approving or rejecting a report:**
1. Open the report detail view.
2. Click "Accept" to approve or "Reject" to return the report to the enterprise.
3. The enterprise will see the updated status in their portal.

### Account Settings

Access your account settings by clicking your avatar or username icon in the bottom-left corner of the screen.

From the popup menu you can:
- **View profile** — see your username, full name, email, role, and title.
- **Edit profile** — update your full name.
- **Change email** — request an email change (OTP verification required).
- **Change password** — update your password (requires your current password).

---

## Enterprise Portal Guide

The Enterprise Portal displays a sidebar menu specific to enterprise functions.

### Company Profile

This section displays your company's registered information.

**Viewing your profile:**
- All company details are displayed: name, tax code, enterprise type, industry, address, contact information, and legal representative.

**Editing your profile:**
1. Click the edit button next to each section.
2. Update the relevant fields.
3. Click "Save" to apply changes.

**Managing attachments:**
1. Navigate to the attachments section in your profile.
2. Upload required documents (business license, tax registration, etc.).
3. Delete outdated attachments as needed.

### Account Settings

Access your account settings from the bottom-left user icon.

Available options:
- **View account info** — see your username and assigned role.
- **Change password** — update your password (requires your current password).
- **Change email** — update your registered email address (OTP verification required).

Your username is your company's tax code and cannot be changed.

### TNLĐ Contract Reporting

This section allows you to submit and manage your company's occupational accident insurance contracts.

**Creating a new report:**
1. Click the "Add Report" button.
2. Select the reporting year and period (month, quarter, or year).
3. Fill in the following sections:
   - **Overview:** Total number of employees, number of female employees, total payroll, number of accidents, fatal accidents, multi-victim accidents, and total costs.
   - **Accident Details:** For each accident incident, enter the cause, injury factor, occupation, number of victims (total, female, deceased, severe), and costs (medical, salary, compensation, workdays lost, asset damage). You can add multiple accident detail rows.
   - **Subsidy:** Enter total costs, workdays lost, asset damage, and any notes.
4. Upload supporting documents as file attachments (PDF, images).
5. Click "Save as Draft" to save without submitting, or "Submit" to send the report to the reviewing authority.

**Viewing submitted reports:**
- The report list shows all reports for your company, their status, and submission dates.
- Status indicators:
  - **Draft:** The report is saved but not yet submitted.
  - **Submitted:** The report has been sent to the authority for review.
  - **Accepted:** The report has been approved.
  - **Rejected:** The report has been returned. Click to view rejection notes and resubmit.

**Editing a draft report:**
1. Click on a draft report in the list.
2. Update the necessary sections.
3. Save as draft or submit.

---

## Business Workflows

### Enterprise Account Creation

There are two ways an enterprise account can be created:

**Method 1 — Admin creates the account:**
1. An admin user logs into the Admin Portal.
2. The admin navigates to Enterprise Management and clicks "Add Enterprise".
3. The admin fills in the company's information and creates the account.
4. The enterprise receives their login credentials (username = tax code, password is set by the admin).
5. The enterprise logs in and should change the password on first login.

**Method 2 — Enterprise self-registration (if enabled):**
1. The enterprise representative navigates to the registration page.
2. They fill in the company details and their email address.
3. An OTP code is sent to the provided email address.
4. They enter the OTP to verify their email.
5. Once verified, the account is created pending admin activation.

### Contract Submission and Approval

The contract reporting workflow follows these steps:

1. **Enterprise creates a report:** The enterprise logs into their portal, creates a new TNLĐ contract report, fills in all required information, and submits it.
2. **Admin reviews the report:** The admin sees the new submission in the TNLĐ Contract Reports section. They open the report to review the details and attached documents.
3. **Admin approves or rejects:** The admin clicks "Accept" to approve the report or "Reject" to send it back. If rejected, the enterprise can edit and resubmit.
4. **Status update:** The enterprise sees the updated status in their report list.

---

## OTP and Email Verification

The system uses One-Time Passwords (OTPs) to verify email ownership for sensitive operations.

**Changing your email address:**
1. Open your account settings.
2. Click "Change Email".
3. Enter your new email address.
4. An OTP code is sent to your current email address.
5. Check your email inbox for the OTP. In development environments, the OTP appears in the backend console logs.
6. Enter the OTP code to confirm the change.
7. Your email address is updated immediately.

**Resetting your password (forgot password flow):**
1. On the login page, click "Forgot Password".
2. Enter your username.
3. An OTP is sent to your registered email address.
4. Enter the OTP code.
5. Set your new password.
6. Log in with your new password.

---

## CSV Import

The system supports bulk data import through CSV files. Template files are available in the application.

**Available import templates:**

| Template File | Purpose | Columns |
|---------------|---------|---------|
| mau_import_doanh_nghiep.csv | Import enterprise list | Tax code, name, type, industry, address, contact info |
| mau_import_nguoi_dung.csv | Import user list | Username, full name, email, role, title |
| mau_import_nghe_nghiep.csv | Import industry list | Code, name, parent code |
| mau_import_loai_chan_thuong.csv | Import injury type list | Code, name |
| mau_import_nguyen_nhan_tnld.csv | Import accident cause list | Code, name |
| mau_import_yeu_to_chan_thuong.csv | Import injury factor list | Code, name |

**Importing a CSV file:**
1. Navigate to the relevant management section.
2. Click the "Import" or "Upload CSV" button.
3. Select a CSV file from your computer.
4. The system validates the file and imports the records.
5. Review the import results for any errors.

---

## Password Management

**Changing your password:**
1. Open your account settings from the user icon in the bottom-left corner.
2. Click "Change Password".
3. Enter your current password.
4. Enter your new password. It must meet the following requirements:
   - Minimum 8 characters.
   - At least one uppercase letter.
   - At least one lowercase letter.
   - At least one digit.
5. Confirm the new password by typing it again.
6. Click "Save". Your password is updated immediately.

**Admin resetting another user's password:**
1. Navigate to User Management in the Admin Portal.
2. Find the user in the list.
3. Click the reset password icon.
4. Set a new password for the user.
5. Click "Save". The user can log in with the new password on their next attempt.

---

## Account Types

The system distinguishes between two account types:

| Account Type | Portal Access | Purpose |
|-------------|---------------|---------|
| Internal | Admin Portal | For government agency staff managing the system |
| Enterprise | Enterprise Portal | For company representatives submitting reports |

The account type is assigned when the user account is created and cannot be changed later.
