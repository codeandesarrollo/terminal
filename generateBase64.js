const clientId = 'AW79wRK5RvhvX2aDDoOgXeadTdkEl1soGvAKdga9uUdsNG4umGrf9pf38zEQ2_WVsD2mT_2G-BvwHPn4';
const secret = 'ELtlNn5XddAEt9NwsYi4BvAg8CXacZcpf_TjKLxsXqZ64woQUHVDvep66KgY2_1kxI-hUnH0SutgwLN8';

const base64 = Buffer.from(`${clientId}:${secret}`).toString('base64');
console.log(base64);
