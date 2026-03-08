// Copyright (c) 2026 [oennora]. SPDX-License-Identifier: Apache-2.0

/**
 * CoolApk 去广告（Quantumult X 精简稳定版）
 *
 * Version: 1.1.0
 * Update:  2026-03-08
 *
 * Changelog:
 * - 1.1.0
 *   - 新增 feedAd / bannerAd 过滤（低误杀）
 *   - 统一信息流与首页广告模板处理
 * - 1.0.0
 *   - 基于 RuCu6 稳定逻辑
 *   - 去 sponsorCard / 商品推广 / 评论广告
 * 
^https:\/\/api\.coolapk\.com\/v6\/main\/(init|indexV8|dataList) url script-response-body https://raw.githubusercontent.com/onenora/saber/main/scripts/coolapk.js
^https:\/\/api\.coolapk\.com\/v6\/feed\/(detail|replyList) url script-response-body https://raw.githubusercontent.com/onenora/saber/main/scripts/coolapk.js
^https:\/\/api\.coolapk\.com\/v6\/page\/dataList\? url script-response-body https://raw.githubusercontent.com/onenora/saber/main/scripts/coolapk.js
^https:\/\/api\.coolapk\.com\/v6\/search\?.*type=hotSearch url reject-200
hostname = api.coolapk.com

 **/

const url = $request.url;
if (!$response.body) $done({});

let obj;
try {
    obj = JSON.parse($response.body);
} catch {
    $done({});
}

/* 工具 */
const isArray = (v) => Array.isArray(v);

/* 帖子详情 */
if (url.includes('/feed/detail')) {
    const d = obj.data;
    if (d) {
        if (isArray(d.hotReplyRows)) {
            d.hotReplyRows = d.hotReplyRows.filter((i) => i?.id);
        }
        if (isArray(d.topReplyRows)) {
            d.topReplyRows = d.topReplyRows.filter((i) => i?.id);
        }
        ['detailSponsorCard', 'include_goods', 'include_goods_ids'].forEach(
            (k) => {
                if (d[k]) d[k] = [];
            },
        );
    }
} else if (url.includes('/feed/replyList')) {
    /* 评论列表 */
    if (isArray(obj.data)) {
        obj.data = obj.data.filter((i) => i?.id);
    }
} else if (url.includes('/main/dataList')) {
    /* 信息流 */
    if (isArray(obj.data)) {
        obj.data = obj.data.filter(
            (i) =>
                i?.entityTemplate !== 'sponsorCard' &&
                i?.entityTemplate !== 'feedAd' &&
                i?.entityTemplate !== 'bannerAd' &&
                i?.title !== '精选配件',
        );
    }
} else if (url.includes('/main/indexV8')) {
    /* 首页 */
    if (isArray(obj.data)) {
        obj.data = obj.data.filter(
            (i) =>
                i?.entityTemplate !== 'sponsorCard' &&
                i?.entityTemplate !== 'feedAd' &&
                i?.entityTemplate !== 'bannerAd' &&
                ![8639, 29349, 33006, 32557].includes(i?.entityId) &&
                !i?.title?.includes('值得买') &&
                !i?.title?.includes('红包'),
        );
    }
} else if (url.includes('/main/init')) {
    /* 启动 / 发现页 */
    if (isArray(obj.data)) {
        obj.data = obj.data.filter(
            (i) => ![944, 945, 6390].includes(i?.entityId),
        );
        // 发现页顶部「酷品」
        obj.data.forEach((i) => {
            if (i?.entityId === 20131 && isArray(i.entities)) {
                i.entities = i.entities.filter((e) => e?.title !== '酷品');
            }
        });
    }
} else if (url.includes('/page/dataList')) {
    /* 页面 / 酷品 */
    if (isArray(obj.data)) {
        obj.data = obj.data.filter(
            (i) =>
                i?.entityTemplate !== 'sponsorCard' &&
                i?.entityTemplate !== 'imageScaleCard' &&
                i?.title !== '酷安热搜',
        );
    }
}

$done({ body: JSON.stringify(obj) });
