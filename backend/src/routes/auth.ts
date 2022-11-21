import { FastifyInstance } from "fastify"
import { z } from "zod"
import { prisma } from "../lib/prisma"
import { authenticate } from "../plugins/authenticate"


export async function  authRoutes(fastify: FastifyInstance) {
   
    fastify.get("/me",{
        onRequest:[authenticate]        // Por causa desse script, se não existir um token, o código nem passa daqui pra baixo.
    },async (request)=> {        
        return {user: request.user}     // Se o script de "authenticate" confirmar que tem um token, passa a ser possível usar esse request pra pegar os dados armazenados no token.
    })

   
    fastify.post('/users', async (request)=>{

        const createUserBody = z.object({                                                                        
            access_token:z.string(),    

        })

        const { access_token } = createUserBody.parse(request.body)                // Isso aqui vai armazenar o token que vem do mobile


            
        const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {		
            method: 'GET',
            headers:{
                Authorization: `Bearer ${access_token}`				
                                                                                        
            }
        })


        const userData = await userResponse.json()

        const userInfoSchema = z.object({						// Aqui abaixo são os dados que a api do google vai retornar
            id:      z.string(),
            email:   z.string().email(),						// Esse dado é uma string, porém é passado mais o ".email" para o zod checar se o email está formatado corretamente	
            name:    z.string(),								// É o nome cadastrado na conta do google
            picture: z.string().url()							//	Isso vai retornar uma url que vai mostrar a foto de perfil do usuário.				
        })
            
        const userInfo = userInfoSchema.parse(userData)

        let user = await prisma.user.findUnique({
            where:{
                googleId: userInfo.id
            }
        })

        if(!user){
            user = await prisma.user.create({
                data:{
                    googleId: userInfo.id,
                    name: userInfo.name,
                    email:userInfo.email,
                    avatarUrl:userInfo.picture
                }
            })
        }


        //Usuário ja foi criado, agora é preciso criar o token para tranzitar dentro da aplicação e não precisar fazer requisição pro google de novo.

      const token = fastify.jwt.sign({              //Aqui é o payload do token esse "sign" é pra adiconar coisas nele.
        name: user.name,
        avatarUrl: user.avatarUrl,

      },{
        sub: user.id,
        expiresIn: '7 days', 
      })


        return { token }
    })
}



