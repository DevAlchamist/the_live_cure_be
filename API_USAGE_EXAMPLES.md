# Healthcare API Usage Examples

## Universal Query Parameters

All endpoints support these standard parameters:
- `page=1` - Page number (default: 1)
- `limit=10` - Items per page (default: 5)
- `search=keyword` - Text search across relevant fields
- `sort=asc` - Sort order (default: descending by createdAt)

## Doctor API Examples

### 1. Basic Doctor Search
```bash
GET /api/doctors?page=1&limit=10&search=cardiology
```

### 2. Advanced Doctor Filtering
```bash
GET /api/doctors?specialty=Cardiologist&city=Mumbai&minRating=4.0&minFees=500&maxFees=2000&isVisitingDoctor=true
```

### 3. Get Doctors by Multiple Cities
```bash
GET /api/doctors?cities=Mumbai,Delhi,Bangalore&status=active
```

### 4. Get Featured High-Rated Doctors
```bash
GET /api/doctors/featured?limit=20
```

### 5. Location-Based Doctor Search
```bash
GET /api/doctors/nearby?lat=19.0760&lng=72.8777&radius=5&specialty=Ophthalmologist
```

### 6. Get All Specialties
```bash
GET /api/doctors/specialties
# Response: ["Cardiologist", "Ophthalmologist", "Dermatologist", ...]
```

### 7. Get Doctor Statistics (Admin)
```bash
GET /api/doctors/stats
# Response: { overview: {...}, bySpecialty: [...] }
```

### 8. Bulk Operations (Admin)
```bash
# Bulk create doctors
POST /api/doctors/bulk
{
  "doctors": [
    { "fullName": "Dr. John Doe", "specialty": "Cardiologist", ... },
    { "fullName": "Dr. Jane Smith", "specialty": "Dermatologist", ... }
  ]
}

# Bulk update status
PUT /api/doctors/bulk/status
{
  "doctorIds": ["60f1b2b3c4d5e6f7a8b9c0d1", "60f1b2b3c4d5e6f7a8b9c0d2"],
  "status": "inactive"
}
```

## Clinic API Examples

### 1. Basic Clinic Search
```bash
GET /api/clinics?search=hospital&city=Mumbai
```

### 2. Advanced Clinic Filtering
```bash
GET /api/clinics?type=Hospital&specialties=Cardiology,Neurology&hasParking=true&hasWheelchairAccess=true&is24Hours=true
```

### 3. Get Emergency Centers
```bash
GET /api/clinics/emergency?city=Delhi
```

### 4. Get Clinics Open Now
```bash
GET /api/clinics/open-now
```

### 5. Get Clinics by Multiple Amenities
```bash
POST /api/clinics/filter/amenities
{
  "amenities": ["Parking", "Wheelchair Access", "24/7 Service"]
}
```

### 6. Location-Based Clinic Search
```bash
GET /api/clinics/nearby?lat=28.6139&lng=77.2090&radius=10&type=Emergency Center
```

### 7. Get All Clinic Types
```bash
GET /api/clinics/types
# Response: ["Primary Care", "Specialty Clinic", "Hospital", "Emergency Center"]
```

## Appointment API Examples

### 1. Book New Appointment (Public)
```bash
POST /api/appointments
{
  "patientName": "John Doe",
  "patientMobile": "+91-9876543210",
  "patientEmail": "john@example.com",
  "patientAge": 35,
  "patientGender": "Male",
  "city": "Mumbai",
  "treatmentType": "Cataract Surgery",
  "doctorName": "Dr. Smith",
  "preferredDate": "2024-01-15",
  "preferredTime": "10:00 AM",
  "symptoms": "Blurred vision",
  "previousTreatment": "None"
}
```

### 2. Validate Appointment Slot (Public)
```bash
POST /api/appointments/validate
{
  "doctorId": "60f1b2b3c4d5e6f7a8b9c0d1",
  "preferredDate": "2024-01-15",
  "preferredTime": "10:00 AM"
}
```

### 3. Advanced Appointment Search (Admin)
```bash
GET /api/appointments?patientName=John&status=pending&startDate=2024-01-01&endDate=2024-01-31&city=Mumbai&minAge=25&maxAge=65
```

### 4. Get Today's Appointments (Admin)
```bash
GET /api/appointments/today?doctorId=60f1b2b3c4d5e6f7a8b9c0d1
```

### 5. Get Appointment Statistics (Admin)
```bash
GET /api/appointments/stats
# Response: { total: 150, today: 5, byStatus: { pending: 20, confirmed: 80, ... } }
```

### 6. Get Appointments by Date Range (Admin)
```bash
GET /api/appointments/date-range?startDate=2024-01-01&endDate=2024-01-31&status=confirmed
```

