const RubbleCollection = require ('./rubbleCollection')

const _ = require ('lodash')

// implementando os servicos restful de forma automatizada 
RubbleCollection.methods(['get', 'post', 'put', 'delete'])

// exibindo o objeto ja atualizado apos qualquer modificacao no servico
RubbleCollection.updateOptions({new: true, runValidators: true})


// padronizando os erros do backend que serao consumidos pelo frontend
RubbleCollection.after('post', sendErrorsOrNext).after('put', sendErrorsOrNext)

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


// criando contador para obter o numero total de documentos no banco de dados para paginacao
RubbleCollection.route('count', function(req, res, next){

    RubbleCollection.count( function(error, value){

        if (error) {

            // convencao para tratamento de erros, sendo sempre um objeto com um atributo que posusi um array de mensagens
            res.status(500).json( {errors: [error] } )

        } else {

            res.json( {value} )

        }

    })

} )

// exportando os servicoes de restful dos ciclos de pagamento para os outros modulos do backend
module.exports = RubbleCollection

