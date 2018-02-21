const SystemUsers = require('./systemUsers')

const _ = require('lodash')

// implementando os servicos restful de forma automatizada 
SystemUsers.methods(['get', 'post', 'put', 'delete'])

// exibindo o objeto ja atualizado apos qualquer modificacao no servico
SystemUsers.updateOptions({ new: true, runValidators: true })


// padronizando os erros do backend que serao consumidos pelo frontend
SystemUsers.after('post', sendErrorsOrNext).after('put', sendErrorsOrNext)

function sendErrorsOrNext(req, res, next) {

    const bundle = res.locals.bundle

    if (bundle.errors) {

        var errors = parseErrors(bundle.errors)
        res.status(500).json({ errors })

    } else {
        next()

    }
}

function parseErrors(nodeRestFullErrors) {
    const errors = []

    _.forIn(nodeRestFullErrors, error => errors.push(error.message))
    return errors

}

// criando contador para obter o numero total de documentos no banco de dados para paginacao
SystemUsers.route('count', function (req, res, next) {
    SystemUsers.count(function (error, value) {
        if (error) {
            // convencao para tratamento de erros, sendo sempre um objeto com um atributo que posusi um array de mensagens
            res.status(500).json({ errors: [error] })
        } else {
            res.json(value)
        }
    })
})


SystemUsers.route('list', function (req, res, next) {
    let limit = req.body.obj.limit;
    let skip = req.body.obj.skip;

    SystemUsers.find(function (error, users) {

        if (error) {
            res.status(500).json({ errors: [error] })
        } else {
            console.log({users})
            res.json({ users })
        }

    }).limit(Number(limit)).skip(Number(skip))
})


SystemUsers.route('validateFields', function (req, res, next) {
    const campo = req.body.campo || ''
    const valor = req.body.valor || ''

    console.log(req.body);

    if (campo == 'email') {
        SystemUsers.find({ "email": valor }, (error, user) => {

            if (error) {
                return res.status(500).json({ errors: [error] })
            } else if (user) {
                return res.json(user)

            }
        })
    } else if (campo == 'cpf') {

        SystemUsers.find({ "documents.name": "CPF", "documents.value": valor }, (err, user) => {

            if (err) {
                return sendErrorsFromDB(res, err)
            } else if (user) {
                return res.json(user)
            } else {
                return res.json()
            }
        })
    }
});

// exportando os servicoes de restful do módulo de usuario para os outros modulos do backend
module.exports = SystemUsers

