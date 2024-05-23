const mongoose = require('mongoose');
const schema = mongoose.Schema;



const seminarSchema = new schema({
    title : {type : String, required : true},
    previewImage : {type : String, required : true},
    place : {type : String, required : true}
})


const Seminar = mongoose.model('Seminar', seminarSchema);

module.exports = Seminar;