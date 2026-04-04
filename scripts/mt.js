// Copyright (c) 2026 [ikun]. SPDX-License-Identifier: Apache-2.0

/*
* 后续接口未修复，仅version 11.1.0 
* 初始思路 @chxm1023
# 美图秀秀
^https?:\/\/((h5|api)\.xiuxiu|api-sub|api\.posters)\.meitu\.com\/.+\/(vip|user|h\d|center|home) url script-response-body https://raw.githubusercontent.com/onenora/saber/main/scripts/mt.js
# 美图子应用 (Wink等)
^https:\/\/api-.*\.meitu\.com\/(.+\/user\/vip_info|user\/show) url script-response-body https://raw.githubusercontent.com/onenora/saber/main/scripts/mt.js

hostname = *.xiuxiu.meitu.com, api.posters.meitu.com, api-*.meitu.com

*/

// 美图系全家桶 All in One 解锁
let ikun;
try {
  ikun = JSON.parse($response.body);
} catch {
  $done({ body: $response.body });
}
ikun.data = ikun.data || {};

// --- 接口路径定义 ---
// 美图秀秀专属接口
const hysj = '/vip/prompt/query.json';
const hyxx = '/vip/vip_show.json';
const user_xiuxiu = '/user/show.json';
const hyzl = '/vip/new_sub_detail.json';
const hymb = '/vip/vip_navigation.json';
const group = '/user/vip_info_by_group.json';
const vip_xiuxiu = '/center/user_info.json';
const sjs = '/user/info_by_entrance.json';
const sjshf = '/home/home.json';
const kta = '/center/user_rights.json';
const ktb = '/center/user_rights_consume.json';

// 美图子应用 (Wink/蛋啵等) 专属接口
const vip_sub = '/user/vip_info';
const user_sub = '/user/show';

// --- 美图秀秀逻辑 ---
if ($request.url.indexOf(hysj) != -1) {
  ikun.data = {
    home_btn_prompt: '立即查看',
    if_transfer: 0,
    pay_interval: 3000,
    beautify_prompt: '',
    home_prompt: '会员有效期至2099/09/09',
    svip_bubble_text:
      '粉钻SVIP：有效期至2099/09/09\n粉钻VIP：有效期至2099/09/99',
    beautify_btn_prompt: '',
    request_time: 1666666666666,
  };
}

if ($request.url.indexOf(hyxx) != -1) {
  ikun.data = {
    id: '666666666666666666',
    id_str: '666666666666666666',
    valid_time: 4092599349,
    uid: 1666666666,
    sub_type: 3,
    expire_days: -66666,
    screen_name: '',
    avatar_url: '',
    in_valid_time: 4092599349,
    gid: 1234567890,
    s: 1,
    vip_type: 101,
    platform: 2,
    sub_name: '包年',
    renew: 2,
    is_valid_user: 1,
    create_time: 1666666666,
    sub_biz_type: 1,
    is_expire: 0,
  };
}

if ($request.url.indexOf(hyzl) != -1) {
  delete ikun.data.materials;
  delete ikun.data.prices;
  delete ikun.data.new_version_rotograms;
  ikun.data.vip_sign_info = {
    sub_type: 3,
    renew_status: 1,
    show_auto_renew: 1,
    next_withhold_amount: 16800,
    withhold_currency_symbol: '¥',
    next_withhold_date: '2099-09-09',
    pay_channel: '苹果支付',
    do_pop_up: false,
  };
  ikun.data.vip_power_num = 999999;
  ikun.data.new_power_num = 999999;
  ikun.data.welfare_center_num = 999999;
  ikun.data.exchange_vip = 0;
  ikun.data.platform = 2;
  ikun.data.renew = 1;
  ikun.data.is_new_vipsub = 0;
  ikun.data.s = 1;
  ikun.data.expire_days = -66666;
  ikun.data.sub_type = 3;
  ikun.data.old_vip_type = 4;
  ikun.data.valid_time = 4092599349;
  ikun.data.invalid_time = 4092599349;
  ikun.data.is_expire = 0;
  ikun.data.rights_page_vip_btn_title = '立即解锁';
  ikun.data.rights_page_svip_btn_title = '立即解锁';
  ikun.data.hbp_vip = {
    sub_type: 3,
    valid_time: 4092599349,
    renew: 1,
    expire_days: -66666,
    is_expire: 0,
    in_valid_time: 4092599349,
    s: 0,
  };
  ikun.data.sub_biz_type = 1;
  ikun.data.vip_type = 101;
  ikun.data.xx_vip = {
    sub_type: 3,
    valid_time: 4092599349,
    renew: 1,
    expire_days: -66666,
    is_expire: 0,
    in_valid_time: 4092599349,
    s: 0,
  };
}

if ($request.url.indexOf(hymb) != -1) {
  delete ikun.data.rights;
  delete ikun.data.navigation_card_list;
  delete ikun.data.config_list;
  delete ikun.data.pendant;
  ikun.data.vip_type = 101;
  ikun.data.display_vip_time = 1;
  ikun.data.display_vip_type = 2;
  ikun.data.hbp_vip = {
    id: '666666666666666666',
    id_str: '666666666666666666',
    valid_time: 4092599349,
    uid: 1666666666,
    sub_type: 3,
    sub_biz_type: 1,
    avatar_url: '',
    is_expire: 0,
    expire_days: -66666,
    gid: 1234567890,
    vip_type: 101,
    platform: 2,
    sub_name: '包年',
    renew: 2,
    s: 0,
    is_valid_user: 1,
    create_time: 1666666666,
    screen_name: '',
    in_valid_time: 4092599349,
  };
  ikun.data.xx_vip = ikun.data.hbp_vip;
}

