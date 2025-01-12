import fs from "fs";
import fonter from "gulp-fonter";
import ttf2woff2 from "gulp-ttf2woff2";

export const otf2ttf = () => {
    return app.gulp
        .src(`${app.path.srcFolder}/fonts/*.otf`, {})
        .pipe(
            app.plugins.plumber(
                app.plugins.notify.onError({
                    title: "FONTS",
                    message: "Error: <%= error.message %>",
                })
            )
        )
        .pipe(
            fonter({
                formats: ["ttf"],
            })
        )
        .pipe(app.gulp.dest(`${app.path.srcFolder}/fonts/`));
};

export const ttfToWoff = () => {
    return app.gulp
        .src(`${app.path.srcFolder}/fonts/*.ttf`, {})
        .pipe(
            app.plugins.plumber(
                app.plugins.notify.onError({
                    title: "FONTS",
                    message: "Error: <%= error.message %>",
                })
            )
        )
        .pipe(
            fonter({
                formats: ["woff"],
            })
        )
        .pipe(app.gulp.dest(`${app.path.build.fonts}`))
        .pipe(app.gulp.src(`${app.path.srcFolder}/fonts/*.ttf`))
        .pipe(ttf2woff2())
        .pipe(app.gulp.dest(`${app.path.build.fonts}`));
};
export const copyWoff = () => {
    return app.gulp
        .src(`${app.path.srcFolder}/fonts/*.woff`)
        .pipe(app.gulp.dest(`${app.path.build.fonts}`))
        .pipe(app.gulp.src(`${app.path.srcFolder}/fonts/*.woff2`))
        .pipe(app.gulp.dest(`${app.path.build.fonts}`));
};

export const fontsStyle = () => {
    let fontsFile = `${app.path.srcFolder}/scss/fonts.scss`;

    fs.readdir(app.path.build.fonts, function (err, fontsFiles) {
        if (fontsFiles) {
            if (!fs.existsSync(fontsFile)) {
                fs.writeFile(fontsFile, "", cb);
                let newFileOnly;

                for (let i = 0; i < fontsFiles.length; i++) {
                    let fontFileName = fontsFiles[i].split(".")[0];
                    if (newFileOnly !== fontFileName) {
                        let fontName = fontFileName.split("-")[0]
                            ? fontFileName.split("-")[0]
                            : fontFileName;

                        let fontDetails = fontFileName.split("-")[1]
                            ? fontFileName.split("-")[1]
                            : fontFileName;

                        let fontWeight = 400;
                        let fontStyle = "normal";

                        switch (true) {
                            case /thin/i.test(fontDetails):
                                fontWeight = 100;
                                break;
                            case /extralight/i.test(fontDetails):
                                fontWeight = 200;
                                break;
                            case /light/i.test(fontDetails):
                                fontWeight = 300;
                                break;
                            case /book/i.test(fontDetails):
                                fontWeight = 400;
                                break;
                            case /medium/i.test(fontDetails):
                                fontWeight = 500;
                                break;
                            case /semibold|demi/i.test(fontDetails):
                                fontWeight = 600;
                                break;
                            case /bold/i.test(fontDetails):
                                fontWeight = 700;
                                break;
                            case /extrabold|heavy/i.test(fontDetails):
                                fontWeight = 800;
                                break;
                            case /black/i.test(fontDetails):
                                fontWeight = 900;
                                break;
                            default:
                                fontWeight = 400;
                        }

                        if (/italic/i.test(fontDetails)) {
                            fontStyle = "italic";
                        }

                        fs.appendFile(
                            fontsFile,
                            `@font-face {
                                font-family: '${fontName}';
                                font-display: swap;
                                src: url("../fonts/${fontFileName}.woff2") format("woff2"), url("../fonts/${fontFileName}.woff") format("woff");
                                font-weight: ${fontWeight};
                                font-style: ${fontStyle};
                            }\r\n`,
                            cb
                        );
                        newFileOnly = fontFileName;
                    }
                }
            } else {
                console.log(
                    "Файл scss/fonts.scss уже существует. Для обновления его нужно удалить!"
                );
            }
        }
    });

    return app.gulp.src(`${app.path.srcFolder}`);

    function cb() { }
};

