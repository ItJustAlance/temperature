<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from '@/stores/authStore';

const router = useRouter();

const login = ref("");
const password = ref("");
const errors = ref([]);

const authStore = useAuthStore(); // используем auth store

const onLoginClick = async () => {
  try {
    // Аутентификация пользователя
    const authenticated = await authStore.authenticateUser ({
      login: login.value,
      password: password.value
    });
    console.log('authenticated', authenticated)
    // Перенаправление на главную страницу, если пользователь аутентифицирован
    if (authenticated) {
      router.push("/weather");
    } else {
      // Обработка неудачной аутентификации
      errors.value.push("Неверные учетные данные.");
    }
  } catch (error) {
    // Обработка ошибок
    errors.value.push("Произошла ошибка при аутентификации.");
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
            <form @submit.prevent="onLoginClick" class="form auth__form">
              <div class="form__row">
                <label for="login" class="form__label">Имя пользователя <strong>admin</strong></label>
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
                <label for="password" class="form__label">Пароль <strong>123</strong></label>
                <input
                  id="password"
                  type="password"
                  class="input input_theme_public input_width_full"
                  placeholder="Введите пароль"
                  v-model="password"
                  :toggleMask="true"
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
                  Вход
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
