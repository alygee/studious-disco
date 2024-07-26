import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { toast } from 'vue3-toastify';
import type { User } from '@/types';
import UserListData from '../assets/userList.json';

export const useUserStore = defineStore('user', () => {
  const users = ref<User[]>([]);
  const currentPage = ref(1);
  const itemsPerPage = ref(5);
  const searchQuery = ref('');
  const sortField = ref<keyof User>('firstName');
  const sortOrder = ref<'asc' | 'desc'>('asc');

  const loadUsers = async () => {
    return Promise.resolve(UserListData).then((data) => {
      users.value = data;
    });
  };

  const addUser = (user: User) => {
    if (user.firstName || user.lastName || user.email) {
      users.value.push({ ...user, id: Date.now() });
      toast.success('User added');
    } else {
      toast.error('Not enough data to add');
    }
  };

  const updateUser = (updatedUser: User) => {
    const index = users.value.findIndex((user) => user.id === updatedUser.id);
    if (index !== -1) {
      users.value[index] = updatedUser;
    }
    toast.success('User updated');
  };

  const deleteUser = (userId: number) => {
    users.value = users.value.filter((user) => user.id !== userId);
    toast.success('User deleted');
  };

  const filteredUsers = computed(() => {
    return users.value.filter(
      (user) =>
        `${user.firstName} ${user.lastName}`
          .toLowerCase()
          .includes(searchQuery.value.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.value.toLowerCase()),
    );
  });

  const sortedUsers = computed(() => {
    return filteredUsers.value.sort((a, b) => {
      let result = 0;
      if (a[sortField.value] < b[sortField.value]) {
        result = -1;
      } else if (a[sortField.value] > b[sortField.value]) {
        result = 1;
      }
      return sortOrder.value === 'asc' ? result : -result;
    });
  });

  const totalPages = computed(() => {
    return Math.ceil(filteredUsers.value.length / itemsPerPage.value);
  });

  const setPage = (page: number) => {
    currentPage.value = page;
  };

  const setSearchQuery = (query: string) => {
    searchQuery.value = query;
    currentPage.value = 1; // Reset to first page when search query changes
  };

  const setSortField = (field: keyof User) => {
    if (sortField.value === field) {
      sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
    } else {
      sortField.value = field;
      sortOrder.value = 'asc';
    }
  };

  return {
    users: computed(() => users.value),
    loadUsers,
    addUser,
    updateUser,
    deleteUser,
    totalPages,
    setPage,
    currentPage,
    searchQuery,
    setSearchQuery,
    sortField,
    sortOrder,
    setSortField,
    itemsPerPage,
    sortedUsers,
  };
});
