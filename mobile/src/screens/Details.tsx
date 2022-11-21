import { HStack, useToast, VStack } from "native-base";
import { Header } from "../components/Header";
import { useRoute } from "@react-navigation/native";        // Lembrando que esses hook serve para trabalhar com dados que vem da url
import { useEffect, useState } from "react";
import { Loading } from "../components/Loading";
import { Guesses } from "../components/Guesses";
import { PoolCardProps } from "../components/PoolCard";
import {api} from "../services/api"
import { PoolHeader } from "../components/PoolHeader";
import { EmptyMyPoolList } from "../components/EmptyMyPoolList";
import { Option } from "../components/Option";
import {Share} from 'react-native'      // Esse componente serve para compartilhamento de algum dado da aplicação pelo celular



interface RouteParams{
    id: string;
}

export function Details(){

    const[optionSelected, setOptionSelected] = useState<'guesses' | 'ranking'>('guesses')
    const [poolDetails, setPoolDetails] = useState<PoolCardProps>({} as PoolCardProps)
    const [isLoading, setIsLoading] = useState(true);
    

    const route = useRoute();
    const { id } = route.params as RouteParams; // Nessa variável vai ficar armazenado os parâmetros que vieram da url
    

    const toast = useToast();

    async function fetchPoolDetails(){
        try{
            setIsLoading(true)

            const response = await api.get(`/pools/${id}`)
            setPoolDetails(response.data.pools)
            


         }catch(error){
            toast.show({
                title: 'Não foi possível carregar os detalhes do bolão',
                placement: 'top',
                bgColor: 'red.500'

            })
            
         }finally{
             setIsLoading(false)
         }
    }

    async function handleCodeShare(){
       await Share.share({
            message:poolDetails.code        // Aqui dentro são passados os dados a serem compartilhados.
        });
    }

    useEffect(()=>{fetchPoolDetails()},[id])

    if(isLoading){
        return <Loading />
    }
    return(
        <VStack flex={1} bgColor="gray.900">
            <Header title={poolDetails.title} onShare={handleCodeShare} showBackButton showShareButton/>

            {poolDetails._count?.participants > 0 ? 
                <VStack px={5} flex={1}>
                    <PoolHeader data={poolDetails} />
                    <HStack bgColor="gray.800" p={1} rounded="sm" mb={5}>
                        <Option title="Seus palpites" 
                        isSelected={optionSelected === 'guesses'} //Aqui poderia receber "true" ou "false", mas invés de passar isso diretamente, passa-se uma condicional, quando o "optionSelected" for igual a "guesses" e for true, ai esse fica clicável.
                        onPress={()=>setOptionSelected('guesses')}/>

                        <Option title="Ranking do grupo" 
                        isSelected={optionSelected === 'ranking'} 
                        onPress={()=> setOptionSelected('ranking')}/>

                    </HStack>
                    <Guesses poolId={poolDetails.id} code={poolDetails.code}/>
                </VStack>                
                :
                <EmptyMyPoolList code={poolDetails.code}/>
            }

        </VStack>
    );
}