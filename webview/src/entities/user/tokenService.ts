class TokenService {
  setToken(token: string) {
    localStorage.setItem("token", token);
  }

  getToken() {
    return localStorage.getItem("token");
  }

  hasToken(): boolean {
    const token = localStorage.getItem("token");
    return Boolean(token);
  }
}

export const tokenService = new TokenService();