### 7. Demographic Analysis (Admin)
```bash
GET /api/appointments/demographics
GET /api/appointments/age-groups
GET /api/appointments/gender/Female
```

### 8. Export Appointments (Admin)
```bash
GET /api/appointments/export/csv?startDate=2024-01-01&endDate=2024-01-31
GET /api/appointments/export/excel?status=completed
GET /api/appointments/export/pdf?doctorId=60f1b2b3c4d5e6f7a8b9c0d1
```

### 9. Bulk Appointment Operations (Admin)
```bash
# Bulk confirm appointments
PUT /api/appointments/bulk/confirm
{
  "appointmentIds": ["60f1b2b3c4d5e6f7a8b9c0d1", "60f1b2b3c4d5e6f7a8b9c0d2"],
  "confirmedDate": "2024-01-15",
  "confirmedTime": "10:00 AM"
}

# Bulk cancel appointments
PUT /api/appointments/bulk/cancel
{
  "appointmentIds": ["60f1b2b3c4d5e6f7a8b9c0d3", "60f1b2b3c4d5e6f7a8b9c0d4"],
  "cancellationReason": "Doctor unavailable"
}
```

### 10. Appointment Workflow (Admin)
```bash
# Confirm appointment
PUT /api/appointments/60f1b2b3c4d5e6f7a8b9c0d1/confirm
{
  "confirmedDate": "2024-01-15",
  "confirmedTime": "10:00 AM",
  "consultationFees": 1500
}

# Reschedule appointment
PUT /api/appointments/60f1b2b3c4d5e6f7a8b9c0d1/reschedule
{
  "newDate": "2024-01-16",
  "newTime": "11:00 AM"
}

# Complete appointment
PUT /api/appointments/60f1b2b3c4d5e6f7a8b9c0d1/complete
{
  "appointmentNotes": "Patient responded well to treatment"
}

# Cancel appointment
PUT /api/appointments/60f1b2b3c4d5e6f7a8b9c0d1/cancel
{
  "cancellationReason": "Patient requested cancellation"
}
```

## Advanced Query Examples

### 1. Complex Doctor Search with Multiple Filters
```bash
GET /api/doctors?search=heart surgery&specialty=Cardiologist&cities=Mumbai,Delhi&minRating=4.5&maxFees=3000&isHospitalDoctor=true&diseasesTreated=Heart Disease,Hypertension&page=1&limit=20&sort=asc
```

### 2. Complex Clinic Search
```bash
GET /api/clinics?search=multi specialty&type=Hospital&specialties=Cardiology,Neurology,Orthopedics&facilities=ICU,Operation Theatre&amenities=Parking,Wheelchair Access&isEmergencyCenter=true&hasParking=true&page=2&limit=15
```

### 3. Complex Appointment Analytics
```bash
GET /api/appointments?status=completed&treatmentType=Cataract Surgery&startDate=2024-01-01&endDate=2024-03-31&minAge=50&maxAge=80&patientGender=Male&city=Mumbai&doctorId=60f1b2b3c4d5e6f7a8b9c0d1&minFees=1000&maxFees=5000
```

## Response Format

All paginated endpoints return data in this format:
```json
{
  "doctors": [
    {
      "_id": "60f1b2b3c4d5e6f7a8b9c0d1",
      "fullName": "Dr. John Doe",
      "specialty": "Cardiologist",
      "rating": 4.5,
      "consultationFees": 1500,
      // ... other fields
    }
  ],
  "totalDocs": 150,
  "limit": 10,
  "totalPages": 15,
  "page": 1,
  "pagingCounter": 1,
  "hasPrevPage": false,
  "hasNextPage": true,
  "prevPage": null,
  "nextPage": 2
}
```

## Error Responses

```json
{
  "error": true,
  "message": "Doctor not found",
  "result": null
}
```

## Authentication

For admin endpoints, include the JWT token:
```bash
curl -H "Authorization: Bearer your-jwt-token" \
     "http://localhost:53321/api/doctors/stats"
```

## Tips for Optimal Usage

1. **Use appropriate page sizes**: Start with `limit=10-20` for better performance
2. **Combine filters**: Use multiple query parameters to narrow down results
3. **Use text search**: The `search` parameter searches across multiple relevant fields
4. **Leverage specialized endpoints**: Use `/featured`, `/nearby`, `/emergency` etc. for specific needs
5. **Use bulk operations**: For multiple operations, use bulk endpoints to reduce API calls
6. **Cache static data**: Cache results from `/specialties`, `/cities`, `/types` endpoints
7. **Use date ranges**: For time-based queries, always specify date ranges to limit results
