import path from 'path'
export default {
  // vite.config.ts
alias: {
  '/@/': path.resolve(__dirname, 'src'),
},
resolvers: [
  {
      alias(id: string) {
          return id.replace(/^@\//, '/@/') // add slash to particular id, then vite won't resolve it as a module
      },
  },
]
}