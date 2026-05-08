# Autenticación con Email y Contraseña

## Descripción
La autenticación con Email y Contraseña permite a los usuarios registrarse e iniciar sesión utilizando su correo electrónico y una contraseña personal. Este método es gestionado completamente por Firebase Authentication.

## Estado en el Proyecto: *Completado y Funcionando*

## Componentes Implementados
- LoginPage.tsx: Formulario de inicio de sesión
- RegisterPage.tsx: Formulario de registro de usuarios
- ForgotPage.tsx: Recuperación de contraseña
- ResetPage.tsx: Restablecimiento de contraseña

## Estructura en Firestore

### Colección users
```javascript
{
  uid: "string",
  email: "string",
  displayName: "string",
  createdAt: "timestamp",
  lastLogin: "timestamp",
  provider: "email",
  role: "user"
}