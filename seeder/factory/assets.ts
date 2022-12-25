import { runSeeder } from "../_fireseed";
import { getFiles } from "$utils/file-system";
import { resolve } from "path";

export default runSeeder(async ({ bucket }) => {
    const path = resolve("./seeder/assets");

    const assets = await getFiles(path);

    assets.map(async (file: string) => {
        const filePath = `${path}/${file}`;

        const bucketFile = bucket.file(filePath);

        if (!(await bucketFile.exists())) {
            console.info("Seeding assets: " + filePath);

            await bucket.upload(filePath, {
                destination: `assets/${file}`,
                public: true,
            });
        }
    });
}).catch((err) => {
    console.error(err);
});
