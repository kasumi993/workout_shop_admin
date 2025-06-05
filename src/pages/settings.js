import MainLayout from "@/layouts/MainLayout";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import AdminUsersList from "@/components/AdminInfo/AdminUsersList";
import CreateEditAdminUser from "@/components/AdminInfo/CreateEditAdminUser";
import CustomersService from "@/services/customersService";
import { useToast } from "@/components/GlobalComponents/Notifications";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('users');
  const [adminUsers, setAdminUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);
  const { data: session } = useSession();
  const toast = useToast();

  useEffect(() => {
    if (activeTab === 'users') {
      fetchAdminUsers();
    }
  }, [activeTab, refresh]);

  const fetchAdminUsers = async () => {
    try {
      setLoading(true);
      const customers = await CustomersService.getCustomers();
      // Filter only admin users
      const admins = customers.filter(customer => customer.isAdmin);
      setAdminUsers(admins);
    } catch (error) {
      console.error('Failed to fetch admin users:', error);
      toast.error('Error', 'Failed to load admin users');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = () => {
    setEditingUser(null);
    setShowCreateForm(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowCreateForm(true);
  };

  const handleDeleteUser = async (user) => {
    // Prevent deleting the current user
    if (user.id === session?.user?.id) {
      toast.error('Error', 'You cannot delete your own account');
      return;
    }

    try {
      await CustomersService.deleteCustomer(user.id);
      toast.success('Success', 'Admin user deleted successfully');
      setRefresh(prev => prev + 1);
    } catch (error) {
      console.error('Failed to delete admin user:', error);
      toast.error('Error', 'Failed to delete admin user');
    }
  };

  const handleFormSuccess = () => {
    setShowCreateForm(false);
    setEditingUser(null);
    setRefresh(prev => prev + 1);
  };

  const handleFormCancel = () => {
    setShowCreateForm(false);
    setEditingUser(null);
  };

  const tabs = [
    {
      id: 'users',
      name: 'Admin Users',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
      )
    },
    {
      id: 'general',
      name: 'General',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    }
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-1">Manage your admin panel settings and users</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    cursor-pointer flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                    ${activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  {tab.icon}
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'users' && (
              <div className="space-y-6">
                {!showCreateForm ? (
                  <>
                    {/* Admin Users Section Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <h2 className="text-lg font-medium text-gray-900">Admin Users</h2>
                        <p className="text-sm text-gray-600 mt-1">
                          Manage admin users who can access this panel
                        </p>
                      </div>
                      <button
                        onClick={handleCreateUser}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add Admin User
                      </button>
                    </div>

                    {/* Admin Users List */}
                    <AdminUsersList
                      users={adminUsers}
                      loading={loading}
                      currentUserId={session?.user?.id}
                      onEditUser={handleEditUser}
                      onDeleteUser={handleDeleteUser}
                    />
                  </>
                ) : (
                  <>
                    {/* Create/Edit Form */}
                    <CreateEditAdminUser
                      user={editingUser}
                      onSuccess={handleFormSuccess}
                      onCancel={handleFormCancel}
                    />
                  </>
                )}
              </div>
            )}

            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">General Settings</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Configure general application settings
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <div className="text-gray-500">
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p>General settings coming soon</p>
                    <p className="text-sm mt-1">Additional configuration options will be available here</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}