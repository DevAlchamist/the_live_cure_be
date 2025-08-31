const _ = require("lodash");

class QueryHelper {
  constructor(query, options = {}, defaultFilter = { deactivated: false }) {
    this.query = query;
    this.defaultFilter = _.cloneDeep(defaultFilter);
    this.options = options;
    this.defaultUnFilters = [
      "page",
      "limit",
      "search",
      "sort",
      "city",
      "salary",
      "own",
      "minPrice",
      "maxPrice",
      "budget",
      // Healthcare specific filters
      "minRating",
      "maxRating",
      "minFees",
      "maxFees",
      "minAge",
      "maxAge",
      "startDate",
      "endDate",
      "lat",
      "lng",
      "radius",
      "q",
      "filters",
      "location",
      "dateRange",
    ];

    this.initOptions();
    this.initFilter();
  }

  initOptions() {
    const {
      page = 1,
      limit = 5,
      unFilter = [],
      searchFields = ["title"],
      sort: initialSort = { createdAt: -1 },
      customFilters,
      customLabels = { docs: "docs" },
      customPopulate = [],
      customSelect = null,
    } = this.options;

    this.page = _.toInteger(this?.query?.page || page);
    this.limit = _.toInteger(this?.query?.limit || limit);
    this.searchFields = searchFields;
    this.initialSort = initialSort;
    this.customFilters = customFilters;
    this.customLabels = customLabels;
    this.customPopulate = customPopulate;
    this.customSelect = customSelect;
    this.sort = this.query?.sort === "asc" ? { createdAt: 1 } : initialSort;
    this.effectiveUnFilter = _.union(this.defaultUnFilters, unFilter);
  }

  initFilter() {
    this.filter = _.cloneDeep(this.defaultFilter);

    // Search Filtering
    if (this.query?.search && !_.isEmpty(this.searchFields)) {
      const searchRegex = new RegExp(this.query.search, "i");
      this.filter[
        this.searchFields.length === 1 ? this.searchFields[0] : "$or"
      ] =
        this.searchFields.length === 1
          ? searchRegex
          : this.searchFields.map((field) => ({ [field]: searchRegex }));
    }

    // Location Filtering
    if (this.query?.city) {
      _.set(this.filter, "location.city", new RegExp(this.query.city, "i"));
    }

    // Salary Range Filtering
    if (this.query?.salary) {
      const salaryValue = _.isArray(this.query.salary)
        ? this.query.salary
        : _.split(this.query.salary, ",").map(_.toNumber);

      this.filter.salaryRange = _.pickBy(
        {
          $gte: salaryValue[0],
          $lte: salaryValue[1],
        },
        _.identity
      );
    }

    // Budget Filtering
    if (this.query?.budget) {
      _.set(this.filter, "budget", { $gte: this.query.budget });
    }

    // Price Range Filtering
    if (this.query?.minPrice || this.query?.maxPrice) {
      this.filter.price = _.pickBy(
        {
          $gte: this.query.minPrice,
          $lte: this.query.maxPrice,
        },
        _.identity
      );
    }

    // Healthcare specific filters
    // Rating Range Filtering
    if (this.query?.minRating || this.query?.maxRating) {
      this.filter.rating = _.pickBy(
        {
          $gte: this.query.minRating ? parseFloat(this.query.minRating) : undefined,
          $lte: this.query.maxRating ? parseFloat(this.query.maxRating) : undefined,
        },
        _.identity
      );
    }

    // Consultation Fees Range Filtering
    if (this.query?.minFees || this.query?.maxFees) {
      this.filter.consultationFees = _.pickBy(
        {
          $gte: this.query.minFees ? parseFloat(this.query.minFees) : undefined,
          $lte: this.query.maxFees ? parseFloat(this.query.maxFees) : undefined,
        },
        _.identity
      );
    }

    // Age Range Filtering (for appointments)
    if (this.query?.minAge || this.query?.maxAge) {
      this.filter.patientAge = _.pickBy(
        {
          $gte: this.query.minAge ? parseInt(this.query.minAge) : undefined,
          $lte: this.query.maxAge ? parseInt(this.query.maxAge) : undefined,
        },
        _.identity
      );
    }

    // Date Range Filtering
    if (this.query?.startDate || this.query?.endDate) {
      this.filter.preferredDate = _.pickBy(
        {
          $gte: this.query.startDate ? new Date(this.query.startDate) : undefined,
          $lte: this.query.endDate ? new Date(this.query.endDate) : undefined,
        },
        _.identity
      );
    }

    // Array field filtering (for specialties, cities, facilities, etc.)
    if (this.query?.specialties) {
      const specialties = _.isArray(this.query.specialties) 
        ? this.query.specialties 
        : this.query.specialties.split(',');
      this.filter.specialties = { $in: specialties.map(s => new RegExp(s.trim(), 'i')) };
    }

    if (this.query?.cities) {
      const cities = _.isArray(this.query.cities) 
        ? this.query.cities 
        : this.query.cities.split(',');
      this.filter.cities = { $in: cities.map(c => new RegExp(c.trim(), 'i')) };
    }

    if (this.query?.facilities) {
      const facilities = _.isArray(this.query.facilities) 
        ? this.query.facilities 
        : this.query.facilities.split(',');
      this.filter.facilities = { $in: facilities.map(f => new RegExp(f.trim(), 'i')) };
    }

    if (this.query?.amenities) {
      const amenities = _.isArray(this.query.amenities) 
        ? this.query.amenities 
        : this.query.amenities.split(',');
      this.filter.amenities = { $in: amenities.map(a => new RegExp(a.trim(), 'i')) };
    }

    if (this.query?.diseasesTreated) {
      const diseases = _.isArray(this.query.diseasesTreated) 
        ? this.query.diseasesTreated 
        : this.query.diseasesTreated.split(',');
      this.filter.diseasesTreated = { $in: diseases.map(d => new RegExp(d.trim(), 'i')) };
    }

    // Boolean filters
    if (this.query?.isVisitingDoctor !== undefined) {
      this.filter.isVisitingDoctor = this.query.isVisitingDoctor === 'true';
    }

    if (this.query?.isHospitalDoctor !== undefined) {
      this.filter.isHospitalDoctor = this.query.isHospitalDoctor === 'true';
    }

    if (this.query?.isEmergencyCenter !== undefined) {
      this.filter.isEmergencyCenter = this.query.isEmergencyCenter === 'true';
    }

    if (this.query?.is24Hours !== undefined) {
      this.filter.is24Hours = this.query.is24Hours === 'true';
    }

    if (this.query?.hasParking !== undefined) {
      this.filter.hasParking = this.query.hasParking === 'true';
    }

    if (this.query?.hasWheelchairAccess !== undefined) {
      this.filter.hasWheelchairAccess = this.query.hasWheelchairAccess === 'true';
    }

    // Add remaining filters dynamically
    _.forEach(this.query, (value, key) => {
      if (!this.effectiveUnFilter.includes(key)) {
        this.filter[key] = value;
      }
    });

    // Apply custom filters if provided
    if (_.isFunction(this.customFilters)) {
      this.customFilters(this.filter, this.query, this.options);
    }
  }

  getConfig() {
    return {
      filter: this.filter,
      options: {
        page: this.page,
        limit: this.limit,
        sort: this.sort,
        lean: true,
        customLabels: this.customLabels,
        populate: this.customPopulate,
        select: this.customSelect,
      },
    };
  }
}

const createQueryHelper = (query, options = {}) => {
  const queryHelper = new QueryHelper(query, options);
  return {
    filter: queryHelper.filter,
    options: queryHelper.options
  };
};


module.exports = createQueryHelper;
