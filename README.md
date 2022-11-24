# Projeto de estudos full-stack  " nlw-copa-rocketseat "

## Como iniciar o projeto após baixa-lo:
1. O primeiro de tudo é ir dentro das 3 pastas do projeto, "backend", "web" e "mobile" e usar o comando `npm install`, para instalar todas as dependências.
2. O próximo passo é colocar o backend para rodar, pois 

### Backend:
Tanto o projeto "web" e principalmente o "mobile" precisam do backend funcionando.
- Para rodar o backend é só no terminal dentro da pasta "backend" rodar o comando `npm run dev`, que o backend ja vai rodar.

#### Como ver os dados do backend no browser:
> Caso queira ver o backend e todos os dados que tem no banco, todas as tabelas é só digitar no terminal o seguinte comando:
`npx prisma studio`

### Projeto Web:
  - Na parte web do projeto só da para ver algumas informações e criar bolões, para fazer apostas mesmo é só no mobile
  - O projeto web foi criado usando o NEXTJs, então para iniciar o o projeto web localmente é só digitar no terminal dentro da pasta "web" `npm run dev`
  
### Projeto Mobile:
  Na parte mobile do projeto é um pouco mais complicado. 
  - Para poder usar o projeto, primeiro de tudo é preciso instalar no seu celular o app "EXPO" que tem nas lojas de app:
  ![Imagem do expo encontrada na playstore](https://play-lh.googleusercontent.com/algsmuhitlyCU_Yy3IU7-7KYIhCBwx5UJG4Bln-hygBjjlUVCiGo1y8W5JNqYm9WW3s=w240-h480-rw)
  >Essa é a imagem do expo
  
  - Depois é preciso que o celular e o seu pc estejam na mesma rede WI-FI.
  
  - Com o expo instalado no celular e os dois dispositivos na mesma rede wi-fi, é preciso dentro da pasta "mobile" rodar o comando `npx expo start`. Ao         fazer isso irá aparecer um QR code, basta ler o QR code com a camera do seu celular, ou com o leitor de QRcode dentro do app "expo".
    Basta seguir esses passos para que ja vai abrir o app no celular funcionando, é só fazer login com alguma conta sua do google e aproveitar.
    
    > - Uma observação a ser feita é que, as vazer pode dar um problema de cache no app mobile, para resolver isso é só rodar o projeto adicionando a flag         `--clear`
    
    > - Tem outro erro que ocorre as vezes também que o "expo" não rodar, ou o qrcode não aparecer, para resolver isso é só reiniciar o roteador.


## Adicionando jogos no bolão:
Infelizmente essa parte não tinha na aula, então eu vou ter que desenvolver ela, para poder dizer quais jogos podem ser feito as apostas.
Porém atualmente da para popular a tabela de jogos para apostar se criar o código dentro do backend da seguinte forma:

1. Tudo acontece basicamente dentro do arquivo "seed.ts" que está dentro da pasta "prisma". Dentro desse arquivo é só apagra o que ja tem lá e escrever alguns códigos para adicionar os jogos do bolão que vão aparecer no app mobile. O código para fazer isso é mais ou menos assim:
    ```
       await prisma.game.create({
        data: {
            date: '2022-12-20T12:00:00.681Z',
            firstTeamCountryCode: 'DE',
            secondTeamCountryCode: 'BR',
            
        }
        
    })
    ```
    Em "firstTeamCountryCode" e "secondTeamCountryCode", as duas letras representam os times que podem ser feitas as apostas, é só substituir essa parte     pelo time que você deseja.
    
2. Após escrever os códigos com as datas,horários e times que vão jogar, é só no terminal dentro da pasta "mobile" digitar `npx prisma db seed`, esse comando vai fazer com que os jogos sejam criados dentro do backend da aplicação.

> É uma forma um pouco "Gambiarra", mas por enquanto é a unica forma de fazer isso.
    
