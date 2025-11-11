interface ImportMetaEnv {
  readonly VITE_URL_SERVER: string;
  readonly VITE_URL_PICTURES: string;
  // добавьте другие переменные по мере необходимости
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
