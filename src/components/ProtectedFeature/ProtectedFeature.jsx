import React, { useContext } from "react";
import { WhichRenderContext } from "../../contexts";

// Componente que controla a visualização de features baseado nas permissões do usuário
export const ProtectedFeature = ({
  requiredPermissions,
  userPermissions,
  verifyEntireTree,
  children,
}) => {
  const { selectedNode, treeData } = useContext(WhichRenderContext);
  const { permission: nodeUserPermissions = [] } = selectedNode || {};

  if (verifyEntireTree) {
    userPermissions = treeData.reduce((result, tree) => {
      return result.concat(tree.permission);
    }, []);
  }

  // Compara as permissões necessárias com as permissões do usuário
  const allowed = hasPermission(
    requiredPermissions,
    userPermissions || nodeUserPermissions
  );

  // Renderiza o componente (ou não) de acordo com a permissão
  const feature = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      if (child.type === Allowed || child.type === NotAllowed) {
        return React.cloneElement(child, { allowed });
      }
    }

    return allowed ? child : null;
  });

  return <>{feature}</>;
};

// Função usada para retornar se o usuário possuí as devidas permissões ou não
export const hasPermission = (requiredPermissions, userPermissions) => {
  // Compara as permissões necessárias com as permissões do usuário
  const allowed =
    requiredPermissions?.every((permission) =>
      userPermissions?.includes(permission)
    ) ?? false;

  return allowed;
};

// Componentes opcionais, para casos em que, mesmo sem permissão, algo deve ser mostrado.
// Por padrão, não é necessário utilizá-los. Caso não sejam utilizados, o ProtectedFeature só exibirá a feature caso o usuário obrigatóriamente tenha permissão
// Se forem utilizados, será exibido o conteúdo de Allowed caso o usuário tenha permissão, ou NotAllowed caso não tenha.
export const Allowed = ({ children, allowed }) => {
  return <>{allowed && children}</>;
};

export const NotAllowed = ({ children, allowed }) => {
  return <>{!allowed && children}</>;
};
