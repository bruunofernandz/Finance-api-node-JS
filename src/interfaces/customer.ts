export interface Customer {
    cpf: string,
    name: string,
    id: string,
    statement: Statement[]
}

export interface Statement {
    description?: string,
    amount: number,
    createdAt: Date,
    type: "credit" | "withdraw"
}
