import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../services/api";
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session'
import * as WebBrowser from 'expo-web-browser'

WebBrowser.maybeCompleteAuthSession();

interface UserProps{                     //Essa parte é a tipagem do uuário que pode ser recebido no context
    name:string;           
    avatarUrl: string;
}

export interface AuthContextDataProps{   // Essa parte é a tipagem do "Context"
user:UserProps; 
isUserLoading: boolean;                                
signIn:() => Promise<void>;              //Isso aqui ta dizendo que o context, precisa ter uma função promise dentro dele que o retorno nulo              
}




export const AuthContext = createContext({} as AuthContextDataProps);     // Aqui é a criação do context, iniciando com um valor vazio, por isso as chaves
                                                                          // Essa é a parte responsável por armazenar o valor do contexto








interface AuthProviderProps{                         //Essa é a tipagem do children da função desse componente
children: ReactNode                                  // Esse "ReactNode" é uma tipagem para childrens, porém é um pacote que precisa ser importado do 'react' la em cima.
}

export function AuthContextProvider({children}:AuthProviderProps ){         //Essa função é a responsável por atribuir valores ao context e compartilhar ele com toda a aplicação 
                                                                            //Esse "children" é porque sempre que algo precisar de autenticação, precisa ser envolvido pelo componente do context E apartir desse componente que vai renderizar tudo, daí com o children, vai renderizar qualquer coisa que tiver envolvido por ele
    
   const [user, setUser] = useState<UserProps>( {} as UserProps)            //Aqui ta dizendo qual o tipo do state, ele começa vazio, mas "UserProps" é o seu tipo
   const [isUserLoading, setIsUserLoading] = useState (false)
   
   
   const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: process.env.CLIENT_ID,
        redirectUri: AuthSession.makeRedirectUri({useProxy: true}),
        scopes: ['profile', 'email']
    })


    async function signIn(){
      try{
        setIsUserLoading(true)
        await promptAsync()

      }catch(error){
        console.log(error)
        throw error;
      }finally{
        setIsUserLoading(false)
      }
    }
    
    async function signInWithGoogle(access_token: string){
        // console.log("TOKEN DE AUTENTICAÇÃO ====> " + access_token)

        try{
          setIsUserLoading(true)
          const tokenResponse = await api.post('/users', {access_token} );
          api.defaults.headers.common['Authorization'] = `Bearer ${tokenResponse.data.token}`;    //Todas as requisição vinda daquela baseURL do axios, vão ter esse token no seu cabeçalho ou header

          const userInfoResponse = await api.get('/me');
          setUser(userInfoResponse.data.user)

        }catch(error){
            console.log(error)
            throw error
        }finally{
          setIsUserLoading(false)
        }
    }

    useEffect(()=> {                   /*  A interrogação é pra ver se o objeto está nulo, se não tem conteudo */
        if(response?.type === 'success' && response.authentication?.accessToken){   
            signInWithGoogle(response.authentication.accessToken)
        }
    },[response]);

    return(

        <AuthContext.Provider value={{                          //Esse "value" está esperando dados de acordo com a tipagem definidade em "AuthContextDataProps"
            signIn,
            isUserLoading,
            user
        }}>                   

            {children}
        </AuthContext.Provider>
        
    )
}