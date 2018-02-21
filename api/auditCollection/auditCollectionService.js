const AuditiCollection = require ('./auditCollection')
const _ = require ('lodash')

// implementando os servicos restful de forma automatizada 
AuditiCollection.methods(['get', 'post', 'put', 'delete'])

// exibindo o objeto ja atualizado apos qualquer modificacao no servico
AuditiCollection.updateOptions({new: true, runValidators: true})

// padronizando os erros do backend que serao consumidos pelo frontend
AuditiCollection.after('post', sendErrorsOrNext).after('put', sendErrorsOrNext)

function sendErrorsOrNext(req, res, next){
    const bundle = res.locals.bundle
    if (bundle.errors){
        var errors = parseErrors(bundle.errors)
        res.status(500).json( {errors} )
    } else {
        next()
    }
}

function parseErrors (nodeRestFullErrors) {

    const errors = []
    _.forIn(nodeRestFullErrors, error => errors.push (error.message) )
    return errors
}


// exportando os servicoes de restful dos ciclos de pagamento para os outros modulos do backend
module.exports = AuditiCollection



