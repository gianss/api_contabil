import { BcryptAdapter } from '../../cryptography/bcrypter-adapter'
import { Knex } from 'knex'

export async function seed(knex: Knex): Promise<void> {
    const bcryptAdapter = new BcryptAdapter(10)
    await knex('users').del()
    await knex('companys').del()
    await knex('companys').insert(
        {
            id: 1,
            name: 'Gian Sousa',
            phone: '77988654840',
            email: 'gian_ss@live.com',
            status: 'active'
        }
    )
    await knex('users').insert([
        {
            id: 1,
            name: 'Gian Sousa',
            email: 'gian_ss@live.com',
            phone: '77988654840',
            password: await bcryptAdapter.hash('123'),
            status: 'active',
            type: 'administrator',
            company_id: 1
        },
        {
            id: 2,
            name: 'Robson Braga',
            email: 'rbqdev@gmail.com',
            phone: '77988654840',
            password: await bcryptAdapter.hash('123'),
            status: 'active',
            type: 'company',
            company_id: 1
        },
        {
            id: 3,
            name: 'Igor Ferreia',
            email: 'igorfals@gmail.com',
            phone: '77988654840',
            password: await bcryptAdapter.hash('123'),
            status: 'active',
            type: 'employee',
            company_id: 1
        }
    ])
};
