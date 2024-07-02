<template>
    <a-card title="Список всех сделок" :bordered="false">
        <!-- SearchBar -->
        <template #extra>
            <SearchBar :isLoading="isLoading" :searchedTerm="searchTerm" @search="updateSearch" />
        </template>

        <!-- Данные таблицы -->
        <a-table
            :dataSource="dataSource"
            rowKey="id"
            :columns="columns"
            :pagination="false"
            bordered
            :loading="isLoading"
            :scroll="{ x: true }"
        >
            <!-- Сообщение, если ничего не найдено -->
            <template #emptyText>
                <a-empty>
                    <template #description>
                        <p>Ни одной сделки не найдено</p>
                    </template>
                </a-empty>
            </template>

            <!-- Основная информация -->
            <template #bodyCell="{ column, record, index }">
                <!-- Номер -->
                <template v-if="column.key === 'index'">
                    {{ index + 1 }}
                </template>

                <!-- Ответственный -->
                <template v-if="column.key === 'responsible_user'">
                    <UserCard :user="record.responsible_user" />
                </template>

                <!-- Статус -->
                <template v-if="column.key === 'status'">
                    <a-tag :color="record.status.color" style="color: rgba(0, 0, 0, 0.65)">{{
                        record.status.name
                    }}</a-tag>
                </template>

                <!-- Бюджет -->
                <template v-if="column.key === 'price'">
                    <p>{{ record.price }} ₽</p>
                </template>

                <!-- Дата -->
                <template v-if="column.key === 'created_at'">
                    <p>{{ moment(record.created_at).format('D MMMM YYYY') }}</p>
                </template>
            </template>

            <!-- Выпадающий список с контактами -->
            <template #expandedRowRender="{ record }">
                <LeadContacts :contacts="record.contacts" />
            </template>
        </a-table>

        <!-- Модальное окно для вывода ошибки -->
        <a-modal :visible="!!errorMessage" :footer="null" @cancel="handleError">
            <h2>Произошла ошибка</h2>
            <p>Что-то пошло не так. Пожалуйста, повторите ошибку позже</p>
        </a-modal>
    </a-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import moment from 'moment';
// components
import LeadContacts from '@/components/LeadContacts.vue';
import SearchBar from '@/components/ui/SearchBar.vue';
import UserCard from '@/components/ui/UserCard.vue';
// hooks
import useSearch from '@/hooks/useSearch';

const store = useStore();
moment.locale('ru');

const errorMessage = ref(false);
const handleError = () => (errorMessage.value = false);

const { searchTerm, updateSearch } = useSearch(fetchLeads);

const isLoading = ref(false);
async function fetchLeads(): Promise<void> {
    isLoading.value = true;
    try {
        await store.dispatch('getLeads', { searchQuery: searchTerm.value });
    } catch (_) {
        errorMessage.value = true;
    }
    isLoading.value = false;
}
fetchLeads();

const dataSource = computed(() => store.getters.leads);
const columns = [
    { title: '#', key: 'index' },
    { title: 'Название', dataIndex: 'name', key: 'name' },
    { title: 'Бюджет (руб)', dataIndex: 'price', key: 'price' },
    { title: 'Статус', key: 'status' },
    { title: 'Ответственный', key: 'responsible_user' },
    { title: 'Дата создания', dataIndex: 'created_at', key: 'created_at' }
];
</script>
