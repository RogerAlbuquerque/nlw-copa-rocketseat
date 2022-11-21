// Arquivos com a extensão ".d.ts" são arquivos que vão ter somente definição de tipos do typescript, não vai ter código.
// É basicamente um arquivo para o typescript ler, e obter informações sobre o tipo de algum dado
// No github do "fasstify-jwt" se procurar por "typescript", da de achar falando sobre exatamente como montar esses tipsos para token jwt.

import "@fastify/jwt";

declare module '@fastify/jwt'{
    interface FastifyJWT{
        user:{
            sub: string;
            name:string;
            avatarUrl:string;
        }
    }
}