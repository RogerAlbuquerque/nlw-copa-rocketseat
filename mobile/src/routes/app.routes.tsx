import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { PlusCircle, SoccerBall } from 'phosphor-react-native'
import {useTheme} from 'native-base'
import { Platform } from 'react-native'

import { New } from '../screens/New'
import { Pools } from '../screens/Pools'
import { Find } from '../screens/Find'
import { Details } from '../screens/Details'




const {Navigator, Screen } = createBottomTabNavigator()


export function AppRoutes(){
    const { colors, sizes } = useTheme();       // Esse sizes é para usar o tamanho do tema criado com o typescript
    const size = sizes[6]
    return(
        <Navigator
            screenOptions={{
                headerShown:false,
                tabBarLabelPosition: 'beside-icon',
                tabBarActiveTintColor: colors.yellow[500],
                tabBarInactiveTintColor: colors.gray[300],
                tabBarStyle: {
                    position: 'absolute',
                    height: sizes[22],
                    borderTopWidth: 0,
                    backgroundColor:colors.gray[800]
                },
                tabBarItemStyle:{
                    position:'relative',
                    top: Platform.OS === 'android' ? -10 : 0
                }
            }}
        >
            <Screen 
                name = "new"
                component = {New}
                options={{
                    tabBarIcon: ({ color }) => <PlusCircle color={color} size={size}/>,
                    tabBarLabel: 'Novo bolão'
                }}
            />

            <Screen 
                 name = "pools"
                 component = {Pools}
                 options={{
                    tabBarIcon: ({ color }) => <SoccerBall color={color} size={size}/>,
                    tabBarLabel: 'Meus bolões'
                }}
            />

            <Screen 
                 name = "find"
                 component = {Find}
                 options={{
                   tabBarButton: () => null             // isso aqui é pra fazer com que não aapaareça um terceiro item na barra de menusr no app.
                }}
            />

            <Screen 
                 name = "details"
                 component = {Details}
                 options={{
                   tabBarButton: () => null             // isso aqui é pra fazer com que não aapaareça um terceiro item na barra de menusr no app.
                }}
            />
            
        </Navigator>
    )
}