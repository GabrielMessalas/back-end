const _ = require('lodash')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const systemUsers = require('./systemUsers.js')
const auditCollection = require('../auditCollection/auditCollection.js')

const env = require('../../.env')

const emailRegex = /\S+@\S+\.\S+/
const passwordRegex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,16})/
const cpfRegex = /([0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2})/

const sendErrorsFromDB = (res, dbErrors) => {
    const errors = []
    _.forIn(dbErrors.errors, error => errors.push(error.message))
    return res.status(400).json({ errors })
}

const login = (req, res, next) => {
    const email = req.body.email || ''
    const password = req.body.password || ''
    systemUsers.findOne({ email }, (err, user) => {
        if (err) {
            return sendErrorsFromDB(res, err)
        } else if (user && bcrypt.compareSync(password, user.password)) {
            const token = jwt.sign(user.toJSON(), env.authSecret, {
                expiresIn: "4h"
            })

            const { name, email } = user

            for (let documents of user.documents) {
                if (documents.name == "CPF") {
                    cpf = documents.value;
                }
            }

            res.json({ name, cpf, email, token })

        } else {
            return res.status(400).send({ errors: ['Usuário/Senha inválidos'] })
        }
    })
}

const validateToken = (req, res, next) => {
    const token = req.body.token || ''
    jwt.verify(token, env.authSecret, function (err, decoded) {
        return res.status(200).send({ valid: !err })
    })
}

const signup = (req, res, next) => {
    console.log('signup')
    const name = req.body.name || ''
    const cpf = req.body.cpf || ''
    const email = req.body.email || ''
    const password = req.body.password || ''
    const confirmPassword = req.body.confirm_password || ''
    const active = req.body.active || ''
    if (!email.match(emailRegex)) {
        return res.status(400).send({ errors: ['O e-mail informado está inválido'] })
    }
    if (!cpf.match(cpfRegex)) {
        return res.status(400).send({
            errors: [
                "CPF Informado está incorreto."
            ]
        })
    }
    if (!password.match(passwordRegex)) {
        return res.status(400).send({
            errors: [
                "Senha precisar ter: uma letra maiúscula, uma letra minúscula, um número, uma caractere especial(@#$%) e tamanho entre 6-16."
            ]
        })
    }
    const salt = bcrypt.genSaltSync()
    const passwordHash = bcrypt.hashSync(password, salt)
    if (!bcrypt.compareSync(confirmPassword, passwordHash)) {

        return res.status(400).send({ errors: ['Senhas não conferem.'] })
    }


    systemUsers.findOne({
        $or: [{ 'email': email },
        { 'documents.name': 'CPF', 'documents.value': cpf }]
    }, (err, user) => {
        if (err) {
            return res.status(400).send(err)
        } else if (user) {
            return res.status(400).send({ errors: ['Usuário já cadastrado.'] })
        } else {
            const newUser = new systemUsers({ name, email, password: passwordHash, active, documents: [{ name: 'CPF', value: cpf }] })
            newUser.save(err => {
                if (err) {
                    return sendErrorsFromDB(res, err)
                } else {
                    login(req, res, next)
                }
            })
        }
    })
}

const cadAudit = (req, res, next) => {

    const nameUser = req.body.nameUser || ''
    const numberCpfUser = req.body.numberCpfUser || ''
    const date = req.body.date || ''
    const ipUser = req.body.ipUser || ''
    const session = req.body.session || ''
    const description = req.body.description || ''

    const newAudit = new auditCollection({ nameUser,  numberCpfUser, date, ipUser, session, description })
    newAudit.save(err => {
        if (err) {
            return sendErrorsFromDB(res, err)
        } else {
            console.log("Deu Boa")
        }
        
    })
}

module.exports = { login, signup, validateToken, cadAudit }