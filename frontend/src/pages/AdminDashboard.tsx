import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_CATEGORIES, GET_USER } from "../graphql/queries";
import {
  ADD_CATEGORY,
  UPDATE_CATEGORY_NAME,
  DELETE_CATEGORY,
} from "../graphql/mutations";
import { useAuth } from "../hooks/useAuth";
import {
  ChartBarIcon,
  UsersIcon,
  PlusIcon,
  ShoppingBagIcon,
  FolderIcon,
  PencilIcon,
  TrashIcon,
  TagIcon,
} from "@heroicons/react/24/outline";

interface Category {
  id: number;
  name: string;
  parent?: Category | null;
  children: Category[];
  products: Product[];
}

interface Product {
  id: number;
  title: string;
}

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [showCreateCategory, setShowCreateCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categoryData, setCategoryData] = useState({
    category: "",
    parentId: null as number | null,
  });
  const [editCategoryName, setEditCategoryName] = useState("");

  // Get basic data for admin overview
  const { data: categoriesData, loading: categoriesLoading, refetch: refetchCategories } = useQuery(GET_CATEGORIES);
  const { data: userData } = useQuery(GET_USER);

  const [addCategory] = useMutation(ADD_CATEGORY);
  const [updateCategoryName] = useMutation(UPDATE_CATEGORY_NAME);
  const [deleteCategory] = useMutation(DELETE_CATEGORY);

  // Track page view when component mounts
  React.useEffect(() => {
    // Simple page tracking could be implemented here in the future
  }, [user]);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await addCategory({
        variables: {
          category: categoryData.category,
          parentId: categoryData.parentId,
        },
      });
      setShowCreateCategory(false);
      setCategoryData({
        category: "",
        parentId: null,
      });
      refetchCategories();
    } catch (error: any) {
      console.error("Error creating category:", error);
      setError(error.message || "Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await updateCategoryName({
        variables: {
          categoryId: editingCategory.id,
          category: editCategoryName,
        },
      });
      setEditingCategory(null);
      setEditCategoryName("");
      refetchCategories();
    } catch (error: any) {
      console.error("Error updating category:", error);
      setError(error.message || "Failed to update category");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      setLoading(true);
      setError(null);
      
      try {
        await deleteCategory({
          variables: { categoryId },
        });
        refetchCategories();
      } catch (error: any) {
        console.error("Error deleting category:", error);
        setError(error.message || "Failed to delete category");
      } finally {
        setLoading(false);
      }
    }
  };

  if (user?.role !== "Admin") {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Access denied. Admin privileges required.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      {/* Error Display */}
      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
          <button 
            onClick={() => setError(null)}
            className="float-right ml-2 text-red-700 hover:text-red-900"
          >
            ×
          </button>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "overview"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <ChartBarIcon className="h-5 w-5 inline mr-2" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "categories"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <FolderIcon className="h-5 w-5 inline mr-2" />
            Categories
          </button>
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Basic Stats */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FolderIcon className="h-8 w-8 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    Total Categories
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {categoriesData?.categories?.length || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UsersIcon className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    Admin Dashboard
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    Active
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ShoppingBagIcon className="h-8 w-8 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    System Status
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    Online
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TagIcon className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    User Role
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {user?.role}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Welcome Message */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Welcome to Admin Dashboard
            </h3>
            <p className="text-gray-600 mb-4">
              Manage your e-commerce platform from here. You can:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Manage product categories</li>
              <li>View system statistics</li>
              <li>Monitor platform activity</li>
            </ul>
          </div>
        </div>
      )}

      {/* Categories Tab */}
      {activeTab === "categories" && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Categories</h2>
            <button
              onClick={() => setShowCreateCategory(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Category
            </button>
          </div>

          {categoriesLoading ? (
            <div className="flex justify-center items-center min-h-64">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  All Categories
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Parent Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {categoriesData?.categories?.map((category: Category) => (
                      <tr key={category.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {category.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {category.parent?.name || "Root Category"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => {
                              setEditingCategory(category);
                              setEditCategoryName(category.name);
                            }}
                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                            title="Edit category"
                            aria-label={`Edit ${category.name} category`}
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete category"
                            aria-label={`Delete ${category.name} category`}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create Category Modal */}
      {showCreateCategory && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Add New Category
              </h3>
              <form onSubmit={handleCreateCategory} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={categoryData.category}
                    onChange={(e) =>
                      setCategoryData({
                        ...categoryData,
                        category: e.target.value,
                      })
                    }
                    placeholder="Enter category name"
                    title="Category name"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Parent Category (Optional)
                  </label>
                  <select
                    value={categoryData.parentId || ""}
                    onChange={(e) =>
                      setCategoryData({
                        ...categoryData,
                        parentId: e.target.value
                          ? parseInt(e.target.value)
                          : null,
                      })
                    }
                    title="Parent category selection"
                    aria-label="Select parent category"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">No Parent</option>
                    {categoriesData?.categories?.map((cat: Category) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateCategory(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Creating..." : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {editingCategory && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Edit Category
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={editCategoryName}
                    onChange={(e) => setEditCategoryName(e.target.value)}
                    placeholder="Enter new category name"
                    title="Edit category name"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setEditingCategory(null);
                      setEditCategoryName("");
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateCategory}
                    disabled={loading}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
