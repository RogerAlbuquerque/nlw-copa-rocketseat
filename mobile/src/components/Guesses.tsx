import { useToast, FlatList } from 'native-base';
import { useEffect, useState } from 'react';
import { Game, GameProps } from '../components/Game';
import { api } from '../services/api';
import { EmptyMyPoolList } from './EmptyMyPoolList';
import { Loading } from './Loading';


interface Props {
  poolId: string;
  code:string;
}

export function Guesses({ poolId, code }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [games, setGames] = useState<GameProps[]>([])
  const [firstTeamPoints, setFirstTeamPoints] = useState('')
  const [secondTeamPoints, setSecondTeamPoints] = useState('')
  const toast = useToast();
  
  async function fetchGames(){
    try{
      setIsLoading(true)

      const response = await api.get(`pools/${poolId}/games`);
      setGames(response.data.games)
    
      


   }catch(error){
      toast.show({ 
          title: 'Não foi possível carregar os jogos',
          placement: 'top',
          bgColor: 'red.500'

      })
      
   }finally{
       setIsLoading(false)
   }
  }

  async function handleGuessConfirm(gameId: string){
    try{ 
 
      if(!firstTeamPoints.trim() || !secondTeamPoints.trim()){
        return toast.show({ 
          title: 'Informe o palpite do placar!',
          placement: 'top',
          bgColor: 'red.500'
         })
      }
      
      await api.post(`/pools/${poolId}/games/${gameId}/guesses`, {    // Esse é sempre o body da requisição
        firstTeamPoint:  Number(firstTeamPoints),
        secondTeamPoint: Number(secondTeamPoints),
      });

        toast.show({ 
          title: 'Palpite realizado com sucesso!',
          placement: 'top',
          bgColor: 'green.500'
         })

        fetchGames()
        
   }catch(error){
      toast.show({ 
          title: 'Não foi possível enviar o palpite',
          placement: 'top',
          bgColor: 'red.500'

      })
      
   }
  }





  useEffect(()=>{
    fetchGames();
  },[poolId])


  if(isLoading){
    return <Loading />
  }
  
  return (
    <FlatList 
      data={games}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <Game 
          data={item}
          setFirstTeamPoints={setFirstTeamPoints}
          setSecondTeamPoints={setSecondTeamPoints}
          onGuessConfirm={()=> handleGuessConfirm(item.id)}
        />
      )}
      _contentContainerStyle={{pb:10}}
      ListEmptyComponent={() => <EmptyMyPoolList code={code}/>}
    />
  );
}
