import React from 'react';
import Head from 'next/head';
import { Save, Upload, Bell, Clock, Globe, CreditCard } from 'lucide-react';
import { Card, Button, Input, Loading, useToast, ImageUpload } from '@/components/ui';
import { useShopSettings, useUpdateShopSettings, useWorkingHours, useUpdateWorkingHours } from '@/hooks';
import api from '@/lib/api';

const DAY_NAMES = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
const DAY_LABELS: Record<string, string> = {
  MONDAY: 'Monday', TUESDAY: 'Tuesday', WEDNESDAY: 'Wednesday', THURSDAY: 'Thursday',
  FRIDAY: 'Friday', SATURDAY: 'Saturday', SUNDAY: 'Sunday',
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = React.useState('general');
  const { addToast } = useToast();

  // Shop settings
  const { data: shopData, isLoading: loadingSettings } = useShopSettings();
  const updateSettings = useUpdateShopSettings();

  // Working hours
  const { data: workingHoursData, isLoading: loadingHours } = useWorkingHours();
  const updateHours = useUpdateWorkingHours();

  // General form state
  const [generalForm, setGeneralForm] = React.useState({
    name: '', description: '', phone: '', email: '', address: '',
  });

  // Sync shop data to form when loaded
  React.useEffect(() => {
    if (shopData) {
      setGeneralForm({
        name: shopData.name || '',
        description: shopData.description || '',
        phone: shopData.phone || '',
        email: shopData.email || '',
        address: shopData.address || '',
      });
    }
  }, [shopData]);

  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSettings.mutateAsync(generalForm);
      addToast({ type: 'success', title: 'Settings saved!' });
    } catch (err: any) {
      addToast({ type: 'error', title: 'Failed to save', message: err.response?.data?.message || 'Try again.' });
    }
  };

  const handleSaveHour = async (dayOfWeek: string, field: string, value: any) => {
    try {
      await updateHours.mutateAsync({ dayOfWeek, [field]: value });
    } catch (err: any) {
      addToast({ type: 'error', title: `Failed to update ${DAY_LABELS[dayOfWeek]}` });
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: Upload },
    { id: 'general', label: 'General', icon: Globe },
    { id: 'hours', label: 'Working Hours', icon: Clock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'payments', label: 'Payments', icon: CreditCard },
  ];

  if (loadingSettings) return <Loading text="Loading settings..." />;

  // Build working hours map
  const hoursMap: Record<string, any> = {};
  if (Array.isArray(workingHoursData)) {
    workingHoursData.forEach((wh: any) => { hoursMap[wh.dayOfWeek] = wh; });
  }

  const [profileForm, setProfileForm] = React.useState({
    name: '',
    phone: '',
    avatarUrl: '',
  });

  React.useEffect(() => {
    // Optionally load admin profile data here if available
    // For now, leave as blank/default
  }, []);

  async function handleSaveProfile(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    try {
      await api.patch('/users/me', {
        name: profileForm.name,
        phone: profileForm.phone,
      });
      addToast({ type: 'success', title: 'Profile updated!' });
    } catch (err: any) {
      addToast({ type: 'error', title: 'Failed to update profile', message: err.response?.data?.message || 'Try again.' });
    }
  }
  return (
    <>
      <Head>
        <title>Settings - Overline Admin</title>
      </Head>

      <div>
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500">Configure your shop preferences</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Tabs */}
          <div className="lg:w-64">
            <Card className="p-2">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </Card>
          </div>

          {/* Content */}
          <div className="flex-1">
            {activeTab === 'general' && (
              <Card>
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Shop Information</h2>
                <form className="space-y-6" onSubmit={handleSaveGeneral}>
                  <ImageUpload
                    currentUrl={shopData?.logoUrl}
                    onUpload={async (file) => {
                      const formData = new FormData();
                      formData.append('file', file);
                      const { data } = await api.patch(
                        `/upload/shop/${shopData?.id}/logo`,
                        formData,
                        { headers: { 'Content-Type': 'multipart/form-data' } },
                      );
                      addToast({ type: 'success', title: 'Logo uploaded!' });
                      return data.logoUrl;
                    }}
                    label="Upload Logo"
                    hint="PNG, JPG up to 5MB. Recommended: 200x200px"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Shop Name"
                      value={generalForm.name}
                      onChange={(e) => setGeneralForm({ ...generalForm, name: e.target.value })}
                    />
                    <Input label="Slug" value={shopData?.slug || ''} disabled />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      rows={3}
                      value={generalForm.description}
                      onChange={(e) => setGeneralForm({ ...generalForm, description: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Phone"
                      type="tel"
                      value={generalForm.phone}
                      onChange={(e) => setGeneralForm({ ...generalForm, phone: e.target.value })}
                    />
                    <Input
                      label="Email"
                      type="email"
                      value={generalForm.email}
                      onChange={(e) => setGeneralForm({ ...generalForm, email: e.target.value })}
                    />
                  </div>

                  <div>
                    <Input
                      label="Address"
                      value={generalForm.address}
                      onChange={(e) => setGeneralForm({ ...generalForm, address: e.target.value })}
                    />
                  </div>

                  <Button type="submit" isLoading={updateSettings.isPending}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </form>
              </Card>
            )}

            {activeTab === 'hours' && (
              <Card>
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Working Hours</h2>
                {loadingHours ? (
                  <Loading text="Loading hours..." />
                ) : (
                  <div className="space-y-4">
                    {DAY_NAMES.map((day) => {
                      const wh = hoursMap[day] || { openTime: '09:00', closeTime: '21:00', isClosed: day === 'SUNDAY' };
                      return (
                        <div key={day} className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0">
                          <div className="w-28 font-medium text-gray-900">{DAY_LABELS[day]}</div>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                              checked={!wh.isClosed}
                              onChange={(e) => handleSaveHour(day, 'isClosed', !e.target.checked)}
                            />
                            <span className="text-sm text-gray-600">Open</span>
                          </label>
                          <div className="flex items-center gap-2 ml-auto">
                            <input
                              type="time"
                              className="px-2 py-1 border border-gray-300 rounded text-sm"
                              defaultValue={wh.openTime || '09:00'}
                              disabled={wh.isClosed}
                              onBlur={(e) => handleSaveHour(day, 'openTime', e.target.value)}
                            />
                            <span className="text-gray-400">to</span>
                            <input
                              type="time"
                              className="px-2 py-1 border border-gray-300 rounded text-sm"
                              defaultValue={wh.closeTime || '21:00'}
                              disabled={wh.isClosed}
                              onBlur={(e) => handleSaveHour(day, 'closeTime', e.target.value)}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            )}

            {activeTab === 'notifications' && (
              <Card>
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Notification Settings</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Customer Notifications</h3>
                    <div className="space-y-3">
                      {[
                        { label: 'Booking confirmation', key: 'bookingConfirmation', enabled: true },
                        { label: 'Booking reminder (1 hour before)', key: 'bookingReminder', enabled: true },
                        { label: 'Booking cancellation', key: 'bookingCancellation', enabled: true },
                        { label: 'Queue updates', key: 'queueUpdates', enabled: false },
                      ].map((item) => (
                        <label key={item.key} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{item.label}</span>
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                            defaultChecked={item.enabled}
                          />
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Admin Notifications</h3>
                    <div className="space-y-3">
                      {[
                        { label: 'New booking', key: 'newBooking', enabled: true },
                        { label: 'Booking cancellation', key: 'adminCancellation', enabled: true },
                        { label: 'Daily summary', key: 'dailySummary', enabled: false },
                      ].map((item) => (
                        <label key={item.key} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{item.label}</span>
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                            defaultChecked={item.enabled}
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <Button onClick={() => addToast({ type: 'info', title: 'Notification settings saved (notifications module coming soon)' })}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Settings
                  </Button>
                </div>
              </Card>
            )}

            {activeTab === 'payments' && (
              <Card>
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Payment Settings</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Payment Provider</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <button className="p-4 border-2 border-primary-500 rounded-lg bg-primary-50 text-center">
                        <p className="font-medium text-primary-600">Razorpay</p>
                        <p className="text-xs text-gray-500 mt-1">Connected</p>
                      </button>
                      <button className="p-4 border-2 border-gray-200 rounded-lg text-center hover:border-gray-300">
                        <p className="font-medium text-gray-900">Stripe</p>
                        <p className="text-xs text-gray-500 mt-1">Not connected</p>
                      </button>
                    </div>
                  </div>

                  <div>
                    <Input
                      label="Razorpay Key ID"
                      type="password"
                      defaultValue="rzp_live_xxxxx"
                      placeholder="rzp_live_..."
                    />
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Payment Options</h3>
                    <div className="space-y-3">
                      {[
                        { label: 'Enable online payments', key: 'onlinePayments', enabled: true },
                        { label: 'Allow pay at counter', key: 'payAtCounter', enabled: true },
                        { label: 'Require upfront payment', key: 'upfrontPayment', enabled: false },
                      ].map((item) => (
                        <label key={item.key} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{item.label}</span>
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                            defaultChecked={item.enabled}
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <Button onClick={() => addToast({ type: 'info', title: 'Payment settings saved (payments module coming soon)' })}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Settings
                  </Button>
                </div>
              </Card>
            )}

            {activeTab === 'profile' && (
              <Card>
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Admin Profile</h2>
                <form className="space-y-6" onSubmit={handleSaveProfile}>
                  <ImageUpload
                    currentUrl={profileForm.avatarUrl}
                    onUpload={async (file) => {
                      const formData = new FormData();
                      formData.append('file', file);
                      const { data } = await api.patch(
                        '/v1/upload/user/avatar',
                        formData,
                        { headers: { 'Content-Type': 'multipart/form-data' } },
                      );
                      setProfileForm((prev) => ({ ...prev, avatarUrl: data.avatarUrl }));
                      addToast({ type: 'success', title: 'Profile photo uploaded!' });
                      return data.avatarUrl;
                    }}
                    label="Upload Profile Photo"
                    hint="PNG, JPG up to 5MB. Recommended: 200x200px"
                  />
                  <Input
                    label="Name"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  />
                  <Input
                    label="Phone"
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  />
                  <Button type="submit">
                    <Save className="w-4 h-4 mr-2" />
                    Save Profile
                  </Button>
                </form>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
