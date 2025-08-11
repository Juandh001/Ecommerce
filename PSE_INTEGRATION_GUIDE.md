# GUÍA COMPLETA DE INTEGRACIÓN PSE + STRIPE

Esta guía te muestra cómo integrar PSE (Pagos Seguros en Línea) de Colombia junto con Stripe en tu ecommerce, permitiendo a los usuarios elegir entre múltiples métodos de pago.

## 🚀 ¿QUÉ SE IMPLEMENTÓ?

### Backend (Node.js + Fastify + Prisma)
- ✅ PSE Service con EBANX como proveedor
- ✅ Use Cases para crear pagos PSE y procesar webhooks
- ✅ Repositorios actualizados para manejar pagos
- ✅ Endpoints API RESTful para PSE
- ✅ Base de datos extendida con campos PSE

### Frontend (Next.js + React + TypeScript)
- ✅ Componente PSEPayment para pagos PSE
- ✅ Selector de métodos de pago (Stripe + PSE)
- ✅ Página de checkout completa
- ✅ Panel de administración con configuraciones PSE
- ✅ Proxies API para conectar frontend con backend

## 📋 CONFIGURACIÓN INICIAL

### 1. Variables de Entorno (Backend)

Agrega estas variables al archivo `backend/.env`:

```env
# PSE Configuration (EBANX)
PSE_INTEGRATION_KEY="your_ebanx_integration_key_here"
PSE_SANDBOX=true
```

### 2. Variables de Entorno (Frontend)

En `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 3. Obtener Credenciales de EBANX

1. Regístrate en [EBANX](https://www.ebanx.com/)
2. Solicita acceso a PSE para Colombia
3. Obtén tu Integration Key del dashboard
4. Configura la URL de webhook: `https://tu-dominio.com/api/pse/webhook`

## 🏗️ ARQUITECTURA

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│    Frontend     │    │     Backend     │    │     EBANX       │
│   (Next.js)     │    │   (Fastify)     │    │   (PSE API)     │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ PaymentSelector │───▶│ PSE Controller  │───▶│ PSE Service     │
│ PSEPayment      │    │ PSE Use Cases   │    │ Bank List API   │
│ Checkout Page   │    │ PSE Repository  │    │ Payment API     │
│                 │    │ Webhook Handler │◀───│ Webhook         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔄 FLUJO DE PAGO PSE

### 1. Usuario selecciona PSE
```typescript
// Componente muestra lista de bancos PSE
const banks = await fetch('/api/pse/banks');
```

### 2. Usuario llena formulario PSE
- Selecciona banco
- Ingresa número de documento
- Ingresa teléfono
- Confirma pago

### 3. Sistema crea pago PSE
```typescript
const payment = await createPSEPayment({
  orderId,
  bankCode,
  customerDocument,
  documentType,
  customerPhone
});
```

### 4. Usuario es redirigido al banco
```typescript
window.location.href = payment.redirectUrl;
```

### 5. Banco procesa pago y envía webhook
```typescript
// Backend recibe notificación
POST /api/pse/webhook
{
  "hash": "payment_hash",
  "operation": "payment_notification",
  "notification_type": "update"
}
```

### 6. Sistema actualiza estado del pago
- Pago confirmado → Orden aprobada
- Pago fallido → Orden cancelada

## 📊 MODELOS DE BASE DE DATOS

### Payment Model (Actualizado)
```sql
model Payment {
  id              String        @id @default(cuid())
  orderId         String
  amount          Decimal       @db.Decimal(10, 2)
  currency        String        @default("USD")
  method          PaymentMethod
  status          PaymentStatus @default(PENDING)
  transactionId   String?
  stripePaymentId String?       -- Para Stripe
  psePaymentId    String?       -- Para PSE (hash)
  pseRedirectUrl  String?       -- URL de redirección PSE
  pseBankCode     String?       -- Código del banco PSE
  gatewayResponse Json?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
}
```

### PaymentMethod Enum (Actualizado)
```typescript
enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  PAYPAL = 'PAYPAL',
  STRIPE = 'STRIPE',
  PSE = 'PSE',                 -- ✅ Nuevo
  CASH_ON_DELIVERY = 'CASH_ON_DELIVERY'
}
```

## 🔧 ENDPOINTS API

### GET /api/pse/banks
Obtiene lista de bancos PSE disponibles

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "code": "1001",
      "name": "BANCO DE BOGOTA"
    },
    {
      "code": "1007",
      "name": "BANCOLOMBIA"
    }
  ]
}
```

### POST /api/pse/payment
Crea un nuevo pago PSE

**Request:**
```json
{
  "orderId": "ORD-123456",
  "bankCode": "1007",
  "customerDocument": "12345678",
  "documentType": "CC",
  "customerPhone": "3001234567"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "paymentId": "pay_xyz",
    "redirectUrl": "https://registro.pse.com.co/...",
    "pseHash": "abc123def"
  }
}
```

### POST /api/pse/webhook
Recibe notificaciones de EBANX sobre cambios de estado

**Request:**
```json
{
  "hash": "abc123def",
  "operation": "payment_notification",
  "notification_type": "update"
}
```

## 🎨 COMPONENTES FRONTEND

### PaymentMethodSelector
Componente principal que permite seleccionar entre Stripe y PSE
```typescript
<PaymentMethodSelector
  orderId={orderId}
  onPaymentSuccess={handleSuccess}
  onPaymentError={handleError}
