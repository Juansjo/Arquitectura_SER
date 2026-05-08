#  Autenticación con Google

## Descripción
La autenticación con Google permite a los usuarios iniciar sesión utilizando su cuenta de Google mediante OAuth 2.0. Este método obtiene automáticamente el nombre, email y foto de perfil del usuario.

## Estado en el Proyecto: **Completado y Funcionando**

## Componentes Implementados
- `LoginPage.tsx`: Botón "Continuar con Google"
- `firebase.ts`: Configuración del proveedor Google

## 🔧 Configuración del Proveedor

```typescript
// src/config/firebase.ts
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');

Juan Diego Arevalo Arevalo - 0191983