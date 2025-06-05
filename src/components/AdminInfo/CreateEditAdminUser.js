import { useState, useEffect } from 'react';
import { useToast } from '@/components/GlobalComponents/Notifications';
import CustomersService from '@/services/customersService';
import ImageUploader from '../Images/ImageUploader';

export default function CreateEditAdminUser({ user, onSuccess, onCancel }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        image: '',
        isAdmin: true
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const toast = useToast();
    const isEditMode = !!user;

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                password: '',
                confirmPassword: '',
                image: user.image || '',
                isAdmin: user.isAdmin || true
            });
        } else {
            setFormData({
                name: '',
                email: '',
                password: '',
                confirmPassword: '',
                image: '',
                isAdmin: true
            });
        }
        setErrors({});
    }, [user]);

    const validateForm = () => {
        const newErrors = {};

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Password validation (only for new users or when password is provided for existing users)
        if (!isEditMode || formData.password) {
            if (!formData.password) {
                newErrors.password = 'Password is required';
            } else if (formData.password.length < 6) {
                newErrors.password = 'Password must be at least 6 characters long';
            }

            if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const submitData = {
                name: formData.name.trim(),
                email: formData.email.trim(),
                isAdmin: formData.isAdmin
            };

            // Only include image if it's provided
            if (formData.image.trim()) {
                submitData.image = formData.image.trim();
            }

            // Only include password if it's provided (required for new users)
            if (formData.password || !isEditMode) {
                submitData.password = formData.password;
            }

            if (isEditMode) {
                await CustomersService.updateCustomer(user.id, submitData);
                toast.success('Success', 'Admin user updated successfully');
            } else {
                await CustomersService.createCustomer(submitData);
                toast.success('Success', 'Admin user created successfully');
            }

            onSuccess();
        } catch (error) {
            console.error('Failed to save admin user:', error);
            const errorMessage = error.response?.data?.message || 'Failed to save admin user';
            toast.error('Error', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-medium text-gray-900">
                        {isEditMode ? `Edit Admin User` : 'Create New Admin User'}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                        {isEditMode 
                            ? 'Update the admin user information below' 
                            : 'Fill in the details to create a new admin user'
                        }
                    </p>
                </div>
                <button
                    onClick={onCancel}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name *
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            placeholder="Enter full name"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                                errors.name ? 'border-red-300' : 'border-gray-300'
                            }`}
                            disabled={loading}
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address *
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            placeholder="Enter email address"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                                errors.email ? 'border-red-300' : 'border-gray-300'
                            }`}
                            disabled={loading}
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                        )}
                    </div>
                </div>

                {/* Password Section */}
                <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-md font-medium text-gray-900 mb-4">
                        {isEditMode ? 'Change Password (Optional)' : 'Password *'}
                    </h3>
                    {isEditMode && (
                        <p className="text-sm text-gray-600 mb-4">
                            Leave password fields empty to keep the current password
                        </p>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {isEditMode ? 'New Password' : 'Password *'}
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                    placeholder={isEditMode ? 'Enter new password' : 'Enter password'}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors pr-10 ${
                                        errors.password ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                            )}
                            <p className="mt-1 text-sm text-gray-500">
                                Minimum 6 characters
                            </p>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {isEditMode ? 'Confirm New Password' : 'Confirm Password *'}
                            </label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={formData.confirmPassword}
                                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                placeholder="Confirm password"
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                                    errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                                }`}
                                disabled={loading}
                            />
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Admin Status */}
                <div className="border-t border-gray-200 pt-6">
                    <div className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            id="isAdmin"
                            checked={formData.isAdmin}
                            onChange={(e) => handleInputChange('isAdmin', e.target.checked)}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            disabled={loading}
                        />
                        <label htmlFor="isAdmin" className="text-sm font-medium text-gray-700">
                            Admin Access
                        </label>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                        Grant this user administrative privileges to access the admin panel
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:justify-end pt-6 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {isEditMode ? 'Updating...' : 'Creating...'}
                            </>
                        ) : (
                            isEditMode ? 'Update Admin User' : 'Create Admin User'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}