import { VStack, Heading, Text, useToast } from "native-base";
import { Header } from "../components/Header";
import { useState } from 'react'

import Logo from '../assets/logo.svg'
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { api } from "../services/api";


export function New(){
    const[title, setTitle] = useState('');
    const[isLoading, setIsLoading] = useState(false);

    const toast = useToast();   // Esse hook é uma forma mais bonitinha e mais estilizada de dar um Alert no mobile.

   async function handlePoolCreate(){
        if(!title.trim()){
            // Alert.alert('Opa', 'informe o nome do bolão!')    // Esse é o alert do react-native o "opa" vai ficar tipo um <h1>, então é titulo e subtítulo. tem que fazer o import do {Alert} from 'native-base'       
            
            // Essa é a forma de usasr o hook toast
            return toast.show({
                title: 'Informe um nome para o seu bolão',
                placement: 'top',
                bgColor: 'red.500'
            });
        }

        try{
            setIsLoading(true);
            await api.post('/pools', {title}) 

            toast.show({
                title: 'Bolão criado com sucesso',
                placement: 'top',
                bgColor: 'green.500'
            });
        
                setTitle('')

        }catch(error){
                console.log(error)
                toast.show({
                    title: 'Não foi possível criar o bolão',
                    placement: 'top',
                    bgColor: 'red.500'
                });
        }finally{
            setIsLoading(false);
        }
    }



    return (
        //  O "VStack" serve para deixar cada componente um abaixo do outro, é tipo umma "div" mais ou menos
       <VStack flex={1} bgColor="gray.900">          
            <Header title="Criar novo bolão" />

            <VStack mt={8}  mx={5} alignItems='center'>
                <Logo />
                <Heading fontFamily='heading' color='white'  fontSize='xl' my={8} textAlign='center'>
                    crie seu próprio bolão  da copa e compartilhe entre amigos!
                </Heading>
                                                                      {/* Isso aqui é a mesma coisa daquele "(e) => setTitle(e.target.value)" é só a forma resumida */}
                <Input mb={2} placeholder="Qual o nome do seu bolão" value={title} onChangeText={setTitle}/>  
            
                <Button title="CRIAR MEU BOLÃO" onPress={handlePoolCreate} isLoading={isLoading }/>

                <Text color="gray.200" fontSize='sm' textAlign='center' px={10} mt={4}>
                    Após criar o seu bolão, você recebera um código único para convidar outras pessoas
                </Text>

            
            </VStack>
       </VStack>
    )
}