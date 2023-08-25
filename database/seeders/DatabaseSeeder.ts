import * as fs from "fs";
import {Environment} from "../../app/Providers/Environment";
import {asyncForEach} from "../../app/Helpers/functions";
import {AppDataSource} from "../../app/Providers/DataSource";
import {ColorConsole} from "../../app/Utilities/Console";
import {Log} from "../../core/Log";

async function insert(data: { model: any, values: object[] }) {
    const datasource = await AppDataSource.instance().getDataSource();

    datasource.createQueryBuilder()
        .insert()
        .into(data.model)
        .values(data.values)
        .execute()
        .catch(reason => {
            Log().error(reason, 'seeder insert');
        });
}


(async () => {
    const seederDir = Environment.PWD + "/database/seeders";
    const dirFiles = fs.readdirSync(seederDir).filter(file => file !== 'DatabaseSeeder.ts');

    asyncForEach(dirFiles, async (item) => {
        const className = item.replace('.ts', '');
        const seederClass = await import(seederDir + `/${item}`);
        const classInstance = new seederClass[className]()

        await insert(classInstance.seed());
    }).then(value => {
        ColorConsole.success('database seeded: ' + value);
    });
})();