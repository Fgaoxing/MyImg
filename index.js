import fetch from "node-fetch";
import ss from "simplest-server"

ss.http({
    "(.*):": function (req, res) {
        fetch('https://registry.npmmirror.com/ytblogimg/').then(function (fres) {
            fres.json().then(function (json) {
                if ('dist-tags' in json) {
                    console.log(json['dist-tags']['latest']);
                    fetch(`https://registry.npmmirror.com/ytblogimg/${json['dist-tags']['latest']}/files/${req.url.pathname}`).then(function (fres) {
                        if (fres.headers.get("Content-Type") == "application/json; charset=utf-8") {
                            fres.json().then(function (json) {
                                if ("error" in json) {
                                    res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
                                    res.end(`<html lang="zh-cn"><head><meta http-equiv="content-type" content="text/html; charset=utf-8"><title>404 图片不存在 - 图床</title><link rel="shortcut icon" href="/webp/logo.webp"><link rel="stylesheet" href="https://jsd.onmicrosoft.cn/gh/Hexo-theme-Jian/static/css/grid.css"></head><body><div class="card center" style="width: calc(100% - 32px);display: flex;justify-content: center;max-width: 300px;flex-direction: column;align-items: center;"><h1 style="font-size: 50px;margin: 15px;">404</h1><span style="margin: 25px;">图片不存在，请检查URL</span></div></body></html>`);
                                    return;
                                } else {
                                    res.writeHead(301, {
                                        "Content-Type": "text/html",
                                        "Location": `https://registry.npmmirror.com/ytblogimg/${json['dist-tags']['latest']}/files/${req.url.pathname}`,
                                        "Cache-Control": "public, s-maxage=1209600, max-age=1209600",
                                        "Vercel-CDN-Cache-Control": "max-age=604800"
                                    });
                                    res.end("JUMP TO IMAGE");
                                    return;
                                }
                            }).catch(function (err) {
                                console.log(err);
                            })
                        } else {
                            res.writeHead(301, {
                                "Content-Type": "text/html",
                                "Location": `https://registry.npmmirror.com/ytblogimg/${json['dist-tags']['latest']}/files/${req.url.pathname}`,
                                "Cache-Control": "public, s-maxage=1209600, max-age=1209600",
                                "Vercel-CDN-Cache-Control": "max-age=604800"
                            });
                            res.end("JUMP TO IMAGE");
                            return;
                        }
                    }).catch(function (err) {
                        console.log(err);
                    })
                }
            }).catch(function (err) {
                console.log(err);
            })
        }).catch(function (err) {
            console.log(err);
        })
        res.writeHead(500, { "Content-Type": "text/html; charset=utf-8" });
        res.end(`<html lang="zh-cn"><head><meta http-equiv="content-type" content="text/html; charset=utf-8"><title>500 发生错误 - 图床</title><link rel="shortcut icon" href="/webp/logo.webp"><link rel="stylesheet" href="https://jsd.onmicrosoft.cn/gh/Hexo-theme-Jian/static/css/grid.css"></head><body><div class="card center" style="width: calc(100% - 32px);display: flex;justify-content: center;max-width: 300px;flex-direction: column;align-items: center;"><h1 style="font-size: 50px;margin: 15px;">500</h1><span style="margin: 25px;">发生错误</span></div></body></html>`);
        return;
    }
}).listen(3000)
