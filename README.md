# DBP E2E 2

Tarea del E2E - Frontend con TypeScript, React y Tailwind CSS

# Integrantes
- Antonio Guerrero
- Ernesto Mendoza

## Estructura del Proyecto

```
e2e/src/
├── components/     # Componentes reutilizables
├── context/        # Context API para estado global
├── hooks/          # Custom hooks
├── pages/          # Páginas de la aplicación
├── services/       # Servicios de API
├── types/          # Definiciones de tipos TypeScript
├── App.tsx         # Componente principal
└── main.tsx        # Punto de entrada
```

## Componentes

- **DriverCard**: Tarjeta de conductor con información y calificación
- **EmptyState**: Estado vacío personalizable
- **ErrorBanner**: Banner de error con icono
- **Navbar**: Barra de navegación con usuario y logout
- **ProtectedLayout**: Layout protegido con verificación de autenticación
- **RatingStars**: Componente interactivo de calificación
- **RouteLine**: Visualización de ruta pickup/dropoff
- **Spinner**: Indicador de carga
- **StatusBadge**: Badge de estado de viaje
- **TripCard**: Tarjeta de viaje con información completa

## Servicios

- **api.ts**: Configuración de axios con interceptores
- **authService.ts**: Autenticación (login/register)
- **tripService.ts**: Operaciones de viajes
- **userService.ts**: Información de usuario

## Tipos

- **user.ts**: Interfaz de Usuario
- **trips.ts**: Interfaz de Viaje y estado
- **errorManagers.ts**: Payloads y respuestas de API

## Hooks

- **useAuth**: Hook para acceder al contexto de autenticación
- **useTripPolling**: Hook para polling de estado de viaje

## Páginas

- **Login.tsx**: Página de inicio de sesión
- **Register.tsx**: Página de registro
