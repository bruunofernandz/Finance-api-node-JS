declare namespace Express {
    interface Request {
        customer: { //atenção pra grafia, não é "costumer" mas como seu código tá com com "costumer" em todo lugar, vc pode colocar "costumer" aqui tb
            cpf: string,
            name: string,
            id: string,
            statement: any[]
          };
    }
  }