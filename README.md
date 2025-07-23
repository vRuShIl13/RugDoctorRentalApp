🧱 Step 1: Solution Structure (Visual Studio)
You’ll be creating a .NET solution with 3 main projects:

✅ Projects to Create
Project Name	Template Type	Purpose
RugDoctor.API	ASP.NET Core Web API	Your server backend
RugDoctor.App	.NET MAUI App	Your mobile/desktop frontend
RugDoctor.Shared	Class Library (.NET Standard)	Shared models between API and MAUI

⚙️ How to Create This in Visual Studio
Open Visual Studio 2022 or newer.

Create a Blank Solution called RugDoctorRentalSystem.

Add the following projects:

🔷 1. RugDoctor.API
Template: ASP.NET Core Web API

No authentication needed (for now)

.NET 8 (if available)

🔷 2. RugDoctor.App
Template: .NET MAUI App

Platform: Android, iOS, Windows, macOS

.NET 8

🔷 3. RugDoctor.Shared
Template: Class Library (.NET Standard)

Purpose: Share models like Customer, RentalForm, etc.

🔁 Reference Setup
In RugDoctor.API, add reference to RugDoctor.Shared

In RugDoctor.App, add reference to RugDoctor.Shared

This lets both frontend and backend use the same model definitions.

❓ Should You Start with the API or the MAUI App?
✅ Start with API first — Here's why:
You’ll define your core data models (Customer, Machine, RentalForm)

You’ll expose HTTP endpoints (POST new customer, GET rentals, etc.)

You can test everything with Postman or Swagger UI

Then you plug it into the MAUI app later via API calls

MAUI Comes Next:
Once the API is stable, the MAUI app can:

Fetch customers

Submit rental forms

Upload signatures and photos

