import { FastifyInstance } from "fastify"
import { z } from "zod"
import { prisma } from "../lib/prisma"
import { authenticate } from "../plugins/authenticate"

export async function  guessRoutes(fastify: FastifyInstance) {
    fastify.get('/guesses/count', async ()=>{
      
        let count = await prisma.guess.count()         
           return {count}
    })

    fastify.post('/pools/:poolId/games/:gameId/guesses', {onRequest:[authenticate]}, async (request, reply) =>{

        const createGuessParams = z.object({    // Essa parte é para receber na url da requisição os dados do usuário e de qual bolão o mesmo está fazendo a aposta
            poolId: z.string(),
            gameId: z.string(),
        })

        const createGuessBody = z.object({      // Essa parte é para receber no corpo da requisição a pontuação de cada time
            firstTeamPoint: z.number(),
            secondTeamPoint: z.number(),
        })

        const { poolId, gameId } = createGuessParams.parse(request.params)
        const { firstTeamPoint, secondTeamPoint } = createGuessBody.parse(request.body)

       
       
       
//Aqui são basicamente as regras de negócios do projeto


    // Se o usuário não participa do bolão, não pode fazer aposta       
        const participant = await prisma.participant.findUnique({
            where:{
                userId_poolId:{         // Esse é um dado que não tem no arquivo do prisma, porém existe dentro do banco quando se cria uma relação entre 2 tabelas
                                        // e nesse caso esse comando vai buscar ela, pois seu id, é a junção do id das suas 2 foreign key
                    poolId,
                    userId: request.user.sub,
                }
            }
        })


        if (!participant){  // Isso aqui é caso o "where" ali de cima que testa se o usuário faz parte do bolão, vier vazio, pq quer dizer que ele não entrou no bolão.
            return reply.status(400).send({message: "You'are not allowed to create a guess inside this pool."})
        }

        
    //Se o usuário ja fez uma aposta, não pode fazer outra no mesmo jogo e no mesmo bolão.
        const guess = await prisma.guess.findUnique({
            where:{
                participantId_gameId:{
                    participantId: participant.id,
                    gameId,
                }
            }
        })

        if (guess){
            return reply.status(400).send({message: "You already sent a guess to this game on this pool."})
        }

        const game = await prisma.game.findUnique({
            where:{
                id:gameId
            }
        })

        if(!game){
            return reply.status(400).send({message: "Game not found."})
        }

        if(game.date < new Date()){
            return reply.status(400).send({message: "You cannot send guesses after the game date."})
        }

//Se tudas essas validações e regras passarem, ai sim cria-se o palpite
        await prisma.guess.create({
            data:{
                gameId,
                participantId: participant.id,
                firstTeamPoint,
                secondTeamPoint,
            }
        })
        
        return reply.status(201).send()
    } )
}