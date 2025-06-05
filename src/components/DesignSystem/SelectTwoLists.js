import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { HiChevronDown, HiXCircle } from 'react-icons/hi2';

export default function SelectTwoLists({
    initialElementId, 
    onElementSelected, 
    list = [], 
    loading = false, 
    label = "Select" 
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedParent, setSelectedParent] = useState(null);
    const [selectedElement, setSelectedElement] = useState({});
    const [isMobile, setIsMobile] = useState(false);
    const dropdownRef = useRef(null);
    
    // Check if we're on mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);
    
    // Memoize parents list to avoid recalculation on every render
    const parents = useMemo(() => {
        return list.filter(item => !item.parent);
    }, [list]);
    
    // Memoize children list based on selected parent
    const children = useMemo(() => {
        if (!selectedParent) return [];
        return list.filter(element => element?.parent?.id === selectedParent.id);
    }, [list, selectedParent?.id]);

    // Initialize data only when dependencies actually change
    const initializeData = useCallback(() => {
        if (!initialElementId || !list.length) return;
        
        const initialElement = list.find(item => item.id === initialElementId);
        if (!initialElement) return;
        
        setSelectedElement(initialElement);
        setSelectedParent(initialElement.parent);
    }, [initialElementId, list]);
    
    // Initialize data when component mounts or dependencies change
    useEffect(() => {
        initializeData();
    }, [initializeData]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Optimize parent hover handler to avoid unnecessary state updates
    const handleParentHover = useCallback((parent) => {
        // Only update if different parent is selected
        if (selectedParent?.id !== parent.id) {
            setSelectedParent(parent);
        }
    }, [selectedParent?.id]);

    // Batch state updates in select handler
    const handleSelectChild = useCallback((child) => {
        setSelectedElement(child);
        onElementSelected(child.id);
        setIsOpen(false);
    }, [onElementSelected]);

    // Optimize remove selection handler
    const handleRemoveSelection = useCallback(() => {
        setSelectedElement({});
        onElementSelected('');
        setIsOpen(false);
        setSelectedParent(null);
    }, [onElementSelected]);

    // Optimize dropdown open/close handlers
    const openDropdown = useCallback(() => {
        if (isOpen) {
            setIsOpen(false);
            setSelectedParent(null);
            return;
        }
        
        setIsOpen(true);
        // Pre-select first parent if none selected and parents exist
        if (parents.length > 0) {
            if (selectedParent) {
                const index = parents.findIndex(c => c.id === selectedParent.id);
                setSelectedParent(parents[index]);
            } else {
                setSelectedParent(parents[0]);
            }
        }
    }, [isOpen, parents, selectedParent]);

    const closeDropdown = useCallback(() => {
        setIsOpen(false);
        setSelectedParent(null);
    }, []);

    // Memoized conditional values to avoid recalculation
    const hasSelectedElement = selectedElement && Object.keys(selectedElement).length > 0;
    const selectedElementName = hasSelectedElement ? selectedElement.name : '';
    const selectedParentName = selectedParent ? selectedParent.name : '';

    return (
        <div className="relative" ref={dropdownRef} tabIndex="0">
            {/* Trigger Button */}
            <div
                onClick={openDropdown}
                className={`styled-select relative w-full h-13 py-6 cursor-pointer transition-all duration-200 hover:shadow-sm
                    ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                    ${isOpen ? 'border-gray-200' : ''}
                `}
            >
                {/* Label */}
                <div className={`styled-select-label
                    absolute transition-all duration-200 text-gray-600 font-medium pointer-events-none
                    ${hasSelectedElement ? '!text-xs top-0.5' : 'text-sm top-4'}
                `}>
                    {label}
                </div>
                
                {/* Selected Value */}
                {hasSelectedElement && (
                    <div className="selected-value absolute top-4">
                        {selectedParentName && (
                            <span className="text-gray-500 text-xs">
                                {selectedParentName} → 
                            </span>
                        )} {selectedElementName}
                    </div>
                )}
                
                {/* Arrow */}
                {!hasSelectedElement && (
                    <div className="absolute right-3 top-4 flex items-center justify-center">
                        <HiChevronDown 
                            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                                isOpen ? 'rotate-180' : ''
                            }`} 
                        />
                    </div>
                )}
                
                {/* Clear Selection Button */}
                {hasSelectedElement && (
                    <button
                        onClick={handleRemoveSelection}
                        className="absolute right-3 top-4 p-1 hover:bg-gray-100 rounded"
                        type="button"
                    >
                        <HiXCircle className="w-4 h-4 text-gray-500" />
                    </button>
                )}
            </div>

            {/* Mobile overlay */}
            {isOpen && isMobile && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={closeDropdown} />
            )}

            {/* Dropdown Menu */}
            {isOpen && (
                <div className={`
                    ${isMobile 
                        ? 'fixed inset-4 top-16 z-50 bg-white rounded-lg shadow-xl' 
                        : 'absolute z-50 w-full bg-white top-0 rounded-b-md shadow-lg'
                    }
                `}>
                    {/* Header with close button */}
                    <div className="relative h-12 border-b border-gray-100">
                        <div className="text-sm font-medium text-gray-500 px-4 py-3">
                           Select a {label}
                        </div>
                        <button
                            onClick={closeDropdown}
                            className="absolute right-3 top-3 p-1 hover:bg-gray-100 rounded"
                            type="button"
                        >
                            <HiXCircle className="w-4 h-4 text-gray-500" />
                        </button>
                    </div>

                    {/* Two Lists Container */}
                    <div className={`
                        ${isMobile 
                            ? 'flex flex-col h-full' 
                            : 'flex h-96'
                        }
                    `}>
                        {/* Left List - Parent list */}
                        <div className={`
                            ${isMobile 
                                ? 'border-b border-gray-100 p-4 flex-1' 
                                : 'w-[40%] border-r border-gray-100 p-4'
                            }
                        `}>
                            <div className="text-sm font-medium text-gray-500 mb-5">
                                Categories
                            </div>

                            {/* Parent Categories */}
                            <div className={`
                                space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-300
                                ${isMobile ? 'max-h-48' : 'max-h-80'}
                            `}>
                                {parents.map((parent) => {
                                    const isHovered = selectedParent?.id === parent.id;
                                    return (
                                        <div
                                            key={parent.id}
                                            onMouseEnter={() => !isMobile && handleParentHover(parent)}
                                            onClick={() => isMobile && handleParentHover(parent)}
                                            className={`
                                                flex items-center p-3 rounded cursor-pointer transition-all duration-150
                                                ${isHovered ? 'bg-gray-100 opacity-100' : 'bg-gray-50 hover:bg-gray-100'}
                                                ${selectedParent && !isHovered ? 'opacity-30 hover:opacity-100' : 'opacity-100'}
                                            `}
                                        >
                                            <div className="flex-1 min-w-0">
                                                <p className="text-gray-700 font-medium truncate">
                                                    {parent.name}
                                                </p>
                                            </div>
                                            {isHovered && (
                                                <div className="ml-2 text-gray-400">
                                                    →
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Right List - Child list */}
                        <div className={`
                            ${isMobile 
                                ? 'p-4 flex-1' 
                                : 'w-[60%] p-4'
                            }
                        `}>
                            <div className="text-sm font-medium text-gray-500 mb-5 flex items-center">
                                Subcategories
                                {selectedParentName && (
                                    <span className="text-xs text-gray-400 ml-2">
                                        ({selectedParentName})
                                    </span>
                                )}
                            </div>
                            
                            <div className={`
                                space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-violet-400 scrollbar-track-gray-100 hover:scrollbar-thumb-violet-500
                                ${isMobile ? 'max-h-48' : 'max-h-80'}
                            `}>
                                {children.length > 0 ? (
                                    children.map((child) => {
                                        const isSelected = selectedElement.id === child.id;
                                        
                                        return (
                                            <div
                                                key={child.id}
                                                onClick={() => handleSelectChild(child)}
                                                className={`
                                                    flex items-center p-3 rounded cursor-pointer transition-all duration-150
                                                    ${isSelected ? 'bg-gray-100' : 'bg-white hover:bg-gray-50'}
                                                    border border-transparent hover:border-gray-200
                                                `}
                                            >
                                                <div className="mr-3">
                                                    {isSelected ? (
                                                        <div className="w-4 h-4 bg-teal-500 rounded-full flex items-center justify-center">
                                                            <div className="w-2 h-2 bg-white rounded-full"></div>
                                                        </div>
                                                    ) : (
                                                        <div className="w-4 h-4 border-2 border-gray-300 rounded-full hover:border-teal-500"></div>
                                                    )}
                                                </div>
                                                <span className="text-gray-700 flex-1 truncate">
                                                    {child.name}
                                                </span>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="text-gray-400 text-sm italic py-8 text-center">
                                        {selectedParent ? 'No subcategories available' : `Select a category first`}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};