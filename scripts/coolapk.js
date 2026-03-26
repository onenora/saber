// Copyright (c) 2026 [oennora]. SPDX-License-Identifier: Apache-2.0
// CoolApk 去广告 v1.4.1 | Quantumult X
// ^https:\/\/api\.coolapk\.com\/v6\/main\/(init|indexV8) url script-response-body https://raw.githubusercontent.com/onenora/saber/main/scripts/coolapk.js
// ^https:\/\/api\.coolapk\.com\/v6\/(page\/)?dataList url script-response-body https://raw.githubusercontent.com/onenora/saber/main/scripts/coolapk.js
// ^https:\/\/api\.coolapk\.com\/v6\/feed\/(detail|replyList) url script-response-body https://raw.githubusercontent.com/onenora/saber/main/scripts/coolapk.js
// ^https:\/\/api\.coolapk\.com\/v6\/search\?.*type=hotSearch url reject-200
// hostname = api.coolapk.com

const url = $request.url;
if (!$response.body) $done({});

let obj;
try {
    obj = JSON.parse($response.body);
} catch {
    $done({});
}

const AD_TEMPLATES = new Set([
    'sponsorCard',
    'feedAd',
    'bannerAd',
    'imageScaleCard',
]);
const AD_KEYWORDS = ['值得买', '红包', '精选配件', '酷安热搜'];
const AD_IDS = new Set([
    944, 945, 6390, 8639, 29349, 33006, 32557, 24455, 36839,
]);

const isAd = (i) =>
    AD_TEMPLATES.has(i?.entityTemplate) ||
    AD_KEYWORDS.some((kw) => i?.title?.includes(kw)) ||
    AD_IDS.has(i?.entityId) ||
    AD_IDS.has(i?.extraDataArr?.cardId);

const filterAds = (arr) =>
    Array.isArray(arr) ? arr.filter((i) => !isAd(i)) : arr;

if (url.includes('/main/init')) {
    if (Array.isArray(obj.data)) {
        // 清除广告 SDK 配置，阻断开屏/插屏广告初始化
        obj.data.forEach((i) => {
            const extra = i?.extraDataArr;
            if (extra)
                Object.keys(extra).forEach((k) => {
                    if (k.startsWith('SplashAd.') || k.startsWith('Ad.'))
                        delete extra[k];
                });
        });
        obj.data = filterAds(obj.data);
        // 移除酷品入口
        obj.data.forEach((i) => {
            if (i?.entityId === 20131 && Array.isArray(i.entities))
                i.entities = i.entities.filter((e) => e?.title !== '酷品');
        });
    }
} else if (url.includes('dataList') || url.includes('/main/indexV8')) {
    obj.data = filterAds(obj.data);
} else if (url.includes('/feed/detail')) {
    const d = obj.data;
    if (d) {
        if (Array.isArray(d.hotReplyRows))
            d.hotReplyRows = d.hotReplyRows.filter((i) => i?.id);
        if (Array.isArray(d.topReplyRows))
            d.topReplyRows = d.topReplyRows.filter((i) => i?.id);
        ['detailSponsorCard', 'include_goods', 'include_goods_ids'].forEach(
            (k) => {
                if (d[k]) d[k] = [];
            },
        );
    }
} else if (url.includes('/feed/replyList')) {
    obj.data = Array.isArray(obj.data)
        ? obj.data.filter((i) => i?.id)
        : obj.data;
}

$done({ body: JSON.stringify(obj) });
