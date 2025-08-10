# 🛒 Modern Ecommerce - Full Stack Application

Una aplicación completa de ecommerce construida con las tecnologías más modernas y optimizadas, siguiendo principios SOLID y arquitectura escalable.

## ✨ Características

### 🎯 Funcionalidades Core
- **Autenticación completa** (registro, login, JWT)
- **Catálogo de productos** con búsqueda y filtros avanzados
- **Carrito de compras** en tiempo real
- **Sistema de órdenes** y checkout
- **Gestión de inventario** automática
- **Sistema de reviews** y ratings
- **Panel de administración** (en desarrollo)
- **Gestión de direcciones** de envío
- **Lista de deseos** (wishlist)

### 🏗️ Arquitectura y Tecnologías

#### Backend
- **Fastify** - Framework ultra-rápido para Node.js
- **TypeScript** - Tipado estático para mayor robustez
- **Prisma ORM** - ORM moderno con type safety
- **PostgreSQL** - Base de datos relacional potente
- **JWT** - Autenticación segura
- **Swagger** - Documentación automática de API
- **Arquitectura Hexagonal** - Principios SOLID

#### Frontend  
- **Next.js 14** - Framework React con App Router
- **TypeScript** - Desarrollo type-safe
- **Tailwind CSS** - Estilos utilitarios modernos
- **TanStack Query** - Cache inteligente y sincronización
- **Zustand** - State management ligero
- **React Hook Form** - Formularios optimizados
- **Headless UI** - Componentes accesibles

## 🚀 Instalación y Configuración

### Prerequisitos
- Node.js 18+ 
- PostgreSQL 12+
- npm o yarn

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd ecommerce-fullstack
```

### 2. Configurar la base de datos

Crear una base de datos PostgreSQL:
```sql
CREATE DATABASE ecommerce_db;
```

### 3. Configurar Backend

```bash
cd backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
```

Editar `backend/.env`:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/ecommerce_db?schema=public"
JWT_SECRET="tu-clave-jwt-super-segura-aqui"
PORT=3001
NODE_ENV=development
CORS_ORIGIN="http://localhost:3000"
```

```bash
# Generar cliente Prisma
npm run db:generate

# Ejecutar migraciones
npm run db:migrate

# Poblar con datos de prueba
npm run db:seed

# Iniciar servidor de desarrollo
npm run dev
```

### 4. Configurar Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > .env.local

# Iniciar servidor de desarrollo
npm run dev
```

### 5. Iniciar Ambos Servicios

Desde la raíz del proyecto:
```bash
# Instalar dependencias del workspace
npm install

