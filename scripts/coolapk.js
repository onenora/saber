// Copyright (c) 2026 [oennora]. SPDX-License-Identifier: Apache-2.0
// CoolApk 去广告 v1.3.1 | Quantumult X
// ^https:\/\/api\.coolapk\.com\/v6\/main\/(init|indexV8|dataList) url script-response-body https://raw.githubusercontent.com/onenora/saber/main/scripts/coolapk.js
// ^https:\/\/api\.coolapk\.com\/v6\/feed\/(detail|replyList) url script-response-body https://raw.githubusercontent.com/onenora/saber/main/scripts/coolapk.js
// ^https:\/\/api\.coolapk\.com\/v6\/page\/dataList url script-response-body https://raw.githubusercontent.com/onenora/saber/main/scripts/coolapk.js
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

const isArr = Array.isArray;
const isAdId = (i) =>
    AD_IDS.has(i?.entityId) ||
    AD_IDS.has(i?.cardId) ||
    AD_IDS.has(i?.extraDataArr?.cardId);
const isAd = (i) =>
    AD_TEMPLATES.has(i?.entityTemplate) ||
    AD_KEYWORDS.some((kw) => i?.title?.includes(kw)) ||
    isAdId(i);
const isSplash = (data) =>
    isArr(data) &&
    data.some(
        (i) => i?.entityTemplate === 'splash' || i?.entityType === 'splash',
    );

if (url.includes('/feed/detail')) {
    const d = obj.data;
    if (d) {
        if (isArr(d.hotReplyRows))
            d.hotReplyRows = d.hotReplyRows.filter((i) => i?.id);
        if (isArr(d.topReplyRows))
            d.topReplyRows = d.topReplyRows.filter((i) => i?.id);
        ['detailSponsorCard', 'include_goods', 'include_goods_ids'].forEach(
            (k) => {
                if (d[k]) d[k] = [];
            },
        );
    }
} else if (url.includes('/feed/replyList')) {
    if (isArr(obj.data)) obj.data = obj.data.filter((i) => i?.id);
} else if (url.includes('/main/init')) {
    if (isArr(obj.data)) {
        if (isSplash(obj.data)) {
            obj.data = obj.data.map((i) => i?.id).filter(Boolean);
        } else {
            obj.data = obj.data.filter((i) => !isAd(i));
            obj.data.forEach((i) => {
                if (i?.entityId === 20131 && isArr(i.entities))
                    i.entities = i.entities.filter((e) => e?.title !== '酷品');
            });
        }
    }
} else if (
    url.includes('/main/dataList') ||
    url.includes('/main/indexV8') ||
    url.includes('/page/dataList')
) {
    if (isArr(obj.data)) obj.data = obj.data.filter((i) => !isAd(i));
}

$done({ body: JSON.stringify(obj) });
