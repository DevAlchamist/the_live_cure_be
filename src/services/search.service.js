const { DoctorModel } = require("../models/Doctor.model");
const { ClinicModel } = require("../models/Clinic.model");
const { BlogModel } = require("../models/Blog.model");
const { OphthalmologyTreatmentModel } = require("../models/OphthalmologyTreatment.model");
const { PatientStoryModel } = require("../models/PatientStory.model");
const { AppointmentModel } = require("../models/Appointment.model");

class SearchService {
  static async globalSearch({ query, type, page, limit }) {
    try {
      const searchRegex = new RegExp(query, 'i');
      const results = {
        doctors: [],
        clinics: [],
        blogs: [],
        treatments: [],
        patientStories: []
      };

      if (!type || type === 'doctors') {
        results.doctors = await DoctorModel.find({
          $or: [
            { name: searchRegex },
            { specialty: searchRegex },
            { mainCategory: searchRegex },
            { cities: { $in: [searchRegex] } }
          ]
        }).limit(limit);
      }

      if (!type || type === 'clinics') {
        results.clinics = await ClinicModel.find({
          $or: [
            { name: searchRegex },
            { type: searchRegex },
            { city: searchRegex },
            { specialties: { $in: [searchRegex] } }
          ]
        }).limit(limit);
      }

      if (!type || type === 'blogs') {
        results.blogs = await BlogModel.find({
          $or: [
            { title: searchRegex },
            { content: searchRegex },
            { category: searchRegex }
          ]
        }).limit(limit);
      }

      if (!type || type === 'treatments') {
        results.treatments = await OphthalmologyTreatmentModel.find({
          $or: [
            { title: searchRegex },
            { diseaseName: searchRegex },
            { description: searchRegex }
          ]
        }).limit(limit);
      }

      if (!type || type === 'patientStories') {
        results.patientStories = await PatientStoryModel.find({
          $or: [
            { title: searchRegex },
            { content: searchRegex },
            { condition: searchRegex }
          ]
        }).limit(limit);
      }

      return results;
    } catch (error) {
      throw new Error(`Error in global search: ${error.message}`);
    }
  }

  static async searchDoctors({ query, specialty, city, rating, fees, page, limit }) {
    try {
      const searchRegex = new RegExp(query, 'i');
      const filter = {
        $or: [
          { name: searchRegex },
          { specialty: searchRegex },
          { mainCategory: searchRegex },
          { cities: { $in: [searchRegex] } }
        ]
      };

      if (specialty) filter.specialty = specialty;
      if (city) filter.cities = { $in: [city] };
      if (rating) filter.rating = { $gte: rating };
      if (fees) filter.consultationFees = { $lte: fees };

      const skip = (page - 1) * limit;
      const doctors = await DoctorModel.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ rating: -1 });

      const total = await DoctorModel.countDocuments(filter);

