const mongoose = require('mongoose');
const { Schema } = mongoose;

const availabilitySchema = new Schema({
    plate: { type: String, required: true, unique: true },
    input_date: { type: Date, default: Date.now, require: true},
    output_date: { type: Date, default: Date.now, required: false, default: "" },
    state: { type: String, require: true },
});

const model = mongoose.model('availability', availabilitySchema);
module.exports = model;