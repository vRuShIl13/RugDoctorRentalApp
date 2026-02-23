1. EPIC: Reservation lifecycle & queue management
2. Add `cancelReservation()` and update calendar/queue entries.
3. Add `rescheduleReservation()` with conflict checks and buffer-aware calendar updates.
4. Auto-promote the next queued reservation when a slot opens (and notify).
5. Enforce valid status transitions (Pending → Confirmed → Completed/Cancelled).
6. Add unit tests for queue promotion, cancellation, and rescheduling.

7. EPIC: Availability search & booking rules
8. Build an availability service to list machines for a date range (buffer-aware).
9. Enforce `maxRentalDays` and rental period validation in one place.
10. Add pickup/return time windows (e.g., store hours).
11. Add tests for availability and booking rules.

12. EPIC: Rental lifecycle & returns
13. Extend `Rental` with `startDate`, `endDate`, `actualReturnDate`.
14. Add overdue detection + late fee calculation.
15. Add return inspection notes (condition, issues, cleaning fee).
16. Add tests for late fees and return flow.

17. EPIC: Customer & verification
18. Create a `RenterService` with CRUD and verification workflow.
19. Block reservations for unverified renters (configurable override).
20. Add contact preferences (email/phone opt-in).
21. Add tests for verification gating.

22. EPIC: Notifications & logging
23. Add `NotificationLog` model (provider, status, error, timestamps).
24. Add retry/backoff for failed email sends.
25. Add simple message templates (tokens for name, pickup time, machine).
26. Add tests for reminder rules and retry behavior.

27. EPIC: Inventory & maintenance
28. Add `MaintenanceLog` model and service for each machine.
29. Auto-schedule maintenance after N rentals or time interval.
30. Prevent reservations when machine is in maintenance/out-of-service.
31. Add tests for maintenance blocking.

32. EPIC: Payments & pricing
33. Build a `PricingService` (tax, fees, discounts, deposits).
34. Record payments and refunds with status tracking.
35. Add cancellation policy and refund rules.
36. Add tests for pricing and refunds.

37. EPIC: Persistence & API surface
38. Define repository interfaces (in-memory vs file/DB).
39. Add JSON persistence for machines, renters, reservations, rentals.
40. Add a minimal CLI or REST endpoints for core flows.
41. Add tests for persistence + API inputs.
