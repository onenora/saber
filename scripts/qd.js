// Copyright (c) 2026 [oennora]. SPDX-License-Identifier: Apache-2.0

/*
 *  起点精简去广告 (保留每日导读)
 * Version: 1.0.0
 * Update:  2026-03-08
 * 
^https:\/\/magev6\.if\.qidian\.com\/argus\/api\/(v4\/client\/getsplashscreen|v[23]\/deeplink\/geturl|v1\/(client\/getconf|bookshelf\/getHoverAdv|adv\/getadvlistbatch)) url script-response-body https://raw.githubusercontent.com/onenora/saber/main/scripts/qd.js

hostname = magev6.if.qidian.com

*/

const url = $request.url;

// 1. 安全放行：防止空响应导致App网络错误
if (!$response || !$response.body) {
    $done({});
}

let body;
try {
    body = JSON.parse($response.body);
} catch (e) {
    console.log(`[起点优化] ❌ JSON解析失败 | 接口: ${url}`);
    $done({ body: $response.body });
}

if (!body || !body.Data) {
    $done({ body: $response.body });
}

try {
    // ==================== 1. 开屏拦截 ====================
    if (url.includes('v4/client/getsplashscreen')) {
        let logMsg = [];
        if (body.Data?.List) {
            body.Data.List = null;
            logMsg.push('移除开屏数据');
        }
        if (body.Data?.EnableGDT === 1) {
            body.Data.EnableGDT = 0;
            logMsg.push('关闭广点通');
        }
        console.log(
            `[起点优化] 🛑 开屏页拦截: ${logMsg.length > 0 ? logMsg.join('，') : '本次无广告'}`,
        );
    }

    // ==================== 2. 冷启动强跳拦截 (兼容v2/v3) ====================
    else if (url.includes('deeplink/geturl')) {
        if (body.Data?.ActionUrl) {
            console.log(
                `[起点优化] 🚫 冷启动拦截: 阻止强制跳转 (原URL: ${body.Data.ActionUrl})`,
            );
            body.Data.ActionUrl = '';
        }
    }

    // ==================== 3. 广告位批处理通杀 (个人中心/导航栏等) ====================
    else if (url.includes('v1/adv/getadvlistbatch')) {
        let clearedCount = 0;
        let clearedPositions = [];

        // 动态遍历 Data 下的所有坑位（如 iOS_tab, iosusercenter 等），统统清空
        for (let position in body.Data) {
            if (
                Array.isArray(body.Data[position]) &&
                body.Data[position].length > 0
            ) {
                clearedCount += body.Data[position].length;
                clearedPositions.push(position);
                body.Data[position] = []; // 清空广告列表
            }
        }

        if (clearedCount > 0) {
            console.log(
                `[起点优化] 🧹 广告批处理通杀: 清理了 ${clearedCount} 个广告项 (位置: ${clearedPositions.join(', ')})`,
            );
        }
    }

    // ==================== 4. 书架悬浮窗清理 ====================
    else if (url.includes('v1/bookshelf/getHoverAdv')) {
        if (body.Data?.ItemList?.length > 0) {
            console.log(
                `[起点优化] 🎈 书架悬浮窗: 清理了 ${body.Data.ItemList.length} 个悬浮小广告`,
            );
            body.Data.ItemList = [];
        }
    }

    // ==================== 5. 全局配置深度净化 (getconf) ====================
    else if (
        url.includes('v1/client/getconf') ||
        url.includes('young/getconf')
    ) {
        console.log(`[起点优化] ⚙️ 全局配置 (getconf): 开始深度净化...`);

        // 干掉第三方联盟
        if (body.Data?.PangleEnable === '1') body.Data.PangleEnable = '0';
        if (body.Data?.GDT) {
            if (body.Data.GDT.Account) body.Data.GDT.Account.Enable = 0;
            if (body.Data.GDT.Popup) body.Data.GDT.Popup.Enable = 0;
        }

        // 清空视频坑位
        if (body.Data?.AdVideoPositionConfig?.length > 0) {
            body.Data.AdVideoPositionConfig = [];
            console.log('   ├── 🧹 [清理] 所有视频广告坑位');
        }

        // 净化云端配置
        if (body.Data?.CloudSetting) {
            if (body.Data.CloudSetting.TeenShowFreq !== '0')
                body.Data.CloudSetting.TeenShowFreq = '0';
            if (body.Data.CloudSetting.EnablePangle !== '0')
                body.Data.CloudSetting.EnablePangle = '0';
            if (body.Data.CloudSetting.ShelfLikeConf)
                body.Data.CloudSetting.ShelfLikeConf.Switch = 0;
            console.log('   ├── 👶 [清理] 青少年模式与猜你喜欢');
        }

        // 清理各类推销弹窗和悬浮标
        if (body.Data?.PushDialogScenes?.length > 0)
            body.Data.PushDialogScenes = [];
        if (body.Data?.ActivityPopup !== undefined)
            body.Data.ActivityPopup = null;
        if (body.Data?.ActivityIcon) {
            body.Data.ActivityIcon.Type = 0;
            body.Data.ActivityIcon.StartTime = 0;
            body.Data.ActivityIcon.EndTime = 0;
            delete body.Data.ActivityIcon.Actionurl;
            delete body.Data.ActivityIcon.ActionUrl;
            delete body.Data.ActivityIcon.Icon;
        }

        // 清理书架底部导流图标
        if (body.Data?.BookShelfBottomIcons?.length > 0) {
            body.Data.BookShelfBottomIcons = [];
            console.log('   ├── 🧼 [清理] 书架底部推销图标');
        }

        // 防风控与功能增强
        if (body.Data?.WolfEye === 1) body.Data.WolfEye = 0;
        if (body.Data?.EnableSearchUser !== '1')
            body.Data.EnableSearchUser = '1';

        console.log(`[起点优化] ✅ 全局配置净化完成！`);
    }
} catch (e) {
    console.log(
        `[起点优化] ❌ 脚本执行异常 | 接口: ${url} | 错误: ${e.message}`,
    );
}

$done({ body: JSON.stringify(body) });
