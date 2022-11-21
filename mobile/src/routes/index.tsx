import { Box } from "native-base";
import { NavigationContainer } from "@react-navigation/native"
import {useAuth} from "../hooks/useAuth"
import { SignIn } from "../screens/SignIn";
import { AppRoutes } from "./app.routes"


export function Routes(){
    const { user } = useAuth();
    return(
        //Esse box é só para caso dê uma travadinha na renderização dos componentes, a tela de fundo seja da mesma cor da aplicação ai ngm nem percebe nada.
        <Box flex={1} bg='gray.900'>            
            <NavigationContainer>
                {user.name ? <AppRoutes/> : <SignIn />}
            </NavigationContainer>
        </Box>
    )
}