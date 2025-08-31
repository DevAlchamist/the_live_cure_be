# Healthcare Backend API Endpoints

## Authentication
- `POST /api/users/login` - Login with email/password
- `POST /api/users/create` - Register new user
- `GET /api/users/own` - Get current user (Auth required)

## Universal Query Parameters
All endpoints support these pagination and filtering parameters:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 5)
- `search` - Text search across relevant fields
- `sort` - Sort order ("asc" for ascending, default: descending by createdAt)

## Doctor Management

### Public Endpoints
- `GET /api/doctors` - Get all doctors with comprehensive filtering
  - **Query params**: `page`, `limit`, `search`, `sort`, `specialty`, `mainCategory`, `cities`, `status`, `rating`, `minRating`, `maxRating`, `consultationFees`, `minFees`, `maxFees`, `experience`, `isVisitingDoctor`, `isHospitalDoctor`, `diseasesTreated`, `professionalTitle`

- `GET /api/doctors/search` - Advanced search endpoint
  - **Query params**: `q` (query), `filters` (JSON string), `location`, `radius`

- `GET /api/doctors/active` - Get active doctors only
- `GET /api/doctors/specialties` - Get all unique specialties
- `GET /api/doctors/categories` - Get all unique main categories  
- `GET /api/doctors/cities` - Get all practice cities
- `GET /api/doctors/titles` - Get all professional titles
- `GET /api/doctors/featured` - Get high-rated doctors (rating >= 4.0)
- `GET /api/doctors/nearby` - Get nearby doctors
  - **Query params**: `lat`, `lng`, `radius` (in km)
- `GET /api/doctors/count` - Get total doctor count
- `GET /api/doctors/specialty/:specialty` - Get doctors by specialty
- `GET /api/doctors/city/:city` - Get doctors by city
- `GET /api/doctors/category/:category` - Get doctors by main category
- `GET /api/doctors/:doctorId` - Get doctor details by ID
- `GET /api/doctors/:doctorId/reviews` - Get doctor reviews
- `GET /api/doctors/:doctorId/availability` - Get doctor availability

### Admin Endpoints (Auth Required)
- `GET /api/doctors/inactive` - Get inactive doctors
- `GET /api/doctors/stats` - Get doctor statistics and analytics
- `POST /api/doctors` - Create new doctor
- `POST /api/doctors/bulk` - Create multiple doctors
- `POST /api/doctors/:doctorId/qualifications` - Add qualification
- `POST /api/doctors/:doctorId/cities` - Add practice city
- `POST /api/doctors/:doctorId/diseases` - Add disease treated
- `POST /api/doctors/:doctorId/clone` - Clone doctor profile
- `PUT /api/doctors/:doctorId` - Update doctor
- `PUT /api/doctors/:doctorId/status` - Update doctor status
- `PUT /api/doctors/:doctorId/rating` - Update doctor rating
- `PUT /api/doctors/:doctorId/fees` - Update consultation fees
- `PUT /api/doctors/bulk/status` - Bulk update doctor status
- `PATCH /api/doctors/:doctorId/qualifications/:qualificationId` - Update qualification
- `DELETE /api/doctors/:doctorId` - Delete doctor
- `DELETE /api/doctors/bulk` - Bulk delete doctors
- `DELETE /api/doctors/:doctorId/qualifications/:qualificationId` - Remove qualification
- `DELETE /api/doctors/:doctorId/cities` - Remove practice city
- `DELETE /api/doctors/:doctorId/diseases` - Remove disease

## Clinic Management

### Public Endpoints
- `GET /api/clinics` - Get all clinics with comprehensive filtering
  - **Query params**: `page`, `limit`, `search`, `sort`, `name`, `type`, `city`, `state`, `pincode`, `status`, `specialties`, `facilities`, `amenities`, `isEmergencyCenter`, `is24Hours`, `hasParking`, `hasWheelchairAccess`, `phone`, `email`

- `GET /api/clinics/search` - Advanced search endpoint
  - **Query params**: `q` (query), `filters` (JSON string), `location`, `radius`

- `GET /api/clinics/active` - Get active clinics only
- `GET /api/clinics/types` - Get all unique clinic types
- `GET /api/clinics/specialties` - Get all unique specialties
- `GET /api/clinics/facilities` - Get all unique facilities
- `GET /api/clinics/amenities` - Get all unique amenities
- `GET /api/clinics/cities` - Get all cities
- `GET /api/clinics/states` - Get all states
- `GET /api/clinics/emergency` - Get emergency centers
- `GET /api/clinics/24hours` - Get 24-hour clinics
- `GET /api/clinics/accessible` - Get wheelchair accessible clinics
- `GET /api/clinics/parking` - Get clinics with parking
- `GET /api/clinics/nearby` - Get nearby clinics
  - **Query params**: `lat`, `lng`, `radius` (in km)
