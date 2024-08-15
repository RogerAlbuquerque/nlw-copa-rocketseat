import { FastifyInstance } from "fastify"
import { prisma } from "../lib/prisma"
import {z} from "zod"                                            //Esse pacote serve para fazer tipagem de requisições, é como se fosse o typescript do backend.
import ShortUniqueId from "short-unique-id"                      // Gera IDs aleatórios e únicos
import { authenticate } from "../plugins/authenticate"

export async function  poolRoutes(fastify: FastifyInstance) {
    //Ver o número de bolões
    fastify.get('/pools/count', async ()=>{
        // return {count:0}                //Isso aqui é como se fosse o "res.send()" do express
    
     let count = await prisma.pool.count()          // Isso aqui retorna o número de elemento que tem na tabela "pool"
            
        return {count}
    
    })


    //Criar bolões com dono (via mobile com token) ou sem dono de inicio(Via pc e o dono é o primeiro a entrar no bolão)
    fastify.post('/pools', async (request, reply)=>{       

        const createPoolBody = z.object({               // Essa parte diz que o valor é um objeto,
            title:z.string()                            // Essa fala que o objeto tem um "title" com valor que é do tipo "string"
                                                        // Essa é a funcionalidade do pacote "ZOD" ela obriga que esse valor cuspa uma string, não pode ser null
        })

     const {title} = createPoolBody.parse(request.body) // Esse title é o nome do bolão, e o 'parse' é pra converter o body no tipo correto especificado pelo 'zod', se o body for diferente do registrado acima. da erro
     
     
     const generate = new ShortUniqueId({length: 6})    //ele vai gerar um ID aleatório de 6 digitos
     const code = String(generate()).toUpperCase()      //Convertendo para string em caixa alta, o resultado do "generate()"
     

     
     try{

        await request.jwtVerify()

        await prisma.pool.create({
            data:{
                title,
                code: code,
                ownerId: request.user.sub,          // Esse sub, só funciona normal aqui por causa do codigo la em "@types"
                
                participants:{                      // Como tem relação as duas, da para criar um dado nessa tabela aqui de dentro. Aqui ta fazendo com o que o mesmo usuário que criou o bolão, 
                                                    // ja entre como participante no próprio bolão adicionando ele na tabela "participants".
                                                    
                    create:{                
                        userId:request.user.sub,
                    }
                }
            }
        })

     }catch{

        await prisma.pool.create({
            data:{
                title,
                code: code    
            }
        })

     }
     






        return reply.status(201).send({code})

    })


    //Rota para um usuário entrar em um bolão. Entrar em um bolão significa, criar um novo registro na tabela "participant"
    fastify.post('/pools/join', {
        onRequest:[authenticate]        //Com isso a rota só é acessível se o usuário estiver autenticado.
        },
        async (request, reply)=>{

            const joinPoolBody = z.object({               
                code:z.string()                             
            })

            const { code } = joinPoolBody.parse(request.body)

            const pool = await prisma.pool.findUnique({
                where:{
                    code    
                },
                include:{           // Essa parte é uma funcionalidade do prisma que faz ser possível adicionar mais coisas na pesquisa.
                    participants:{  // Aqui ele vai retornar além da existência do bolão, uma lista de usuários com o mesmo ID do que ta chamando dentro desse bolão.
                        where:{
                            userId:request.user.sub,
                        }
                    }
                }
            })

            if (!pool){
                    return reply.status(400).send({
                        message: 'Pool not found.'
                    })
            }

            if(pool.participants.length > 0){
                return reply.status(400).send({
                    message: 'You alredy joined this pool.'
                })
            }


            // Se "pool" for "true" então  a variável tem todos os dados do bolão.
            // O código abaixo é usado para atualizar um dado dentro de uma tabela utilizando o método "update" invés do "create".

            if(!pool.ownerId){
                await prisma.pool.update({
                    where:{                         // Essa parte indica qual área dad tabela "pool" será atualizada
                        id:pool.id,     
                    },
                    data:{                          // Essa parte são quais os novos dados e  onde que serão adicionados na tabela.Nessse caso o dono da tabela será o primeiro usuário que entrar no bolão.
                        ownerId: request.user.sub,  // Que nesse caso é quem cria o bolão. (Essa é uma solução paliativa para caso o bolão seja criado no pc e não na versão mobile)
                    }
                })
            }   

            await prisma.participant.create({
                data:{
                    poolId:pool.id,
                    userId: request.user.sub,
                }
            })


            return reply.status(201).send()

        
        })


    // Essa rota é para mostrar todos os bolões que o usuário está participando
    fastify.get('/pools', {
        onRequest:[authenticate]       
        }, async (request)=>{

            const pools = await prisma.pool.findMany({
                where:{
                    participants:{
                        // "some" significa que vai procurar  usuário na lista de participantes que pelo menos 1 deles tenha os dados abaixo referente ao usuário logado
                        // (pode ser "every"[todos tem que ter o dado], ou "none" (nenhum pode ter o dado))
                        some:{      
                            userId: request.user.sub,
                        }
                    }
                },include:{
                    _count:{        //Esse dado vai incluir o resultado em valor numérico referente a quantas tabelas "participant" existem dentro desse bolão. É so passar o nome do campo, e "true" caso queira que ele                                        // seja contado, tipo "id:true"
                        select:{                
                            participants:true  // Quando coloca só "true" na busca do prisma, quer dizer que é pra ele retornar todas as informações referentes a "participant". Para retornar uma em específico, precisaria                                                //colocar o select aqui também
                        }
                    },
                    participants:{
                        select:{                       
                            id:true,

                        user:{              //Como "user" tem relação com "participants" é possível pegar dados de dentro dessa tabela desse jeito aqui
                            select:{
                                avatarUrl:true,
                            }
                        }
                        },
                        take: 4,            // Aqui segue a mesma ideia do de cima, só que essa opção "take" diz ue é para pegar só os 4 primeiros                    
                    },

                    // "owner: true"  desse jeito retornaria todos os dados do dono do bolão, ja que essa é a chave estrangeira vinda de "user"
                    owner: {
                        select:{    //Dessa forma vai trazer só os dados que forem indicados abaixo
                            id:true,
                            name:true,                           

                        }
                    }
                }
            })


            return { pools }
        })


    fastify.get('/pools/:id', {onRequest: [authenticate]}, async (request) => { // Normalmente em requisições "GET" não tem informações sendo passadas no corpo da requisição, aquele que se pega com "request.body"

        const getPoolParams = z.object({               
            id: z.string()                             
        })

        const { id } = getPoolParams.parse(request.params)

        const pools = await prisma.pool.findUnique({
            where:{
                id,             // Isso é tipo dizer "id: id" em que o segundo "id" é referente a variável.
            },include:{
                _count:{
                    select:{                
                        participants:true  
                    }
                },
                participants:{
                    select:{                       
                        id:true,

                    user:{     
                        select:{
                            avatarUrl:true,
                        }
                    }
                    },
                    take: 4,  
                },

              
                owner: {
                    select:{  
                        id:true,
                        name:true,                           

                    }
                }
            }
        })


        return { pools }
    })
}
