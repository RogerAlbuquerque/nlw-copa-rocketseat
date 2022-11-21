import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient ({            // Essa é a parte que faz a conexão com o banco de dados já
    log:['query'],                                   // Esse comando cria um log para mostrar todas as querys que o prisma está executando no banco, porém é opcional só com o 
                                                     // "new PrismaClient()"" acho que ja morria
                                                     // Essa variável vai servir para mecher com os dados de dentro do banco
})