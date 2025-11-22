export default {
  schema: './prisma/schema.prisma',
  datasource: {
    provider: 'sqlite',
    url: 'file:./dev.db',
  },
};
