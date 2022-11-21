import { VStack, Icon, useToast, FlatList  } from "native-base";
import { Octicons } from '@expo/vector-icons'
import { useNavigation } from "@react-navigation/native";
import {useCallback, useState} from 'react'             // O useCallback evita que uma informação seja chamada repetidas vzs, porque ele guarda a referência de uma chamada.
import {useFocusEffect} from '@react-navigation/native' // Esse hook é tipo o useEffect, só que ele executa a função sempre que um componente receber o foco, ou seja, sempre que sair de uma rota e entrar nele de novo
                                                        // Para garantir que esse hook não vai quebrar, ele é recomendado usar junto com o useCallback.
import { Button } from '../components/Button'
import { Header } from "../components/Header";
import { api } from "../services/api";
import { PoolCard, PoolCardProps } from "../components/PoolCard";
import { Loading } from "../components/Loading";
import { EmptyPoolList } from "../components/EmptyPoolList";

export function Pools(){
    const [isLoading, setIsLoading] = useState(true);
    const [pools, setPools] = useState<PoolCardProps[]>([])     // Esse é troço entre chavez é a tipagem do state que foi criada la em "PoolCardProps"
    const { navigate } = useNavigation();

    const toast = useToast();
    async function fetchPools(){
        try{
           const response = await api.get('/pools')
           setPools(response.data.pools)

        }catch(error){
            console.log(error)

            toast.show({
                title: 'Não foi possível carregar os bolões',
                placement: 'top',
                bgColor: 'red.500'

            })
        }finally{
            setIsLoading(false)
        }
    }

    useFocusEffect(useCallback(()=>{
        fetchPools();
    },[]));
    return(
        <VStack flex={1} bgColor="gray.900">
            <Header title="Meus bolões" />

            <VStack mt={6} mx={5} borderBottomWidth={1} borderBottomColor="gray.600" pb={4} mb={4}>
                <Button 
                    title="BUSCAR BOLÃO POR CÓDIGO" 
                    leftIcon={<Icon as={Octicons} name="search" color="black" size="md"/>}
                    onPress={() => navigate('find')}
                    />
            </VStack>

           { isLoading ? <Loading/> : 
                <FlatList               // Esse é um componente para gerenciar lista de vários conteúdos, é tipo o método "map()"
                    data={pools}
                    keyExtractor={item => item.id}  // Essa parte é para diferenciar os conteúdos da lista,
                    renderItem={({item}) => (
                        <PoolCard 
                            data={item}
                            onPress={ () => navigate('details', { id: item.id} )}
                                                    // Aqui é a rota, e o parâmetro que precisa ser passado para ela, como esta sendo pedido no arquivo de tipagem das rotas
                        />
                    )}
                    px={5}
                    showsVerticalScrollIndicator={false}
                    _contentContainerStyle={{pb:10}}    // Esse serve para fazer uma config interna dos Items
                    ListEmptyComponent={()=> <EmptyPoolList />} // Esse renderiza um componente caso o "data" do FlatList for vazio
                />}
        </VStack>
    )
}