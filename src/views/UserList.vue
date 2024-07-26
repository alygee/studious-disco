<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">User List</h1>
    <div class="mt-4 mb-4">
      <input
        v-model="searchQuery"
        @input="updateSearchQuery"
        placeholder="Search users"
        class="w-full p-2 border border-gray-300 rounded"
      />
    </div>
    <div class="grid grid-cols-5 gap-4 mb-4">
      <button
        @click="setSortField('firstName')"
        :class="sortButtonClass('firstName')"
        class="text-center py-2 px-8 rounded"
      >
        First Name <span :class="sortIconClass('firstName')"></span>
      </button>
      <button
        @click="setSortField('lastName')"
        :class="sortButtonClass('lastName')"
        class="text-center py-2 px-8 rounded"
      >
        Last Name <span :class="sortIconClass('lastName')"></span>
      </button>
      <button
        @click="setSortField('email')"
        :class="sortButtonClass('email')"
        class="text-center py-2 px-8 rounded"
      >
        Email <span :class="sortIconClass('email')"></span>
      </button>
      <button
        @click="setSortField('lastVisitedAt')"
        :class="sortButtonClass('lastVisitedAt')"
        class="text-center py-2 px-8 rounded"
      >
        Last Visited <span :class="sortIconClass('lastVisitedAt')"></span>
      </button>
    </div>
    <div
      v-for="user in paginatedUsers()"
      :key="user.id"
      class="p-2 border rounded"
    >
      <div class="grid grid-cols-5 gap-4">
        <div>{{ user.firstName }}</div>
        <div>{{ user.lastName }}</div>
        <div>{{ user.email }}</div>
        <div>
          {{ new Date(user.lastVisitedAt * 1000).toLocaleString() }}
        </div>
        <div class="text-right">
          <router-link :to="`/user/${user.id}`">
            <button
              class="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Edit
            </button>
          </router-link>
          <button
            @click="deleteUser(user.id)"
            class="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 ml-2"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-5 gap-4 my-5">
      <input
        v-model="newUser.firstName"
        type="text"
        placeholder="First Name"
        class="w-full p-2 border border-gray-300 rounded"
      />
      <input
        v-model="newUser.lastName"
        type="text"
        placeholder="Last Name"
        class="w-full p-2 border border-gray-300 rounded"
      />
      <input
        v-model="newUser.email"
        type="email"
        placeholder="Email"
        class="w-full p-2 border border-gray-300 rounded"
      />
      <input
        v-model.number="newUser.lastVisitedAt"
        type="number"
        placeholder="Last Visited (timestamp)"
        class="w-full p-2 border border-gray-300 rounded"
      />
      <button
        type="button"
        class="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 ml-2"
        @click="addUser(newUser)"
      >
        Add
      </button>
    </div>
    <div v-if="totalPages > 1" class="flex justify-center mt-4 space-x-2">
      <button
        v-for="page in totalPages"
        :key="page"
        @click="setPage(page)"
        :class="[
          'px-3 py-1 rounded',
          {
            'bg-blue-500 text-white': currentPage === page,
            'bg-gray-200': currentPage !== page,
          },
        ]"
      >
        {{ page }}
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/userStore';
import UserForm from '@/components/UserForm.vue';
import type { User } from '@/types';

const userStore = useUserStore();
const {
  users,
  totalPages,
  currentPage,
  searchQuery,
  itemsPerPage,
  sortedUsers,
} = storeToRefs(userStore);

const newUser = ref<User | null>({
  id: 0,
  email: '',
  firstName: '',
  lastName: '',
  lastVisitedAt: Date.now(),
});

const loadUsers = async () => {
  await userStore.loadUsers();
};

const addUser = (user: User) => {
  userStore.addUser(user);
  newUser.value = {
    id: 0,
    email: '',
    firstName: '',
    lastName: '',
    lastVisitedAt: Date.now(),
  };
};

const deleteUser = (userId: number) => {
  userStore.deleteUser(userId);
};

const setPage = (page: number) => {
  userStore.setPage(page);
};

const updateSearchQuery = () => {
  userStore.setSearchQuery(searchQuery.value);
};

const setSortField = (field: keyof User) => {
  userStore.setSortField(field);
};

const sortButtonClass = (field: keyof User) => {
  return userStore.sortField === field
    ? userStore.sortOrder === 'asc'
      ? 'bg-gray-300 text-black'
      : 'bg-gray-500 text-white'
    : 'bg-gray-200 text-black';
};

const sortIconClass = (field: keyof User) => {
  if (userStore.sortField === field) {
    return userStore.sortOrder === 'asc' ? 'icon-asc' : 'icon-desc';
  }
  return 'icon-none';
};

function paginatedUsers() {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return sortedUsers.value.slice(start, end);
}

onMounted(loadUsers);
</script>

<style scoped>
.icon-asc::before {
  content: '↑';
}
.icon-desc::before {
  content: '↓';
}
.icon-none::before {
  content: '↕';
}
</style>
