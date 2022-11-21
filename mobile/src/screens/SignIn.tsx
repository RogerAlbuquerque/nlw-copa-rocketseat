import { Center, Text, Icon } from "native-base";
import { Fontisto } from "@expo/vector-icons"
import { useAuth } from "../hooks/useAuth";

import Logo from '../assets/logo.svg'
import { Button } from "../components/Button";



export function SignIn(){
    const {signIn, isUserLoading} = useAuth();           // Essa parte recebe os dados do componente na pasta 'context', é só usar os dados em algum lugar agora
    return(
        <Center flex={1} bgColor="gray.900" p={7}>

            <Logo width={240} height={40}/>
                <Button 
                    title='ENTRAR COM O GOOGLE'
                    leftIcon={<Icon as={Fontisto} name="google" color="white" size="md"/>}  
                    type='SECONDARY' 
                    mt={12}
                    onPress={signIn}    //É a função vinda do 'context'

                    isLoading={isUserLoading}    //Essa propriedade quando é "true" vai ficar um loading no meio do botão , e da para personalizar esse loading também dentro do componente
                    _loading= {{_spinner:{color: 'white'}}} 
                />
                <Text color='white' textAlign='center' mt={4}>          {/* 'mt' é marginTop*/}
                    Não utilizamos nenhuma informação além {'\n'}  {/* esse \n é para a quebra de linha, tipo o <br>*/}
                     do seu e-mail para a criação da sua conta.
                </Text>



            {/* <Text color={"white"} fontSize={60} fontWeight="bold">
                Sign In
            </Text> */}
      </Center>
    )
}