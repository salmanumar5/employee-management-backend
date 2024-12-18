const mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate-v2');
const { created_at, updated_at } = require('../constants/keyName');

const generalSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    birthDate: { type: String },
    gender: { type: String },
    maritalStatus: { type: String },
    bloodGroup: { type: String },
    personalEmail: { type: String },
    mobileNumber: { type: String },
    alternativeMobileNumber: { type: String },
    currentAddress: { type: String },
    permanentAddress: { type: String },
    linkedInProfile: { type: String },
    role: {
        type: String,
        trim: true
    },
    team: {
        type: String,
        trim: true
    },
    joiningDate: {
        type: String,
        trim: true
    },
    reportingManager: {
        type: String,
        require: true,
    },

    probation: {
        type: String,
        trim: true
    },

    noticePeriod: {
        type: String,
        trim: true
    },

    netSalaryMinusPF: {
        type: Number,
        trim: true
    },
    monthlyGrossSalary: {
        type: Number,
        trim: true
    },
    annualGrossSalary: {
        type: String,
        trim: true
    },
    otherIncentiveIf: {
        type: String,
        trim: true
    },

    typeOfRole: {
        type: String,
        trim: true
    },

    otherTypeOfRoleIf: {
        type: String,
        trim: true
    },
    lastOrganization: {
        name: { type: String },
        industry: { type: String },
        divisionDesignation: { type: String },
        duration: { type: String },
        reasonForLeaving: { type: String }
    },
    [created_at]: {
        type: String,
        trim: true,
        required: true,
    },
    [updated_at]: {
        type: String,
        trim: true,
        required: true,
    },
});

generalSchema.plugin(mongoosePaginate);

var GeneralInfoModel = mongoose.model('generalInfo', generalSchema);

module.exports = GeneralInfoModel
