// Copyright (c) 2026 [oennora]. SPDX-License-Identifier: Apache-2.0

/**
 * CoolApk 去广告（Quantumult X 精简稳定版）
 *
 * Version: 1.2.0
 * Update:  2026-03-14
 *
 * Changelog:
 * - 1.2.0 (优化版)
 * - 引入配置驱动模式，集中管理黑名单
 * - 增加深层嵌套 ID (extraDataArr.cardId) 穿透拦截
 * - 精简过滤逻辑判断，提升执行效率
 * - 1.1.0
 * - 新增 feedAd / bannerAd 过滤（低误杀）
 * - 统一信息流与首页广告模板处理
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

/* ================= 集中配置区 ================= */
// 1. 广告模板黑名单
const AD_TEMPLATES = ['sponsorCard', 'feedAd', 'bannerAd', 'imageScaleCard'];
// 2. 标题关键词黑名单
const AD_KEYWORDS = ['值得买', '红包', '精选配件', '酷安热搜'];
// 3. 实体 ID 黑名单 (包含表层 entityId 与深层 cardId)
const AD_IDS = [
    944,
    945,
    6390, // 开屏/基础广告
    8639,
    29349,
    33006,
    32557, // 首页常见推广
    24455,
    36839, // 深层推广卡片/带货
];

/* ================= 工具函数 ================= */
const isArray = (v) => Array.isArray(v);

// 提取多层级可能存在的 ID
const extractId = (i) => i?.entityId || i?.cardId || i?.extraDataArr?.cardId;

// 综合判定是否为广告/推广内容
const isAd = (i) => {
    if (AD_TEMPLATES.includes(i?.entityTemplate)) return true;
    if (AD_KEYWORDS.some((kw) => i?.title?.includes(kw))) return true;
    if (AD_IDS.includes(extractId(i))) return true;
    return false;
};

/* ================= 核心处理逻辑 ================= */

if (url.includes('/feed/detail')) {
    /* 帖子详情 */
    const d = obj.data;
    if (d) {
        // 酷安评论区的广告通常没有真正意义上的 id，用 i?.id 过滤非常聪明
        if (isArray(d.hotReplyRows))
            d.hotReplyRows = d.hotReplyRows.filter((i) => i?.id);
        if (isArray(d.topReplyRows))
            d.topReplyRows = d.topReplyRows.filter((i) => i?.id);

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
} else if (
    url.includes('/main/dataList') ||
    url.includes('/main/indexV8') ||
    url.includes('/page/dataList')
) {
    /* 信息流 / 首页 / 页面(酷品) -> 统一使用综合过滤逻辑 */
    if (isArray(obj.data)) {
        obj.data = obj.data.filter((i) => !isAd(i));
    }
} else if (url.includes('/main/init')) {
    /* 启动 / 发现页 */
    if (isArray(obj.data)) {
        // 过滤基础广告配置
        obj.data = obj.data.filter((i) => !isAd(i));

        // 单独处理发现页顶部「酷品」模块中的子项
        obj.data.forEach((i) => {
            if (i?.entityId === 20131 && isArray(i.entities)) {
                i.entities = i.entities.filter((e) => e?.title !== '酷品');
            }
        });
    }
}

// 返回处理后的数据
$done({ body: JSON.stringify(obj) });
