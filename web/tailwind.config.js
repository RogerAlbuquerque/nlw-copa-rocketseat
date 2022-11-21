/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.tsx',    //Aqui diz que qualquer arquivo dentro de src, e que tenha a extensão .tsx pode ser estilizado com talwind
  ],
  
  theme: {
    extend: {
      fontFamily:{
        sans:'Roboto, sans-serif'     //Aqui é para indicar qual a fonte padrão utilizada pelo tailwind
      },

      backgroundImage:{
        app:'url(/app-bg.png)'
      },

      colors:{                        //Essa estrutura serve para subsituir a cor padrão do tailwhind "grey-900" por essa indicada abaixo
          gray:{
            100: '#E1E1E6',
            300: '#8D8D99',
            600:'#323238',
            800:'#282824',
            900:'#121214'           
          },

          yellow:{
            500:'#F7DD43',
            700:'#E5CD3D'
          },

          ignite:{
            
            500: '#129E57'
          }
      }
    },
  },
  plugins: [],
}