- `GET /api/clinics/open-now` - Get currently open clinics
- `GET /api/clinics/open-on/:day` - Get clinics open on specific day
- `GET /api/clinics/count` - Get total clinic count
- `GET /api/clinics/city/:city` - Get clinics by city
- `GET /api/clinics/state/:state` - Get clinics by state
- `GET /api/clinics/type/:type` - Get clinics by type
- `GET /api/clinics/specialty/:specialty` - Get clinics by specialty
- `GET /api/clinics/:clinicId` - Get clinic details by ID
- `GET /api/clinics/:clinicId/doctors` - Get doctors at clinic
- `GET /api/clinics/:clinicId/reviews` - Get clinic reviews
- `POST /api/clinics/filter/amenities` - Get clinics by amenities (POST with array)

### Admin Endpoints (Auth Required)
- `GET /api/clinics/inactive` - Get inactive clinics
- `GET /api/clinics/stats` - Get clinic statistics
- `GET /api/clinics/:clinicId/appointments` - Get clinic appointments
- `POST /api/clinics` - Create new clinic
- `POST /api/clinics/bulk` - Create multiple clinics
- `POST /api/clinics/:clinicId/specialties` - Add specialty
- `POST /api/clinics/:clinicId/facilities` - Add facility
- `POST /api/clinics/:clinicId/amenities` - Add amenity
- `POST /api/clinics/:clinicId/clone` - Clone clinic
- `PUT /api/clinics/:clinicId` - Update clinic
- `PUT /api/clinics/:clinicId/status` - Update clinic status
- `PUT /api/clinics/:clinicId/working-hours` - Update working hours
- `PUT /api/clinics/:clinicId/contact` - Update contact information
- `PUT /api/clinics/bulk/status` - Bulk update clinic status
- `PATCH /api/clinics/:clinicId/working-hours/:day` - Update specific day working hours
- `DELETE /api/clinics/:clinicId` - Delete clinic
- `DELETE /api/clinics/bulk` - Bulk delete clinics
- `DELETE /api/clinics/:clinicId/specialties` - Remove specialty
- `DELETE /api/clinics/:clinicId/facilities` - Remove facility
- `DELETE /api/clinics/:clinicId/amenities` - Remove amenity

## Appointment Management

### Public Endpoints
- `POST /api/appointments` - Book new appointment
- `POST /api/appointments/validate` - Validate appointment slot
- `POST /api/appointments/check-availability` - Check doctor availability

### Admin Endpoints (Auth Required)
- `GET /api/appointments` - Get all appointments with comprehensive filtering
  - **Query params**: `page`, `limit`, `search`, `sort`, `patientName`, `patientEmail`, `patientMobile`, `patientGender`, `patientAge`, `minAge`, `maxAge`, `city`, `treatmentType`, `doctorName`, `doctorId`, `clinicId`, `status`, `paymentStatus`, `preferredDate`, `startDate`, `endDate`, `bookingDate`, `confirmedDate`, `consultationFees`, `minFees`, `maxFees`

- `GET /api/appointments/search` - Advanced search endpoint
- `GET /api/appointments/stats` - Get appointment statistics
- `GET /api/appointments/analytics` - Get advanced analytics
- `GET /api/appointments/reports` - Generate reports

#### Status-based Endpoints
- `GET /api/appointments/pending` - Get pending appointments
- `GET /api/appointments/confirmed` - Get confirmed appointments
- `GET /api/appointments/completed` - Get completed appointments
- `GET /api/appointments/cancelled` - Get cancelled appointments
- `GET /api/appointments/rescheduled` - Get rescheduled appointments
- `GET /api/appointments/status/:status` - Get appointments by status

#### Time-based Endpoints
- `GET /api/appointments/today` - Get today's appointments
- `GET /api/appointments/tomorrow` - Get tomorrow's appointments
- `GET /api/appointments/this-week` - Get this week's appointments
- `GET /api/appointments/this-month` - Get this month's appointments
- `GET /api/appointments/upcoming` - Get upcoming appointments
- `GET /api/appointments/overdue` - Get overdue appointments
- `GET /api/appointments/date-range` - Get appointments by date range
- `GET /api/appointments/date/:date` - Get appointments by specific date

