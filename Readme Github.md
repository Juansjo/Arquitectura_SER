#  Autenticación con GitHub

## Descripción
La autenticación con GitHub permite a los usuarios iniciar sesión utilizando su cuenta de GitHub mediante OAuth. Este método obtiene el nombre de usuario, email y avatar del perfil de GitHub.

##  Estado en el Proyecto: **Completado y Funcionando**

##  Componentes Implementados
- `LoginPage.tsx`: Botón "Continuar con GitHub"
- `firebase.ts`: Configuración del proveedor GitHub

## Configuración del Proveedor

```typescript
// src/config/firebase.ts
export const githubProvider = new GithubAuthProvider();
githubProvider.addScope('read:user');
githubProvider.addScope('user:email');


Juan Jose Perez Gomez - 0191923