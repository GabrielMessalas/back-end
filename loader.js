// importando as configuracoes do servidor do backend
const server = require ('./config/server')
// importando as configuracoes de conexao com o banco de dados mongodb
require('./config/database')

require('./config/routes')(server)
