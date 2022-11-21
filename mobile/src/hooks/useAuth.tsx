import { useContext } from "react";

import { AuthContext,AuthContextDataProps } from "../context/AuthContext";

export function useAuth(): AuthContextDataProps {
    const context = useContext(AuthContext)

    return context;
}



/* Sempre que for usar um "useContext" precisaria importar ele em todo componente, e chamar a const. Esse componente serve para evitar isso, 
sempre que precisar usar o contexto criado antes é só chamar esse componente "useAuth", que eleja está ligado ao context criado dentro de "AuthContext" 
e retonra o seu conteúdo*/


// Basicamente a ideia aqui foi criar um hook, para tratar melhor os dados do context.