if ($request.url.indexOf(group) != -1) {
  ikun.data = {
    active_sub_type: 2,
    account_type: 1,
    sub_type_name: '续期',
    active_sub_order_id: '666666666666666666',
    trial_period_invalid_time: '4092599349000',
    current_order_invalid_time: '4092599349000',
    active_order_id: '666666666666666666',
    limit_type: 0,
    active_sub_type_name: '续期',
    use_vip: true,
    have_valid_contract: false,
    derive_type_name: '普通会员',
    derive_type: 1,
    in_trial_period: true,
    is_vip: true,
    membership: {
      id: '7',
      display_name: '',
      level: 2,
      level_name: '高级会员',
    },
    active_promotion_status_list: [2, 6],
    sub_type: 3,
    account_id: '1666666666',
    invalid_time: '4092599349000',
    valid_time: '4092599349000',
    active_product_id: '0',
    active_promotion_status: 2,
    show_renew_flag: false,
  };
}

if ($request.url.indexOf(vip_xiuxiu) != -1) {
  ikun.data.vip_end_time = 4092599349;
  ikun.data.is_vip = true;
}

if ($request.url.indexOf(sjs) != -1) {
  ikun.data = {
    vip_info: {
      active_sub_type: 2,
      account_type: 1,
      sub_type_name: '续期',
      active_sub_order_id: '666666666666666666',
      trial_period_invalid_time: '4092599349000',
      current_order_invalid_time: '4092599349000',
      active_order_id: '666666666666666666',
      limit_type: 0,
      active_sub_type_name: '续期',
      use_vip: true,
      have_valid_contract: false,
      derive_type_name: '普通会员',
      derive_type: 1,
      in_trial_period: true,
      is_vip: true,
      membership: {
        id: '7',
        display_name: '',
        level: 2,
        level_name: '高级会员',
      },
      active_promotion_status_list: [2, 6],
      sub_type: 3,
      account_id: '1666666666',
      invalid_time: '4092599349000',
      valid_time: '4092599349000',
      active_product_id: '0',
      active_promotion_status: 2,
      show_renew_flag: false,
    },
    account_type: 1,
    account_id: '1666666666',
    rights_info: [
      {
        show_tips: '抠图剩余张数：9999999 张 >',
        commodity_unit: '2',
        link_words: '9999999 张 >',
        commodity_id: 'shejishi.cutout',
        commodity_count: 9999999,
      },
    ],
  };
}

if ($request.url.indexOf(sjshf) != -1) {
  delete ikun.data.banner;
}

if ($request.url.indexOf(kta) != -1) {
  ikun.data = { cutout: { num_left: 9999999 } };
}

if ($request.url.indexOf(ktb) != -1) {
  ikun.data = { consume_result: true };
}

// --- 美图子应用 (Wink/蛋啵等) 逻辑 ---
if (
  $request.url.indexOf(vip_sub) != -1 &&
  $request.url.indexOf('group') == -1
) {
  // 避免误伤美图秀秀的group接口
  ikun.data.trial_period_invalid_time = 4092599349000;
  ikun.data.current_order_invalid_time = 4092599349000;
  ikun.data.valid_time = 4092599349000;
  ikun.data.invalid_time = 4092599349000;
  ikun.data.use_vip = true;
  ikun.data.have_valid_contract = true;
  ikun.data.derive_type_name = '普通会员';
  ikun.data.in_trial_period = true;
  ikun.data.is_vip = true;
}

// --- 通用 User 信息覆盖 (包含美图秀秀和子应用) ---
if (
  $request.url.indexOf(user_sub) != -1 ||
  $request.url.indexOf(user_xiuxiu) != -1
) {
  // 兼容秀秀(101)与子应用(1)的VIP类型
  ikun.data.vip_type = $request.url.indexOf(user_xiuxiu) != -1 ? 101 : 1;
  ikun.data.vip_icon = 'https://xximg1.meitudata.com/6948531818264286440.png';
  ikun.data.follower_count = 999000;
  ikun.data.fan_count = 999000;
  if (ikun.data.favorites_count !== undefined)
    ikun.data.favorites_count = 999000;
  ikun.data.be_like_count = 999000;
}

// --- 动态 VIP 字段注入（通用兜底） ---
try {
  const deepVip = (obj) => {
    if (!obj || typeof obj !== 'object') return;
    Object.keys(obj).forEach((k) => {
      const v = obj[k];

      // 动态识别 VIP 字段
      if (/(vip|svip)/i.test(k)) {
        if (typeof v === 'number') obj[k] = 1;
        if (typeof v === 'boolean') obj[k] = true;
        if (typeof v === 'string' && /time|date|expire/i.test(k))
          obj[k] = '2099-09-09';
      }

      // 时间字段兜底
      if (/(time|date|expire|invalid)/i.test(k)) {
        if (typeof v === 'number') obj[k] = 4092599349;
        if (typeof v === 'string') obj[k] = '4092599349000';
      }

      // 递归
      if (typeof v === 'object') deepVip(v);
    });
  };

  deepVip(ikun);
} catch {}

$done({ body: JSON.stringify(ikun) });
