import React from 'react';
import Head from 'next/head';
import { Plus, Edit2, Mail, Phone, Users, Trash2 } from 'lucide-react';
import { Card, Button, Input, Badge, Loading, useToast } from '@/components/ui';
import { useStaff, useCreateStaff, useUpdateStaff, useDeleteStaff } from '@/hooks';
import { cn } from '@/lib/utils';

interface StaffFormData {
  name: string;
  email: string;
  phone: string;
  role: 'STAFF' | 'OWNER';
}

const emptyForm: StaffFormData = {
  name: '',
  email: '',
  phone: '',
  role: 'STAFF',
};

export default function StaffPage() {
  const { data: staff, isLoading } = useStaff();
  const createStaff = useCreateStaff();
  const updateStaff = useUpdateStaff();
  const deleteStaff = useDeleteStaff();
  const { addToast } = useToast();

  const [showForm, setShowForm] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState<StaffFormData>({ ...emptyForm });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        await updateStaff.mutateAsync({ id: editingId, ...formData });
        addToast({ type: 'success', title: 'Staff member updated!' });
      } else {
        await createStaff.mutateAsync(formData);
        addToast({ type: 'success', title: 'Staff member added!' });
      }
      
      setShowForm(false);
      setEditingId(null);
      setFormData({ ...emptyForm });
    } catch (err: any) {
      addToast({ 
        type: 'error', 
        title: 'Failed to save staff', 
        message: err.response?.data?.message || 'Try again.' 
      });
    }
  };

  const handleEdit = (member: any) => {
    setEditingId(member.id);
    setFormData({
      name: member.name || '',
      email: member.email || '',
      phone: member.phone || '',
      role: member.role || 'STAFF',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this staff member?')) {
      try {
        await deleteStaff.mutateAsync(id);
        addToast({ type: 'success', title: 'Staff member deleted!' });
      } catch (err: any) {
        addToast({ 
          type: 'error', 
          title: 'Failed to delete staff', 
          message: err.response?.data?.message || 'Try again.' 
        });
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ ...emptyForm });
  };

  if (isLoading) return <Loading text="Loading staff..." />;

  return (
    <>
      <Head>
        <title>Staff - Overline Admin</title>
      </Head>

      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Staff</h1>
            <p className="text-gray-500">Manage your team members</p>
          </div>
          <Button onClick={() => { setEditingId(null); setFormData({ ...emptyForm }); setShowForm(true); }}>
            <Plus className="w-4 h-4 mr-2" />
            Add Staff
          </Button>
        </div>

        {/* Add/Edit Form Modal */}
        {showForm && (
          <Card className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {editingId ? 'Edit Staff Member' : 'Add Staff Member'}
            </h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  label="Full Name" 
                  required 
                  placeholder="Enter name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <Input 
                  label="Email" 
                  type="email" 
                  required 
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  label="Phone" 
                  type="tel" 
                  placeholder="+91 9876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as 'STAFF' | 'OWNER' })}
                  >
                    <option value="STAFF">Staff</option>
                    <option value="OWNER">Owner/Manager</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button 
                  type="submit" 
                  isLoading={createStaff.isPending || updateStaff.isPending}
                  disabled={createStaff.isPending || updateStaff.isPending}
                >
                  {editingId ? 'Update Staff' : 'Add Staff'}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Staff Grid */}
        {!staff || staff.length === 0 ? (
          <Card className="text-center py-12">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No staff members yet</h3>
            <p className="text-gray-500 mb-4">Add your first team member to get started.</p>
            <Button onClick={() => { setEditingId(null); setFormData({ ...emptyForm }); setShowForm(true); }}>
              <Plus className="w-4 h-4 mr-2" /> Add Staff
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {staff.map((member: any) => (
              <Card key={member.id}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold text-lg">
                      {member.avatarUrl ? (
                        <img src={member.avatarUrl} alt={member.name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        member.name?.charAt(0) || 'S'
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{member.name}</h3>
                      <Badge variant={member.role === 'OWNER' ? 'info' : 'default'}>
                        {member.role}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button 
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                      onClick={() => handleEdit(member)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      onClick={() => handleDelete(member.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {member.email && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Mail className="w-4 h-4" />
                      {member.email}
                    </div>
                  )}
                  {member.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Phone className="w-4 h-4" />
                      {member.phone}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <span
                    className={cn(
                      'text-sm font-medium',
                      member.isActive ? 'text-green-600' : 'text-gray-400'
                    )}
                  >
                    {member.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
