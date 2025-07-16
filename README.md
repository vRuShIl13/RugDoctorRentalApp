🧼 Rug Doctor Rental System – Blazor App Roadmap
This project aims to digitize the Rug Doctor rental process using a Blazor WebAssembly application backed by a .NET Web API.

✅ Phase 1: Customer Form UI (Step 1)
Goal: Create a clean, interactive Blazor page that lets staff input customer rental data.

Tasks:

 Add a new Blazor page (Pages/AddCustomer.razor)

 Build a form with fields that match the Customer model

 Use HttpClient to POST the data to /api/customer

 Show success message or client-side validation

🛠 Phase 2: Additional Models (Step 2)
Design and implement:

RentalForm — form record linked to customer

Machine — represents machine inventory

RentalStatus — enum to track machine state (Available, CheckedOut, etc.)

🔁 Phase 3: Machine Checkout / Check-in (Step 3)
Goals:

Allow staff to assign a machine to a customer

Track machine status changes (Available, CheckedOut)

Update inventory dynamically

📁 Phase 4: File Upload (Step 4)
Features:

Add field to upload customer ID (image or PDF)

Store in wwwroot/uploads or cloud storage

Link upload to customer or rental record

✍️ Phase 5: Digital Signature Pad (Step 5)
Technologies:

Use HTML5 <canvas> + JSInterop

Capture customer signature

Convert to image

Upload/store image in database or file system

📋 Phase 6: List of Rental Forms (Step 6)
Functionality:

Display past rental forms in a searchable table

Filter by date, customer, or machine

View/edit details of each rental form

🖨️ Phase 7: Export / Print (Step 7)
Output Options:

Print rental form as PDF or HTML

Export all forms as CSV or bulk PDF

Printable summary view for paper backup
