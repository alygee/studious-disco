<template>
  <div class="max-w-md mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">User Details</h1>
    <form @submit.prevent="onSubmit" class="space-y-4">
      <div v-if="user" class="p-4 border rounded space-y-2">
        <input
          v-model="user.firstName"
          type="text"
          placeholder="First Name"
          class="w-full p-2 border border-gray-300 rounded"
        />
        <input
          v-model="user.lastName"
          type="text"
          placeholder="Last Name"
          class="w-full p-2 border border-gray-300 rounded"
        />
        <input
          v-model="user.email"
          type="email"
          placeholder="Email"
          class="w-full p-2 border border-gray-300 rounded"
        />
        <input
          v-model.number="user.lastVisitedAt"
          type="number"
          placeholder="Last Visited (timestamp)"
          class="w-full p-2 border border-gray-300 rounded"
        />
        <button
          type="submit"
          class="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Save
        </button>
      </div>
    </form>
    <router-link to="/" class="mt-4 block text-blue-500"
      >Back to User List</router-link
    >
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/userStore';
import type { User } from '@/types';

const route = useRoute();
const user = ref<User | null>(null);
const userStore = useUserStore();
const { users } = storeToRefs(userStore);

const emits = defineEmits<{ (e: 'submit', user: User): void }>();

onMounted(async () => {
  if (!users.value.length) {
    await userStore.loadUsers();
  }
  const userId = Number(route.params.id);
  user.value = users.value.find((u) => u.id === userId) || null;
});

const onSubmit = () => {
  userStore.updateUser({ ...user.value });
};
</script>
