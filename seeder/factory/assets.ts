import { getFiles } from "$server/utils/file-system";
import { resolve } from "path";
import { runSeeder } from "../_fireseed";

const assetPath = resolve("./seeder/assets");

export default runSeeder(async ({ bucket }) => {
    const assets = await getFiles(assetPath);

    assets.map(async (file: string) => {
        const filePath = `${assetPath}/${file}`;
        const destination = `assets/${file}`;

        const bucketFile = bucket.file(destination);

        const [exists] = await bucketFile.exists();

        if (!exists) {
            console.info("Seeding assets: " + destination);

            await bucket.upload(filePath, {
                destination,
                public: true,
            });
        }
    });
}).catch((err) => {
    console.error(err);
});
