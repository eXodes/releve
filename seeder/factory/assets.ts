import { getFiles } from "$server/utils/file-system";
import { resolve } from "path";
import { runSeeder } from "../_fireseed";

const assetPath = resolve("./seeder/assets");

export default runSeeder(async ({ bucket }) => {
    const assets = await getFiles(assetPath);

    assets.map(async (file: string) => {
        const filePath = `${assetPath}/${file}`;

        const bucketFile = bucket.file(filePath);

        const [exists] = await bucketFile.exists();

        if (!exists) {
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
