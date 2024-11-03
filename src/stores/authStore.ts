import { defineStore } from "pinia";

interface UserPayloadInterface {
  login: string;
  password: string;
  token: string;
}
interface UserData {
  email: string;
  password: string;
  token: string;
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    authenticated: false,
    loading: false,
    userData: {},
  }),
  actions: {
    onAuth(payload: UserPayloadInterface){
      console.log('payload.token', payload.token)
      localStorage.setItem('authToken', payload.token);
      this.authenticated = true;

    },
    async authenticateUser(payload: UserPayloadInterface) {
      console.log('payload', payload)
      // отправляем запрос

      const result: Response = await fetch('/api.json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login: payload.login, password: payload.password }),
      });

      if (!result.ok) {
        throw new Error('Сеть не отвечает');
      }
      const data = await result.json();

      // имитируем будто нам сервер отдал нужные данные
      const dataFilter = data.data.find((el: UserData) => el.email === payload.login && el.password === payload.password)

      console.log('dataFilter', dataFilter)
      if (result.ok) {
        localStorage.setItem('authToken', dataFilter.token)

        this.authenticated = true;
        this.userData = dataFilter;
        return this.authenticated;
      }
    },
  },
});
