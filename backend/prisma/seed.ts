import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient()

async function main(){

    const user = await prisma.user.create({
       data:{
        name:'Jon Doe',
        email:'john.doe@gmail.com'
       }
    })

    const pool = await prisma.pool.create({
        data:{
            title: 'Example Poll',
            code:'BOL123',
            ownerId:user.id,

            participants:{
                create:{
                    userId: user.id
                }
            }
        }
    })

    await prisma.game.create({
        data: {
            date: '2022-12-20T12:00:00.681Z',
            firstTeamCountryCode: 'DE',
            secondTeamCountryCode: 'BR',
            
        }
        
    })

    await prisma.game.create({
        data: {
            date: '2022-12-30T08:30:00.681Z',
            firstTeamCountryCode: 'BR',
            secondTeamCountryCode: 'AR',

            guesses:{
                create:{
                    firstTeamPoint: 2,
                    secondTeamPoint:1,

                    participant:{
                        connect:{
                            userId_poolId:{
                                userId: user.id,
                                poolId: pool.id
                            }
                        }
                    }
                }
            }
            
        }
        
    })


    // '2022-11-04T17:46:04.681Z'

}


main()