#### Entity-based Endpoints
- `GET /api/appointments/doctor/:doctorId` - Get appointments by doctor
- `GET /api/appointments/clinic/:clinicId` - Get appointments by clinic
- `GET /api/appointments/patient/:patientEmail` - Get appointments by patient
- `GET /api/appointments/treatment/:treatmentType` - Get appointments by treatment
- `GET /api/appointments/city/:city` - Get appointments by city

#### Payment-based Endpoints
- `GET /api/appointments/payment/pending` - Get pending payments
- `GET /api/appointments/payment/paid` - Get paid appointments
- `GET /api/appointments/payment/failed` - Get failed payments
- `GET /api/appointments/payment/refunded` - Get refunded appointments

#### Demographics & Analytics
- `GET /api/appointments/demographics` - Get appointment demographics
- `GET /api/appointments/age-groups` - Get appointments by age group
- `GET /api/appointments/gender/:gender` - Get appointments by gender

#### Export Endpoints
- `GET /api/appointments/export/csv` - Export appointments as CSV
- `GET /api/appointments/export/excel` - Export appointments as Excel
- `GET /api/appointments/export/pdf` - Export appointments as PDF

#### Calendar & Notifications
- `GET /api/appointments/calendar` - Get appointment calendar
- `GET /api/appointments/calendar/:year/:month` - Get monthly calendar
- `GET /api/appointments/notifications/due` - Get due notifications
- `GET /api/appointments/reminders` - Get appointment reminders

#### Individual Appointment Management
- `GET /api/appointments/:appointmentId` - Get appointment details
- `GET /api/appointments/:appointmentId/history` - Get appointment status history
- `POST /api/appointments/bulk` - Create bulk appointments
- `POST /api/appointments/:appointmentId/notes` - Add appointment note
- `POST /api/appointments/:appointmentId/send-reminder` - Send reminder
- `PUT /api/appointments/:appointmentId` - Update appointment
- `PUT /api/appointments/:appointmentId/status` - Update appointment status
- `PUT /api/appointments/:appointmentId/confirm` - Confirm appointment
- `PUT /api/appointments/:appointmentId/cancel` - Cancel appointment
- `PUT /api/appointments/:appointmentId/reschedule` - Reschedule appointment
- `PUT /api/appointments/:appointmentId/complete` - Complete appointment
- `PUT /api/appointments/:appointmentId/payment` - Update payment status
- `PUT /api/appointments/:appointmentId/fees` - Update consultation fees
- `PUT /api/appointments/bulk/status` - Bulk update status
- `PUT /api/appointments/bulk/confirm` - Bulk confirm appointments
- `PUT /api/appointments/bulk/cancel` - Bulk cancel appointments
- `PATCH /api/appointments/:appointmentId/patient` - Update patient info
- `PATCH /api/appointments/:appointmentId/doctor` - Assign doctor
- `PATCH /api/appointments/:appointmentId/clinic` - Assign clinic
- `DELETE /api/appointments/:appointmentId` - Delete appointment
- `DELETE /api/appointments/bulk` - Bulk delete appointments
- `DELETE /api/appointments/:appointmentId/notes/:noteId` - Remove appointment note

## File Upload
- `POST /api/upload-image` - Upload image to Cloudinary

## Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `409` - Conflict

## Authentication
Most admin endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Data Models

### Doctor Model Fields
- `fullName`, `professionalTitle`, `specialty`, `rating`, `consultationFees`
- `experience`, `about`, `profileImageUrl`, `contactNumber`
- `qualifications[]`, `mainCategory`, `cities[]`, `address`
- `mapCoordinates{lat,lng}`, `mapLink`, `diseasesTreated[]`
- `employeeCode`, `reviewCount`, `status`, `isVisitingDoctor`, `isHospitalDoctor`

### Clinic Model Fields
- `name`, `type`, `address`, `city`, `state`, `pincode`
- `phone`, `email`, `website`, `status`, `specialties[]`, `facilities[]`
- `workingHours{}`, `description`, `amenities[]`, `emergencyContact`
- `isEmergencyCenter`, `is24Hours`, `hasParking`, `hasWheelchairAccess`

### Appointment Model Fields
- `patientName`, `patientMobile`, `patientEmail`, `patientAge`, `patientGender`
- `city`, `treatmentType`, `doctorName`, `doctorId`, `clinicId`
- `preferredDate`, `preferredTime`, `symptoms`, `previousTreatment`
- `status`, `bookingDate`, `appointmentNotes`, `cancellationReason`
- `confirmedDate`, `confirmedTime`, `consultationFees`, `paymentStatus`
