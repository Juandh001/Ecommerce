'use client';

import { useState } from 'react';
import { 
  CogIcon,
  CurrencyDollarIcon,
  TruckIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  BellIcon
} from '@heroicons/react/24/outline';

interface GeneralSettings {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  contactEmail: string;
  supportEmail: string;
  currency: string;
  timezone: string;
  language: string;
}

interface PaymentSettings {
  stripeEnabled: boolean;
  stripePublicKey: string;
  stripeSecretKey: string;
  paypalEnabled: boolean;
  paypalClientId: string;
  paypalSecretKey: string;
}

interface ShippingSettings {
  freeShippingThreshold: number;
  standardShippingRate: number;
  expressShippingRate: number;
  internationalShippingRate: number;
  processingTime: string;
}

interface NotificationSettings {
  newOrderNotifications: boolean;
  lowStockNotifications: boolean;
  customerServiceNotifications: boolean;
  marketingEmails: boolean;
}

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);

  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>({
    siteName: 'ModernStore',
    siteDescription: 'Tu tienda de confianza online',
    siteUrl: 'https://modernstore.com',
    contactEmail: 'contact@modernstore.com',
    supportEmail: 'support@modernstore.com',
    currency: 'USD',
    timezone: 'America/Mexico_City',
    language: 'es',
  });

  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>({
    stripeEnabled: true,
    stripePublicKey: 'pk_test_...',
    stripeSecretKey: '',
    paypalEnabled: false,
    paypalClientId: '',
    paypalSecretKey: '',
  });

  const [shippingSettings, setShippingSettings] = useState<ShippingSettings>({
    freeShippingThreshold: 100,
    standardShippingRate: 10,
    expressShippingRate: 25,
    internationalShippingRate: 50,
    processingTime: '1-2 business days',
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    newOrderNotifications: true,
    lowStockNotifications: true,
    customerServiceNotifications: true,
    marketingEmails: false,
  });

  const tabs = [
    { id: 'general', name: 'General', icon: CogIcon },
    { id: 'payments', name: 'Pagos', icon: CurrencyDollarIcon },
    { id: 'shipping', name: 'Envíos', icon: TruckIcon },
    { id: 'notifications', name: 'Notificaciones', icon: BellIcon },
    { id: 'security', name: 'Seguridad', icon: ShieldCheckIcon },
  ];

  const handleSaveSettings = async () => {
    try {
      setLoading(true);
      
      // TODO: Implement save settings API
      console.log('Saving settings...');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Configuración guardada exitosamente');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error al guardar la configuración');
    } finally {
      setLoading(false);
    }
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Información General</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Sitio
            </label>
            <input
              type="text"
              value={generalSettings.siteName}
              onChange={(e) => setGeneralSettings({...generalSettings, siteName: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL del Sitio
            </label>
            <input
              type="url"
              value={generalSettings.siteUrl}
              onChange={(e) => setGeneralSettings({...generalSettings, siteUrl: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción del Sitio
            </label>
            <textarea
              value={generalSettings.siteDescription}
              onChange={(e) => setGeneralSettings({...generalSettings, siteDescription: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email de Contacto
            </label>
            <input
              type="email"
              value={generalSettings.contactEmail}
              onChange={(e) => setGeneralSettings({...generalSettings, contactEmail: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email de Soporte
            </label>
            <input
              type="email"
              value={generalSettings.supportEmail}
              onChange={(e) => setGeneralSettings({...generalSettings, supportEmail: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Moneda
            </label>
            <select
              value={generalSettings.currency}
              onChange={(e) => setGeneralSettings({...generalSettings, currency: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="USD">USD - Dólar Estadounidense</option>
              <option value="EUR">EUR - Euro</option>
              <option value="MXN">MXN - Peso Mexicano</option>
              <option value="CAD">CAD - Dólar Canadiense</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Zona Horaria
            </label>
            <select
              value={generalSettings.timezone}
              onChange={(e) => setGeneralSettings({...generalSettings, timezone: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="America/Mexico_City">Ciudad de México</option>
              <option value="America/New_York">Nueva York</option>
              <option value="America/Los_Angeles">Los Ángeles</option>
              <option value="Europe/Madrid">Madrid</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPaymentSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuración de Pagos</h3>
        
        {/* Stripe Settings */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <h4 className="text-lg font-medium text-gray-900">Stripe</h4>
            </div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={paymentSettings.stripeEnabled}
                onChange={(e) => setPaymentSettings({...paymentSettings, stripeEnabled: e.target.checked})}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Habilitar</span>
            </label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Clave Pública
              </label>
              <input
                type="text"
                value={paymentSettings.stripePublicKey}
                onChange={(e) => setPaymentSettings({...paymentSettings, stripePublicKey: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="pk_test_..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Clave Secreta
              </label>
              <input
                type="password"
                value={paymentSettings.stripeSecretKey}
                onChange={(e) => setPaymentSettings({...paymentSettings, stripeSecretKey: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="sk_test_..."
              />
            </div>
          </div>
        </div>

        {/* PayPal Settings */}
        <div className="border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-yellow-500 rounded flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <h4 className="text-lg font-medium text-gray-900">PayPal</h4>
            </div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={paymentSettings.paypalEnabled}
                onChange={(e) => setPaymentSettings({...paymentSettings, paypalEnabled: e.target.checked})}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Habilitar</span>
            </label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client ID
              </label>
              <input
                type="text"
                value={paymentSettings.paypalClientId}
                onChange={(e) => setPaymentSettings({...paymentSettings, paypalClientId: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Secret Key
              </label>
              <input
                type="password"
                value={paymentSettings.paypalSecretKey}
                onChange={(e) => setPaymentSettings({...paymentSettings, paypalSecretKey: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderShippingSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuración de Envíos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Umbral de Envío Gratis ($)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={shippingSettings.freeShippingThreshold}
              onChange={(e) => setShippingSettings({...shippingSettings, freeShippingThreshold: parseFloat(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tiempo de Procesamiento
            </label>
            <input
              type="text"
              value={shippingSettings.processingTime}
              onChange={(e) => setShippingSettings({...shippingSettings, processingTime: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="1-2 días hábiles"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tarifa Envío Estándar ($)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={shippingSettings.standardShippingRate}
              onChange={(e) => setShippingSettings({...shippingSettings, standardShippingRate: parseFloat(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tarifa Envío Express ($)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={shippingSettings.expressShippingRate}
              onChange={(e) => setShippingSettings({...shippingSettings, expressShippingRate: parseFloat(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tarifa Envío Internacional ($)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={shippingSettings.internationalShippingRate}
              onChange={(e) => setShippingSettings({...shippingSettings, internationalShippingRate: parseFloat(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuración de Notificaciones</h3>
        <div className="space-y-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={notificationSettings.newOrderNotifications}
              onChange={(e) => setNotificationSettings({...notificationSettings, newOrderNotifications: e.target.checked})}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div className="ml-3">
              <span className="text-sm font-medium text-gray-700">Notificaciones de Nuevos Pedidos</span>
              <p className="text-xs text-gray-500">Recibe emails cuando lleguen nuevos pedidos</p>
            </div>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={notificationSettings.lowStockNotifications}
              onChange={(e) => setNotificationSettings({...notificationSettings, lowStockNotifications: e.target.checked})}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div className="ml-3">
              <span className="text-sm font-medium text-gray-700">Alertas de Bajo Stock</span>
              <p className="text-xs text-gray-500">Notificaciones cuando productos tengan poco inventario</p>
            </div>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={notificationSettings.customerServiceNotifications}
              onChange={(e) => setNotificationSettings({...notificationSettings, customerServiceNotifications: e.target.checked})}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div className="ml-3">
              <span className="text-sm font-medium text-gray-700">Notificaciones de Servicio al Cliente</span>
              <p className="text-xs text-gray-500">Emails de consultas y mensajes de clientes</p>
            </div>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={notificationSettings.marketingEmails}
              onChange={(e) => setNotificationSettings({...notificationSettings, marketingEmails: e.target.checked})}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div className="ml-3">
              <span className="text-sm font-medium text-gray-700">Emails de Marketing</span>
              <p className="text-xs text-gray-500">Actualizaciones de productos y promociones</p>
            </div>
          </label>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuración de Seguridad</h3>
        <div className="space-y-6">
          <div className="border border-gray-200 rounded-lg p-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Autenticación de Dos Factores</h4>
            <p className="text-sm text-gray-600 mb-4">
              Agrega una capa extra de seguridad a tu cuenta de administrador
            </p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Configurar 2FA
            </button>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Sesiones Activas</h4>
            <p className="text-sm text-gray-600 mb-4">
              Administra y revoca sesiones activas en diferentes dispositivos
            </p>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Ver Sesiones
            </button>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Cambiar Contraseña</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña Actual
                </label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nueva Contraseña
                </label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Actualizar Contraseña
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'payments':
        return renderPaymentSettings();
      case 'shipping':
        return renderShippingSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'security':
        return renderSecuritySettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
          <p className="text-gray-600">Administra la configuración de tu tienda</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6">
              {renderTabContent()}
            </div>
            
            {/* Save Button */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={handleSaveSettings}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 