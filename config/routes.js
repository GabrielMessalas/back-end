
const express = require('express')
const auth = require('./auth')

module.exports = function(server) {

     /*
     * Rotas abertas
     */
    const openApi = express.Router()
    server.use('/oapi', openApi)
    const AuthService = require('../api/systemUsers/systemUsersAuthService')
    openApi.post('/login', AuthService.login)
    openApi.post('/signup', AuthService.signup)
    openApi.post('/validateToken', AuthService.validateToken)
    openApi.post('/cadAudit', AuthService.cadAudit)

     /*
     
     * Rotas protegidas por Token JWT
     */
    const protectedApi = express.Router()
   server.use('/aapi', protectedApi)
  // protectedApi.use(auth)



    const systemUsersService = require('../api/systemUsers/systemUsersService')
    systemUsersService.register(protectedApi, '/systemUsers')

    const RubbleCollectionService = require('../api/rubbleCollection/rubbleCollectionService')
    RubbleCollectionService.register(protectedApi, '/rubbleCollection')

    const auditCollectionService = require('../api/auditCollection/auditCollectionService')
    auditCollectionService.register(protectedApi, '/auditCollection')
    
}


