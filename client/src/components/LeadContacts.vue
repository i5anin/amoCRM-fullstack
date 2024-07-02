<template>
    <!-- Сообщение, если нет контактов -->
    <h4 v-if="contacts.length === 0" style="text-align: center">Нет Контактов, связанных со сделкой</h4>

    <!-- Контакты -->
    <template v-else>
        <!-- Заголовок -->
        <h4 style="text-align: center">Контакты, связанные со сделкой:</h4>

        <!-- Таблица контактов -->
        <a-table :dataSource="contacts" :columns="columns" :pagination="false" rowKey="id" bordered>
            <template #bodyCell="{ column, record, index }">
                <!-- Порядковый номер -->
                <template v-if="column.key === 'index'">
                    {{ index + 1 }}
                </template>

                <!-- Карточка (аватар, имя, ссылки на звонок/письмо) -->
                <template v-if="column.key === 'name'">
                    <UserCard :user="record" />
                </template>

                <!-- Номер телефона и почта будут вставлены в виде сырых данных из dataSource-->
            </template>
        </a-table>
    </template>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import IUser from '@/types/IUser';
import UserCard from '@/components/ui/UserCard.vue';

defineProps<{ contacts: IUser[] }>();

const columns = [
    { title: '#', key: 'index' },
    { title: 'Имя', dataIndex: 'name', key: 'name' },
    { title: 'Номер телефона', dataIndex: 'phone', key: 'phone' },
    { title: 'Почта', dataIndex: 'email', key: 'email' }
];
</script>
