<template>
  <div class="max-w-md mx-auto mt-8">
    <form @submit.prevent="onSubmit" class="space-y-4">
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
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, defineProps, defineEmits } from 'vue';
import type { User } from '@/types';

const props = defineProps<{ initialUser: User | null }>();
const emits = defineEmits<{ (e: 'submit', user: User): void }>();

const user = ref<User>({
  id: 0,
  email: '',
  firstName: '',
  lastName: '',
  lastVisitedAt: Date.now(),
});

watch(
  () => props.initialUser,
  (newVal) => {
    if (newVal) {
      user.value = { ...newVal };
    }
  },
  { immediate: true },
);

const onSubmit = () => {
  emits('submit', { ...user.value });
  user.value = {
    id: 0,
    email: '',
    firstName: '',
    lastName: '',
    lastVisitedAt: Date.now(),
  };
};
</script>
