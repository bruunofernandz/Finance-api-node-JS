"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const uuid_1 = require("uuid");
const App = (0, express_1.default)();
App.use(express_1.default.json());
const customers = [];
//middleware
function verifyIfExistsAccountCPF(request, response, next) {
    const { cpf } = request.headers;
    const customer = customers.find(customer => customer.cpf === cpf);
    if (!customer) {
        return response.status(400).json({ message: "Customer not found!" });
    }
    request.customer = customer;
    return next();
}
App.post('/account', (request, response) => {
    const { cpf, name } = request.body;
    const customerAlreadyExists = customers.some((customer) => customer.cpf === cpf);
    if (customerAlreadyExists) {
        return response.status(400).json({ error: "Customer already exists!" });
    }
    if (!customerAlreadyExists) {
        customers.push({
            cpf,
            name,
            id: (0, uuid_1.v4)(),
            statement: []
        });
        return response.status(201).send(customers);
    }
});
App.get('/statement', verifyIfExistsAccountCPF, (request, response) => {
    const { customer } = request;
    return response.status(201).json(customer.statement);
});
App.listen(3000, () => {
    console.log("Server is online!");
});
