import express, { NextFunction, Request, Response } from "express";
import { v4 as uuidv } from 'uuid';
import { Customer, Statement } from "./interfaces/customer";

const App = express();

App.use(express.json());

const customers: Customer[] = [];

//middleware
function verifyIfExistsAccountCPF(request: Request, response: Response, next: NextFunction) {
    const { cpf } = request.headers;

    const customer = customers.find(customer => customer.cpf === cpf);

    if(!customer) {
        return response.status(400).json({ message: "Customer not found!" });
    }

    request.customer = customer;

    return next();
}

function getBalance(statement: Statement[]) {
    const balance = statement.reduce((acc: any, operation: any) => {
        if(operation.type === "credit") {
            return acc + operation.amount;
        }

        if (operation.type === "withdraw") {
            return acc - operation.amount
        }
    }, 0);

    return balance;
}

App.post('/account', (request: Request, response: Response) => {
    const { cpf, name } : Customer = request.body;

    const customerAlreadyExists = customers.some((customer) => customer.cpf === cpf);

    if (customerAlreadyExists)  {
        return response.status(400).json({ error: "Customer already exists!" });
    }

    if (!customerAlreadyExists) {
        customers.push({
            cpf,
            name,
            id: uuidv(),
            statement: []
        });

    return response.status(201).send(customers);
    }
} );

App.get('/statement', verifyIfExistsAccountCPF, (request: Request, response: Response) => {
    const { customer } = request;

    return response.status(201).json(customer.statement);
});

App.post("/deposit", verifyIfExistsAccountCPF, (request: Request, response: Response) => {
    const { description, amount } = request.body;

    const { customer } = request;

    const statementOperation : Statement = {
        description,
        amount,
        createdAt: new Date(),
        type: "credit"
    };

    customer.statement.push(statementOperation);

    return response.status(201).send();
});

App.post("/withdraw", verifyIfExistsAccountCPF, (request: Request, response: Response) => {
    const { amount } = request.body;

    const { customer } = request

    const balance = getBalance(customer.statement);

    if (balance < amount) {
        return response.status(400).json({ message: "Insufficient funds!" })
    }

    const statementOperation : Statement = {
        amount,
        createdAt: new Date(),
        type: "withdraw"
    };

    customer.statement.push(statementOperation);

    return response.status(201).send();
});

App.listen(3000, () => {
    console.log("Server is online!");
});