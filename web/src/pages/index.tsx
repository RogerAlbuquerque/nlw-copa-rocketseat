interface HomeProps{
  poolCount: number;
  guessCount:number;
  userCount: number;
}

import appPreviewImg from '../assets/app-nlw-copa-preview.png'
import logoImg from '../assets/logo.svg'
import usersAvatarExampleImg from '../assets/users-avatar-example.png'
import iconCheckImage from '../assets/icon-check.svg'


import Image from 'next/image'
import { api } from '../lib/axios';
import { FormEvent, useState } from 'react';            //Esse "formEvent" foi o pacote importado para o evento

export default function Home(props: HomeProps) {

  const [poolTitle, setPoolTitle] = useState('')

  async function createPool(event:FormEvent){           // Observe que foi importado um pacote referente a esse "tipo" para cancelar a ação padrão do submit do form
    event.preventDefault()

    try {
     const response = await api.post('/pools',{
        title: poolTitle
      });

      const{code} = response.data

     await navigator.clipboard.writeText(code)              //Esse comando é para qua o 'Control + C'do usuário fique o conteúdo de "code" nele

     alert('Bolão criado com sucesso, o código foi copiado para a área de transferência')
     setPoolTitle('')
     
    }catch(err){
      console.log(err)
      alert('Falha ao criar o bolão, tente novamente')
    }
  }


  return (    
    <div className='max-w-[1124px] h-screen mx-auto grid grid-cols-2 gap-28 items-center'>
      <main>
        <Image src={logoImg} alt="Logo do site, NLW Copa" />
        <h1 className='mt-14 text-white text-5xl font-bold leading-tight'>        
          Crie seu proprio bolão da copa e compartilhe com seus amigos        
        </h1>


        <div className='mt-10 flex items-center gap-2'>
          <Image src={usersAvatarExampleImg} alt="" />
          <strong className='text-gray-100 text-xl'>

          <span className='text-ignite-500'> +{props.userCount}</span> pessoas já estão usando

          </strong>
        </div>

        <form onSubmit={createPool} className='mt-10 flex gap-2'>
          <input className='flex px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100'
          type="text" 
          required 
          placeholder='Qual o nome do seu bolão'
          onChange={event => setPoolTitle(event.target.value)}
          value={poolTitle}
          />

          <button 
          className='bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700'
          type='submit'
          >
            Criar meu bolão
            </button>
        </form>


        <p className='mt-4 text-sm text-gray-300 leading-relaxed'>
          Após criar o seu bolão,você reberá um código único que poderá usar para convidadr outras pessoas
        </p>

        <div className='mt-10 pt-10 border-t border-gray-600 flex items-center justify-between text-gray-100'>
          <div className='flex items-center gap-6'>
            <Image src={iconCheckImage} alt="" />
            <div className='flex flex-col'>
              <span className='font-bold text-2xl'>+{props.poolCount}</span>
              <span>Bolões criados</span>
            </div> 

            <div className='w-px h-14 bg-gray-600'>

            </div>
            
          </div>
          <div className='flex items-center gap-6'>
              <Image src={iconCheckImage} alt="" />
              <div className='flex flex-col'>
                <span className='font-bold text-2xl'>+{props.guessCount}</span>
                <span>Palpites enviados</span>
              </div>
            

          </div>
        </div>

      </main>

      <Image src={appPreviewImg} alt="Dois celulares exibindo uma prévia da aplicação móvel do NLW Copa" />
      {/* O next tira a qualidade das imagens por padrão, para deixar elas na qualidade máxima usa a propriedade quality e passa 100*/}
    </div>
  )
}

export const getServerSideProps = async () => {

  // const poolCountResponse = await api.get('/pools/count')         // Usando o axios facilita, invés de chamar vários "fetch", o código fica mais clean
  // const guessCountResponse = await api.get('/guesses/count')

  const [poolCountResponse,guessCountResponse,userCountResponse] = await Promise.all([
    api.get('/pools/count'),              //Basicamente, o método de cima, a segunda chamada precisa esperar a primeira para acontecer.Usando esse método do axios
    api.get('/guesses/count'),            //as duas são chamadas simultaneamente. Isso torna o código mais perfomático em larga escala.
    api.get('/users/count')               //'api' está fazendo referência ao "baseURL" dentro de 'lib/axios', ele chama o get dentro daquele caminho base nessas rotas
  ])                                      




  
  return{
    props:{
      poolCount: poolCountResponse.data.count,
      guessCount:guessCountResponse.data.count,
      userCount: userCountResponse.data.count
    }
  }
}
