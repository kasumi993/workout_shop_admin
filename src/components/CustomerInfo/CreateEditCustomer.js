import { useState, useEffect } from 'react';
import { useToast } from '@/components/GlobalComponents/Notifications';
import CustomersService from '@/services/customersService';

export default function CreateEditCustomer({ customer, onSuccess, onCancel }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        isAdmin: false
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const toast = useToast();
    const isEditMode = !!customer;

    useEffect(() => {
        if (customer) {
            setFormData({
                name: customer.name || '',
                email: customer.email || '',
                isAdmin: customer.isAdmin || false
            });
        } else {
            setFormData({
                name: '',
                email: '',
                isAdmin: false
            });
        }
        setErrors({});
    }, [customer]);

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

            if (isEditMode) {
                await CustomersService.updateCustomer(customer.id, submitData);
                toast.success('Success', 'Customer updated successfully');
            } else {
                await CustomersService.createCustomer(submitData);
                toast.success('Success', 'Customer created successfully');
            }

            onSuccess();
        } catch (error) {
            console.error('Failed to save customer:', error);
            const errorMessage = error.response?.data?.message || 'Failed to save customer';
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
                        {isEditMode ? `Edit Customer` : 'Create New Customer'}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                        {isEditMode
                            ? 'Update the customer information below'
                            : 'Fill in the details to create a new customer'
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

                {/* Admin Status */}
                <div className="border-t border-gray-200 pt-6">
                    <div className="flex items-start sm:items-center space-x-3">
                        <div className="flex items-center mt-1 sm:mt-0">
                            <input
                                type="checkbox"
                                id="customerIsAdmin"
                                checked={formData.isAdmin}
                                onChange={(e) => handleInputChange('isAdmin', e.target.checked)}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                disabled={loading}
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <label htmlFor="customerIsAdmin" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
                                Admin Access
                            </label>
                            <p className="mt-1 text-sm text-gray-500">
                                Grant this customer administrative privileges to access the admin panel
                            </p>
                        </div>
                    </div>
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
                            isEditMode ? 'Update Customer' : 'Create Customer'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}