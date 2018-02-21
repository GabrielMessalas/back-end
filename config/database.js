// dependencia para manipulacao do banco de dados mongodb
const mongoose = require('mongoose')

// realizando a conexao com o banco de dados db_ilhaconectada (sem uso de usuarios e senhas)
module.exports = mongoose.connection.openUri('mongodb://localhost/db_ilhaconectada')