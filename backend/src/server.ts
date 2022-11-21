import Fastify from "fastify"                  
import cors from "@fastify/cors"
import jwt from "@fastify/jwt"

import { poolRoutes } from "./routes/pools"
import { authRoutes } from "./routes/auth"
import { userRoutes } from "./routes/user"
import { guessRoutes} from "./routes/guess"
import { gameRoutes } from "./routes/game"



 


async function bootstrap(){

    const fastify = Fastify({      //Isso aqui é a mesma coisa de fazer aquele "const app = express()"
        logger:true                // Essa propriedade faz com que o fastify imprima logs para tudo de novo que acontecer na aplicação
    })

    await fastify.register(cors,{
        origin: true                              // Sem isso, por padrão, se outras aplicações chamarem essa rota via fetch, talvez ele não retorne nada
    })


    await fastify.register(jwt, {
            secret:'nlwcopa'
    })

    await fastify.register(authRoutes)
    await fastify.register(userRoutes)
    await fastify.register(poolRoutes)
    await fastify.register(guessRoutes)
    await fastify.register(gameRoutes)
    

   
    await fastify.listen({port: 3333, host: '0.0.0.0' })             // Esse host é para rodar no mobile, porque o mobile faz um espelhamento da rota do backend, para uma rota interna dela que fica exatamente nesse endereço do host.
}

bootstrap()