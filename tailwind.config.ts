import type { Config } from 'tailwindcss'

// Importa cores do config do cliente
// Para trocar as cores: edite src/lib/config.ts
const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: 'var(--cor-primaria)',
          gold: 'var(--cor-secundaria)',
          dark: '#1A1A1A',
        },
      },
      fontFamily: {
        display: ['var(--font-bebas)', 'Impact', 'sans-serif'],
        body: ['var(--font-montserrat)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
