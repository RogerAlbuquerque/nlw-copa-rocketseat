# study project full-stack  "nlw-copa-rocketseat"

## How to start the project after downloading it:
1. The first thing is to go inside the 3 folders of the project, "backend", "web" and "mobile" and use the command `npm install`, to install all the dependencies.
2.The next step is to get the backend running 

### Backend:
Both the "web" project and especially the "mobile" project need a working backend.
- To run the backend, just run the `npm run dev` command in the terminal inside the "backend" folder, and the backend will run.

#### How to see the backend data in the browser?
> If you want to see the backend and all the data in the database, all the tables, just type the following command in the terminal:
`npx prism studio`

### Web Project:
  -In the web part of the project, you can only see some information and create betting pools, to place bets it's only on mobile
  - The web project was created using NEXTJs, so to start the web project locally just type in the terminal inside the "web" folder `npm run dev`
  
### Mobile Project:
  In the mobile part of the project it is a little more complicated.
  - To be able to use the project, first of all you need to install the "EXPO" app on your cell phone, which you can find in the app stores:
  ![Imagem do expo encontrada na playstore](https://play-lh.googleusercontent.com/algsmuhitlyCU_Yy3IU7-7KYIhCBwx5UJG4Bln-hygBjjlUVCiGo1y8W5JNqYm9WW3s=w240-h480-rw)
  >This is the picture from the expo app on playstore
  
  - Then, the cell phone and your PC must be on the same WI-FI network.
  
  - With expo installed on the cell phone and the two devices on the same wi-fi network, it is necessary to run the command `npx expo start` inside the "mobile" folder. When you do this, a QR code will appear, just read the QR code with your cell phone's camera, or with the QRcode reader inside the "expo" app.
     Just follow these steps and the app will open on your mobile phone, just log in with your google account and enjoy.
    
    > - An observation to be made is that sometimes there can be a problem with the cache in the mobile app, to solve this just run the project adding the flag `--clear`
    
    > - There is another error that occurs sometimes when the "expo" does not run, or the qrcode does not appear, to solve this just restart the router.


## Adding games to the pool:
Unfortunately, this part was not included in the class, so I will have to develop it, to be able to say which games can be placed with bets.
However, currently, you can populate the table of games to bet if you create the code inside the backend as follows:

1. Everything basically happens inside the "seed.ts" file that is inside the "prisma" folder. Inside that file, just delete what's already there and write some codes to add the sweepstakes games that will appear in the mobile app. The code to do this looks something like this:
    ```
       await prisma.game.create({
        data: {
            date: '2022-12-20T12:00:00.681Z',
            firstTeamCountryCode: 'DE',
            secondTeamCountryCode: 'BR',
            
        }
        
    })
    ```
   In "firstTeamCountryCode" and "secondTeamCountryCode", the two letters represent the teams that can be bet on, just replace that part with the team you want.
    
2. After writing the codes with the dates, times and teams that will play, just type `npx prisma db seed` in the terminal inside the "mobile" folder, this command will cause the games to be created within the backend of the application.

> It's a bit work around, but for now it's the only way to do it.
    
