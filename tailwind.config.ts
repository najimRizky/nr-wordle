import type { Config } from 'tailwindcss'

const config: Config = {
  safelist: [
    {
      pattern: /bg-(red|green|blue|yellow|pink|purple)-(400|500)/,
      variants: ['lg', 'hover', 'focus', 'lg:hover'],
    },
  ],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
    container: {
      center: true,
      padding: '16px',
    }
  },
  plugins: [
    require('flowbite/plugin')
  ]
}
export default config
