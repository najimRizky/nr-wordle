import type { Config } from 'tailwindcss'

const config: Config = {
  safelist: [
    {
      pattern: /bg-(red|green|blue|yellow|pink|purple)-(400|500)/,
    },
  ],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    fontFamily: {
      "body": ['"Nunito"', 'sans-serif'],
    },
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      keyframes: {
        pulse2: {
          '0%, 100%': { opacity: "1" },
          '50%': { opacity: "0.25" },
        },
      }
    },
    screens: {
      xs: '480px',
      sm: '600px',
      md: '728px',
      lg: '984px',
      xl: '1180px',
      '2xl': '1400px',
    },
    container: {
      center: true,
      padding: '16px',
    }
  }
}
export default config