      return {
        doctors,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit
        }
      };
    } catch (error) {
      throw new Error(`Error searching doctors: ${error.message}`);
    }
  }

  static async searchClinics({ query, type, city, amenities, page, limit }) {
    try {
      const searchRegex = new RegExp(query, 'i');
      const filter = {
        $or: [
          { name: searchRegex },
          { type: searchRegex },
          { city: searchRegex },
          { specialties: { $in: [searchRegex] } }
        ]
      };

      if (type) filter.type = type;
      if (city) filter.city = city;
      if (amenities && amenities.length > 0) {
        filter.amenities = { $in: amenities };
      }

      const skip = (page - 1) * limit;
      const clinics = await ClinicModel.find(filter)
        .skip(skip)
        .limit(limit);

      const total = await ClinicModel.countDocuments(filter);

      return {
        clinics,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit
        }
      };
    } catch (error) {
      throw new Error(`Error searching clinics: ${error.message}`);
    }
  }

  static async searchBlogs({ query, category, page, limit }) {
    try {
      const searchRegex = new RegExp(query, 'i');
      const filter = {
        $or: [
          { title: searchRegex },
          { content: searchRegex },
          { category: searchRegex }
        ]
      };

      if (category) filter.category = category;

      const skip = (page - 1) * limit;
      const blogs = await BlogModel.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      const total = await BlogModel.countDocuments(filter);

      return {
        blogs,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit
        }
      };
    } catch (error) {
      throw new Error(`Error searching blogs: ${error.message}`);
    }
  }

  static async searchTreatments({ query, disease, page, limit }) {
    try {
      const searchRegex = new RegExp(query, 'i');
      const filter = {
        $or: [
          { title: searchRegex },
          { diseaseName: searchRegex },
          { description: searchRegex }
        ]
      };

      if (disease) filter.diseaseName = disease;

      const skip = (page - 1) * limit;
      const treatments = await OphthalmologyTreatmentModel.find(filter)
        .skip(skip)
        .limit(limit);

      const total = await OphthalmologyTreatmentModel.countDocuments(filter);

      return {
        treatments,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit
        }
      };
    } catch (error) {
      throw new Error(`Error searching treatments: ${error.message}`);
    }
  }

  static async searchPatientStories({ query, condition, page, limit }) {
    try {
      const searchRegex = new RegExp(query, 'i');
      const filter = {
        $or: [
          { title: searchRegex },
          { content: searchRegex },
          { condition: searchRegex }
        ]
      };

      if (condition) filter.condition = condition;

      const skip = (page - 1) * limit;
      const patientStories = await PatientStoryModel.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      const total = await PatientStoryModel.countDocuments(filter);

      return {
        patientStories,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit
        }
      };
    } catch (error) {
      throw new Error(`Error searching patient stories: ${error.message}`);
    }
  }

  static async searchAppointments({ query, status, date, doctor, patient, userId, page, limit }) {
    try {
      const searchRegex = new RegExp(query, 'i');
      const filter = {
        $or: [
          { patientName: searchRegex },
          { patientEmail: searchRegex },
          { doctorName: searchRegex },
          { clinicName: searchRegex }
        ]
      };

      if (status) filter.status = status;
      if (date) filter.preferredDate = new Date(date);
      if (doctor) filter.doctorName = doctor;
      if (patient) filter.patientName = patient;
      if (userId) filter.userId = userId;

      const skip = (page - 1) * limit;
      const appointments = await AppointmentModel.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      const total = await AppointmentModel.countDocuments(filter);

      return {
        appointments,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit
        }
      };
    } catch (error) {
      throw new Error(`Error searching appointments: ${error.message}`);
    }
  }

  static async getSearchSuggestions({ query, type, limit }) {
    try {
      const searchRegex = new RegExp(query, 'i');
      const suggestions = [];

      if (!type || type === 'doctors') {
        const doctorSuggestions = await DoctorModel.find({
          $or: [
            { name: searchRegex },
            { specialty: searchRegex }
          ]
        }).select('name specialty').limit(limit);
        suggestions.push(...doctorSuggestions.map(d => ({ type: 'doctor', value: d.name, specialty: d.specialty })));
      }

      if (!type || type === 'clinics') {
        const clinicSuggestions = await ClinicModel.find({
          $or: [
            { name: searchRegex },
            { city: searchRegex }
          ]
        }).select('name city').limit(limit);
        suggestions.push(...clinicSuggestions.map(c => ({ type: 'clinic', value: c.name, city: c.city })));
      }

      if (!type || type === 'treatments') {
        const treatmentSuggestions = await OphthalmologyTreatmentModel.find({
          $or: [
            { title: searchRegex },
            { diseaseName: searchRegex }
          ]
        }).select('title diseaseName').limit(limit);
        suggestions.push(...treatmentSuggestions.map(t => ({ type: 'treatment', value: t.title, disease: t.diseaseName })));
      }

      return suggestions.slice(0, limit);
    } catch (error) {
      throw new Error(`Error getting search suggestions: ${error.message}`);
    }
  }
}

module.exports = { SearchService };
