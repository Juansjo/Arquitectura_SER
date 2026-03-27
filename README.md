# 🔐 Sistema de Autenticación - React + Firebase

Aplicación de login con React, TypeScript y Firebase que implementa autenticación con Google, GitHub, Facebook y Email/Password.

##Tecnologías
- React + TypeScript + Vite
- Firebase Auth + Firestore
- React Router DOM

##Páginas

### LoginPage
Formulario de inicio de sesión con email/contraseña y botones para autenticación social (Google, GitHub, Facebook). Incluye enlace a recuperación de contraseña y registro.

### RegisterPage
Registro de nuevos usuarios con validaciones:
- Nombre obligatorio
- Email válido
- Contraseña mínima 6 caracteres
- Confirmación de contraseña

### ForgotPage
Recuperación de contraseña. El usuario ingresa su email y recibe un enlace para restablecerla.

### ResetPage
Restablecimiento de contraseña. Valida el código de la URL y permite establecer una nueva contraseña.

## 🔑 Métodos de Autenticación

| Método | Configuración |
|--------|---------------|
| **Google** | Habilitar en Firebase Console |
| **GitHub** | Crear OAuth App → Callback: `https://tu-proyecto.firebaseapp.com/__/auth/handler` |
| **Facebook** | Crear app en Facebook Developers → Callback: misma URL |
| **Email/Password** | Habilitar en Firebase Console |

## 🛠️ Instalación

```bash
git clone https://github.com/Juansjo/Arquitectura_SER.git
cd Arquitectura_SER
npm install
npm run dev

Juan Jose Perez Gomez 191923