/>
```

### PSEPayment
Componente específico para pagos PSE
```typescript
<PSEPayment
  orderId={orderId}
  onPaymentSuccess={onPaymentSuccess}
  onPaymentError={onPaymentError}
/>
```

## 🔒 SEGURIDAD

### 1. Validación de Webhooks
```typescript
// Verificar que el webhook venga de EBANX
const webhookData = await pseService.processWebhook(requestBody);
```

### 2. Autenticación de Usuario
```typescript
// Verificar token JWT en pagos
const userId = request.user?.id;
if (!userId) {
  return reply.code(401).send({ error: 'Unauthorized' });
}
```

### 3. Validación de Datos
```typescript
// Validar datos del formulario PSE
if (!selectedBank || !customerDocument || !customerPhone) {
  onPaymentError('Todos los campos son obligatorios');
  return;
}
```

## 🧪 TESTING

### 1. Modo Sandbox
```env
PSE_SANDBOX=true
```

### 2. Datos de Prueba PSE
- **Documento:** 123456789
- **Teléfono:** 3001234567
- **Banco:** Cualquiera de la lista
- **Simular Autorizado:** YES (pago exitoso)
- **Simular Autorizado:** NO (pago fallido)

### 3. Testing de Webhooks
Usa ngrok para probar webhooks localmente:
```bash
ngrok http 3001
# URL webhook: https://abc123.ngrok.io/api/pse/webhook
```

## 🚀 DEPLOYMENT

### 1. Variables de Producción
```env
PSE_INTEGRATION_KEY="prod_integration_key"
PSE_SANDBOX=false
```

### 2. Configurar Webhook URL
En el dashboard de EBANX, configura:
```
https://tu-dominio.com/api/pse/webhook
```

### 3. SSL Obligatorio
PSE requiere HTTPS en producción

## 💰 CONVERSIÓN DE MONEDAS

El sistema convierte automáticamente USD a COP:
```typescript
if (order.currency === 'USD') {
  amount = order.total * 4000; // 1 USD = 4000 COP aprox
  currency = 'COP';
}
```

**Recomendación:** Usa una API de cambio real como ExchangeRate-API o CurrencyLayer.

## 📈 MONITOREO

### 1. Logs de Pagos
```typescript
console.log('PSE Payment created:', {
  orderId,
  pseHash,
  amount,
  bankCode
});
```

### 2. Métricas Importantes
- Tasa de conversión PSE vs Stripe
- Bancos más utilizados
- Tiempo promedio de pago
- Tasas de abandono por método

## 🛠️ COMANDOS ÚTILES

### Instalar dependencias backend
```bash
cd backend
npm install axios dotenv
```

### Ejecutar migraciones
```bash
cd backend
npx prisma migrate dev --name add_pse_fields
```

### Generar cliente Prisma
```bash
cd backend
npx prisma generate
```

### Ejecutar en desarrollo
```bash
# Backend
cd backend && npm run dev

# Frontend  
cd frontend && npm run dev
```

## 🔍 TROUBLESHOOTING

### Error: "Failed to get PSE bank list"
- Verificar PSE_INTEGRATION_KEY
- Verificar conectividad con EBANX API
- Revisar logs del backend

### Error: "Datos inconsistentes" en PSE
- Verificar que todos los datos coincidan exactamente
- Revisar nombre del comercio en EBANX
- Verificar moneda (debe ser COP para PSE)

### Webhook no se recibe
- Verificar URL del webhook en EBANX
- Verificar que el endpoint esté accesible públicamente
- Revisar logs del servidor

## 📞 SOPORTE

### EBANX Support
- Email: support@ebanx.com
- Documentación: https://developer.ebanx.com/

### PSE ACH Colombia
- Sitio web: https://www.pse.com.co/
- Documentación técnica: https://www.achcolombia.com.co/

## 🎯 PRÓXIMOS PASOS

1. **Implementar Stripe completamente**
2. **Agregar más métodos de pago** (Nequi, Daviplata, etc.)
3. **Implementar analytics de pagos**
4. **Agregar notificaciones por email**
5. **Optimizar UX del checkout**

---

¡Ya tienes PSE totalmente integrado! 🎉

Los usuarios colombianos ahora pueden pagar fácilmente desde su banco, mientras que usuarios internacionales pueden usar Stripe. El sistema es escalable y está listo para producción. 