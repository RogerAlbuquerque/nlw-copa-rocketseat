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
  O projeto web foi criado usando o NEXTJs, então para iniciar o o projeto web localmente é só digitar no terminal dentro da pasta "web" `npm run dev`
  
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
