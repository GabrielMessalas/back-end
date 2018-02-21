// importando modulos necessarios para criacao do webservice
const restful = require('node-restful')
const mongoose = restful.mongoose

const auditCollectionSchema = new mongoose.Schema({

    nameUser: { type: String, require: true },
    numberCpfUser: { type: String, require: true },
    date: { type: String, require: true},
    ipUser: { type: String, require: true},
    session: { type: String, require: true},
    description: { type: String, require: true}

})


module.exports = restful.model('AuditiCollection', auditCollectionSchema)

