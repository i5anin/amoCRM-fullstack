<template>
    <a-row align="middle" :gutter="8">
        <!-- Аватар -->
        <a-col>
            <a-avatar size="small">
                <template #icon><UserOutlined /></template>
            </a-avatar>
        </a-col>

        <!-- Имя -->
        <a-col>
            {{ user.name }}
        </a-col>

        <!-- Звонок по номеру телефона (ссылка) -->
        <a-col>
            <a v-if="user.phone" :href="phoneLink">
                <PhoneTwoTone />
            </a>
        </a-col>

        <!-- Написать письмо на эл.почту (ссылка) -->
        <a-col>
            <a v-if="user.email" :href="emailLink">
                <MailOutlined />
            </a>
        </a-col>
    </a-row>
</template>

<script setup lang="ts">
import { UserOutlined, PhoneTwoTone, MailOutlined } from '@ant-design/icons-vue';
import { defineProps, computed } from 'vue';
import IUser from '@/types/IUser';

const props = defineProps<{ user: IUser }>();

const phoneLink = computed(() => 'tel:' + props.user.phone);
const emailLink = computed(() => 'mailto:' + props.user.email);
</script>
