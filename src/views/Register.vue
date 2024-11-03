<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from '@/stores/authStore';

const router = useRouter();

const login = ref("");
const password = ref("");
const errors = ref([]);

const authStore = useAuthStore(); // используем auth store

const onRegisterClick = async () => {
  try {

    // типа отправили на бэк
    const params = {
      login: login.value,
      password: password.value
    };
    if(!login.value || !password.value)
      return

    const result = await fetch('api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    });
    console.log('resulttt', result);
    // нам прислали токен вызываем экшн для авторизации

    await authStore.onAuth ({
      token: 'dsf-fds-dfsd-fsd-sfdgdfbb-fd'
    });
    router.push('/weather')

  } catch (error) {
    console.error(error);
  }
};
</script>


<template>
  <div class="auth-page">
    <main class="auth-content auth-page__content">
      <div class="auth-content__inner">
        <div class="auth-content__col auth-content__col_for_form">
          <div class="auth">
            <form @submit.prevent="onRegisterClick" class="form auth__form">
              <div class="form__row">
                <label for="login" class="form__label">Имя пользователя</label>
                <input
                  id="login"
                  type="text"
                  class="input input_theme_public input_width_full"
                  placeholder="Введите имя пользователя"
                  v-model="login"
                />
                <span class="error form__error-msg"></span>
              </div>
              <div class="form__row">
                <label for="password" class="form__label">Пароль</label>
                <input
                  id="password"
                  type="password"
                  class="input input_theme_public input_width_full"
                  placeholder="Введите пароль"
                  v-model="password"
                />
                <span class="error form__error-msg"></span>
              </div>

              <div v-if="errors.length > 0" class="form__row">
                <div
                  class="text-error"
                  v-for="(error, index) in errors"
                  :key="index"
                >
                  {{ error }}
                </div>
              </div>
              <div class="form__buttons">
                <button
                  type="submit"
                  class="button button_theme_main button_width_full"
                >
                  Зарегистрироваться
                </button>

              </div>
            </form>
          </div>
        </div>
      </div>
    </main>

  </div>
</template>

<style scoped></style>
