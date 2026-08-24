import type { Config } from 'tailwindcss'

const nimbus = ['var(--font-nimbus, "Helvetica Neue"), sans-serif']
const nimbusCond = ['var(--font-nimbus-cond, "Arial Narrow"), sans-serif']
const plantin = ['var(--font-plantin, Georgia), serif']

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#171a21',
        orange: '#FF6900',
        alabaster: '#dddfdf',
        slate: '#735cdd',
        ocean: '#3c91e6',
      },
      fontFamily: {
        sans: nimbus,
        cond: nimbusCond,
        serif: plantin,
        // alias heredado: cualquier `font-mono` restante también usa Nimbus Sans
        mono: nimbus,
      },
    },
  },
  plugins: [],
}

export default config
