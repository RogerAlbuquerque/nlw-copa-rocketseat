import { VStack, Heading, useToast } from "native-base";

import { Header } from "../components/Header";
import { Button } from "../components/Button";
import { Input  } from "../components/Input";
import { useState } from "react";
import { api } from "../services/api";
import { useNavigation } from "@react-navigation/native";


export function Find(){
    const [isLoading, setIsLoading] = useState(false);
    const [code, setCode] = useState('');

    const toast = useToast();
    const { navigate }= useNavigation();

        async function handleJoinPool(){
            try{
                setIsLoading(true)
                if(!code.trim()){
                   return toast.show({          // Por causa desse "return" caso o código entre aqui, ele acaba aqui.
                        title: 'Informe o código',
                        placement: 'top',
                        bgColor: 'red.500'
    
                    });
                }

                    await api.post('/pools/join', {code});
                    toast.show({
                        title: 'Você entrou no bolão com sucesso',
                        placement: 'top',
                        bgColor: 'green.500'
    
                    })

                    navigate('pools')
                    setIsLoading(false)
                }

            catch(error){
                console.log(error)
                setIsLoading(false)

                if(error.response?.data?.message === 'Pool not Found.'){
                    return toast.show({
                        title: 'Bolão não foi encontrado',
                        placement: 'top',
                        bgColor: 'red.500'
    
                    })
                }

                if(error.response?.data?.message === 'You alredy joined this pool.'){
                    return toast.show({
                        title: 'Você ja está nesse bolão',
                        placement: 'top',
                        bgColor: 'red.500'
    
                    })
                }

                toast.show({
                    title: 'Não foi possível encontrar o bolão',
                    placement: 'top',
                    bgColor: 'red.500'

                })

               
            }
        }

    return (
        //  O "VStack" serve para deixar cada componente um abaixo do outro, é tipo umma "div" mais ou menos
       <VStack flex={1} bgColor="gray.900">          
            <Header title="Buscar por código" showBackButton />

            <VStack mt={8}  mx={5} alignItems='center'>
               
                <Heading fontFamily='heading' color='white'  fontSize='xl' my={8} textAlign='center'>
                    Encontre um bolão através de {'\n'}
                    seu código único
                </Heading>

                <Input mb={2} 
                placeholder="Qual código do seu bolão?" 
                onChangeText={setCode} 
                
                // Essa propriedade serve para fazer com que os caracteres do teclado fiquem por padrão para digitar em maiúsculos.
                autoCapitalize ='characters'/>  

                <Button title="BUSCAR BOLÃO" isLoading={isLoading} onPress={handleJoinPool} />
            
            </VStack>
       </VStack>
    )
}