# Iniciar backend y frontend simultáneamente
npm run dev
```

## 🌐 URLs de la Aplicación

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Documentación API**: http://localhost:3001/docs
- **Prisma Studio**: `npm run db:studio` (desde /backend)

## 👥 Credenciales de Prueba

El script de seed crea usuarios de prueba:

### Administrador
- **Email**: `admin@ecommerce.com`
- **Password**: `admin123`

### Cliente
- **Email**: `customer@example.com`  
- **Password**: `customer123`

## 📊 Datos de Prueba

El seed incluye:
- 2 usuarios (1 admin, 1 cliente)
- 4 categorías (Electronics, Smartphones, Laptops, Clothing)
- 6 productos de ejemplo
- Inventario configurado
- Reviews de productos
- Carrito con productos

## 🛠️ Scripts Disponibles

### Backend
```bash
npm run dev          # Desarrollo con hot reload
npm run build        # Compilar para producción
npm run start        # Ejecutar versión compilada
npm run db:migrate   # Ejecutar migraciones
npm run db:seed      # Poblar con datos de prueba  
npm run db:studio    # Abrir Prisma Studio
npm run test         # Ejecutar tests
```

### Frontend
```bash
npm run dev          # Desarrollo con hot reload
npm run build        # Compilar para producción
npm run start        # Ejecutar versión compilada
npm run lint         # Ejecutar linter
npm run type-check   # Verificar tipos TypeScript
```

### Root (Ambos servicios)
```bash
npm run dev          # Iniciar backend y frontend
npm run build        # Compilar ambos proyectos
npm run start        # Ejecutar ambos en producción
```

## 🏗️ Estructura del Proyecto

```
├── backend/
│   ├── src/
│   │   ├── domain/                 # Entidades y reglas de negocio
│   │   │   ├── entities/          
│   │   │   └── repositories/      # Interfaces de repositorios
│   │   ├── application/            # Casos de uso
│   │   │   └── use-cases/         
│   │   ├── infrastructure/         # Implementaciones técnicas
│   │   │   ├── database/          # Prisma y configuración DB
│   │   │   └── repositories/      # Implementaciones de repositorios
│   │   └── server.ts              # Servidor Fastify
│   ├── prisma/
│   │   └── schema.prisma          # Schema de base de datos
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/                   # App Router de Next.js
│   │   ├── components/            # Componentes React
│   │   ├── lib/                   # Utilidades y API client
│   │   ├── store/                 # Zustand stores
│   │   ├── types/                 # Tipos TypeScript
│   │   └── hooks/                 # Custom hooks
│   └── package.json
└── package.json                   # Workspace configuration
```

## 🔧 Configuración Avanzada

### Base de Datos
El proyecto usa PostgreSQL con Prisma ORM. Para cambiar la configuración:

1. Modificar `DATABASE_URL` en `/backend/.env`
2. Ajustar el schema en `/backend/prisma/schema.prisma`
3. Ejecutar `npm run db:migrate`

### API Routes
Las rutas del backend están organizadas en:
- `/api/auth/*` - Autenticación
- `/api/products/*` - Productos
- `/api/cart/*` - Carrito
- `/api/orders/*` - Órdenes
- `/api/categories/*` - Categorías
- `/api/users/*` - Usuarios

### Environment Variables

#### Backend (.env)
```env
DATABASE_URL=           # URL de PostgreSQL
JWT_SECRET=            # Clave para JWT
PORT=                  # Puerto del servidor (default: 3001)
NODE_ENV=              # Entorno (development/production)
CORS_ORIGIN=           # Origen permitido para CORS
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=   # URL del backend API
```

## 🚀 Deployment

### Preparación para Producción

1. **Backend**:
```bash
cd backend
npm run build
npm run db:migrate:prod
```

2. **Frontend**:
```bash
cd frontend
npm run build
```

### Docker (Opcional)
```bash
# Crear imagen del backend
docker build -t ecommerce-backend ./backend

# Crear imagen del frontend  
docker build -t ecommerce-frontend ./frontend
```

## 🧪 Testing

```bash
# Backend tests
cd backend
npm run test

# Frontend tests (configurar primero)
cd frontend  
npm run test
```

## 📝 API Documentation

La documentación completa de la API está disponible en:
http://localhost:3001/docs

Incluye:
- Todos los endpoints disponibles
- Schemas de request/response
- Ejemplos de uso
- Autenticación requerida

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Añadir nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🆘 Soporte

Si encuentras algún problema:

1. Revisa la documentación
2. Verifica que las variables de entorno estén configuradas
3. Asegúrate de que PostgreSQL esté corriendo
4. Verifica que las dependencias estén instaladas
5. Revisa los logs del servidor

### Problemas Comunes

**Error de conexión a la base de datos**:
- Verificar que PostgreSQL esté corriendo
- Comprobar la `DATABASE_URL` en el `.env`
- Asegurar que la base de datos existe

**Error de CORS**:
- Verificar `CORS_ORIGIN` en backend
- Comprobar que el frontend corre en el puerto correcto

**Error de JWT**:
- Verificar que `JWT_SECRET` esté configurado
- Comprobar que el token no haya expirado

---

## 🎯 Roadmap

### Próximas Funcionalidades
- [ ] Integración con Stripe para pagos reales
- [ ] Panel de administración completo
- [ ] Sistema de cupones y descuentos
- [ ] Notificaciones push
- [ ] Chat de soporte en vivo
- [ ] Analytics y reportes
- [ ] Multi-idioma
- [ ] PWA (Progressive Web App)
- [ ] Sistema de afiliados

---

¡Gracias por usar Modern Ecommerce! 🎉 